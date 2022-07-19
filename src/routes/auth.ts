import { v4 } from "uuid";
import { CONFIG } from "../config";
import { stringify } from "querystring";
import { SECRETS } from "../secrets";
import Router from "@koa/router";
import axios, { AxiosRequestConfig } from "axios";
import { EnhancedContext } from "../middleware";
import { AuthResponse, MeResponse } from "../services/spotify";
import { UserSessionDataKind } from "../services/datastore/kinds";

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

    ctx.logger.debug("Begin oath callback", {
      code,
      state,
      storedState,
    });

    if (state === null || state !== storedState) {
      ctx.logger.error("mismatch in state", {
        state: state || "N/A",
        storedState: storedState || "N/A",
      });
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
      data: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(SECRETS.clientId + ":" + SECRETS.clientSecret).toString(
            "base64"
          ),
      },
      timeout: 320000,
      timeoutErrorMessage: "Request timed out",
      responseType: "json",
    };
    ctx.logger.debug("Using client is and secret", {
      clientId: SECRETS.clientId.substring(0, 5) + "...",
      clientSecret: SECRETS.clientSecret.substring(0, 5) + "...",
    });
    ctx.logger.debug("Calling spotify for token", { authOptions });

    let authPostResponse;
    let authPostResponseData: AuthResponse;
    try {
      authPostResponse = await axios(authOptions);
      authPostResponseData = authPostResponse.data;
    } catch (error) {
      ctx.logger.error("Failed to get token from spotify api.", { error });
      throw error;
    }
    ctx.logger.info("Auth response", { authPostResponseData });
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
        const token = ctx.jwtService.sign({
          userSpotifyId,
        });
        const userSessionDataRepository =
          ctx.datastoreService.getRepository("userSessionData");
        await userSessionDataRepository.save(
          new UserSessionDataKind({
            userSpotifyId,
            accessToken,
            accessTokenExpiryDateTime: tokenExpiryDate,
            refreshToken: authPostResponseData.refresh_token,
          })
        );
        ctx.redirect(`${CONFIG.frontEndHost}/landing?token=${token}`);
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
