import Koa from "koa";
import { v4 } from "uuid";
import { withLogger } from "./middleware/logger";
import { getRouter } from "./routes";

export const createServer = (): Koa => {
  const app = new Koa();

  app.use(async (ctx, next) => {
    ctx.correlationId = v4();
    await next();
  });

  app.use(withLogger);

  const router = getRouter();

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
