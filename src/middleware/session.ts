import { EnhancedContext } from "./index";
import { Next } from "koa";
import axios, { AxiosRequestConfig } from "axios";
import { SECRETS } from "../secrets";
import { handleAxiosError } from "../errors";
import { UserSessionDataKind } from "../services/datastore/kinds";

export interface User {
  userSpotifyId: string;
  accessToken: {
    value: string;
    expiresAt: Date;
  };
}

async function refreshAccessToken(refreshToken: string): Promise<{
  newAccessToken: string;
  newExpiryDateTime: Date;
}> {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  const authOptions: AxiosRequestConfig = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(SECRETS.clientId + ":" + SECRETS.clientSecret).toString(
          "base64"
        ),
    },
    data: params,
    responseType: "json",
  };

  const authPostResponse = await axios(authOptions).catch(handleAxiosError);
  const authPostResponseData = authPostResponse.data;
  const { expires_in, access_token } = authPostResponseData;
  const tokenExpiryDate = new Date(Date.now() + expires_in * 1000);
  return {
    newExpiryDateTime: tokenExpiryDate,
    newAccessToken: access_token,
  };
}

export async function withSession(ctx: EnhancedContext, next: Next) {
  ctx.user = null;
  const authHeader = ctx.headers["authorization"];
  if (!authHeader || !authHeader.length) {
    ctx.logger.debug(`No auth header present`);
    return next();
  }
  const jwt = authHeader.split("Bearer ")[1];

  if (!jwt || !jwt.length) {
    ctx.logger.debug(`No jwt in auth header`);
    return next();
  }
  ctx.logger.debug(`Found jwt: ${jwt}`);

  const decodedJwt = ctx.jwtService.verify(jwt);

  const { userSpotifyId, accessTokenExpiryTime, accessToken } = decodedJwt;

  ctx.logger.debug(`Decoded token.`, { decodedJwt });

  const user: User = {
    userSpotifyId,
    accessToken: {
      value: accessToken,
      expiresAt: new Date(Number(accessTokenExpiryTime)),
    },
  };

  // if we are within one minute of the token expiring, refresh
  if (user.accessToken.expiresAt.getTime() - Date.now() < 1000 * 60) {
    const userSessionDataRepository =
      ctx.datastoreService.getRepository("userSessionData");
    const userSessionData = await userSessionDataRepository.getByKey(
      decodedJwt.userSpotifyId
    );
    if (!userSessionData || !userSessionData.refreshToken) {
      ctx.logger.info(
        `Invalid entity for user ${decodedJwt.userSpotifyId} found`
      );
      ctx.cookies.set("jwt", "");
      return ctx.redirect("/login");
    }
    const { newAccessToken, newExpiryDateTime } = await refreshAccessToken(
      userSessionData.refreshToken
    );

    user.accessToken.value = newAccessToken;
    user.accessToken.expiresAt = newExpiryDateTime;
    ctx.cookies.set(
      "x-set-jwt",
      ctx.jwtService.sign({
        accessToken: newAccessToken,
        accessTokenExpiryTime: newExpiryDateTime.getTime().toString(),
        userSpotifyId: userSpotifyId,
      })
    );
    await userSessionDataRepository.update(
      new UserSessionDataKind({
        userSpotifyId,
        accessToken: newAccessToken,
        accessTokenExpiryDateTime: newExpiryDateTime,
      })
    );
  }

  ctx.user = user;
  await next();
}
