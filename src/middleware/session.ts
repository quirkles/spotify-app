import { EnhancedContext } from "./index";
import { Next } from "koa";
import axios, { AxiosRequestConfig } from "axios";
import { SECRETS } from "../secrets";
import { AuthResponse } from "../services/spotify";

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
  const jwtCookie = ctx.cookies.get("jwt");
  if (!jwtCookie || !jwtCookie.length) {
    return next();
  }
  ctx.logger.debug(`Found jwt cookie: ${jwtCookie}`);

  const { accessToken, userSpotifyId } = ctx.jwtService.verify(jwtCookie);
  ctx.logger.trace({ accessToken, userSpotifyId }, `Decoded token.`);

  const cacheEntityValue = await ctx.cacheService.getCacheValue(userSpotifyId);

  if (cacheEntityValue === null) {
    ctx.logger.info(`No cache entity for user ${userSpotifyId} found`);
    ctx.cookies.set("jwt", "");
    return ctx.redirect("/login");
  }

  const { refreshToken, accessTokenExpiryDateTime } = cacheEntityValue;

  if (!refreshToken || !accessTokenExpiryDateTime) {
    ctx.logger.info(
      {
        refreshToken: refreshToken || "N/A",
        accessTokenExpiryDateTime: accessTokenExpiryDateTime || "N/A",
      },
      `Failed to find refreshToken and accessTokenExpiryDateTime in the cache.`
    );
    ctx.cookies.set("jwt", "");
    return ctx.redirect("/login");
  }

  const user: User = {
    userSpotifyId,
    refreshToken,
    accessToken: {
      value: accessToken,
      expiresAt: accessTokenExpiryDateTime,
    },
  };

  if (accessTokenExpiryDateTime.getTime() - Date.now() < 1000 * 60 * 2) {
    ctx.logger.trace("Refreshing access token");
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
      value: accessToken,
    };
    ctx.logger.info(`Expires at: ${tokenExpiryDate}`);
    await ctx.cacheService.setExpiryDate(userSpotifyId, tokenExpiryDate);
    const newJwtToken = ctx.jwtService.sign({
      userSpotifyId,
      accessToken: access_token,
    });
    ctx.cookies.set("jwt", newJwtToken);
  }
  ctx.user = user;
  await next();
}
