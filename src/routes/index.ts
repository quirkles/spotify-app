import Router from "@koa/router";

import { initAuthRoutes } from "./auth";
import { initApiRoutes } from "./api";
import { initMoodRoutes } from "./mood";

export function initRoutes(router: Router) {
  initAuthRoutes(router);
  initApiRoutes(router);
  initMoodRoutes(router);
  return router;
}
