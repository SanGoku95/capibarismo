import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  updateMetaTags,
  addStructuredData,
  removeStructuredData,
  createPersonStructuredData,
  createItemListStructuredData,
  createArticleStructuredData,
} from './seo';

interface UseSEOParams {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const useSEO = (params: UseSEOParams) => {
  const location = useLocation();
  const BASE_URL = 'https://capibarismo.com';

  useEffect(() => {
    const canonical = params.canonical || `${BASE_URL}${location.pathname}`;
    
    updateMetaTags({
      ...params,
      canonical,
    });

    // Cleanup function to reset on unmount if needed
    return () => {
      // Clean up any page-specific structured data
      removeStructuredData('page-structured-data');
    };
  }, [location.pathname, params]);
};

export const usePersonSEO = (
  name: string,
  description: string,
  jobTitle?: string,
  image?: string,
  affiliation?: string,
  knowsAbout?: string[]
) => {
  const location = useLocation();
  const BASE_URL = 'https://capibarismo.com';

  useEffect(() => {
    const url = `${BASE_URL}${location.pathname}`;
    
    // Update meta tags
    updateMetaTags({
      title: name,
      description,
      canonical: url,
      image,
      type: 'profile',
    });

    // Add Person structured data
    const personData = createPersonStructuredData(
      name,
      description,
      url,
      jobTitle,
      image,
      affiliation,
      knowsAbout
    );
    addStructuredData(personData, 'person-structured-data');

    return () => {
      removeStructuredData('person-structured-data');
    };
  }, [name, description, location.pathname, jobTitle, image, affiliation, knowsAbout]);
};

export const useItemListSEO = (
  title: string,
  description: string,
  items: { name: string; url: string; description?: string }[]
) => {
  const location = useLocation();
  const BASE_URL = 'https://capibarismo.com';

  useEffect(() => {
    const url = `${BASE_URL}${location.pathname}`;
    
    // Update meta tags
    updateMetaTags({
      title,
      description,
      canonical: url,
      type: 'website',
    });

    // Add ItemList structured data
    const itemListData = createItemListStructuredData(items);
    addStructuredData(itemListData, 'itemlist-structured-data');

    return () => {
      removeStructuredData('itemlist-structured-data');
    };
  }, [title, description, items, location.pathname]);
};

export const useArticleSEO = (
  headline: string,
  description: string,
  datePublished?: string,
  dateModified?: string,
  image?: string
) => {
  const location = useLocation();
  const BASE_URL = 'https://capibarismo.com';

  useEffect(() => {
    const url = `${BASE_URL}${location.pathname}`;
    
    // Update meta tags
    updateMetaTags({
      title: headline,
      description,
      canonical: url,
      image,
      type: 'article',
      publishedTime: datePublished,
      modifiedTime: dateModified,
    });

    // Add Article structured data
    const articleData = createArticleStructuredData(
      headline,
      description,
      datePublished,
      dateModified,
      image
    );
    addStructuredData(articleData, 'article-structured-data');

    return () => {
      removeStructuredData('article-structured-data');
    };
  }, [headline, description, datePublished, dateModified, image, location.pathname]);
};
