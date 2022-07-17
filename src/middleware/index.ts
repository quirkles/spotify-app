import Koa, { DefaultState, ExtendableContext, Next } from "koa";
import { Logger } from "winston";
import { v4 } from "uuid";

import { withLogger } from "./logger";
import { withCacheService } from "./redisCache";
import { withJwtService } from "./jwtService";
import { User, withSession } from "./session";

import { CacheService, JwtService } from "../services";

export interface EnhancedContext extends ExtendableContext {
  correlationId: string;
  logger: Logger;
  cacheService: CacheService;
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
    .use(withCacheService)
    .use(withJwtService)
    .use(withSession);
}
