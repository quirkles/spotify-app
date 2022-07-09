import { ExtendableContext, Next } from "koa";
import { CacheService } from "../services/cacheService";
import { EnhancedContext } from "./index";

export async function withCacheService(
  ctx: ExtendableContext & ExtendableContext & EnhancedContext,
  next: Next
) {
  ctx.cacheService = new CacheService();
  await next();
}
