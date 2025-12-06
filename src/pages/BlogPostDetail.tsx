import { useParams, useLocation } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import PageLayout from '@/components/PageLayout';
import SEO, { FAQItem } from '@/components/SEO';
import EnhancedBlogContent from '@/components/EnhancedBlogContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Route-specific FAQ data for structured data
const BLOG_FAQ_DATA: Record<string, FAQItem[]> = {
  'smart-ppe-revolution': [
    {
      question: 'What is Smart PPE?',
      answer: 'Smart PPE (Personal Protective Equipment) refers to traditional safety gear enhanced with sensors, connectivity, and intelligence. Unlike ordinary PPE that acts as a passive barrier, smart PPE actively monitors conditions and provides real-time alerts to prevent accidents.'
    },
    {
      question: 'How does smart PPE improve workplace safety?',
      answer: 'Smart PPE improves safety by providing real-time monitoring of environmental conditions, worker health metrics, and potential hazards. It can detect falls, monitor vital signs, sense toxic gases, and automatically alert emergency responders when needed.'
    },
    {
      question: 'What industries benefit from smart PPE?',
      answer: 'Smart PPE benefits multiple industries including construction, manufacturing, oil & gas, fire & rescue, healthcare, mining, and any workplace where safety is paramount. Each industry can customize the technology to address specific safety challenges.'
    }
  ],
  'wearable-safety-tech-protecting-workers-roi': [
    {
      question: 'How much do workplace injuries cost?',
      answer: 'According to the National Safety Council, the average cost for a medically consulted work injury is $43,000 in 2023. With 2.2 injuries per 100 full-time workers, a 200-person site can expect about $215,000 in injury costs annually before accounting for downtime or replacement training.'
    },
    {
      question: 'What ROI can wearable safety technology deliver?',
      answer: 'Real-world deployments show significant returns: one study found 54% lower OSHA recordables and 88% fewer lost workdays. Another warehouse study showed 62% of workers reduced risky movements by half, with total ergonomic hazards falling 39%.'
    },
    {
      question: 'Do insurance companies support wearable safety technology?',
      answer: 'Yes, many insurers now bundle wearable device costs into workers compensation premiums. Employers keep the hardware as long as usage stays high because fewer claims leave insurers ahead financially. Regional carriers are expanding similar rebate schemes.'
    }
  ]
};

// Route-specific enhanced keywords
const BLOG_ENHANCED_KEYWORDS: Record<string, string[]> = {
  'smart-ppe-revolution': [
    'personal protective equipment',
    'workplace safety solutions',
    'smart safety gear',
    'construction safety technology',
    'industrial safety monitoring',
    'occupational health technology',
    'safety compliance',
    'worker protection systems',
    'smart hard hats',
    'connected safety equipment'
  ],
  'wearable-safety-tech-protecting-workers-roi': [
    'workplace injury costs',
    'safety ROI',
    'workers compensation savings',
    'ergonomic sensors',
    'workplace safety investment',
    'safety technology ROI',
    'industrial wearables',
    'safety cost reduction',
    'occupational safety economics',
    'safety technology partnerships',
    'workplace injury statistics',
    'safety equipment financing',
    'injury prevention technology'
  ]
};

const BlogPostDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Compute SEO props based on route/slug
  const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin;
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const faqItems = slug ? BLOG_FAQ_DATA[slug] : undefined;
  const enhancedKeywords = slug && BLOG_ENHANCED_KEYWORDS[slug]
    ? [...(post.keywords || []), ...BLOG_ENHANCED_KEYWORDS[slug]]
    : post.keywords;

  return (
    <PageLayout>
      <SEO 
        title={`${post.title} - WRLDS`}
        description={post.metaDescription || post.excerpt}
        canonicalUrl={canonicalUrl}
        imageUrl={post.imageUrl}
        keywords={enhancedKeywords}
        isBlogPost={true}
        publishDate={new Date(post.date).toISOString()}
        author={post.author}
        category={post.category}
        type="article"
        faqItems={faqItems}
      />
      
      <article className="w-full pt-16 pb-16">
        {/* Hero Section - Taller to accommodate text content */}
        <div className="banner-container h-96 sm:h-[450px] md:h-[500px] lg:h-[550px] relative">
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover filter grayscale"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          
          <div className="banner-overlay">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-start md:justify-center">
              <div className="w-full max-w-4xl mx-auto text-left md:text-center">
                <Link to="/blog" className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition-colors text-sm">
                  <ArrowLeft className="mr-2 h-3 w-3" />
                  Back to Blog
                </Link>
                
                {/* Mobile-optimized title */}
                <h1 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight break-words max-w-full">
                  {post.title}
                </h1>
                
                {/* Compact mobile metadata */}
                <div className="flex flex-col gap-3 text-gray-300 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start md:justify-center gap-2 sm:gap-6">
                    <div className="flex items-center text-xs sm:text-base">
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-base">
                      <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-start md:justify-center">
                    <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/20">
                      {post.category}
                    </div>
                  </div>
                </div>
                
                {/* Mobile-optimized excerpt */}
                <p className="text-gray-200 text-sm sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <EnhancedBlogContent content={post.content} />
          </div>
        </div>
      </article>
    </PageLayout>
  );
};

export default BlogPostDetail;