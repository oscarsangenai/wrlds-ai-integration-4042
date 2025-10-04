import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { Check, X } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileUploadZone } from '@/components/ApplyForm/FileUploadZone';
import { useUpload } from '@/components/ApplyForm/useUpload';
import { volunteerFormSchema, VolunteerFormData } from '@/components/ApplyForm/types';
import { timezones, countries, departmentOptions, skillOptions, availabilityOptions } from '@/data/formOptions';

const VolunteerApply = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { files, error: uploadError, addFiles, removeFile } = useUpload();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      agreeTerms: false,
      skills: []
    }
  });

  const agreeTerms = watch('agreeTerms');
  const department = watch('department');
  const availability = watch('availability');
  const country = watch('country');
  const timezone = watch('timezone');

  const toggleSkill = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(newSkills);
    setValue('skills', newSkills);
  };

  const onSubmit = async (data: VolunteerFormData) => {
    if (files.some(f => f.status === 'uploading')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const completedFiles = files
        .filter(f => f.status === 'complete')
        .map(f => ({ id: f.id, name: f.name, url: f.url }));

      await axios.post('/api/apply', {
        type: 'volunteer',
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

  // Success screen - wireframe: volunteer application submiited.png
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
              We have received your application for Volunteering,<br />
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

  // Main application form - wireframe: volunteer member form - empty.png, volunteer form - filled.png
  return (
    <>
      <Helmet>
        <title>Apply to Volunteer — Gen AI Global</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Hero Card */}
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Volunteer With Us
                </h1>
                <p className="text-lg text-muted-foreground">
                  Join our team of passionate volunteers and help build a responsible AI community. Make an impact with your skills and expertise.
                </p>
              </div>

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
                  Volunteer Application
                </h2>
                <p className="text-sm text-muted-foreground">
                  Help us make a difference in the AI community
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

                {/* Country & Timezone */}
                <div className="grid sm:grid-cols-2 gap-4">
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
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Preferred Department <span className="text-destructive">*</span></Label>
                  <Select value={department} onValueChange={(value) => setValue('department', value)}>
                    <SelectTrigger id="department" className="h-11" aria-invalid={!!errors.department}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {departmentOptions.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-destructive">{errors.department.message}</p>
                  )}
                </div>

                {/* Skills (multi-select with badges) */}
                <div className="space-y-2">
                  <Label>Skills <span className="text-destructive">*</span></Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[80px]">
                    {skillOptions.map(skill => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <Badge
                          key={skill}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                          {isSelected && <X className="ml-1 h-3 w-3" />}
                        </Badge>
                      );
                    })}
                  </div>
                  {errors.skills && (
                    <p className="text-sm text-destructive">{errors.skills.message}</p>
                  )}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability">Weekly Availability <span className="text-destructive">*</span></Label>
                  <Select value={availability} onValueChange={(value) => setValue('availability', value)}>
                    <SelectTrigger id="availability" className="h-11" aria-invalid={!!errors.availability}>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {availabilityOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.availability && (
                    <p className="text-sm text-destructive">{errors.availability.message}</p>
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

                {/* Previous Volunteer Experience */}
                <div className="space-y-2">
                  <Label htmlFor="previousVolunteer">Previous Volunteer Experience (Optional)</Label>
                  <Textarea
                    id="previousVolunteer"
                    {...register('previousVolunteer')}
                    placeholder="Tell us about your volunteer experience..."
                    aria-invalid={!!errors.previousVolunteer}
                    className="min-h-[100px] resize-y"
                  />
                  {errors.previousVolunteer && (
                    <p className="text-sm text-destructive">{errors.previousVolunteer.message}</p>
                  )}
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to volunteer? <span className="text-destructive">*</span></Label>
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

                {/* Submit button */}
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

export default VolunteerApply;
