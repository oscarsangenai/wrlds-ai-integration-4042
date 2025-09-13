# Deployment Guide

## Overview
This project uses the Vercel API backend for LinkedIn scraping functionality and is configured for deployment on both Vercel and Netlify.

## Required Environment Variables

### Client-side (Optional)
```bash
# EmailJS Integration (for contact form)
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id  
VITE_EMAILJS_TEMPLATE_ID=your_template_id

# Feature Flags
VITE_ENABLE_LINKEDIN=0  # Set to 1 to enable LinkedIn scraper
```

### Server-side (Vercel API only)
```bash
# LinkedIn Scraper Backend
SCRAPER_BASE_URL=https://your-scraper-service.com
BRIGHT_DATA_API_KEY=your_api_key
ALLOWED_ORIGINS=https://genaiglobal.org,http://localhost:3000
```

## Deployment Steps

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Netlify  
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard
5. Deploy

## Backend Architecture

### Chosen Backend: Vercel API
- File: `api/scrape-linkedin.ts`
- Endpoint: `/api/scrape-linkedin`
- Method: POST
- Feature flag: `VITE_ENABLE_LINKEDIN=1`

### Security
- CORS allowlist enforced via `ALLOWED_ORIGINS`
- CSP headers configured for both Vercel and Netlify
- No secrets exposed to client bundle

### Data Flow
1. Client checks `VITE_ENABLE_LINKEDIN` flag
2. If enabled, posts to `/api/scrape-linkedin` 
3. API forwards request to `SCRAPER_BASE_URL` with `BRIGHT_DATA_API_KEY`
4. Response returned to client with typed interface