# Environment Variables Setup Guide

This document describes all environment variables used in Presidential Punch Peru and how to configure them.

## Quick Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`

3. Never commit `.env.local` to version control (it's already in `.gitignore`)

## Environment Variables Reference

### Client-Side Variables (VITE_ prefix)

These variables are embedded in the client-side bundle and are publicly visible.
**Never put secrets in VITE_ variables!**

#### `VITE_POSTHOG_KEY`
- **Type**: String (optional)
- **Purpose**: PostHog analytics and session recording
- **Default**: Disabled if not provided
- **Where to get it**: [PostHog Dashboard](https://posthog.com/) → Project Settings → API Key
- **Development**: Optional (analytics will be disabled)
- **Production**: Recommended for user analytics and debugging

Example:
```bash
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### `VITE_USE_API`
- **Type**: Boolean (optional)
- **Purpose**: Toggle between real API and mock data in development
- **Default**: `true` (uses real API)
- **Development**: Set to `false` to use local mock data
- **Production**: Should always use real API (don't set this variable)

Example:
```bash
VITE_USE_API=false  # Use mock data in development
```

### Server-Side Variables

These variables are only available on the server (API routes) and are never exposed to the client.

#### `BLOB_READ_WRITE_TOKEN`
- **Type**: String (required for API routes)
- **Purpose**: Vercel Blob Storage authentication for vote data
- **Where to get it**: Vercel Dashboard → Storage → Blob → Create Token
- **Development**: Optional (API routes won't work without it)
- **Production**: **Required** for the voting/ranking system to function

Example:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxx
```

#### `NODE_ENV`
- **Type**: String (automatically set)
- **Purpose**: Determines environment (development/production/test)
- **Default**: Automatically set by most platforms
- **Values**: `development`, `production`, `test`
- **Note**: Usually don't need to set this manually

## Setting Up for Different Environments

### Local Development

1. Create `.env.local`:
   ```bash
   # Optional: Enable analytics (or leave empty to disable)
   VITE_POSTHOG_KEY=

   # Optional: Use mock data instead of API
   VITE_USE_API=false

   # Optional: Only needed if testing API routes
   BLOB_READ_WRITE_TOKEN=
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

### Production (Vercel)

Set environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following:
   - `VITE_POSTHOG_KEY`: Your PostHog API key (for production project)
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob token (required)
3. Deploy

### Production (Other Platforms)

If deploying to a platform other than Vercel:

1. Set environment variables in your hosting platform:
   - `VITE_POSTHOG_KEY` (optional)
   - `BLOB_READ_WRITE_TOKEN` (required if using API routes)

2. Note: Vercel Blob Storage is specific to Vercel. For other platforms, you'll need to:
   - Use a different storage solution (e.g., AWS S3, Google Cloud Storage)
   - Update `api/storage.ts` to work with your chosen storage provider

## Security Notes

### ⚠️ Important Security Guidelines

1. **Never commit secrets**: `.env.local` and `.env` are in `.gitignore`
2. **VITE_ variables are public**: They're embedded in the client bundle
3. **Server variables are private**: They're only available in API routes
4. **Use different keys per environment**: Don't reuse production keys in development
5. **Rotate compromised keys immediately**: If a key is exposed, regenerate it

### What's Safe to Expose

✅ **Safe** (can use VITE_ prefix):
- API endpoints (public URLs)
- Feature flags
- Public configuration
- Application version
- PostHog project key (designed to be public)

❌ **Never expose** (never use VITE_ prefix):
- Private API keys
- Database credentials
- Secret tokens
- Encryption keys
- OAuth secrets

## Troubleshooting

### Analytics not working
- Check that `VITE_POSTHOG_KEY` is set correctly
- In development, check browser console for PostHog logs
- Verify PostHog key in dashboard matches your `.env.local`

### API routes failing
- Check that `BLOB_READ_WRITE_TOKEN` is set
- Verify token has read/write permissions in Vercel Blob dashboard
- Check Vercel function logs for specific errors

### Changes not appearing
- After changing `VITE_*` variables, restart the dev server
- Server-side variables require redeployment on Vercel
- Clear browser cache if needed

### "Missing environment variable" errors
- Make sure you copied `.env.example` to `.env.local`
- Verify all required variables are set
- Check for typos in variable names

## Additional Resources

- [Vite Environment Variables Docs](https://vitejs.dev/guide/env-and-mode.html)
- [PostHog Setup Guide](https://posthog.com/docs/getting-started/install)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)

## Questions?

If you have questions about environment setup:
1. Check existing [GitHub Issues](https://github.com/Italosayan/presidential-punch-peru/issues)
2. Review the [README.md](README.md) for general setup
3. Open a new issue if your question isn't answered
