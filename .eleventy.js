const { DateTime } = require("luxon");
const markdownIt       = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs  = require('markdown-it-attrs');

module.exports = function(eleventyConfig) {

  // ── Markdown avec HTML inline + ancres + attrs ──
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, breaks: true, linkify: true })
      .use(markdownItAnchor, { level: 2 })
      .use(markdownItAttrs)
  );

  // ── Filters ────────────────────────────────────
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .setLocale("fr")
      .toFormat("dd MMMM yyyy");
  });
  eleventyConfig.addFilter("isoDate", (date) => {
    return new Date(date).toISOString().slice(0, 10);
  });
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));

  // Modifications 20260424 par Openclaw — filtre pour articles similaires (exclut l'article courant)
  eleventyConfig.addFilter("excludeUrl", (array, url, n = 3) =>
    array.filter(item => item.url !== url).slice(0, n)
  );

  // Modifications 20260424 par Openclaw — collection déjà définie ailleurs, commentée pour éviter le conflit
  // eleventyConfig.addCollection("articlesSorted", (collectionApi) =>
  //   collectionApi.getFilteredByTag("articles")
  //     .filter(p => p.date <= new Date())
  //     .sort((a, b) => b.date - a.date)
  // );

  // Modifications 20260424 par Openclaw
  // Filtre pour articles similaires : exclut l'article courant avant de limiter
  eleventyConfig.addFilter("excludeUrl", (array, url, n = 3) =>
    array.filter(item => item.url !== url).slice(0, n)
  );

  // Modifications 20260424 par Openclaw
  // Collection articles triés par date décroissante, articles futurs exclus
  eleventyConfig.addCollection("articlesSorted", (collectionApi) =>
    collectionApi.getFilteredByTag("articles")
      .filter(p => p.date <= new Date())
      .sort((a, b) => b.date - a.date)
  );

  // ── Passthrough ────────────────────────────────
  eleventyConfig.addPassthroughCopy({ "src/_assets/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  return {
    markdownTemplateEngine: "njk",   // ← était false, à changer !
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
    dir: {
      input: "src",
      output: "dist",
      layouts: "_layouts",
      data: "_data"
    }
  };
};