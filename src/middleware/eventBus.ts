import { Next } from "koa";
import { EnhancedContext } from "./index";
import { EventBus } from "../services/eventBus";

export async function withEventBus(ctx: EnhancedContext, next: Next) {
  ctx.eventBus = new EventBus(ctx.logger);

  await next();
}
