import Router from "@koa/router";
import { v4 } from "uuid";
import { CONFIG } from "../config";
import { stringify } from "querystring";
import { SECRETS } from "../secrets";
import axios, { AxiosRequestConfig } from "axios";
import { MeResponse } from "../services/spotify";
import { EnhancedContext } from "../middleware";

export function initApiRoutes(router: Router) {
  router.get("/me", async function (ctx: EnhancedContext, next) {
    if (!ctx.user?.accessToken?.value.length) {
      ctx.logger.error("No session user found");
      return next();
    }
    const options: AxiosRequestConfig = {
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: { Authorization: "Bearer " + ctx.user.accessToken.value },
      responseType: "json",
    };

    let testGetResponse;
    let meData: MeResponse;

    try {
      testGetResponse = await axios(options);
      meData = testGetResponse.data;
      ctx.body = meData;
      await next();
    } catch (error) {
      ctx.logger.error(error);
      throw error;
    }
  });
}
