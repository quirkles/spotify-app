import Router from "@koa/router";

export function getRouter() {
  const router = new Router();

  router.get("/hi", (ctx, next) => {
    ctx.body = "Hello World";
    next();
  });

  return router;
}
