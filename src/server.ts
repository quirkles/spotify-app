import Koa from "koa";
import cors from "@koa/cors";

import { withLogger } from "./middleware/logger";
import { getRouter } from "./routes";
import { initializeMiddleware } from "./middleware";

export const createServer = (): Koa => {
  const app = new Koa();

  app.use(cors());

  app.use(withLogger);

  initializeMiddleware(app);

  const router = getRouter();

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
