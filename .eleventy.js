const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

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
  // Après les autres addFilter
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));

  eleventyConfig.addPassthroughCopy({ "src/_assets/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  return {
    markdownTemplateEngine: false,
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