/**
 * Module dependencies.
 */

const path = require("path");
const views = require("koa-views");
const swig = require("swig-templates");
const extras = require("swig-extras");

extras.useFilter(swig, "batch");
extras.useFilter(swig, "groupby");
// extras.useFilter(swig, "indent");
extras.useFilter(swig, "markdown");
extras.useFilter(swig, "nl2br");
extras.useFilter(swig, "pluck");
extras.useFilter(swig, "split");
extras.useFilter(swig, "trim");
extras.useFilter(swig, "truncate");

extras.useTag(swig, "markdown");
extras.useTag(swig, "switch");

/**
 * Setup views mapping .html
 * to the swig template engine.
 */

module.exports = views(path.resolve(__dirname, "../views"), {
  map: {
    html: "swig"
  }
});
