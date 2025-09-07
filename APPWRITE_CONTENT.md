# Appwrite Setup Guide for FinBoard

This guide will help you set up Appwrite authentication for your FinBoard application.

## 1. Create Appwrite Account and Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io/) or set up a self-hosted instance
2. Create a new account or sign in
3. Create a new project:
   - Project Name: `FinBoard`
   - Project ID: `finboard` (or your preferred ID)

## 2. Configure Authentication

### 2.1 Enable Authentication Methods

In your Appwrite console, go to **Authentication** → **Settings**:

1. **Email/Password**: Enable this method
2. **OAuth Providers** (optional):
   - Google: Enable if you want Google sign-in
   - Apple: Enable if you want Apple sign-in
   - GitHub: Enable if you want GitHub sign-in

### 2.2 Configure OAuth Providers (Optional)

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
6. Copy Client ID and Client Secret to Appwrite console

#### Apple OAuth Setup:
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create a new App ID
3. Create a Services ID
4. Configure Sign in with Apple
5. Add redirect URI: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/apple`
6. Copy Team ID, Key ID, and Private Key to Appwrite console

## 3. Environment Variables

Create a `.env.local` file in your project root:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
VITE_APPWRITE_BUCKET_AVATARS=avatars

# OpenAI Configuration (Optional - for AI features)
VITE_OPENAI_API_KEY=your-openai-api-key
```

## 4. Database Setup

### 4.1 Create Database

1. Go to **Databases** in Appwrite console
2. Create a new database:
   - Name: `FinBoard Database`
   - Database ID: `finboard-db`

### 4.2 Create Collections

#### Users Collection (`users`):
```json
{
  "name": "Users",
  "documentId": "users",
  "attributes": [
    {
      "key": "name",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "email",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "avatar",
      "type": "string",
      "size": 500,
      "required": false
    },
    {
      "key": "preferences",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "createdAt",
      "type": "datetime",
      "required": true
    }
  ],
  "indexes": [
    {
      "key": "email",
      "type": "key",
      "attributes": ["email"],
      "orders": ["ASC"]
    }
  ]
}
```

#### Transactions Collection (`transactions`):
```json
{
  "name": "Transactions",
  "documentId": "transactions",
  "attributes": [
    {
      "key": "userId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "title",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": true
    },
    {
      "key": "amount",
      "type": "double",
      "required": true
    },
    {
      "key": "currency",
      "type": "enum",
      "elements": ["USD", "INR"],
      "required": true
    },
    {
      "key": "category",
      "type": "string",
      "size": 100,
      "required": true
    },
    {
      "key": "date",
      "type": "datetime",
      "required": true
    },
    {
      "key": "tags",
      "type": "string",
      "size": 1000,
      "required": false
    },
  ],
  "indexes": [
    {
      "key": "userId",
      "type": "key",
      "attributes": ["userId"],
      "orders": ["ASC"]
    },
    {
      "key": "date",
      "type": "key",
      "attributes": ["date"],
      "orders": ["DESC"]
    }
  ]
}
```


### 4.3 Set Collection Permissions

For each collection, set permissions:
- **Create**: `users` (authenticated users can create their own records)
- **Read**: `users` (users can only read their own records)
- **Update**: `users` (users can only update their own records)
- **Delete**: `users` (users can only delete their own records)

## 5. Storage Setup

### 5.1 Create Storage Bucket

1. Go to **Storage** in Appwrite console
2. Create a new bucket:
   - Name: `Avatars`
   - Bucket ID: `avatars`
   - File size limit: `5MB`
   - Allowed file extensions: `jpg`, `jpeg`, `png`, `gif`, `webp`

### 5.2 Set Bucket Permissions

- **Create**: `users` (authenticated users can upload)
- **Read**: `users` (users can read all files)
- **Update**: `users` (users can update their own files)
- **Delete**: `users` (users can delete their own files)

## 6. Security Rules

### 6.1 User Collection Rules

```javascript
// Users can only access their own documents
function isOwner() {
  return $userId == $resource.userId;
}

// Allow create if user is authenticated
function isAuthenticated() {
  return $userId != null;
}

// Allow read/update/delete if user is owner
function canAccess() {
  return isOwner();
}
```

### 6.2 Transaction Collection Rules

```javascript
// Users can only access their own transactions
function isOwner() {
  return $userId == $resource.userId;
}

// Allow create if user is authenticated
function isAuthenticated() {
  return $userId != null;
}

// Allow read/update/delete if user is owner
function canAccess() {
  return isOwner();
}
```

## 7. Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Try creating a new account
4. Test login functionality
5. Verify that user data is created in the database

## 8. Production Considerations

### 8.1 Environment Variables
- Use different project IDs for development and production
- Set up proper CORS settings in Appwrite console
- Configure custom domains if needed

### 8.2 Security
- Enable rate limiting
- Set up proper validation rules
- Use HTTPS in production
- Regularly rotate API keys

### 8.3 Monitoring
- Set up Appwrite monitoring
- Configure error tracking
- Monitor authentication metrics

## 9. Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is added to Appwrite console settings
2. **Authentication Fails**: Check if email/password auth is enabled
3. **Database Permission Errors**: Verify collection permissions are set correctly
4. **File Upload Issues**: Check storage bucket permissions and file size limits

### Support Resources:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Community](https://appwrite.io/discord)
- [GitHub Issues](https://github.com/appwrite/appwrite/issues)

## 10. Next Steps

After completing this setup:
1. Implement user profile management
2. Add transaction CRUD operations
3. Set up real-time subscriptions
4. Implement file upload for avatars
5. Add data validation and error handling
6. Set up automated backups
