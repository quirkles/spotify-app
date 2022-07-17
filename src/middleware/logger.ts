import Koa, { ExtendableContext } from "koa";
import { v4 } from "uuid";

import { EnhancedContext } from "./index";

import { logger } from "../logger";

export async function withLogger(
  ctx: Koa.ExtendableContext & ExtendableContext & EnhancedContext,
  next: Koa.Next
) {
  ctx.logger = logger.child({
    labels: {
      correlationId: ctx.correlationId,
      requestId: v4(),
    },
  });

  ctx.logger.info("Received request", { request: ctx.request.toJSON() });
  await next();
}
