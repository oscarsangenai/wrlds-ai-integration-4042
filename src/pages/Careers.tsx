
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Mail, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useInView } from '@/hooks/useInView';

const Careers = () => {
  const { ref: titleRef, isInView: titleInView } = useInView<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: subtitleRef, isInView: subtitleInView } = useInView<HTMLParagraphElement>({ threshold: 0.2 });
  const { ref: contentRef, isInView: contentInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <PageLayout showContact={false}>
        <section className="pt-16 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              <h1 
                ref={titleRef}
                className={`text-4xl font-bold mb-6 ${titleInView ? 'animate-slide-up' : ''}`}
              >
                Join Our Team
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <p 
                  ref={subtitleRef}
                  className={`text-xl text-gray-600 mb-4 ${subtitleInView ? 'animate-slide-up stagger-1' : ''}`}
                >
                  We're looking for passionate innovators to help us revolutionize the smart textile industry.
                </p>
                
                <p className={`text-xl text-gray-600 mb-12 ${subtitleInView ? 'animate-slide-up stagger-2' : ''}`}>
                  We welcome both full-time professionals and interns who are eager to contribute to groundbreaking technology.
                </p>
                
                <div 
                  ref={contentRef}
                  className={`mb-16 ${contentInView ? 'animate-slide-up' : ''}`}
                >
                  <h2 className="text-3xl font-bold mb-6">Why Join WRLDS?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        title: "Innovation",
                        description: "Work on cutting-edge technology that's changing multiple industries."
                      },
                      {
                        title: "Impact",
                        description: "Create solutions that enhance safety, performance, and quality of life."
                      },
                      {
                        title: "Growth",
                        description: "Develop your skills in a rapidly expanding field with diverse challenges."
                      }
                     ].map((benefit, i) => (
                       <div key={benefit.title} className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mt-12">
                    <h3 className="font-bold text-xl mb-6">Contact Our COO</h3>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex flex-col items-center text-center">
                        <img 
                          src={`${import.meta.env.BASE_URL || '/'}lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png`}
                          alt="Love Anderberg"
                          className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
                          loading="lazy"
                          decoding="async"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Love Anderberg</h3>
                        <p className="text-gray-600 mb-4">COO</p>
                        <div className="flex flex-col space-y-3">
                          <a href="mailto:love@genaiglobal.org" className="flex items-center text-gray-700 hover:text-blue-600">
                            <Mail className="w-5 h-5 mr-2" />
                            love@genaiglobal.org
                          </a>
                          <a 
                            href="https://www.linkedin.com/in/love-anderberg-67549a174/" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-blue-600"
                          >
                            <Linkedin className="w-5 h-5 mr-2" />
                            LinkedIn Profile
                          </a>
                          <a href="tel:+46760149508" className="flex items-center text-gray-700 hover:text-blue-600">
                            <Phone className="w-5 h-5 mr-2" />
                            076-014 95 08
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

export default Careers;
