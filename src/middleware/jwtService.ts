import { Next } from "koa";
import { EnhancedContext } from "./index";
import { JwtService } from "../services";

export async function withJwtService(ctx: EnhancedContext, next: Next) {
  ctx.jwtService = new JwtService();

  await next();
}
