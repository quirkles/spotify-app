import { createServer } from "./server";
import { CONFIG } from "./config";

export async function main() {
  const server = await createServer();
  return server.listen(CONFIG.port);
}

main()
  .then(() => {
    console.log("App listening!");
  })
  .catch((err) => console.log("App failed to start", err));
