# Deployment Guide

This guide covers deploying Presidential Punch Peru to production.

## Prerequisites

Before deployment, ensure you have:
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Security scan completed

## Deployment Platforms

### Vercel (Recommended)

Presidential Punch Peru is optimized for Vercel deployment.

#### First-Time Setup

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "presidential-punch-peru"

3. **Configure Environment Variables**:
   Go to Project Settings → Environment Variables and add:
   
   **Production:**
   ```
   VITE_POSTHOG_KEY=phc_your_production_key_here
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
   ```
   
   **Preview (optional):**
   ```
   VITE_POSTHOG_KEY=phc_your_preview_key_here
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
   ```

4. **Set Up Blob Storage**:
   - Go to Storage → Blob
   - Create a new Blob store
   - Copy the token
   - Add to environment variables

5. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Node Version: `20.x`

6. **Deploy**:
   ```bash
   vercel --prod
   # Or push to main branch for automatic deployment
   ```

#### Continuous Deployment

Once configured, Vercel automatically:
- Deploys on push to `main` branch (production)
- Creates preview deployments for PRs
- Runs build checks before deployment

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take 24-48 hours)

### Netlify

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20.x`

3. **Environment Variables**:
   Go to Site Settings → Environment Variables:
   ```
   VITE_POSTHOG_KEY=your_posthog_key
   BLOB_READ_WRITE_TOKEN=your_blob_token
   ```

4. **API Routes** (Important!):
   - Netlify requires additional configuration for API routes
   - You may need to use Netlify Functions instead of Vercel Edge Functions
   - See [Netlify Functions docs](https://docs.netlify.com/functions/overview/)

### Other Platforms (AWS, GCP, Azure)

For non-Vercel/Netlify deployments:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Serve the `dist` folder** as a static site

3. **API Routes**:
   - API routes in `/api` are Vercel-specific
   - You'll need to:
     - Port to your platform's serverless functions, OR
     - Set up a separate Node.js backend, OR
     - Disable voting/ranking features

4. **Storage**:
   - Replace Vercel Blob with your storage solution:
     - AWS S3
     - Google Cloud Storage
     - Azure Blob Storage
   - Update `api/storage.ts` accordingly

5. **Environment Variables**:
   Set in your platform's environment configuration

## Environment Variables

### Required for Production

- `BLOB_READ_WRITE_TOKEN`: Storage access token (Vercel Blob)

### Optional but Recommended

- `VITE_POSTHOG_KEY`: Analytics key

### Development Only

- `VITE_USE_API`: Set to `false` to use mock data

See [ENVIRONMENT.md](ENVIRONMENT.md) for detailed information.

## Pre-Deployment Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Lint check passes: `npm run lint`
- [ ] Security scan completed: Review [VULNERABILITIES.md](VULNERABILITIES.md)
- [ ] Environment variables configured in hosting platform
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active (usually automatic)
- [ ] Analytics configured and working
- [ ] API endpoints tested (if using voting/ranking)

## Post-Deployment Verification

After deploying, verify:

1. **Homepage loads**: Visit your URL
2. **Navigation works**: Click through all pages
3. **Candidate data displays**: Check compare and profiles pages
4. **Responsive design**: Test on mobile/tablet
5. **Analytics tracking**: Verify PostHog receives events (if configured)
6. **API endpoints** (if applicable):
   - Test voting functionality
   - Check ranking display
7. **Performance**: Run Lighthouse audit
8. **Console errors**: Check browser console for errors

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Run `npm install` locally first
- Check package.json for missing dependencies
- Verify Node version matches (20.x)

**Error: "prebuild script failed"**
- Check `scripts/validate-data.ts` is working
- Verify data files are valid
- May need to skip prebuild in CI: `npm install --ignore-scripts`

### Environment Variables Not Working

**VITE_ variables not available:**
- Must be set at build time (not runtime)
- Redeploy after changing VITE_ variables
- Check they're set in correct environment (production/preview)

**Server variables not working:**
- Check they're set in hosting platform
- Verify variable names match exactly
- For Vercel: Redeploy to pick up changes

### API Routes Not Working

**404 on /api/* routes:**
- API routes are Vercel-specific
- On other platforms, need different serverless setup
- Check `vercel.json` configuration

**"Missing BLOB_READ_WRITE_TOKEN":**
- Set in hosting environment variables
- Verify token has read/write permissions
- Check Vercel Blob storage is active

### Performance Issues

**Slow load times:**
- Check bundle size: `npm run build -- --mode=analyze`
- Enable gzip/brotli compression
- Use CDN for static assets
- Lazy load routes and components (already implemented)

**High memory usage:**
- Review large data files
- Check for memory leaks in components
- Monitor Vercel/Netlify function logs

## Monitoring

### Analytics (PostHog)

- Dashboard: https://app.posthog.com
- Track: Page views, user interactions, errors
- Set up alerts for critical events

### Error Tracking

- Check Vercel/Netlify deployment logs
- Monitor browser console errors
- Use PostHog session replay for debugging

### Performance Monitoring

- Vercel Analytics: Automatic for Vercel deployments
- Google Lighthouse: Run regularly
- Core Web Vitals: Monitor in Search Console (if indexed)

### Uptime Monitoring

Consider adding:
- [UptimeRobot](https://uptimerobot.com/) - Free uptime monitoring
- [Pingdom](https://www.pingdom.com/) - Advanced monitoring
- [StatusCake](https://www.statuscake.com/) - Free tier available

## Rollback Procedure

### Vercel

1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Netlify

1. Go to Deploys
2. Find last working deploy
3. Click "Publish deploy"

### Git Revert

```bash
# Find the bad commit
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

## Scaling Considerations

### Current Capacity
- Designed for 10,000+ concurrent users
- See [docs/SYSTEM_CAPACITY_ANALYSIS.md](docs/SYSTEM_CAPACITY_ANALYSIS.md)

### If You Need to Scale Further

1. **Enable CDN**: Use Vercel Edge Network (automatic)
2. **Database**: Migrate from Blob to proper database (PostgreSQL, MongoDB)
3. **Caching**: Add Redis for API response caching
4. **Load Balancing**: Use Vercel's automatic load balancing
5. **Monitoring**: Set up detailed performance monitoring

## Security

### Before Public Release

- [ ] Review [SECURITY.md](SECURITY.md)
- [ ] Run security scan: GitHub Security → Code scanning
- [ ] Enable Dependabot alerts
- [ ] Set up security policies
- [ ] Configure branch protection on `main`

### Ongoing Security

- Monitor security advisories weekly
- Update dependencies monthly
- Review access logs for suspicious activity
- Rotate tokens/keys quarterly

## Support

Questions about deployment?
- Check [ENVIRONMENT.md](ENVIRONMENT.md) for configuration help
- Review [troubleshooting section](README.md#🔧-troubleshooting) in README
- Open an [issue](https://github.com/Italosayan/presidential-punch-peru/issues)
- Join [discussions](https://github.com/Italosayan/presidential-punch-peru/discussions)

---

**Ready to deploy?** Double-check the pre-deployment checklist above and go for it! 🚀
