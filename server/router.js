require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
const sass = require("node-sass");
const postcss = require("postcss");

/**
 * PostCSS Plugins
 */
const reporter = require("postcss-reporter");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const precss = require("precss");
const cssnano = require("cssnano");
const stylelint = require("stylelint");

const router = (module.exports = new Router());

const walkSync = (dir = path.resolve(__dirname, "../views"), fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
      fileList = walkSync(path.join(dir, file, "/"), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  });
  return fileList;
};

const tree = walkSync();

tree.forEach(dir => {
  dir = dir.split("views")[1].split(".");
  dir.pop();
  dir = dir
    .join()
    .split(" ")
    .join("%20");

  const reDir = async ctx => {
    await ctx.render(`../views${dir.split("%20").join(" ")}`, {
      ctx,
      dir
    });
  };

  router
    .get(dir, reDir)
    .get(`${dir}.htm`, reDir)
    .get(`${dir}.html`, reDir);
});

router
  .get("/", async ctx => await ctx.render("index"))
  .get(/.\.(s)?(c|a)ss$/, async ctx => {
    const res = sass.renderSync({
      file: path.join("public", ctx.req.url.replace(/\.css$/, ".scss"))
    });
    const scss = await postcss([
      reporter,
      autoprefixer,
      postcssPresetEnv,
      precss,
      cssnano,
      stylelint
    ]).process(res.css, {
      from: undefined
    });
    ctx.set("Content-Type", "text/css");
    ctx.body = scss.css;
  });
