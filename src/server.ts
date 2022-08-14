import Koa from "koa";
import cors from "@koa/cors";

import { initRoutes } from "./routes";
import { EnhancedContext, initializeMiddleware } from "./middleware";
import Router from "@koa/router";

export const createServer = async (): Promise<Koa> => {
  const app = new Koa();

  app.use(
    cors({
      exposeHeaders: "X-Set-Jwt",
    })
  );

  try {
    await initializeMiddleware(app);
  } catch (err) {
    console.log("Error initializing middleware") //eslint-disable-line
    console.log(err) //eslint-disable-line
  }

  app.use(async function (ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.logger?.error("Error caught by middleware:", { error: err });
      ctx.status = (err as Error & { status: number }).status || 500;
      ctx.body = (err as Error).message;
      ctx.app.emit("error", err, ctx.logger);
    }
  });

  const router = initRoutes(new Router());

  app.use(router.routes());

  app.on("error", (err) => {
    console.error(`Error caught by error event handler: ${err.message}`);
    console.error(`Error stack: ${err.stack}`);
  });

  return app;
};
