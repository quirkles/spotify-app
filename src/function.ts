import { createServer } from "./server";
import { Http2ServerRequest, Http2ServerResponse } from "http2";

export async function main(req: Http2ServerRequest, res: Http2ServerResponse) {
  const server = await createServer();
  return server.callback()(req, res);
}
