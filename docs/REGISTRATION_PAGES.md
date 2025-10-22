# Registration Pages Documentation

This document describes the hidden registration pages and the **Fillout webhook integration** for the Gen AI Global community.

## Pages Overview

### 1. General Member Application (`/apply/member`)
- Full registration form for general members
- Includes fields for expertise, LinkedIn, MIT course details
- File upload support for certificates
- Success screen with confirmation message

### 2. Volunteer Application (`/apply/volunteer`)
- Extended form for volunteer applicants
- Additional fields for volunteer roles and availability
- CV/Resume upload functionality
- Success screen with next steps

### 3. Form Submissions Dashboard (`/admin/form-submissions`)
- Admin dashboard to view all form submissions
- Real-time statistics and submission list
- Webhook testing and configuration
- Direct link to Supabase database

---

## Fillout Webhook Integration

### Overview
The application includes a complete backend integration for receiving form submissions from Fillout via webhook. All submissions are stored in Supabase with file uploads automatically processed.

### Webhook Endpoint
```
POST https://neqkxwfvxwusrtzexmgk.supabase.co/functions/v1/gen-ai-global-admissions-webhook
```

### Database Schema

**Table:** `gen_ai_global_admissions`

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| submission_id | TEXT | Unique Fillout submission ID |
| full_name | TEXT | Applicant's full name |
| email | TEXT | Email address |
| linkedin_profile_url | TEXT | LinkedIn profile URL |
| primary_field_of_expertise | TEXT | Primary expertise area |
| taken_mit_course | BOOLEAN | Whether took MIT course |
| certificate_url | TEXT | Certificate file URL (Supabase storage) |
| willing_to_volunteer | BOOLEAN | Volunteering willingness |
| motivation | TEXT | Why join Gen AI Global |
| ai_tools_experience | TEXT | AI tools experience level |
| coding_experience | TEXT | Coding experience level |
| interested_in_volunteering | BOOLEAN | Interest in volunteering |
| cv_resume_url | TEXT | CV/Resume file URL (Supabase storage) |
| discord_sharing_consent | BOOLEAN | Discord sharing consent |
| admission_understanding | BOOLEAN | Admission understanding |
| submitted_at | TIMESTAMP | Submission timestamp |
| timezone | TEXT | User's timezone |
| time_to_complete | DECIMAL | Form completion time (seconds) |
| raw_payload | JSONB | Complete raw webhook payload |
| created_at | TIMESTAMP | Record creation time |

### Storage Buckets

1. **form_uploads** - Stores all form file uploads (certificates, CVs)
2. **certificates** - Dedicated storage for MIT course certificates

Both buckets are configured with public read access and proper RLS policies.

### Fillout Form Configuration

**Form ID:** `wHKtxCmdQDus`

#### Field Mapping
The webhook automatically maps Fillout field IDs to database columns:

| Fillout Field | Field ID | Database Column |
|---------------|----------|-----------------|
| Full Name | 3Q4U | full_name |
| Email | 5ZLy | email |
| LinkedIn Profile URL | sxJB | linkedin_profile_url |
| Primary Field / Area of Expertise | 8xUt | primary_field_of_expertise |
| Have you taken an MIT course | 3gMg | taken_mit_course |
| Certificate upload | cRVh | certificate_url |
| Are you willing to volunteer | 6vhu | willing_to_volunteer |
| Why do you want to join | eK9t | motivation |
| AI tools experience | ioT3 | ai_tools_experience |
| Coding experience | jEcc | coding_experience |
| Interested in volunteering | bAiY | interested_in_volunteering |
| CV/Resume upload | sZNa | cv_resume_url |
| Discord consent | vCg5 | discord_sharing_consent |

### File Upload Processing

When files are submitted through Fillout:
1. Webhook receives file URLs from Fillout
2. Files are downloaded from Fillout servers
3. Files are uploaded to Supabase storage buckets
4. Supabase storage URLs are stored in database
5. Original Fillout URLs are not stored

**Supported formats:** PDF, JPG, PNG  
**Max file size:** 15MB per file

### Setting Up the Webhook in Fillout

1. Log in to your Fillout account
2. Open form `wHKtxCmdQDus` (Gen A.I Global-General Admissions Form)
3. Go to Settings → Integrations → Webhooks
4. Add new webhook with URL:
   ```
   https://neqkxwfvxwusrtzexmgk.supabase.co/functions/v1/gen-ai-global-admissions-webhook
   ```
5. Set trigger to "On form submission"
6. Test the webhook using the dashboard test button

### Environment Variables

The following secrets are configured in Supabase:

- `FILLOUT_API_KEY` - Your Fillout API key (for schema fetching)
- `SUPABASE_URL` - Supabase project URL (auto-configured)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (auto-configured)

### Testing the Integration

1. Navigate to `/admin/form-submissions`
2. Click "Test Webhook" button
3. Check that test submission appears in the table
4. Verify in Supabase database that record was created

### Webhook Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Submission received and stored",
  "submissionId": "c6c5158c-9aa0-4bb0-baca-e58d8ddbf21c"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Features

- ✅ Automatic duplicate detection (by submission_id)
- ✅ File upload processing and storage
- ✅ Boolean value conversion ("Yes"/"No" → true/false)
- ✅ Raw payload storage for debugging
- ✅ Comprehensive error logging
- ✅ Admin dashboard with statistics
- ✅ Real-time submission monitoring

### Security

- Webhook endpoint is public (no JWT required) but validates all input
- Row Level Security (RLS) enabled on database table
- Storage buckets have proper access policies
- All file uploads are validated and sanitized
- Raw payloads stored for audit trail

### Monitoring & Logs

View webhook logs in Supabase Dashboard:
1. Go to [Edge Functions](https://supabase.com/dashboard/project/neqkxwfvxwusrtzexmgk/functions/gen-ai-global-admissions-webhook/logs)
2. Monitor real-time webhook calls
3. Debug any failed submissions
4. View detailed error messages

---

## Legacy Registration Forms (Internal Use)

The `/apply/member` and `/apply/volunteer` pages remain available for internal testing and development purposes.

### Features
- Full validation using react-hook-form + Zod schemas
- File upload with progress tracking (max 15MB)
- Multi-file queue with delete/cancel
- Success screens matching brand style
- Accessible form controls (ARIA labels, keyboard navigation)

### API Endpoints (Development Only)

#### POST /api/upload
- Accepts multipart/form-data
- Returns mock file upload response

#### POST /api/apply
- Accepts JSON application data
- Returns mock success response

**Note:** These legacy endpoints are replaced by the Fillout webhook for production use.

## Features

### Form Components
- **Full validation** using react-hook-form + Zod schemas
- **File upload** with progress tracking (max 15MB, PDF/JPG/PNG)
- **Multi-file queue** with individual delete/cancel
- **Real-time validation** with accessible error messages
- **Success screens** matching brand style guide

### Accessibility
- ✅ Keyboard navigation support
- ✅ ARIA labels and invalid states
- ✅ `aria-live` for upload progress announcements
- ✅ Screen reader friendly error messages
- ✅ Focus management

### Security
- Client-side file size validation (15MB limit)
- File type restrictions (PDF, JPG, PNG only)
- Zod schema validation before submission
- CORS-enabled API endpoints with rate limiting ready

## Installation

### Dependencies
Already included in package.json:
```json
{
  "axios": "^latest",
  "@hookform/resolvers": "^4.1.3",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.8"
}
```

### Files Added
```
src/
├── pages/apply/
│   ├── MemberApply.tsx
│   └── VolunteerApply.tsx
├── components/ApplyForm/
│   ├── types.ts
│   ├── useUpload.ts
│   └── FileUploadZone.tsx
└── data/
    └── formOptions.ts

api/
├── upload.ts
└── apply.ts
```

## API Endpoints

### POST /api/upload
**Purpose:** Handle file uploads

**Request:** multipart/form-data
```typescript
FormData {
  file: File
}
```

**Response:**
```typescript
{
  success: true,
  files: [{
    id: string,
    url: string,
    name: string
  }]
}
```

**Current Implementation:** Mock stub for local development

**Production TODO:**
- [ ] Integrate with S3/Azure Blob/GCS
- [ ] Add virus scanning
- [ ] Add authentication
- [ ] Generate signed URLs
- [ ] Add rate limiting

### POST /api/apply
**Purpose:** Process application submissions

**Request:** application/json
```typescript
{
  type: 'member' | 'volunteer',
  form: {
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    timezone: string,
    linkedin?: string,
    motivation: string,
    agreeTerms: boolean,
    // Member-specific fields
    course?: string,
    experience?: string,
    // Volunteer-specific fields
    department?: string,
    skills?: string[],
    availability?: string,
    previousVolunteer?: string
  },
  files: [{
    id: string,
    name: string,
    url?: string
  }]
}
```

**Response:**
```typescript
{
  success: true,
  applicationId: string,
  message: string
}
```

**Current Implementation:** Mock stub for local development

**Production TODO:**
- [ ] Save to database (Supabase/PostgreSQL)
- [ ] Send confirmation email to applicant
- [ ] Send admin notification email
- [ ] Trigger Slack/Discord webhook
- [ ] Add GDPR compliance logging
- [ ] Add spam detection

## Environment Variables

Create `.env` file for production:

```bash
# Development - uses mock responses
NODE_ENV=development

# Production - requires these to be set
UPLOAD_ENDPOINT=https://your-upload-service.com/upload
STORAGE_BUCKET=your-bucket-name
MAX_FILE_SIZE=15728640

APPLY_ENDPOINT=https://your-api.com/apply
DATABASE_URL=postgresql://user:pass@host:5432/db
SENDGRID_API_KEY=your-sendgrid-key
ADMIN_EMAIL=admin@genai.global
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
```

## Form Validation

### Member Application Schema
```typescript
{
  firstName: string (1-50 chars, required)
  lastName: string (1-50 chars, required)
  email: string (valid email, required)
  country: string (required)
  timezone: string (required)
  linkedin: string (valid URL, optional)
  course: string (required)
  experience: string (20-500 chars, required)
  motivation: string (50-1000 chars, required)
  agreeTerms: boolean (must be true)
}
```

### Volunteer Application Schema
```typescript
{
  firstName: string (1-50 chars, required)
  lastName: string (1-50 chars, required)
  email: string (valid email, required)
  country: string (required)
  timezone: string (required)
  linkedin: string (valid URL, optional)
  department: string (required)
  skills: string[] (min 1, required)
  availability: string (required)
  previousVolunteer: string (10-500 chars, optional)
  motivation: string (50-1000 chars, required)
  agreeTerms: boolean (must be true)
}
```

## Testing

### Manual Test Checklist

1. **Route Accessibility**
   - [ ] Visit http://localhost:5173/apply/member
   - [ ] Visit http://localhost:5173/apply/volunteer
   - [ ] Both pages load without errors

2. **Hidden from Navigation**
   - [ ] Check main navigation menu
   - [ ] Check footer links
   - [ ] Verify no links to `/apply/*` routes exist

3. **Form Validation**
   - [ ] Submit empty form → all required fields show errors
   - [ ] Enter invalid email → email error appears
   - [ ] Uncheck terms → checkbox error appears
   - [ ] All errors have `aria-invalid="true"`

4. **File Upload Flow**
   - [ ] Upload single 200KB PDF → shows progress → completes
   - [ ] Upload multiple files → both progress independently
   - [ ] Click delete on file → removes from queue
   - [ ] Try uploading 20MB file → shows size error
   - [ ] Try uploading .txt file → shows type error

5. **Dropdown Behavior**
   - [ ] Open any dropdown → matches style guide
   - [ ] Select option → displays selected value
   - [ ] Dropdown has proper z-index (appears above other elements)

6. **Submit Flow**
   - [ ] Fill valid form + upload file → submit succeeds
   - [ ] Success screen appears
   - [ ] "Back to Homepage" button works
   - [ ] Console shows application data logged

7. **Accessibility**
   - [ ] Tab through entire form with keyboard
   - [ ] All inputs are reachable
   - [ ] Labels are properly associated
   - [ ] Upload progress announces to screen reader
   - [ ] Error messages are announced

8. **No Regressions**
   - [ ] Run `npm run build` → no errors
   - [ ] Navigate to homepage → works normally
   - [ ] Other pages still function correctly

### Automated Testing
```bash
# Type checking
npm run tsc --noEmit

# Build verification
npm run build

# Unit tests (if configured)
npm run test
```

## Wireframe Reference

All UI elements match these wireframe files:
- `general member form - empty.png` - Empty member form state
- `general member form - filled.png` - Filled member form state
- `volunteer member form - empty.png` - Empty volunteer form state
- `volunteer form - filled.png` - Filled volunteer form state
- `dropdown-open.png` - Dropdown expanded state
- `dropdown- selectED.png` - Dropdown selected state
- `uploading.png` - File uploading with progress
- `uploaded.png` - Single file uploaded
- `multiple uploaded.png` - Multiple files uploaded
- `general application submiited.png` - Member success screen
- `volunteer application submiited.png` - Volunteer success screen
- `style guide.png` - Typography, colors, button states

## Style Guide Compliance

### Typography (Inter Font)
- Title: 28px, Medium (500), 150% line height
- Body: 16px, Regular (400), 150% line height
- Labels: 16px, Regular (400), 150% line height
- CTA Buttons: 16px, Medium (500), 150% line height

### Colors (HSL)
- Foreground: `hsl(0 0% 7%)` (#121212)
- Muted Foreground: `hsl(223 10% 53%)` (#7D8398)
- Primary (Purple): `hsl(270 100% 60%)`
- Background: `hsl(0 0% 100%)` (#FFFFFF)

### Button States
- Default: Primary purple, 50px height
- Hover: Enhanced with transitions
- Disabled: 50% opacity, no pointer events

## Troubleshooting

### "Module not found: axios"
```bash
npm install axios
```

### Files not uploading
- Check browser console for CORS errors
- Verify `/api/upload` endpoint is running
- Check file size (<15MB) and type (PDF/JPG/PNG)

### Form submission fails
- Check browser console for errors
- Verify all required fields are filled
- Ensure `/api/apply` endpoint is accessible

### Dropdowns appear transparent
- Check `SelectContent` has `className="bg-background z-50"`
- Verify no conflicting z-index in parent elements

## Production Deployment

### Pre-deployment Checklist
- [ ] Set all required environment variables
- [ ] Implement real file upload to cloud storage
- [ ] Implement database integration for applications
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Configure webhook notifications
- [ ] Add rate limiting middleware
- [ ] Add spam detection
- [ ] Test end-to-end flow in staging
- [ ] Add monitoring/logging
- [ ] Document admin process for reviewing applications

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add UPLOAD_ENDPOINT
vercel env add DATABASE_URL
vercel env add SENDGRID_API_KEY
# ... etc
```

## Support

For issues or questions:
1. Check this documentation first
2. Review console errors in browser DevTools
3. Check Network tab for API failures
4. Verify environment variables are set correctly
5. Contact development team with error details
