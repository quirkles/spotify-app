import * as path from "path";

import winston, { transport } from "winston";
import { format, Format } from "logform";

import { gcpFormatter } from "./gcpFormatter";

import { CONFIG } from "../config";
import { GcpConsoleLogTransport } from "./gcpTransport";

const { combine, json, timestamp, prettyPrint } = format;

const environment = CONFIG.environment;

const transports: transport[] = [];

const consoleLogFormatPipeline: Format[] = [timestamp()];

if (process.env.IS_CLOUD !== "1") {
  const logsDir = path.join(__dirname, "../../logs");

  const logDestination = `${logsDir}/${
    environment === "development" ? "dev" : Date.now()
  }.log`;
  console.log("Logging to file:", logDestination) //eslint-disable-line
  transports.push(
    new winston.transports.File({
      filename: logDestination,
      format: combine(timestamp(), json()),
    })
  );
  consoleLogFormatPipeline.push(json());
  consoleLogFormatPipeline.push(prettyPrint({ colorize: true }));
  transports.push(
    new winston.transports.Console({
      format: combine(...consoleLogFormatPipeline),
    })
  );
} else {
  consoleLogFormatPipeline.push(gcpFormatter());
  transports.push(
    new GcpConsoleLogTransport({ format: combine(...consoleLogFormatPipeline) })
  );
}

export const logger = winston.createLogger({
  level: "debug",
  transports,
});
