import { createServer } from "./server";
import { CONFIG } from "./config";

const server = createServer();

server.listen(CONFIG.port);
