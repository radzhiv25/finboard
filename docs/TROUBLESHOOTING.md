# 🚨 FinBoard Troubleshooting Guide

## Quick Fix Checklist

### 1. Environment Variables ✅
Your environment variables are now properly configured:
- ✅ Endpoint: `https://cloud.appwrite.io/v1`
- ✅ Project ID: `68bd87cf003939f9cf46`
- ✅ Database ID: `68bd886500036748d12d`
- ✅ Collections: users, transactions, goals
- ✅ OpenAI API Key: Set

### 2. Common Issues & Solutions

#### Issue: "Database not found" Error
**Solution**: Your database exists but might not have the correct collections.

**Steps to fix**:
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project (`68bd87cf003939f9cf46`)
3. Go to **Databases** → Your database (`68bd886500036748d12d`)
4. Check if these collections exist:
   - `users`
   - `transactions` 
   - `goals`

#### Issue: "Collection not found" Error
**Solution**: Create the missing collections.

**Steps to fix**:
1. In your Appwrite database, click **Create Collection**
2. For each collection, use these exact names:
   - Collection ID: `users`
   - Collection ID: `transactions`
   - Collection ID: `goals`

#### Issue: Login/Signup Not Working
**Solution**: Check authentication settings.

**Steps to fix**:
1. Go to **Authentication** → **Settings**
2. Enable **Email/Password** authentication
3. Check **CORS** settings - add your domain

#### Issue: Permission Errors
**Solution**: Set correct collection permissions.

**Steps to fix**:
1. Go to each collection → **Settings** → **Permissions**
2. Set permissions to:
   - **Create**: `users` (authenticated users)
   - **Read**: `users` (authenticated users)
   - **Update**: `users` (authenticated users)
   - **Delete**: `users` (authenticated users)

### 3. Debug Tools

#### Debug Panel
The app includes a debug panel in the top-right corner with buttons:
- **Force Refresh**: Reload authentication
- **Debug Appwrite**: Test Appwrite connection
- **Check Environment**: Verify environment variables

#### Console Debugging
Open browser console (F12) and look for:
- Environment variable logs
- Appwrite connection status
- Error messages

### 4. Step-by-Step Setup Verification

#### Step 1: Verify Environment
```bash
npm run dev
```
Check console for environment variable logs.

#### Step 2: Test Appwrite Connection
1. Open browser console (F12)
2. Click "Debug Appwrite" in debug panel
3. Check console for connection status

#### Step 3: Test Authentication
1. Try to sign up with a new account
2. Check console for any errors
3. If signup works, try logging in

#### Step 4: Test Database Access
1. After successful login, check if dashboard loads
2. Try adding a transaction
3. Check console for database errors

### 5. Emergency Reset

If nothing works, reset your Appwrite setup:

#### Option A: Use Existing Database
1. Keep your current database ID: `68bd886500036748d12d`
2. Create the required collections manually
3. Set proper permissions

#### Option B: Create New Database
1. Create a new database in Appwrite Console
2. Name it `finboard-db`
3. Update your `.env` file with the new database ID
4. Follow the setup guide to create collections

### 6. Getting Help

#### Check These First:
1. Browser console for errors (F12)
2. Network tab for failed requests
3. Debug panel output
4. Environment variable logs

#### Common Error Messages:
- `Database not found` → Database doesn't exist or wrong ID
- `Collection not found` → Collection doesn't exist or wrong name
- `Permission denied` → Wrong permissions set
- `CORS error` → Domain not allowed in Appwrite settings
- `Invalid credentials` → Wrong project ID or endpoint

### 7. Quick Commands

```bash
# Start development server
npm run dev

# Check environment setup
npm run setup

# Build for production
npm run build

# Type check
npm run type-check
```

### 8. Still Having Issues?

1. **Check the debug panel** - it shows real-time status
2. **Look at console logs** - they show exactly what's failing
3. **Verify Appwrite setup** - make sure database and collections exist
4. **Test with a fresh account** - sometimes existing accounts have issues

The most common issue is missing collections in the database. Make sure you have `users`, `transactions`, and `goals` collections created in your Appwrite database.



