// Modifié par Claude Code le 20260503 — minification JS post-build (recommandation PageSpeed)
const { minify } = require("terser");
const fs = require("fs");

const input = "dist/js/main.js";

(async () => {
  const source = fs.readFileSync(input, "utf8");
  const result = await minify(source, { compress: true, mangle: true });

  if (!result.code) {
    console.error("Erreur Terser : aucun code produit");
    process.exit(1);
  }

  const before = Buffer.byteLength(source, "utf8");
  const after = Buffer.byteLength(result.code, "utf8");
  fs.writeFileSync(input, result.code);
  console.log(`JS minifié : ${before} → ${after} octets (−${Math.round((1 - after / before) * 100)}%)`);
})();
