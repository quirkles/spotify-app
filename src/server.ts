import Koa from "koa";
import { v4 } from "uuid";
import { withLogger } from "./middleware/logger";
import { getRouter } from "./routes";
import { initializeMiddleware } from "./middleware";

export const createServer = (): Koa => {
  const app = new Koa();

  app.use(withLogger);

  initializeMiddleware(app);

  const router = getRouter();

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
