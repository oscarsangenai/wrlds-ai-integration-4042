import React from 'react';
import { Helmet } from 'react-helmet-async';

/** FAQ item for structured data */
export interface FAQItem {
  question: string;
  answer: string;
}

/** SEO component props - all route-specific data must be passed explicitly */
export interface SEOProps {
  /** Page title - will be used in <title> and OG/Twitter tags */
  title?: string;
  /** Meta description for search results */
  description?: string;
  /** Canonical URL for the page (full URL) */
  canonicalUrl?: string;
  /** OG type: 'website', 'article', etc. */
  type?: string;
  /** Site/organization name */
  name?: string;
  /** OG/Twitter image URL (can be relative or absolute) */
  imageUrl?: string;
  /** ISO date string for blog posts */
  publishDate?: string;
  /** ISO date string for last modification */
  modifiedDate?: string;
  /** Author name */
  author?: string;
  /** Content category */
  category?: string;
  /** SEO keywords array */
  keywords?: string[];
  /** Whether this is a blog post (affects OG type and structured data) */
  isBlogPost?: boolean;
  /** Whether to add noindex directive */
  noIndex?: boolean;
  /** FAQ items for FAQ structured data (optional) */
  faqItems?: FAQItem[];
}

/**
 * Purely presentational SEO component.
 * All route-specific logic should live in page components.
 * This component only renders meta tags based on explicit props.
 */
const SEO: React.FC<SEOProps> = ({
  title = 'Gen AI Global — Responsible AI Community',
  description = 'Gen AI Global: An open, responsible AI community. Content pending verification.',
  canonicalUrl,
  type = 'website',
  name = 'Gen AI Global',
  imageUrl = '/lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png',
  publishDate,
  modifiedDate,
  author,
  category,
  keywords = ['Gen AI Global', 'responsible AI', 'AI community', 'education', 'research', 'volunteer'],
  isBlogPost = false,
  noIndex = false,
  faqItems
}) => {
  const SITE_URL = import.meta.env.VITE_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;

  // Create base Organization JSON-LD structured data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gen AI Global',
    url: SITE_URL,
    logo: `${SITE_URL}/lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png`,
    description: 'An open, responsible AI community.',
    sameAs: [
      'https://www.linkedin.com/company/gen-ai-global/'
    ]
  };

  // BlogPosting JSON-LD structured data
  const blogPostStructuredData = isBlogPost && publishDate ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    },
    headline: title,
    image: {
      '@type': 'ImageObject',
      url: absoluteImageUrl,
      width: 1200,
      height: 630
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Organization',
      name: author || 'Gen AI Global',
      url: SITE_URL
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gen AI Global',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png`,
        width: 512,
        height: 512
      },
      url: SITE_URL
    },
    description: description,
    keywords: keywords.join(', '),
    articleSection: category,
    inLanguage: 'en-US',
    isAccessibleForFree: true
  } : null;

  // FAQ structured data (passed from page components)
  const faqStructuredData = faqItems && faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  } : null;

  // Combine keywords with category
  const keywordString = category 
    ? [...keywords, category.toLowerCase()].join(', ') 
    : keywords.join(', ');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      <meta name="keywords" content={keywordString} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isBlogPost ? 'article' : type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Gen AI Global" />
      <meta property="og:locale" content="en_US" />
      {isBlogPost && category && <meta property="article:section" content={category} />}
      {isBlogPost && publishDate && <meta property="article:published_time" content={publishDate} />}
      {isBlogPost && modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {isBlogPost && <meta property="article:publisher" content={SITE_URL} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:site" content="" />
      <meta name="twitter:creator" content="" />
      
      {/* LinkedIn specific */}
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta name="author" content={author || name} />
      
      {/* Pinterest specific */}
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={absoluteImageUrl} />
      
      {/* Additional SEO meta tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      
      {blogPostStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(blogPostStructuredData)}
        </script>
      )}
      
      {faqStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;