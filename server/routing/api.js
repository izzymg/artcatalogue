const Router = require("koa-tree-router");
const cors = require("@koa/cors"); 
const router = new Router({
  onMethodNotAllowed: (ctx) => ctx.body = "405: Method not allowed.",
});

// Middleware adds CORS headers to API responses
const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "localhost",
  allowHeaders: "Content-Type",
  credentials: true,
});

router.post("/", corsMiddleware, async function(ctx) {
  ctx.body = "Hello";
});


module.exports = router;