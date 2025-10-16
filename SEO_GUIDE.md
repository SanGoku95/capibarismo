# SEO Implementation Guide

This document describes the SEO improvements implemented in the Capibarismo project.

## What's Been Implemented

### 1. Sitemap Generation ✅
- **File**: `public/sitemap.xml`
- **Generator**: `scripts/generate-sitemap.js`
- Automatically generates sitemap with all pages (14 URLs total):
  - Homepage
  - Compare page
  - Political compass page
  - About page
  - Sources page
  - 9 candidate profile pages
- Integrated into build process
- Includes hreflang tags for es-PE locale

### 2. Robots.txt ✅
- **File**: `public/robots.txt`
- Allows all major search engines
- References sitemap.xml
- Properly formatted for search engine crawlers

### 3. Meta Tags & Open Graph ✅
- **Base HTML**: Updated `index.html` with es-PE language code
- **Dynamic Meta Tags**: Created `src/lib/seo.ts` and `src/lib/useSEO.ts`
- All pages have unique:
  - Title tags
  - Meta descriptions
  - Open Graph tags (og:title, og:description, og:image, og:type)
  - Twitter Card tags
  - Canonical URLs
  - hreflang tags

### 4. Structured Data (JSON-LD) ✅
- **Person Schema**: Candidate profile pages include Person structured data
  - Name, description, job title
  - Affiliation (political party)
  - Topics of expertise (knowsAbout)
  - Profile image
- **ItemList Schema**: Homepage includes ItemList of all candidates
- **Article Schema**: About and Sources pages include Article structured data

### 5. Language Tags ✅
- HTML lang attribute set to "es-PE"
- hreflang links added to all pages
- Geo tags for Peru (PE)

## How SEO Works in This Application

### Client-Side Dynamic Updates
Since this is a Single Page Application (SPA), SEO is handled through:

1. **Base HTML Meta Tags**: Initial meta tags in `index.html` provide fallback content
2. **Dynamic Updates**: When users navigate to different pages, JavaScript updates:
   - Document title
   - Meta tags (description, Open Graph, Twitter)
   - Canonical URLs
   - Structured data (JSON-LD scripts)

### Search Engine Compatibility
Modern search engines (Google, Bing) execute JavaScript and can read:
- Dynamically updated meta tags
- JSON-LD structured data injected via JavaScript
- Content rendered client-side

## Testing SEO Implementation

### 1. Verify Sitemap
```bash
# Build the project (generates sitemap)
npm run build

# Check sitemap content
cat public/sitemap.xml

# Or generate sitemap only
npm run generate:sitemap
```

### 2. Test Meta Tags
Visit any page and check the document head:
```javascript
// In browser console
console.log(document.title);
console.log(document.querySelector('meta[property="og:title"]').content);
console.log(document.querySelector('script[type="application/ld+json"]').textContent);
```

### 3. Test with SEO Tools
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema.org Validator**: https://validator.schema.org/

### 4. Lighthouse SEO Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://capibarismo.com --only-categories=seo --view
```

## Next Steps for Improved SEO

### Option 1: Prerendering (Recommended for Vercel)
If you want search engines to see the full page content without executing JavaScript:

1. **Install Prerender.io** (Vercel Integration)
   - Visit: https://vercel.com/integrations/prerender
   - Enable for your project
   - Automatically serves static HTML to bots

2. **Or use Vercel's ISR** (Incremental Static Regeneration)
   - Migrate to Next.js for native SSR/SSG support
   - More complex but better long-term solution

### Option 2: Server-Side Rendering (More Work)
Convert to a framework with SSR support:
- Next.js (React)
- Remix (React)
- SvelteKit (Svelte)

## Maintenance

### Updating the Sitemap
The sitemap is automatically generated during build. If you:
- Add new candidates → Sitemap updates automatically
- Add new static pages → Update `scripts/generate-sitemap.js`

### Updating Meta Tags
To change meta tags for a specific page:
1. Find the page component (e.g., `src/pages/HomePage.tsx`)
2. Update the `useSEO()` or `usePersonSEO()` hook parameters
3. Changes apply immediately on next build

### Adding New Structured Data
Use the helper functions in `src/lib/seo.ts`:
- `createPersonStructuredData()` - For people/candidates
- `createItemListStructuredData()` - For lists
- `createArticleStructuredData()` - For articles/pages

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Vercel SEO Guide](https://vercel.com/guides/does-vercel-support-seo)
- [React Helmet Alternative](https://github.com/joshwcomeau/react-helmet-async)

## Checklist

- [x] robots.txt allows crawling
- [x] XML sitemap submitted (needs manual submission to Google Search Console)
- [x] Unique titles per page
- [x] Unique meta descriptions per page
- [x] Open Graph tags on all pages
- [x] hreflang="es-PE" tags
- [x] Person structured data on candidate profiles
- [x] ItemList structured data on homepage
- [x] Article structured data on content pages
- [ ] Prerendering enabled (optional, recommended for Vercel)
- [ ] Core Web Vitals optimized (test with Lighthouse)
- [ ] Sitemap submitted to Google Search Console (manual step)
