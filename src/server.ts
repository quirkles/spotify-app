import Koa from "koa";
import cors from "@koa/cors";

import { initRoutes } from "./routes";
import { initializeMiddleware } from "./middleware";
import Router from "@koa/router";

export const createServer = (): Koa => {
  const app = new Koa();

  app.use(cors());

  initializeMiddleware(app);

  const router = initRoutes(new Router());

  app.use(router.routes());

  return app;
};
