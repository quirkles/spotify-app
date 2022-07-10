import Router from "@koa/router";

import { initAuthRoutes } from "./auth";
import { initApiRoutes } from "./api";

export function getRouter() {
  const router = new Router();

  initAuthRoutes(router);

  initApiRoutes(router);

  return router;
}
