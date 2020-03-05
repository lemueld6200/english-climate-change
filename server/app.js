const path = require("path");
const render = require("./render");
const router = require("./router");
const logger = require("koa-logger");
const koaBody = require("koa-body");
const serve = require("koa-static");
const compress = require("koa-compress");
const minify = require("koa-html-minifier2");

const Koa = require("koa");
const app = (module.exports = new Koa())

  // Middleware
  .use(logger())
  .use(koaBody())
  .use(render)
  .use(compress())
  .use(minify({
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    processScripts: ["application/ld+json"],
    removeComments: true
}))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(path.resolve(__dirname, "../public")))
  .use(async (ctx, next) => {
    try {
      await next();
      ctx.compress = true;
      const status = ctx.status || 404;
      if (status === 404) {
        ctx.throw(404);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      if (ctx.status === 404) {
        await ctx.render("404");
      } else {
        ctx.body = err.message;
        ctx.app.emit("error", err, ctx);
      }
    }
  });
