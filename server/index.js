const dotenv = require("dotenv");
const path = require("path");
const Koa = require("koa");

const init = async function() {

  // Configuration init
  process.stdout.write("Parsing config...");
  const config = dotenv.config({
    path: path.join(__dirname, ".env"),
  });

  if (config.error) {
    throw new Error(`Loading environment failed: ${config.error}`);
  }
  
  process.stdout.write(" done\n");

  // Parse HTTP server address
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 3000;

  // Listen
  const server = new Koa();
  try {
    server.listen(port, host, () => {

      console.log(`Server started on ${host}:${port}`);

      // Shutdown hooks
      function shutdown() {
        console.log("Server shutting down...");
        process.exit(0);
      }
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    });
  } catch(error) {
    throw new Error(`HTTP Server listening failed: ${error}`);
  }
}

init().catch(e => {
  console.error(e);
  console.error("Init failed, exiting.");
  process.exit(1);
});