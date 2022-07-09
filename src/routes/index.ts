import Router from "@koa/router";

import { initAuthRoutes } from "./auth";

export function getRouter() {
  const router = new Router();

  router.get("/hi", (ctx, next) => {
    ctx.body = "Hello World";
    next();
  });

  initAuthRoutes(router);

  return router;
}
