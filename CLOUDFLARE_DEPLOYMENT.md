# Cloudflare Pages Deployment Guide

## ✅ Configuration Complete

Your InterviewAI app is now configured for Cloudflare Pages deployment with static export.

## 📋 Files Configured

### 1. `next.config.ts`
```typescript
{
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```
- **output: 'export'**: Generates static HTML/CSS/JS files
- **images.unoptimized**: Required for static export (no Next.js Image Optimization API)

### 2. `wrangler.jsonc`
```json
{
  "name": "interviewai-qa-app",
  "compatibility_date": "2026-02-23",
  "pages_build_output_dir": "out"
}
```
- **name**: Your Cloudflare Pages project name
- **pages_build_output_dir**: Points to Next.js static export output directory

## 🚀 Deployment Steps

### Option 1: Cloudflare Dashboard (Recommended)

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Configure for Cloudflare Pages deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com/
   - Navigate to **Workers & Pages** → **Create application** → **Pages**
   - Connect your Git repository (GitHub/GitLab)
   - Select your repository

3. **Configure Build Settings**
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or leave empty)
   - **Environment variables**: None required for basic deployment

4. **Deploy**
   - Click **Save and Deploy**
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://interviewai-qa-app.pages.dev`

### Option 2: Wrangler CLI

1. **Install Wrangler** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Build the App**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   npx wrangler pages deploy out --project-name=interviewai-qa-app
   ```

## 🔧 Build Process

When you run `npm run build`, Next.js will:
1. Compile TypeScript and React components
2. Generate static HTML for all pages
3. Optimize CSS and JavaScript
4. Output everything to the `out/` directory

The `out/` directory contains:
- `index.html` - Dashboard page
- `interview.html` - Interview page
- `resources.html` - Resources library
- `report.html` - Report page
- `progress.html` - Progress page
- `topics.html` - Topics page
- `settings.html` - Settings page
- `_next/` - Optimized JS/CSS assets
- All static assets

## ✅ Verification

After deployment, verify these features work:
- ✅ Dashboard loads correctly
- ✅ Interview flow works (questions, answers, feedback)
- ✅ Ideal answers display in live feedback
- ✅ Reports generate from session data
- ✅ Resources library loads with all content
- ✅ Navigation between pages works
- ✅ LocalStorage persists interview sessions

## 🌐 Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `interview.yourdomain.com`)
5. Follow DNS configuration instructions
6. SSL certificate is automatically provisioned

## 📊 Performance

Static export provides excellent performance:
- **Fast Load Times**: Pre-rendered HTML
- **Global CDN**: Cloudflare's edge network
- **No Server**: No cold starts or server costs
- **Automatic HTTPS**: Free SSL certificates
- **DDoS Protection**: Built-in security

## ⚠️ Limitations of Static Export

Since this is a static export, the following Next.js features are **not available**:
- ❌ API Routes (use client-side APIs instead)
- ❌ Server-Side Rendering (SSR)
- ❌ Incremental Static Regeneration (ISR)
- ❌ Image Optimization API (images are unoptimized)
- ❌ Middleware
- ❌ Internationalized Routing

**Good news**: Your app doesn't use any of these features! Everything works with:
- ✅ Client-side React components
- ✅ LocalStorage for data persistence
- ✅ Static pages
- ✅ Client-side routing

## 🔄 Redeployment

To redeploy after making changes:

1. **Make your changes**
2. **Test locally**
   ```bash
   npm run dev
   ```
3. **Build**
   ```bash
   npm run build
   ```
4. **Commit and push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
5. **Cloudflare auto-deploys** from Git (if connected)
   - Or manually deploy: `npx wrangler pages deploy out`

## 🐛 Troubleshooting

### Build Fails
- Check `npm run build` works locally first
- Verify Node.js version (should be 18+)
- Clear `.next` and `out` directories and rebuild

### Pages Don't Load
- Verify `out/` directory contains HTML files
- Check browser console for errors
- Ensure `pages_build_output_dir` is set to `out` in `wrangler.jsonc`

### LocalStorage Not Working
- LocalStorage works in static sites
- Check browser privacy settings
- Verify you're not in incognito/private mode

### Resources Not Loading
- All resources are embedded or use external URLs
- Videos use YouTube embeds (require internet)
- Audio content is text-based (no actual audio files)

## 📈 Monitoring

Cloudflare Pages provides:
- **Analytics**: Page views, unique visitors
- **Build History**: View past deployments
- **Logs**: Build and deployment logs
- **Preview Deployments**: Test branches before merging

## 🎯 Next Steps

1. ✅ Configuration complete
2. ✅ Build tested locally
3. 🔄 Push to Git repository
4. 🔄 Deploy to Cloudflare Pages
5. ✅ Verify deployment
6. 🎉 Share your app!

## 📞 Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

**Your app is ready for deployment! 🚀**
