# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ec1d4f1e-2506-4da5-a91b-34afa90cceb6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ec1d4f1e-2506-4da5-a91b-34afa90cceb6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ec1d4f1e-2506-4da5-a91b-34afa90cceb6) and click on Share -> Publish.

## Deployment & Base Path Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `BASE_URL`: Set to `/` for root deployment or `/subdirectory/` for subdirectory deployment

### Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Hosting Platforms

#### Netlify
- Automatic deployment via `public/_redirects`
- Security headers via `public/_headers`

#### Vercel
- Automatic deployment via `public/vercel.json`
- SPA fallback and security headers included

#### GitHub Pages
- Enable Pages in repository settings
- Use `public/404.html` for SPA routing
- Set `BASE_URL` if deploying to subdirectory

#### Cloudflare Pages
- Automatic SPA fallback detection
- Use `public/_headers` for security

### Base Path Configuration
For subdirectory deployment:
1. Set `BASE_URL=/your-subdirectory/` in environment
2. Update `vite.config.ts` base path
3. Ensure all asset paths are relative

## Troubleshooting

### Common Issues
- **404 on refresh**: Ensure SPA fallback is configured for your hosting platform
- **Assets not loading**: Check base path configuration
- **Layout issues**: Verify CSS custom properties are loaded

### Performance
- Fonts are preloaded for optimal LCP
- Images should use responsive sizing
- Tree-shaking enabled for optimal bundle size

### Security
- CSP headers configured in deployment files
- XSS protection enabled
- Frame options set to DENY

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
