# Environment Variables Setup Guide

This guide explains how to properly set up environment variables for both development and production deployment.

## Development Setup

### 1. Create Environment File

```bash
cp env.example .env
```

### 2. Fill in Your Values

Edit `.env` with your actual values:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-actual-project-id
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
VITE_APPWRITE_COLLECTION_GOALS=goals
VITE_APPWRITE_BUCKET_AVATARS=avatars

# OpenAI Configuration (Optional)
VITE_OPENAI_API_KEY=your-openai-api-key
```

### 3. Verify Setup

Run the development server and check the console:

```bash
npm run dev
```

You should see environment variable logs in the console.

## Production Deployment

### Appwrite Deployment

1. **Set Environment Variables in Appwrite Console**:
   - Go to your Appwrite project settings
   - Navigate to "Environment Variables"
   - Add each variable with the `VITE_` prefix

2. **Required Variables**:
   ```
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_APPWRITE_DATABASE_ID=finboard-db
   VITE_APPWRITE_COLLECTION_USERS=users
   VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
   VITE_APPWRITE_COLLECTION_GOALS=goals
   VITE_APPWRITE_BUCKET_AVATARS=avatars
   VITE_OPENAI_API_KEY=your-openai-key (optional)
   ```

3. **Deploy**:
   ```bash
   npm run build
   # Deploy the dist folder
   ```

### Other Deployment Platforms

#### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with the `VITE_` prefix
4. Redeploy

#### Netlify
1. Go to Site settings
2. Navigate to "Environment variables"
3. Add each variable with the `VITE_` prefix
4. Redeploy

#### Railway
1. Go to your project settings
2. Navigate to "Variables"
3. Add each variable with the `VITE_` prefix
4. Redeploy

## Troubleshooting

### Environment Variables Not Loading

1. **Check Console Logs**:
   - Look for "Environment Variables" section in console
   - Verify all variables are showing as "SET" not "NOT SET"

2. **Verify Variable Names**:
   - All variables must start with `VITE_`
   - Names must match exactly (case-sensitive)

3. **Check Deployment Platform**:
   - Ensure variables are set in deployment platform
   - Some platforms require redeployment after adding variables

4. **Build Process**:
   - Environment variables are embedded at build time
   - Changes require rebuilding and redeploying

### Common Issues

#### "Database not found" Error
- Check `VITE_APPWRITE_PROJECT_ID` is correct
- Verify `VITE_APPWRITE_DATABASE_ID` matches your database ID
- Ensure database exists in Appwrite console

#### "User not authenticated" Error
- Check `VITE_APPWRITE_ENDPOINT` is correct
- Verify `VITE_APPWRITE_PROJECT_ID` is correct
- Check CORS settings in Appwrite console

#### AI Features Not Working
- Check `VITE_OPENAI_API_KEY` is set
- Verify API key is valid and has credits
- Check console for OpenAI errors

## Security Notes

- Never commit `.env` files to version control
- Use different API keys for development and production
- Regularly rotate API keys
- Monitor API usage and costs

## Testing Environment Variables

The app includes built-in environment variable validation:

1. **Development**: Check browser console for environment logs
2. **Production**: Check browser console for environment logs
3. **Validation**: App will show warnings for missing required variables

## Support

If you're still having issues:

1. Check the console logs for environment variable status
2. Verify all variables are set correctly
3. Ensure your deployment platform supports environment variables
4. Check the [APPWRITE_SETUP_GUIDE.md](./APPWRITE_SETUP_GUIDE.md) for Appwrite-specific setup
