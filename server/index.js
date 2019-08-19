const dotenv = require("dotenv");
const path = require("path");
const Koa = require("koa");
const api = require("./routing/api");
const koaCors = require("@koa/cors"); 

const init = async function() {

  // Configuration init
  console.log("Parsing config");
  const config = dotenv.config({
    path: path.join(__dirname, ".env"),
  });

  if (config.error) {
    throw new Error(`Loading environment failed\n${config.error}`);
  }

  // Test DB connection (post config init)
  const repo = require("./db/repo")(
    process.env.DB_URL,
    parseInt(process.env.SEED_ON_STARTUP, 10)
  );

  const conn = await repo.db.getConnection();
  await conn.ping();
  await conn.release();

  // Parse HTTP server address
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 3000;

  // Listen
  const server = new Koa();
  // Middleware
  server.use(
    koaCors({
      origin: process.env.CORS_ORIGIN || "http://localhost:80",
      allowHeaders: "Content-Type",
      credentials: true,
    })
  );
  server.use(api.mount("/api"));

  try {
    server.listen(port, host, () => {

      console.log(`Server started on ${host}:${port} in ${process.env.NODE_ENV} mode`);

      // Shutdown hooks
      async function shutdown() {
        console.log("Server shutting down");
        await repo.db.end();
        process.exit(0);
      }
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    });
  } catch(error) {
    throw new Error(`HTTP Server listening failed: ${error}`);
  }
};

init().catch((e) => {
  console.error(e);
  process.exit(1);
});