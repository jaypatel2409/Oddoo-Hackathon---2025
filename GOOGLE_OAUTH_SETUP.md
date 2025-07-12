# Google OAuth Setup Guide for SkillSwap

This guide will help you set up Google OAuth authentication for the SkillSwap platform.

## Prerequisites

- Google Cloud Console account
- Node.js and npm installed
- MongoDB Atlas account (already configured)

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it "SkillSwap" and click "Create"

### 1.2 Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Google+ API**
   - **Google Identity** API
   - **Google OAuth2 API**

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Fill in the details:
   - **Name**: SkillSwap Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173/auth
     http://localhost:3000/auth
     ```
5. Click "Create"
6. **Copy the Client ID** - you'll need this for the frontend

### 1.4 Get Client Secret (Optional for Frontend)
1. In the same credentials page, click on your OAuth 2.0 client
2. Copy the **Client Secret** - you'll need this for the backend

## Step 2: Environment Configuration

### 2.1 Frontend Environment (.env file)
Create a `.env` file in the `Frontend` directory:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2.2 Backend Environment (.env file)
Create a `.env` file in the `Backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://skillswap-user:mlLWxZQxZnQ7EKYm@skillswapcluster.qkl24oo.mongodb.net/skill_swap_db?retryWrites=true&w=majority&appName=SkillSwapCluster

# JWT Configuration
JWT_SECRET=skillswap_jwt_secret_key_2025_make_it_long_and_random_for_security
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary Configuration (for profile photos)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Step 3: Install Dependencies

### 3.1 Frontend Dependencies
```bash
cd Frontend
npm install @react-oauth/google
```

### 3.2 Backend Dependencies
```bash
cd Backend
npm install
```

## Step 4: Start the Application

### 4.1 Start Backend Server
```bash
cd Backend
npm run dev
```

The backend will start on `http://localhost:5000`

### 4.2 Start Frontend Development Server
```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 5: Test Google OAuth

1. Open your browser and go to `http://localhost:5173`
2. Click "Get Started" or navigate to `/auth`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to the app

## How It Works

### Frontend Flow
1. User clicks "Continue with Google"
2. `useGoogleLogin` hook triggers Google OAuth flow
3. Google returns an access token
4. Frontend sends token to backend `/api/users/google`
5. Backend verifies token and creates/updates user
6. User is logged in and redirected to profile

### Backend Flow
1. Receives Google access token from frontend
2. Verifies token using Google Auth Library
3. Extracts user information (email, name, picture)
4. Checks if user exists by Google ID or email
5. Creates new user or links existing account
6. Returns JWT token for frontend authentication

## Troubleshooting

### Common Issues

1. **"Invalid Google token" error**
   - Check that your Google Client ID is correct
   - Ensure the domain is authorized in Google Console
   - Verify the OAuth consent screen is configured

2. **CORS errors**
   - Check that `http://localhost:5173` is in authorized origins
   - Verify backend CORS configuration

3. **"Google login failed" error**
   - Check browser console for detailed error messages
   - Verify Google APIs are enabled
   - Check network tab for API request failures

### Debug Steps

1. **Check Google Console**
   - Verify OAuth 2.0 credentials are correct
   - Check that APIs are enabled
   - Review OAuth consent screen settings

2. **Check Environment Variables**
   - Ensure all environment variables are set correctly
   - Verify no typos in client IDs

3. **Check Network Requests**
   - Open browser developer tools
   - Check Network tab for failed requests
   - Look for CORS or authentication errors

## Security Considerations

1. **Never expose Client Secret in frontend**
   - Only use Client ID in frontend
   - Keep Client Secret secure in backend

2. **Use HTTPS in production**
   - Update authorized origins to use HTTPS
   - Update redirect URIs accordingly

3. **Validate tokens server-side**
   - Always verify Google tokens on backend
   - Don't trust client-side token validation

## Production Deployment

When deploying to production:

1. **Update Google Console**
   - Add your production domain to authorized origins
   - Add production redirect URIs
   - Configure OAuth consent screen for production

2. **Update Environment Variables**
   - Use production Google Client ID
   - Set production API URLs
   - Configure production database

3. **Security Headers**
   - Ensure HTTPS is enabled
   - Configure proper CORS for production domain
   - Set secure cookie options

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set
4. Ensure Google Console configuration is correct

The Google OAuth integration is now complete and ready to use! 