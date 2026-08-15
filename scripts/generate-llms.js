const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

const distDir = path.join(__dirname, '../dist');
const articlesDir = path.join(distDir, 'articles');
const today = DateTime.now().toISODate();

console.log(`--- DÉBUT GÉNÉRATION LLM (Date du jour : ${today}) ---`);

const headerSummary = `# YanaLabs\n> Agence d'automatisation no-code.\n\nLien vers le contenu complet : https://yanalabs.fr/llms-full.txt\n\n## Articles publiés\n`;
const headerFull = `# YanaLabs — Contenu complet\n> Version intégrale pour IA. Version résumée : https://yanalabs.fr/llms.txt\n\n---\n`;

function decodeEntities(text ) {
    return text.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
}

function getAllHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) getAllHtmlFiles(name, fileList);
        else if (file === 'index.html') fileList.push(name);
    });
    return fileList;
}

const allFiles = getAllHtmlFiles(articlesDir);
let fullContent = [headerFull];
let summaryLines = [headerSummary];
let count = 0;

allFiles.sort().forEach(fname => {
    if (fname.toUpperCase().includes('TMP')) return;

    const raw = fs.readFileSync(fname, 'utf8');
    
    // Extraction de la date (on cherche YYYY-MM-DD)
    const dateMatch = raw.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
    const pubDate = dateMatch ? dateMatch[1] : "1970-01-01";
    
    const articleSlug = path.basename(path.dirname(fname));

    // TEST DE DATE UNIQUE
    if (pubDate > today) {
        console.log(`❌ [EXCLU - FUTUR] : ${articleSlug} (${pubDate})`);
        return; 
    }

    console.log(`✅ [INCLUS] : ${articleSlug} (${pubDate})`);
    count++;

    const titleMatch = raw.match(/<title>(.*?)<\/title>/);
    let title = decodeEntities(titleMatch ? titleMatch[1].split('|')[0].trim() : "Sans titre");
    const url = "https://yanalabs.fr" + fname.replace(distDir, '' ).replace(/index\.html$/, '');

    let textContent = decodeEntities(raw
        .replace(/<(script|style).*?>.*?<\/\1>/gs, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ').trim());

    summaryLines.push(`- [${title}](${url}) (${pubDate})`);
    fullContent.push(`# ${title}\nURL: ${url}\nDate: ${pubDate}\n\n${textContent}\n\n---`);
});

// Écriture forcée
fs.writeFileSync(path.join(distDir, 'llms.txt'), summaryLines.join('\n'), 'utf8');
fs.writeFileSync(path.join(distDir, 'llms-full.txt'), fullContent.join('\n\n'), 'utf8');

console.log(`\n--- FIN : ${count} articles synchronisés dans les deux fichiers ---`);
