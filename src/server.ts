import Koa from "koa";
import cors from "@koa/cors";

import { initRoutes } from "./routes";
import { EnhancedContext, initializeMiddleware } from "./middleware";
import Router from "@koa/router";
import { Logger } from "winston";

export const createServer = async (): Promise<Koa> => {
  const app = new Koa();

  app.use(
    cors({
      exposeHeaders: "X-Set-Jwt",
    })
  );

  await initializeMiddleware(app);

  app.use(async function (ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.status = (err as Error & { status: number }).status || 500;
      ctx.body = (err as Error).message;
      ctx.app.emit("error", err, ctx.logger);
    }
  });

  const router = initRoutes(new Router());

  app.use(router.routes());

  app.on("error", (err, ctx: Partial<EnhancedContext>) => {
    if (ctx.logger?.error) {
      ctx.logger?.error(err);
    } else {
      console.error(err);
    }
  });

  return app;
};
