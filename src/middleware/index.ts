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

export async function initializeMiddleware(
  app: Koa
): Promise<Koa<DefaultState, EnhancedContext>> {
  return (
    app
      .use(withCorrelationId)
      .use(bodyParser())
      .use(await withLogger(logger))
      // eventBus depends on the logger
      .use(withEventBus)
      // subsequent middleware can leverage the event bus
      .use(withSpotifyService)
      .use(await withSqlService(logger))
      .use(withDatastoreService)
      .use(withJwtService)
      .use(withSession)
  );
}
