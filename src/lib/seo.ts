// SEO utilities and constants for Presidential Punch Peru
export const SITE_CONFIG = {
  siteName: 'Presidential Punch Peru 2026',
  siteDescription: 'Plataforma interactiva para comparar candidatos presidenciales de Perú 2026. Encuentra propuestas, trayectorias y posiciones políticas de forma visual y accesible.',
  siteUrl: process.env.NODE_ENV === 'production' 
    ? 'https://presidentialpunch.pe' 
    : 'http://localhost:8080',
  ogImage: '/background_congress.png',
  twitterHandle: '@PresidentialPunchPeru',
  author: 'Presidential Punch Peru',
  keywords: [
    'elecciones peru 2026',
    'candidatos presidenciales peru',
    'comparador politico peru',
    'propuestas electorales',
    'compass politico',
    'democracia peru',
    'campana electoral',
    'politica peruana',
    'candidatos 2026',
    'elecciones generales peru'
  ],
  language: 'es',
  country: 'PE',
  type: 'website'
};

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  articleTags?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_CONFIG.siteName;
  return `${pageTitle} | ${SITE_CONFIG.siteName}`;
}

export function generateDescription(pageDescription?: string): string {
  return pageDescription || SITE_CONFIG.siteDescription;
}

export function generateKeywords(pageKeywords?: string[]): string {
  const allKeywords = [...SITE_CONFIG.keywords];
  if (pageKeywords) {
    allKeywords.push(...pageKeywords);
  }
  return [...new Set(allKeywords)].join(', ');
}

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.siteUrl}${cleanPath}`;
}

// Structured data generators for political content
export function generateCandidateStructuredData(candidate: {
  id: string;
  nombre: string;
  ideologia: string;
  headshot: string;
  proyectoPolitico: {
    resumen: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": candidate.nombre,
    "description": candidate.proyectoPolitico.resumen,
    "image": candidate.headshot,
    "jobTitle": "Candidato Presidencial",
    "memberOf": {
      "@type": "Organization",
      "name": "Elecciones Presidenciales Perú 2026"
    },
    "nationality": {
      "@type": "Country",
      "name": "Peru"
    },
    "politicalAffiliation": candidate.ideologia,
    "url": generateCanonicalUrl(`/candidate/${candidate.id}`)
  };
}

export function generateElectionStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Elecciones Presidenciales Perú 2026",
    "description": "Elecciones generales para elegir el próximo presidente de Perú",
    "startDate": "2026-04-11",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Country",
      "name": "Peru"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Jurado Nacional de Elecciones",
      "url": "https://jne.gob.pe"
    }
  };
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_CONFIG.siteName,
    "description": SITE_CONFIG.siteDescription,
    "url": SITE_CONFIG.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_CONFIG.siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/PresidentialPunchPeru",
      "https://facebook.com/PresidentialPunchPeru"
    ]
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}