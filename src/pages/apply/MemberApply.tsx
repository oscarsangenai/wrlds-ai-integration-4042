import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { Check, ChevronDown } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploadZone } from '@/components/ApplyForm/FileUploadZone';
import { useUpload } from '@/components/ApplyForm/useUpload';
import { memberFormSchema, MemberFormData } from '@/components/ApplyForm/types';
import { timezones, countries, courseOptions } from '@/data/formOptions';

const MemberApply = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { files, error: uploadError, addFiles, removeFile } = useUpload();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      agreeTerms: false
    }
  });

  const agreeTerms = watch('agreeTerms');
  const course = watch('course');
  const country = watch('country');
  const timezone = watch('timezone');

  const onSubmit = async (data: MemberFormData) => {
    if (files.some(f => f.status === 'uploading')) {
      return; // Wait for uploads to complete
    }

    setIsSubmitting(true);

    try {
      const completedFiles = files
        .filter(f => f.status === 'complete')
        .map(f => ({ id: f.id, name: f.name, url: f.url }));

      await axios.post('/api/apply', {
        type: 'member',
        form: data,
        files: completedFiles
      });

      setShowSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen - wireframe: general application submiited.png
  if (showSuccess) {
    return (
      <>
        <Helmet>
          <title>Application Submitted — Gen AI Global</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
              </div>
            </div>

            <h1 className="text-[28px] font-medium leading-[150%] mb-4 text-foreground">
              Thank you for applying!
            </h1>

            <p className="text-base text-muted-foreground leading-[150%] mb-8">
              We have received your application for General Member,<br />
              We will get back to you after reviewing.
            </p>

            <Button
              onClick={() => navigate('/')}
              className="w-full h-[50px] text-base font-medium"
              size="lg"
            >
              Back to Homepage
            </Button>
          </Card>
        </main>
      </>
    );
  }

  // Main application form - wireframe: general member form - empty.png, general member form - filled.png
  return (
    <>
      <Helmet>
        <title>Apply as General Member — Gen AI Global</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Hero Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Join Our Community
                </h1>
                <p className="text-lg text-muted-foreground">
                  Become a General Member and access exclusive AI courses, resources, and connect with a global community of AI enthusiasts.
                </p>
              </div>

              {/* Carousel dots (static) */}
              <div className="flex gap-2 mt-auto">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-muted" />
                <div className="w-2 h-2 rounded-full bg-muted" />
              </div>
            </Card>

            {/* Right: Form Card */}
            <Card className="p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-[28px] font-medium leading-[150%] text-foreground mb-2">
                  General Member Application
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below to join our community
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      aria-invalid={!!errors.firstName}
                      className="h-11"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      aria-invalid={!!errors.lastName}
                      className="h-11"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                    className="h-11"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Country - wireframe: dropdown styles */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country <span className="text-destructive">*</span></Label>
                  <Select value={country} onValueChange={(value) => setValue('country', value)}>
                    <SelectTrigger id="country" className="h-11" aria-invalid={!!errors.country}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {countries.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country.message}</p>
                  )}
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone <span className="text-destructive">*</span></Label>
                  <Select value={timezone} onValueChange={(value) => setValue('timezone', value)}>
                    <SelectTrigger id="timezone" className="h-11" aria-invalid={!!errors.timezone}>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-[300px]">
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timezone && (
                    <p className="text-sm text-destructive">{errors.timezone.message}</p>
                  )}
                </div>

                {/* Course - wireframe: dropdown-open.png, dropdown- selectED.png */}
                <div className="space-y-2">
                  <Label htmlFor="course">Course of Interest <span className="text-destructive">*</span></Label>
                  <Select value={course} onValueChange={(value) => setValue('course', value)}>
                    <SelectTrigger id="course" className="h-11" aria-invalid={!!errors.course}>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {courseOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && (
                    <p className="text-sm text-destructive">{errors.course.message}</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    {...register('linkedin')}
                    aria-invalid={!!errors.linkedin}
                    className="h-11"
                  />
                  {errors.linkedin && (
                    <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">AI Experience <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="experience"
                    {...register('experience')}
                    placeholder="Tell us about your experience with AI..."
                    aria-invalid={!!errors.experience}
                    className="min-h-[100px] resize-y"
                  />
                  {errors.experience && (
                    <p className="text-sm text-destructive">{errors.experience.message}</p>
                  )}
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to join? <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="motivation"
                    {...register('motivation')}
                    placeholder="Share your motivation..."
                    aria-invalid={!!errors.motivation}
                    className="min-h-[120px] resize-y"
                  />
                  {errors.motivation && (
                    <p className="text-sm text-destructive">{errors.motivation.message}</p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Supporting Documents (Optional)</Label>
                  <FileUploadZone
                    files={files}
                    onFilesAdded={addFiles}
                    onFileRemove={removeFile}
                    error={uploadError}
                  />
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setValue('agreeTerms', checked as boolean)}
                    aria-invalid={!!errors.agreeTerms}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-[150%] cursor-pointer">
                    I agree to the terms and conditions and privacy policy <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-sm text-destructive ml-8">{errors.agreeTerms.message}</p>
                )}

                {/* Submit button - wireframe: style guide button states */}
                <Button
                  type="submit"
                  disabled={isSubmitting || files.some(f => f.status === 'uploading')}
                  className="w-full h-[50px] text-base font-medium"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default MemberApply;
