import { EnhancedContext } from "./index";
import { Next } from "koa";
import axios, { AxiosRequestConfig } from "axios";
import { SECRETS } from "../secrets";
import { AuthResponse } from "../services/spotify";
import { UserSessionDataKind } from "../services/datastore/kinds";

export interface User {
  userSpotifyId: string;
  refreshToken: string;
  accessToken: {
    value: string;
    expiresAt: Date;
  };
}

export async function withSession(ctx: EnhancedContext, next: Next) {
  ctx.user = null;
  const authHeader = ctx.headers["authorization"];
  if (!authHeader || !authHeader.length) {
    return next();
  }
  ctx.logger.debug(`Found auth header: ${authHeader}`);

  const jwt = authHeader.split("Bearer ")[1];

  if (!jwt || !jwt.length) {
    return next();
  }
  ctx.logger.debug(`Found jwt: ${authHeader}`);

  const { userSpotifyId } = ctx.jwtService.verify(jwt);
  ctx.logger.debug(`Decoded token.`, { userSpotifyId });

  const userSessionDataRepository =
    ctx.datastoreService.getRepository("userSessionData");

  const cacheEntityValue = await userSessionDataRepository.getByKey(
    userSpotifyId
  );

  ctx.logger.debug("Found user", { cacheEntityValue });

  if (!cacheEntityValue) {
    ctx.logger.info(`No cache entity for user ${userSpotifyId} found`);
    ctx.cookies.set("jwt", "");
    return ctx.redirect("/login");
  }

  const { refreshToken, accessTokenExpiryDateTime, accessToken } =
    cacheEntityValue;

  if (!refreshToken || !accessTokenExpiryDateTime) {
    ctx.logger.info(
      `Failed to find refreshToken and accessTokenExpiryDateTime in the cache.`,
      {
        refreshToken: refreshToken || "N/A",
        accessTokenExpiryDateTime: accessTokenExpiryDateTime || "N/A",
        accessToken: accessToken || "N/A",
      }
    );
    throw new Error("dang");
    return ctx.redirect("/login");
  }

  const user: User = {
    userSpotifyId,
    refreshToken,
    accessToken: {
      value: accessToken || "",
      expiresAt: accessTokenExpiryDateTime,
    },
  };

  if (accessTokenExpiryDateTime.getTime() - Date.now() < 1000 * 60 * 20) {
    ctx.logger.info("Refreshing access token");
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

    let authPostResponse;
    let authPostResponseData: AuthResponse;
    try {
      authPostResponse = await axios(authOptions);
      authPostResponseData = authPostResponse.data;
    } catch (error) {
      ctx.logger.error(error);
      throw error;
    }
    const { expires_in, access_token } = authPostResponseData;
    const tokenExpiryDate = new Date(Date.now() + expires_in * 1000);
    user.accessToken = {
      expiresAt: tokenExpiryDate,
      value: access_token,
    };
    ctx.logger.info(`Expires at: ${tokenExpiryDate}`);
    await userSessionDataRepository.update(
      new UserSessionDataKind({
        userSpotifyId,
        accessTokenExpiryDateTime: tokenExpiryDate,
        accessToken,
      })
    );
  }
  ctx.user = user;
  await next();
}
