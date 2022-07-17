import { ExtendableContext, Next } from "koa";
import { CacheService } from "../services";
import { EnhancedContext } from "./index";

export async function withCacheService(
  ctx: ExtendableContext & EnhancedContext,
  next: Next
) {
  ctx.cacheService = new CacheService(ctx.logger);
  await next();
}
