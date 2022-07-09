import { v4 } from "uuid";
import { CONFIG } from "../config";
import { stringify } from "querystring";
import { SECRETS } from "../secrets";
import Router from "@koa/router";
import axios, { AxiosRequestConfig } from "axios";

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

  router.get("/oauth_callback", async function (ctx, next) {
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
    try {
      authPostResponse = await axios(authOptions);
    } catch (error) {
      ctx.logger.error(error);
      throw error;
    }
    ctx.logger.info({ data: authPostResponse.data || "null" });
    if (authPostResponse.status === 200) {
      const access_token = authPostResponse.data.access_token;

      const options: AxiosRequestConfig = {
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + access_token },
        responseType: "json",
      };

      let testGetResponse;

      try {
        testGetResponse = await axios(options);
        ctx.logger.info({ testGetResponse: testGetResponse.data }, "Success!");
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
