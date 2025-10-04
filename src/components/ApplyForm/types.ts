import { z } from 'zod';

// File upload types
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  file: File;
}

// Base form schema (shared fields)
const baseFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  motivation: z.string().min(50, 'Please provide at least 50 characters').max(1000),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

// Member-specific schema
export const memberFormSchema = baseFormSchema.extend({
  course: z.string().min(1, 'Please select a course'),
  experience: z.string().min(20, 'Please provide at least 20 characters').max(500),
});

// Volunteer-specific schema
export const volunteerFormSchema = baseFormSchema.extend({
  department: z.string().min(1, 'Please select a department'),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  availability: z.string().min(1, 'Please select your availability'),
  previousVolunteer: z.string().min(10, 'Please provide some details').max(500).optional().or(z.literal('')),
});

export type MemberFormData = z.infer<typeof memberFormSchema>;
export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;
export type BaseFormData = MemberFormData | VolunteerFormData;
