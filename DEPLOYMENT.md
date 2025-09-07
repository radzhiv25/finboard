# FinBoard Deployment Guide

## Prerequisites

1. **Appwrite Cloud Account**: Sign up at [appwrite.io](https://appwrite.io)
2. **Node.js**: Version 18 or higher
3. **Git**: For version control

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions

# OpenAI Configuration (Optional)
VITE_OPENAI_API_KEY=your-openai-api-key

# App Configuration
VITE_APP_NAME=FinBoard
VITE_APP_VERSION=1.0.0
```

## Appwrite Setup

1. **Create a new project** in Appwrite Console
2. **Set up the database** using the schema from `APPWRITE_CONTENT.md`
3. **Configure authentication** with email/password and OAuth providers
4. **Set up collections** as described in the documentation
5. **Update environment variables** with your project details

## Build and Deploy

### Local Build Test
```bash
npm run build
npm run preview
```

### Deploy to Appwrite

### Option 1: Using Appwrite Console (Recommended)

1. **Build the project**:
   ```bash
   npm run build:appwrite
   ```

2. **Deploy to Appwrite**:
   - Go to your Appwrite project console
   - Navigate to "Functions" → "Create Function"
   - Choose "Blank" template
   - Set runtime to "Node.js 18"
   - Upload the `dist` folder contents as a zip file
   - Set the entry point to `dist/index.html`
   - Configure environment variables in the function settings

### Option 2: Using Appwrite CLI

1. **Install Appwrite CLI**:
   ```bash
   npm install -g appwrite-cli
   ```

2. **Login to Appwrite**:
   ```bash
   appwrite login
   ```

3. **Deploy**:
   ```bash
   npm run build:appwrite
   appwrite functions create --functionId=finboard --name="FinBoard" --runtime=node-18.0
   appwrite functions createDeployment --functionId=finboard --code=dist
   ```

### Option 3: Manual Upload

1. **Build and compress**:
   ```bash
   npm run build:appwrite
   cd dist
   zip -r ../finboard-dist.zip .
   ```

2. **Upload to Appwrite**:
   - Go to your Appwrite project
   - Navigate to "Storage" → "Create Bucket"
   - Upload the `finboard-dist.zip` file
   - Configure as a static website

### Alternative Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
npm run build
# Push dist folder to gh-pages branch
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Appwrite project set up
- [ ] Database collections created
- [ ] Authentication configured
- [ ] Build tested locally
- [ ] Domain configured (if custom)
- [ ] SSL certificate enabled
- [ ] Error monitoring set up

## Troubleshooting

### Common Issues

1. **Build Errors**: Check for TypeScript errors with `npx tsc --noEmit`
2. **Environment Variables**: Ensure all required variables are set
3. **Appwrite Connection**: Verify endpoint and project ID
4. **CORS Issues**: Check Appwrite CORS settings

#### Appwrite Deployment Specific Issues

**ERESOLVE Dependency Conflicts**:
```
npm error ERESOLVE could not resolve
npm error peerOptional zod@"^3.23.8" from openai@5.19.1
```

**Solution**: This is already fixed in the current version. The project now uses:
- Zod v3.23.8 (compatible with OpenAI)
- `.npmrc` with `legacy-peer-deps=true`
- Appwrite-specific build script

**If you still encounter this error**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install --legacy-peer-deps`
3. Use `npm run build:appwrite` for deployment

**Build Archive Not Created**:
- Ensure you're using Node.js 18+
- Check that all dependencies are installed
- Verify the build completes successfully locally first

### Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Enable caching headers

## Security Considerations

- Never commit `.env` files
- Use environment variables for all secrets
- Enable HTTPS in production
- Configure proper CORS settings
- Set up rate limiting
- Monitor for security vulnerabilities

## Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor performance metrics
- Track user analytics
- Set up uptime monitoring
