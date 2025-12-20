# SiteForgeAI Frontend - Vercel Deployment

This is the frontend application for SiteForgeAI, an AI-powered website creation platform.

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Push this folder to a GitHub repository
2. Import the repository in Vercel dashboard
3. Vercel will automatically detect Vite and configure the build

### Environment Variables
Set these in Vercel dashboard under Project Settings > Environment Variables:

- `VITE_API_URL` - Your Render backend URL (e.g., `https://siteforgeai-api.onrender.com`)

### Build Settings (Auto-detected)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your backend URL
# VITE_API_URL=http://localhost:10000

# Start development server
npm run dev
```

## Features

### Public Pages
- Landing page with AI-powered messaging
- Features showcase
- Pricing plans
- Login and signup

### Client Dashboard
- Project management
- Template library
- Media manager
- Profile settings

### Admin Dashboard (ADMIN role only)
- User management
- Platform analytics
- Role assignment

## Tech Stack
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + Shadcn/ui
- TanStack React Query
- Wouter for routing
