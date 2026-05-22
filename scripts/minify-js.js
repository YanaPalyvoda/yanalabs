// Modifié par Claude Code le 20260503 — minification JS post-build (recommandation PageSpeed)
// Modifié par Claude Code le 20260522 — cache-busting : hash SHA256 injecté dans les HTML
const { minify } = require("terser");
const fs   = require("fs");
const path = require("path");
const crypto = require("crypto");

const input   = "dist/js/main.js";
const distDir = "dist";

(async () => {
  const source = fs.readFileSync(input, "utf8");
  const result = await minify(source, { compress: true, mangle: true });

  if (!result.code) {
    console.error("Erreur Terser : aucun code produit");
    process.exit(1);
  }

  const before = Buffer.byteLength(source, "utf8");
  const after  = Buffer.byteLength(result.code, "utf8");
  fs.writeFileSync(input, result.code);
  console.log(`JS minifié : ${before} → ${after} octets (−${Math.round((1 - after / before) * 100)}%)`);

  // Hash des 8 premiers caractères SHA256 du fichier minifié
  const hash = crypto.createHash("sha256").update(result.code).digest("hex").slice(0, 8);

  // Injecter ?v=HASH dans tous les fichiers HTML du dossier dist
  function injectHash(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        injectHash(full);
      } else if (entry.name.endsWith(".html")) {
        const html = fs.readFileSync(full, "utf8");
        const updated = html.replace(/\/js\/main\.js(\?v=[a-f0-9]+)?/g, `/js/main.js?v=${hash}`);
        if (updated !== html) fs.writeFileSync(full, updated);
      }
    }
  }

  injectHash(distDir);
  console.log(`Cache-busting JS : ?v=${hash} injecté dans les HTML`);
})();
