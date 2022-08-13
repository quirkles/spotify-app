import { ExtendableContext, Next } from "koa";
import { EnhancedContext } from "./index";
import { getDataSource, SqlService } from "../services";
import { Logger } from "winston";

export const withSqlService = async (logger: Logger) => {
  const dataSource = await getDataSource(logger);
  return async (ctx: ExtendableContext & EnhancedContext, next: Next) => {
    ctx.sqlService = new SqlService(ctx.logger, dataSource);
    await next();
  };
};
