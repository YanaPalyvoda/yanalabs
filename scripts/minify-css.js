// Modifié par Claude Code le 20260503 — minification CSS post-build (recommandation PageSpeed)
const CleanCSS = require("clean-css");
const fs = require("fs");

const input = "dist/css/style.css";
const source = fs.readFileSync(input, "utf8");
const result = new CleanCSS({ level: 2 }).minify(source);

if (result.errors.length) {
  console.error("Erreurs CleanCSS:", result.errors);
  process.exit(1);
}

fs.writeFileSync(input, result.styles);
console.log(`CSS minifié : ${result.stats.originalSize} → ${result.stats.minifiedSize} octets (−${Math.round((1 - result.stats.efficiency) * 100)}%)`);
