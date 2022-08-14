import Koa, { DefaultState, ExtendableContext, Next } from "koa";
import { Logger } from "winston";
import { v4 } from "uuid";
import bodyParser from "koa-bodyparser";

import { DataStoreService, JwtService, SqlService } from "../services";

import { withLogger } from "./logger";
import { withDatastoreService } from "./datastore";
import { withJwtService } from "./jwtService";
import { User, withSession } from "./session";
import { withSqlService } from "./sql";
import { EventBus } from "../services/eventBus";
import { withEventBus } from "./eventBus";
import { SpotifyService } from "../services/spotify";
import { withSpotifyService } from "./spotify";
import { logger } from "../logger";

export interface EnhancedContext extends ExtendableContext {
  eventBus: EventBus;
  correlationId: string;
  logger: Logger;
  datastoreService: DataStoreService;
  spotifyService: SpotifyService;
  sqlService: SqlService;
  jwtService: JwtService;
  user: User | null;
  params: Record<string, string>;
}

async function withCorrelationId(
  ctx: ExtendableContext & EnhancedContext,
  next: Next
) {
  ctx.correlationId = v4();
  await next();
}

function debugMiddlewareStack(message: string) {
  return async function (ctx: ExtendableContext & EnhancedContext, next: Next) {
    ctx.logger.info(message);
    await next();
  };
}

export async function initializeMiddleware(
  app: Koa
): Promise<Koa<DefaultState, EnhancedContext>> {
  return (
    app
      .use(withCorrelationId)
      .use(debugMiddlewareStack("after withCorrelationId"))
      .use(await withLogger(logger))
      .use(debugMiddlewareStack("after logger"))
      .use(bodyParser())
      .use(debugMiddlewareStack("after bodyParser"))
      // eventBus depends on the logger
      .use(withEventBus)
      .use(debugMiddlewareStack("after withEventBus"))
      // subsequent middleware can leverage the event bus
      .use(withSpotifyService)
      .use(debugMiddlewareStack("after withSpotifyService"))
      .use(await withSqlService(logger))
      .use(debugMiddlewareStack("after withSqlService"))
      .use(withDatastoreService)
      .use(debugMiddlewareStack("after withDatastoreService"))
      .use(withJwtService)
      .use(debugMiddlewareStack("after withJwtService"))
      .use(withSession)
      .use(debugMiddlewareStack("after withSession"))
  );
}
