import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { 
  SEOProps, 
  SITE_CONFIG, 
  generateTitle, 
  generateDescription, 
  generateKeywords, 
  generateCanonicalUrl 
} from '@/lib/seo';

interface SEOComponentProps extends SEOProps {
  children?: React.ReactNode;
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  articleTags,
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
  noFollow = false,
  children
}: SEOComponentProps) {
  const location = useLocation();
  
  const pageTitle = generateTitle(title);
  const pageDescription = generateDescription(description);
  const pageKeywords = generateKeywords(keywords);
  const canonicalUrl = canonical || generateCanonicalUrl(location.pathname);
  const imageUrl = ogImage ? `${SITE_CONFIG.siteUrl}${ogImage}` : `${SITE_CONFIG.siteUrl}${SITE_CONFIG.ogImage}`;

  const robotsContent = [];
  if (noIndex) robotsContent.push('noindex');
  if (noFollow) robotsContent.push('nofollow');
  if (robotsContent.length === 0) robotsContent.push('index', 'follow');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={author || SITE_CONFIG.author} />
      <meta name="robots" content={robotsContent.join(', ')} />
      <meta name="googlebot" content={robotsContent.join(', ')} />
      
      {/* Language and Location */}
      <meta name="language" content={SITE_CONFIG.language} />
      <meta name="geo.region" content={SITE_CONFIG.country} />
      <meta name="geo.country" content={SITE_CONFIG.country} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content={SITE_CONFIG.siteName} />
      <meta property="og:locale" content="es_PE" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* Article-specific tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === 'article' && articleTags && 
        articleTags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))
      }
      
      {/* Mobile and PWA */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Additional structured data or custom tags */}
      {children}
    </Helmet>
  );
}

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data, null, 2)}
      </script>
    </Helmet>
  );
}