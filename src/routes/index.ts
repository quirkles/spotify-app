import Router from "@koa/router";

import { initAuthRoutes } from "./auth";
import { initApiRoutes } from "./api";

export function initRoutes(router: Router) {
  initAuthRoutes(router);
  initApiRoutes(router);
  return router;
}
