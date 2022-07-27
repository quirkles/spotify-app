import Koa, { ExtendableContext } from "koa";
import { v4 } from "uuid";

import { EnhancedContext } from "./index";
import { Logger } from "winston";

export const withLogger =
  async (logger: Logger) =>
  async (
    ctx: Koa.ExtendableContext & ExtendableContext & EnhancedContext,
    next: Koa.Next
  ) => {
    ctx.logger = logger.child({
      labels: {
        correlationId: ctx.correlationId,
        requestId: v4(),
      },
    });

    ctx.logger.debug("Received request", { request: ctx.request.toJSON() });
    await next();
  };
