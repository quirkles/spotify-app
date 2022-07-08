import * as path from "path";

import Koa from "koa";
import pino, { TransportTargetOptions } from "pino";

import { CONFIG } from "../config";
import { v4 } from "uuid";

const environment = CONFIG.environment;

const logsDir = path.join(__dirname, "../../logs");

const logDestination = `${logsDir}/${
  environment === "development" ? "dev" : Date.now()
}.log`;

const logTargets: TransportTargetOptions[] = [
  {
    target: "pino/file",
    level: "trace",
    options: {
      destination: logDestination,
      mkdir: true,
    },
  },
];

if (environment === "development") {
  logTargets.push({
    target: "pino-pretty",
    level: "trace",
    options: {
      colorize: true,
    },
  });
}

const baseLogger = pino(
  {
    name: "app-logger",
  },
  pino.transport({
    targets: logTargets,
  })
);

export async function withLogger(
  ctx: Koa.ExtendableContext & { correlationId: string; logger: pino.Logger },
  next: Koa.Next
) {
  ctx.logger = baseLogger.child({
    correlationId: ctx.correlationId,
    requestId: v4(),
    destination: 1,
  });
  ctx.logger.info("test");
  await next();
}
