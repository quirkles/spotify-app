import { ExtendableContext, Next } from "koa";
import { EnhancedContext } from "./index";
import { dataSource, SqlService } from "../services";
import { Logger } from "winston";

export const withSqlService = async (logger: Logger) => {
  if (dataSource.isInitialized) {
    logger.info("Datasource is already initialized");
  } else {
    await dataSource
      .initialize()
      .then(() => {
        logger.info("Initialized data source");
      })
      .catch((error) => logger.error("Failed to initialize datasource", error));
  }

  return async (ctx: ExtendableContext & EnhancedContext, next: Next) => {
    ctx.sqlService = new SqlService(ctx.logger, dataSource);
    await next();
  };
};
