const dotenv = require("dotenv");
const path = require("path");
const Koa = require("koa");
const mysql = require("mysql2/promise");
const api = require("./routing/api");

const init = async function() {

  // Configuration init
  console.log("Parsing config");
  const config = dotenv.config({
    path: path.join(__dirname, ".env"),
  });

  if (config.error) {
    throw new Error(`Loading environment failed\n${config.error}`);
  }

  // Start database connection
  console.log("Establishing database connection");
  const db = mysql.createPool(process.env.DB_URL || "mysql://root@localhost/artsite");
  try {
    const conn = await db.getConnection();
    await conn.ping();
    await conn.release();
  } catch(error) {
    throw new Error(`Database connection failure\n${error}`);
  }

  // Parse HTTP server address
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 3000;

  // Listen
  const server = new Koa();
  server.use(api.mount("/api"));
  try {
    server.listen(port, host, () => {

      console.log(`Server started on ${host}:${port} in ${process.env.NODE_ENV} mode`);

      // Shutdown hooks
      async function shutdown() {
        console.log("Server shutting down");
        await db.end();
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
  process.exit(1);
});