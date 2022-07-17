import { createServer } from "./server";
import { Http2ServerRequest, Http2ServerResponse } from "http2";

const handle = createServer().callback();

export function main(req: Http2ServerRequest, res: Http2ServerResponse) {
  return handle(req, res);
}
