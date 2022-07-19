import Koa, { DefaultState, ExtendableContext, Next } from "koa";
import { Logger } from "winston";
import { v4 } from "uuid";

import { withLogger } from "./logger";
import { withDatastoreService } from "./datastore";
import { withJwtService } from "./jwtService";
import { User, withSession } from "./session";

import { DataStoreService, JwtService } from "../services";

export interface EnhancedContext extends ExtendableContext {
  correlationId: string;
  logger: Logger;
  datastoreService: DataStoreService;
  jwtService: JwtService;
  user: User | null;
}

async function withCorrelationId(
  ctx: ExtendableContext & EnhancedContext,
  next: Next
) {
  ctx.correlationId = v4();
  await next();
}

export function initializeMiddleware(
  app: Koa
): Koa<DefaultState, EnhancedContext> {
  return app
    .use(withCorrelationId)
    .use(withLogger)
    .use(withDatastoreService)
    .use(withJwtService)
    .use(withSession);
}
