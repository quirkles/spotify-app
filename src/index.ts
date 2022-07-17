import { createServer } from "./server";
import { CONFIG } from "./config";

export function main() {
  const server = createServer();
  return server.listen(CONFIG.port);
}

main();
