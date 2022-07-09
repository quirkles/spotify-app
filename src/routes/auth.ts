import { v4 } from "uuid";
import { CONFIG } from "../config";
import { stringify } from "querystring";
import { SECRETS } from "../secrets";
import Router from "@koa/router";
import axios, { AxiosRequestConfig } from "axios";
import { EnhancedContext } from "../middleware";
import { AuthResponse, MeResponse } from "../services/spotify";

export function initAuthRoutes(router: Router) {
  router.get("/login", function (ctx, next) {
    const state = v4();
    ctx.cookies.set(CONFIG.spotifyStateKey, state);

    // your application requests authorization
    const scope = CONFIG.scope;
    ctx.redirect(
      "https://accounts.spotify.com/authorize?" +
        stringify({
          response_type: "code",
          client_id: SECRETS.clientId,
          scope: scope,
          redirect_uri: CONFIG.redirectUri,
          state: state,
        })
    );
  });

  router.get("/oauth_callback", async function (ctx: EnhancedContext, next) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = ctx.request.query.code || null;
    const state = ctx.request.query.state || null;
    const storedState = ctx.cookies.get(CONFIG.spotifyStateKey);

    if (state === null || state !== storedState) {
      ctx.logger.error(
        { state: state || "N/A", storedState: storedState || "N/A" },
        "mismatch in state"
      );
      throw new Error("Failed to authorize properly");
    }

    ctx.cookies.set(CONFIG.spotifyStateKey, "");

    const params = new URLSearchParams();
    params.append("code", code as string);
    params.append("redirect_uri", CONFIG.redirectUri);
    params.append("grant_type", "authorization_code");
    const authOptions: AxiosRequestConfig = {
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(SECRETS.clientId + ":" + SECRETS.clientSecret).toString(
            "base64"
          ),
      },
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
    ctx.logger.info({ authPostResponseData }, "Auth response");
    const tokenExpiryDate = new Date(
      Date.now() + authPostResponseData.expires_in * 1000
    );
    ctx.logger.info(`Expires at: ${tokenExpiryDate}`);
    if (authPostResponse.status === 200) {
      const accessToken = authPostResponse.data.access_token;

      const options: AxiosRequestConfig = {
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + accessToken },
        responseType: "json",
      };

      let testGetResponse;
      let meData: MeResponse;

      try {
        testGetResponse = await axios(options);
        meData = testGetResponse.data;
        const userSpotifyId = meData.id;
        ctx.logger.info({ meData }, "me response");
        const token = ctx.jwtService.sign({
          userSpotifyId,
          accessToken,
        });
        await Promise.all([
          ctx.cacheService.setExpiryDate(userSpotifyId, tokenExpiryDate),
          ctx.cacheService.setRefreshToken(
            userSpotifyId,
            authPostResponseData.refresh_token
          ),
        ]);
        ctx.cookies.set("jwt", token);
        ctx.redirect(`/home?token=${token}`);
      } catch (error) {
        ctx.logger.error(error);
        throw error;
      }
    } else {
      ctx.logger.error("Invalid token");
      throw new Error("Invalid token");
    }
    await next();
  });
}
