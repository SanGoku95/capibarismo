interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

interface StructuredDataPerson {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  description?: string;
  image?: string;
  url?: string;
  jobTitle?: string;
  affiliation?: {
    '@type': 'Organization';
    name: string;
  };
  knowsAbout?: string[];
}

interface StructuredDataItemList {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    item: {
      '@type': 'Person' | 'Thing';
      name: string;
      url: string;
      description?: string;
    };
  }[];
}

interface StructuredDataArticle {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
}

const BASE_URL = 'https://capibarismo.com';
const SITE_NAME = 'Capibarismo';
const DEFAULT_IMAGE = `${BASE_URL}/background_congress.png`;
const DEFAULT_DESCRIPTION = 'Compara candidatos presidenciales de Perú 2026 con información verificada y objetiva. Conoce propuestas, trayectorias y posiciones políticas basadas en hechos.';

export const updateMetaTags = (metadata: SEOMetadata) => {
  const {
    title,
    description,
    canonical = BASE_URL,
    image = DEFAULT_IMAGE,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
  } = metadata;

  // Update title
  document.title = `${title} | ${SITE_NAME}`;

  // Update or create meta tags
  const updateMeta = (selector: string, content: string) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      const [attr, value] = selector.replace(/\[|\]/g, '').split('=');
      element.setAttribute(attr, value.replace(/['"]/g, ''));
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Basic meta tags
  updateMeta('meta[name="description"]', description);
  if (author) updateMeta('meta[name="author"]', author);

  // Open Graph
  updateMeta('meta[property="og:title"]', title);
  updateMeta('meta[property="og:description"]', description);
  updateMeta('meta[property="og:url"]', canonical);
  updateMeta('meta[property="og:image"]', image);
  updateMeta('meta[property="og:type"]', type);
  updateMeta('meta[property="og:site_name"]', SITE_NAME);
  updateMeta('meta[property="og:locale"]', 'es_PE');

  // Twitter
  updateMeta('meta[name="twitter:card"]', 'summary_large_image');
  updateMeta('meta[name="twitter:title"]', title);
  updateMeta('meta[name="twitter:description"]', description);
  updateMeta('meta[name="twitter:image"]', image);

  // Article-specific tags
  if (type === 'article') {
    if (publishedTime) updateMeta('meta[property="article:published_time"]', publishedTime);
    if (modifiedTime) updateMeta('meta[property="article:modified_time"]', modifiedTime);
    if (author) updateMeta('meta[property="article:author"]', author);
  }

  // Canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonical;

  // Update hreflang
  let hreflangLink = document.querySelector('link[rel="alternate"][hreflang="es-PE"]') as HTMLLinkElement;
  if (!hreflangLink) {
    hreflangLink = document.createElement('link');
    hreflangLink.rel = 'alternate';
    hreflangLink.hreflang = 'es-PE';
    document.head.appendChild(hreflangLink);
  }
  hreflangLink.href = canonical;
};

export const addStructuredData = (data: StructuredDataPerson | StructuredDataItemList | StructuredDataArticle, id?: string) => {
  const scriptId = id || 'structured-data';
  
  // Remove existing structured data with the same ID
  const existing = document.getElementById(scriptId);
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
};

export const removeStructuredData = (id?: string) => {
  const scriptId = id || 'structured-data';
  const existing = document.getElementById(scriptId);
  if (existing) {
    existing.remove();
  }
};

export const createPersonStructuredData = (
  name: string,
  description: string,
  url: string,
  jobTitle: string = 'Candidato Presidencial',
  image?: string,
  affiliation?: string,
  knowsAbout?: string[]
): StructuredDataPerson => {
  const data: StructuredDataPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    url,
    jobTitle,
    image: image || DEFAULT_IMAGE,
  };

  if (affiliation) {
    data.affiliation = {
      '@type': 'Organization',
      name: affiliation,
    };
  }

  if (knowsAbout && knowsAbout.length > 0) {
    data.knowsAbout = knowsAbout;
  }

  return data;
};

export const createItemListStructuredData = (
  items: { name: string; url: string; description?: string }[]
): StructuredDataItemList => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: item.name,
        url: item.url,
        description: item.description,
      },
    })),
  };
};

export const createArticleStructuredData = (
  headline: string,
  description: string,
  datePublished?: string,
  dateModified?: string,
  image?: string
): StructuredDataArticle => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/capi_logo.png`,
      },
    },
    datePublished,
    dateModified,
    image: image || DEFAULT_IMAGE,
  };
};
