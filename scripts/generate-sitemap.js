import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read candidate data from domains/base.ts (canonical source)
const candidatesPath = path.join(__dirname, '../src/data/domains/base.ts');
const content = fs.readFileSync(candidatesPath, 'utf-8');

// Extract candidate entries: key: { id: '...', nombre: '...' }
const entryPattern = /['"]?([\w-]+)['"]?\s*:\s*\{[^}]*?id:\s*['"]([^'\"]+)['"][^}]*?nombre:\s*['"]([^'\"]+)['"]/g;
const candidates = [];
let match;
while ((match = entryPattern.exec(content)) !== null) {
  const key = match[1];
  const id = match[2] || key;
  const nombre = match[3];
  candidates.push({ id, nombre });
}

// Base URL
const baseUrl = 'https://capibarismo.com';

// Generate sitemap XML
const generateSitemap = () => {
  const now = new Date().toISOString().split('T')[0];
  
  const urls = [
    // Static pages
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/jugar', priority: '0.9', changefreq: 'daily' },
    { loc: '/ranking', priority: '0.9', changefreq: 'daily' },
    { loc: '/compare', priority: '0.9', changefreq: 'weekly' },
    { loc: '/compass', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/fuentes', priority: '0.5', changefreq: 'monthly' },
    
    // Candidate pages
    ...candidates.map(candidate => ({
      loc: `/candidate/${candidate.id}`,
      priority: '0.8',
      changefreq: 'weekly'
    }))
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es-PE" href="${baseUrl}${url.loc}"/>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
};

// Write sitemap
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
const sitemap = generateSitemap();
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✓ Sitemap generated with ${candidates.length} candidate pages`);
console.log(`✓ Total URLs: ${7 + candidates.length}`);
console.log(`✓ Written to: ${sitemapPath}`);
