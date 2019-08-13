const Router = require("koa-tree-router");
const router = new Router({
  onMethodNotAllowed: (ctx) => ctx.body = "405: Method not allowed.",
});

router.post("/", async function(ctx) {
  ctx.body = "Hello";
});


module.exports = router;