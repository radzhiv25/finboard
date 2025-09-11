# 🚀 Appwrite Database Setup Guide

## Current Issue
Your app is showing "Database not found" because the Appwrite database and collections haven't been created yet.

## Step-by-Step Setup

### 1. Access Appwrite Console
1. Go to https://cloud.appwrite.io
2. Sign in to your account
3. Select your project (the one with your Project ID)

### 2. Create Database
1. Go to **Databases** in the left sidebar
2. Click **Create Database**
3. **Database Name**: `finboard-db`
4. **Database ID**: `finboard-db` (should auto-generate)
5. Click **Create**

### 3. Create Collections

#### Collection 1: Users
1. In your `finboard-db` database, click **Create Collection**
2. **Collection Name**: `users`
3. **Collection ID**: `users`
4. Click **Create Collection**
5. **Add Attributes**:
   - `name` (String, 255 chars, required)
   - `preferences` (String, 1000 chars, optional)
   - `createdAt` (DateTime, required)
   - `updatedAt` (DateTime, required)

#### Collection 2: Transactions
1. Click **Create Collection** again
2. **Collection Name**: `transactions`
3. **Collection ID**: `transactions`
4. Click **Create Collection**
5. **Add Attributes**:
   - `userId` (String, 255 chars, required)
   - `title` (String, 255 chars, required)
   - `description` (String, 1000 chars, optional)
   - `amount` (Double, required)
   - `currency` (String, 10 chars, required)
   - `category` (String, 100 chars, required)
   - `date` (DateTime, required)
   - `createdAt` (DateTime, required)
   - `updatedAt` (DateTime, required)

### 4. Set Collection Permissions

#### For Users Collection:
1. Go to **Settings** → **Permissions**
2. **Create**: `users` (authenticated users can create their own profile)
3. **Read**: `users` (users can read their own profile)
4. **Update**: `users` (users can update their own profile)
5. **Delete**: `users` (users can delete their own profile)

#### For Transactions Collection:
1. Go to **Settings** → **Permissions**
2. **Create**: `users` (authenticated users can create transactions)
3. **Read**: `users` (users can read their own transactions)
4. **Update**: `users` (users can update their own transactions)
5. **Delete**: `users` (users can delete their own transactions)

### 5. Update Environment Variables
Make sure your `.env` file has the correct IDs:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-actual-project-id
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
VITE_OPENAI_API_KEY=your-openai-key-optional
```

### 6. Verify Setup
1. Check that all collections exist in your database
2. Verify the attribute names match exactly
3. Ensure permissions are set correctly
4. Test the app again

## Troubleshooting

### If you still get "Database not found":
1. Double-check the Database ID in your environment variables
2. Make sure the database name is exactly `finboard-db`
3. Verify you're using the correct Project ID

### If you get "Collection not found":
1. Check the Collection IDs in your environment variables
2. Make sure collection names are exactly `users` and `transactions`
3. Verify the collections are created in the correct database

### If you get permission errors:
1. Check that collection permissions are set to allow `users` role
2. Make sure users are authenticated before accessing collections
3. Verify the user is logged in before making requests

## Quick Test
After setup, your app should:
1. Load the landing page without errors
2. Allow user registration/login
3. Show the dashboard after authentication
4. Allow creating transactions

Let me know if you need help with any of these steps!
