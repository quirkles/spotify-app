import Transport from "winston-transport";
import { TransformableInfo } from "logform";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

export class GcpConsoleLogTransport extends Transport {
  constructor(opts: ConsoleTransportOptions) {
    super(opts);
  }

  log(info: TransformableInfo, cb: () => void) {
    const { level, ...rest } = info;
    rest.severity = level;

    console.log(JSON.stringify(rest));
    cb();
  }
}
