import Koa, { DefaultState, ExtendableContext, Next } from "koa";
import podyparser from "koa-bodyparser";
import { Logger } from "winston";
import { v4 } from "uuid";

import { DataStoreService, JwtService, SqlService } from "../services";

import { withLogger } from "./logger";
import { withDatastoreService } from "./datastore";
import { withJwtService } from "./jwtService";
import { User, withSession } from "./session";
import { withSqlService } from "./sql";
import bodyParser from "koa-bodyparser";

export interface EnhancedContext extends ExtendableContext {
  correlationId: string;
  logger: Logger;
  datastoreService: DataStoreService;
  sqlService: SqlService;
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
    .use(bodyParser())
    .use(withSqlService)
    .use(withLogger)
    .use(withDatastoreService)
    .use(withJwtService)
    .use(withSession);
}
