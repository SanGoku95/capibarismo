import { candidates } from '../data/candidates';
import { SITE_CONFIG } from './seo';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateSitemap(): string {
  const baseUrl = SITE_CONFIG.siteUrl;
  const currentDate = formatDate(new Date());
  
  const staticPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: `${baseUrl}/compare`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: `${baseUrl}/compass`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/news`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/chat`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    }
  ];

  // Add candidate profile pages
  const candidatePages: SitemapEntry[] = candidates.map(candidate => ({
    url: `${baseUrl}/candidate/${candidate.id}`,
    lastmod: currentDate,
    changefreq: 'weekly' as const,
    priority: '0.8'
  }));

  const allPages = [...staticPages, ...candidatePages];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
}

// Function to generate news sitemap for election-specific content
export function generateNewsSitemap(): string {
  const baseUrl = SITE_CONFIG.siteUrl;
  const currentDate = new Date().toISOString();
  
  // This would be populated with actual news/events data
  const newsItems = [
    {
      url: `${baseUrl}/news/elecciones-2026-calendario`,
      title: 'Calendario Electoral Perú 2026',
      publishedDate: currentDate,
      keywords: 'elecciones, peru, 2026, calendario'
    }
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems.map(item => `  <url>
    <loc>${item.url}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_CONFIG.siteName}</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${item.publishedDate}</news:publication_date>
      <news:title>${item.title}</news:title>
      <news:keywords>${item.keywords}</news:keywords>
    </news:news>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
}