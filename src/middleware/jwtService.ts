import { Next } from "koa";
import { EnhancedContext } from "./index";
import { JwtService } from "../services/jwtService";

export async function withJwtService(ctx: EnhancedContext, next: Next) {
  ctx.jwtService = new JwtService();

  await next();
}
