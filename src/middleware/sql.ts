import { ExtendableContext, Next } from "koa";
import { EnhancedContext } from "./index";
import { SqlService } from "../services";

export async function withSqlService(
  ctx: ExtendableContext & EnhancedContext,
  next: Next
) {
  ctx.sqlService = new SqlService();
  await next();
}
