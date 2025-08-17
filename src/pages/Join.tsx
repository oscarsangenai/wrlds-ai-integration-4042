import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, User, Mail, Phone, Linkedin, ArrowRight } from 'lucide-react';

const Join = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    consent: false
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, JPEG, or PNG file.",
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setCertificateFile(file);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your first name, last name, and email.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to the terms and privacy policy to continue.",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement Supabase integration for:
      // 1. User signup/authentication
      // 2. File upload to secure storage
      // 3. Database insertion (users, memberships, uploads tables)
      // 4. Email confirmation sending
      // 5. Source attribution tracking

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Determine path based on certificate
      if (certificateFile) {
        // Has certificate -> Member path
        toast({
          title: "Application Submitted!",
          description: "Thank you for joining as a member. Your certificate is being reviewed and you'll receive a confirmation email shortly."
        });
        
        // TODO: Set membership status to 'member' pending verification
        navigate('/welcome?type=member');
      } else {
        // No certificate -> Volunteer path
        toast({
          title: "Welcome!",
          description: "Since no certificate was provided, we'll redirect you to our volunteer opportunities."
        });
        
        // TODO: Set membership status to 'volunteer'
        navigate('/get-involved?from=join');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error processing your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout showContact={false}>
      <SEO
        title="Join Gen AI Global - Member Application"
        description="Join our global AI community as a member. Submit your credentials and become part of our network of AI professionals."
        keywords={["join AI community", "AI membership", "AI professionals", "Gen AI Global"]}
      />
      
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Join as Member</h1>
            <p className="text-muted-foreground text-lg">
              Become a certified member of Gen AI Global. Upload your credentials to get started.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Member Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Certificate Upload */}
                <div className="space-y-2">
                  <Label htmlFor="certificate">AI Certificate (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your AI-related certificate or credential. If you don't have one, you'll be directed to our volunteer opportunities.
                  </p>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <input
                      id="certificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="certificate" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {certificateFile ? certificateFile.name : "Click to upload certificate"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PDF, JPEG, PNG (max 5MB)
                        </span>
                      </div>
                    </Label>
                  </div>
                  {certificateFile && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      Certificate uploaded successfully
                    </div>
                  )}
                </div>

                {/* Consent */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, consent: checked as boolean }))
                    }
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    . I consent to the processing of my personal data for membership purposes.
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    "Processing Application..."
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have a certificate?{' '}
              <button
                onClick={() => navigate('/get-involved')}
                className="text-primary hover:underline font-medium"
              >
                Explore volunteer opportunities instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Join;