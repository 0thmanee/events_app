// 42 OAuth Configuration
export const FORTYTWO_CONFIG = {
  // You need to replace these with your actual 42 OAuth credentials
  // Get them from: https://profile.intra.42.fr/oauth/applications/new
  CLIENT_ID: 'u-s4t2ud-1b93565c91ed0f486bbf394130b11ed7baa786ed663494269c49156ca1e456b4', // Replace with your actual 42 client ID
  CLIENT_SECRET: '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', // Replace with your actual 42 client secret (only for backend)
  REDIRECT_URI: 'https://auth-redirect-beta.vercel.app/', // This matches your app scheme
  SCOPES: ['public'], // 42 OAuth scopes
};

// Backend Configuration
export const BACKEND_CONFIG = {
  // Update this to your actual backend URL
  BASE_URL: 'https://edc0-197-230-30-146.ngrok-free.app', // Updated to match actual backend server URL
  ENDPOINTS: {
    AUTH_42_CALLBACK: '/api/users/auth/42/callback',
    AUTH_42_FRONTEND: '/api/users/auth/42/frontend',
    USER_PROFILE: '/api/users/profile',
    LOGOUT: '/api/users/logout',
  },
};

// App Configuration
export const APP_CONFIG = {
  SCHEME: 'hackathon',
  NAME: 'Hackathon Mobile App',
}; 
