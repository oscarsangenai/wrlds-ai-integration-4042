# WRLDS AI Integration Platform

A modern React application built with TypeScript, Vite, and Tailwind CSS, featuring AI-powered sensor solutions and member spotlight functionality.

## Quick Start

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

**Required:** Copy `.env.example` to `.env` and configure with your real credentials:

```bash
# Required for Supabase integration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: EmailJS for contact form
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=

# Optional: External services
VITE_GIVEBUTTER_URL=
VITE_DISCORD_URL=
VITE_ENABLE_LINKEDIN=0

# Server-only (Vercel API - not exposed to client)
SCRAPER_BASE_URL=
BRIGHT_DATA_API_KEY=
ALLOWED_ORIGINS=https://genaiglobal.org,http://localhost:8080
```

**Security Note:** 
- The `.env` file contains placeholder values by default for security
- Replace placeholders with your real credentials before running locally
- Never commit real credentials to version control
- The app will fail-fast with descriptive errors if required variables are missing or invalid

## Development

### Host Configuration

The development server uses `host: true` for IPv4/IPv6 compatibility. Override with:

```bash
HOST=0.0.0.0 npm run dev  # IPv4 only
HOST=:: npm run dev       # IPv6 only
```

### Type Checking

```bash
npm run typecheck  # Check TypeScript without compilation
```

### Linting

```bash
npm run lint       # ESLint with zero-warning policy
```

### Dependency Auditing

```bash
npm run audit:unused  # Check for unused runtime dependencies
```

## Architecture

### Module Organization

Large modules have been split for maintainability:
- **UI Components**: `src/components/ui/` (each <300 LOC)
- **Features**: Domain-specific functionality in `src/features/`
- **Data**: Static data split by domain in `src/data/`
- **Pages**: Route components with extracted presentational components

### Performance Features

- **Bundle Optimization**: Manual chunks for React and vendor libs
- **Tree Shaking**: Production builds drop console/debugger statements
- **Image Optimization**: WebP conversion for images >1MB
- **Lazy Loading**: Non-hero images load on demand
- **Timeout Protection**: 10s timeouts on all fetch operations

### Security

- **CSP Headers**: Comprehensive Content Security Policy
- **CORS**: Allowlist-based origin validation
- **Form Protection**: Honeypot and timing-based bot detection
- **No Secrets in Bundle**: All sensitive data server-side only

## API Integration

### LinkedIn Scraper (Optional)

Enable with `VITE_ENABLE_LINKEDIN=1`. Requires server-side configuration:

```bash
SCRAPER_BASE_URL=https://your-scraper-service.com
BRIGHT_DATA_API_KEY=your_api_key
```

### Error Handling

All fetch operations include:
- Timeout protection (10s)
- Proper error typing with status codes
- Retry logic (2 attempts for 5xx, none for 4xx)

## Image Optimization

### Development

Images are automatically optimized during build:
- PNGs >1MB converted to WebP
- Responsive loading with `width`/`height` attributes
- Lazy loading for non-critical images

### CSP Checklist

Current CSP allows:
- ✅ Self-hosted assets
- ✅ Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
- ✅ Google Analytics/Tag Manager
- ✅ Supabase (*.supabase.co)
- ✅ EmailJS (api.emailjs.com)
- ✅ GPT Engineer (cdn.gpteng.co)
- ✅ Silktide cookie consent (silktide.com)

## Built-in Features

- **Dark/Light Mode**: Theme persistence with next-themes
- **Responsive Design**: Mobile-first Tailwind CSS
- **Accessibility**: ARIA labels, focus management, keyboard navigation
- **SEO**: Dynamic meta tags, sitemap, structured data
- **Analytics**: Google Analytics integration
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton screens and spinners

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push

### Netlify

1. Set build command: `npm run build`
2. Set publish directory: `dist`
3. Configure environment variables
4. Deploy

## Built-in Vite Variables

Note: `import.meta.env.DEV` is available by default in Vite for development mode detection.

## License

Private - All rights reserved