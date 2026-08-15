const { DateTime } = require("luxon");
const markdownIt       = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs  = require('markdown-it-attrs');

module.exports = function(eleventyConfig) {

  // --- FIX : Rendre "now" disponible pour les templates ---
  eleventyConfig.addGlobalData("now", () => new Date());

  // ── Markdown ──
  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true, breaks: true, linkify: true })
      .use(markdownItAnchor, { level: 2 })
      .use(markdownItAttrs)
  );

  // ── Filtres de Date ──
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).setLocale("fr").toFormat("dd MMMM yyyy");
  });

  eleventyConfig.addFilter("isoDate", (date) => {
    return new Date(date).toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });

  // --- FIX : Support des deux noms de filtres pour le RSS ---
  const rfc822Filter = (dateObj) => DateTime.fromJSDate(dateObj, { zone: "utc" }).toRFC2822();
  eleventyConfig.addFilter("rfc822Date", rfc822Filter);
  eleventyConfig.addFilter("dateToRfc822", rfc822Filter);

  // ── Autres Filtres ──
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));
  eleventyConfig.addFilter("jsonify", (v) => JSON.stringify(String(v ?? "")));
  eleventyConfig.addFilter("wordCount", (content) => {
    if (!content) return 0;
    return content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  });

  eleventyConfig.addFilter("plainText", (html) => {
    if (!html) return "";
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&").replace(/&#39;/g, "'")
      .replace(/\s+/g, " ").trim();
  });

  eleventyConfig.addFilter("excludeUrl", (array, url, n = 3) =>
    array.filter(item => item.url !== url).slice(0, n)
  );

  // ── Collections ──
  eleventyConfig.addCollection("articlesSorted", (collectionApi) =>
    collectionApi.getFilteredByTag("articles")
      .filter(p => p.date <= new Date())
      .sort((a, b) => b.date - a.date)
  );

  // ── Passthrough (Chemins originaux) ──
  eleventyConfig.addPassthroughCopy({ "src/_assets/css/style.css": "css/style.css" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/videos": "videos" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");

  return {
    markdownTemplateEngine: "njk",
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
