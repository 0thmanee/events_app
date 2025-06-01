# 42 OAuth Authentication Setup Guide

This guide will help you set up 42 OAuth authentication for your React Native app.

## Prerequisites

1. You must be a 42 student with access to the 42 intranet
2. Your backend should already be configured (which it appears to be)
3. React Native development environment with Expo

## Step 1: Create a 42 OAuth Application

1. Go to [42 OAuth Applications](https://profile.intra.42.fr/oauth/applications/new)
2. Fill in the application details:
   - **Name**: Your app name (e.g., "Hackathon Mobile App")
   - **Description**: Brief description of your app
   - **Website**: Your app's website (can be a placeholder)
   - **Redirect URI**: 
     - For development: `hackathon://auth`
     - For production: `your-app-scheme://auth`
   - **Scopes**: `public` (minimum required)

3. Click "Create Application"
4. Note down your **Client ID** and **Client Secret**

## Step 2: Configure Frontend

1. Open `front_end/constants/config.js`
2. Replace the placeholder values:

```javascript
export const FORTYTWO_CONFIG = {
  CLIENT_ID: 'your_actual_42_client_id_here', // Replace this
  CLIENT_SECRET: 'your_actual_42_client_secret_here', // Only needed for backend
  REDIRECT_URI: 'hackathon://auth',
  SCOPES: ['public'],
};
```

3. Update the backend URL if different:

```javascript
export const BACKEND_CONFIG = {
  BASE_URL: 'http://your-backend-url:3000', // Update this
  // ... rest of config
};
```

## Step 3: Configure Backend Environment Variables

Your backend already has the 42 OAuth implementation. Just make sure these environment variables are set:

```bash
# In your backend .env file
FORTYTWO_CLIENT_ID=your_actual_42_client_id
FORTYTWO_CLIENT_SECRET=your_actual_42_client_secret
REDIRECT_URI=http://your-backend-url:3000/api/users/auth/42/callback
JWT_SECRET=your_jwt_secret
```

## Step 4: Fix Redirect URI Issues

### IMPORTANT: "Invalid Redirect URI" Error Fix

If you're getting "redirect url included is not valid" error, follow these steps:

1. **Test the app first to see the exact redirect URI**:
   - Run your app: `npx expo start`
   - Click "Authenticate with 42"
   - You'll see a debug alert showing the exact redirect URI being used
   - Note this URI down exactly as shown

2. **Update your 42 OAuth Application**:
   - Go to [42 OAuth Applications](https://profile.intra.42.fr/oauth/applications)
   - Click on your application
   - Click "Edit"
   - In the **Redirect URI** field, enter the EXACT URI from step 1
   - Common formats you might see:
     - `hackathon://` (most common)
     - `hackathon://auth`
     - `exp://127.0.0.1:8081` (Expo development)
     - `exp://localhost:8081` (Expo development)

3. **Save the changes** in your 42 OAuth app

4. **Test again** - the authentication should now work

### Alternative Redirect URI Configurations

If the auto-generated redirect URI doesn't work, try these alternatives in your Auth42Button:

**Option 1: Simple scheme**
```javascript
const redirectUri = makeRedirectUri({
  scheme: 'hackathon',
  path: undefined
});
```

**Option 2: Explicit URI**
```javascript
const redirectUri = 'hackathon://';
```

**Option 3: With path**
```javascript
const redirectUri = makeRedirectUri({
  scheme: 'hackathon',
  path: 'auth'
});
```

## Step 5: Test the Authentication Flow

1. Start your backend server:
```bash
cd back_end_app
npm run dev
```

2. Start your Expo development server:
```bash
cd front_end
npx expo start
```

3. Test the authentication:
   - Open your app
   - Click "Authenticate with 42"
   - Note the redirect URI shown in the debug alert
   - Click "Continue" to proceed
   - You should be redirected to 42's OAuth page
   - Login with your 42 credentials
   - You should be redirected back to your app
   - Select your role (student/staff)
   - You should be logged in successfully

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" / "redirect url included is not valid"**
   - **Solution**: Follow Step 4 above exactly
   - Make sure the redirect URI in your 42 OAuth app matches the one shown in the debug alert
   - Remove any trailing slashes or extra characters
   - URI matching is case-sensitive and must be exact

2. **"Configuration Required" error**
   - Make sure you've updated the CLIENT_ID in `constants/config.js`

3. **"Network request failed"**
   - Check that your backend is running
   - Verify the BACKEND_URL in config.js
   - Ensure your device/emulator can reach the backend

4. **OAuth popup doesn't close**
   - This is usually handled automatically by `WebBrowser.maybeCompleteAuthSession()`
   - Make sure this is called at the top level of your component

5. **"Failed to exchange code for token"**
   - Check backend logs for detailed error messages
   - Verify backend environment variables are set correctly
   - Make sure backend redirect URI matches 42 OAuth app settings

### Development vs Production

- **Development**: Use Expo Go or development build
  - Common redirect URIs: `hackathon://`, `exp://localhost:8081`
- **Production**: Use your custom app scheme
  - Update redirect URI accordingly in 42 OAuth app

### Backend API Endpoints

Your backend should handle these endpoints (which it already does):

- `GET /api/users/auth/42` - Initiates OAuth flow
- `GET /api/users/auth/42/callback?code=...` - Handles OAuth callback
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

## Security Notes

1. **Never expose Client Secret in frontend code**
   - Client Secret should only be in backend environment variables
   - Frontend only needs Client ID

2. **Use HTTPS in production**
   - Update redirect URIs to use HTTPS
   - Ensure backend uses HTTPS

3. **Validate tokens**
   - Backend should validate JWT tokens on protected routes
   - Frontend should handle token refresh

## Testing

To test the complete flow:

1. Clear AsyncStorage: `AsyncStorage.clear()`
2. Restart the app
3. Go through the authentication flow
4. Check that user data is stored properly
5. Verify navigation to appropriate screens based on role

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all configuration values
3. Ensure 42 OAuth app settings are correct
4. Test with a different 42 account if available

## Quick Debug Checklist

When getting redirect URI errors:

- [ ] Run the app and note the exact redirect URI from the debug alert
- [ ] Go to your 42 OAuth app settings
- [ ] Ensure the redirect URI matches exactly (case-sensitive)
- [ ] Save changes in 42 OAuth app
- [ ] Test again
- [ ] If still failing, try alternative redirect URI formats above 