import { ExtendableContext, Next } from "koa";
import { DataStoreService } from "../services";
import { EnhancedContext } from "./index";
import { Datastore } from "@google-cloud/datastore";

export async function withDatastoreService(
  ctx: ExtendableContext & EnhancedContext,
  next: Next
) {
  ctx.datastoreService = new DataStoreService(new Datastore(), ctx.logger);
  await next();
}
