import Router from "@koa/router";
import axios, { AxiosRequestConfig } from "axios";
import { EnhancedContext } from "../middleware";
import { handleAxiosError } from "../errors";

export function initApiRoutes(router: Router) {
  router.get("/me", async function (ctx: EnhancedContext, next) {
    if (!ctx.user?.accessToken?.value?.length) {
      ctx.logger.error("No session user found");
      return next();
    }
    const options: AxiosRequestConfig = {
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: { Authorization: "Bearer " + ctx.user.accessToken.value },
      responseType: "json",
    };

    const testGetResponse = await axios(options).catch(handleAxiosError);
    ctx.body = testGetResponse.data;
    await next();
  });
}
