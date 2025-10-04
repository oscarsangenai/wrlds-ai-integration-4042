import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

const ApplicationConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationType = searchParams.get('type') || 'General Member';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout showContact={false} showGeometry={false}>
      <SEO 
        title="Application Submitted — Gen AI Global"
        description="Thank you for your application to Gen AI Global"
        noIndex
      />
      
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-card border rounded-lg p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-[28px] font-medium leading-[150%] mb-4 text-foreground">
              Thank you for applying!
            </h1>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-[150%] mb-8">
              We have received your application for {applicationType},<br />
              We will get back to you after reviewing.
            </p>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/')}
              className="w-full h-[50px] text-base font-medium"
              size="lg"
            >
              Back to Homepage
            </Button>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default ApplicationConfirmation;
