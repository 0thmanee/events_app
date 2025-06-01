import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FORTYTWO_CONFIG, BACKEND_CONFIG } from '../constants/config';

// Complete auth session when returning to app
WebBrowser.maybeCompleteAuthSession();

class AuthService {
  constructor() {
    this.authInProgress = false;
  }

  async login() {
    try {
      console.log('🚀 Starting 42 OAuth login...');
      
      // Check if client ID is properly configured
      if (FORTYTWO_CONFIG.CLIENT_ID === 'YOUR_42_CLIENT_ID_HERE') {
        throw new Error('Please configure your 42 OAuth credentials in constants/config.js');
      }

      if (this.authInProgress) {
        throw new Error('Authentication already in progress');
      }

      this.authInProgress = true;

      // Manual OAuth URL construction
      const redirectUri = 'hackathon://oauth/callback';
      const state = Math.random().toString(36).substring(7);
      const scope = FORTYTWO_CONFIG.SCOPES.join(' ');

      // Build OAuth URL manually (bypassing expo-auth-session)
      const authUrl = 'https://api.intra.42.fr/oauth/authorize?' + 
        `client_id=${encodeURIComponent(FORTYTWO_CONFIG.CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}`;

      console.log('🔗 Redirect URI:', redirectUri);
      console.log('🎯 Client ID:', FORTYTWO_CONFIG.CLIENT_ID);
      console.log('🔍 Scopes:', FORTYTWO_CONFIG.SCOPES);
      console.log('🌐 Manual Auth URL:', authUrl);

      // Store state for verification
      await AsyncStorage.setItem('oauth_state', state);

      // Open browser with OAuth URL
      const result = await WebBrowser.openBrowserAsync(authUrl);
      console.log('🌐 Browser result:', result);

      if (result.type === 'cancel') {
        throw new Error('User cancelled authentication');
      }

      // Set up deep link listener for callback
      return new Promise((resolve, reject) => {
        const subscription = Linking.addEventListener('url', async (event) => {
          try {
            console.log('📱 Deep link received:', event.url);
            
            // Parse the callback URL
            const url = new URL(event.url);
            const code = url.searchParams.get('code');
            const returnedState = url.searchParams.get('state');
            const error = url.searchParams.get('error');

            // Clean up
            subscription?.remove();
            this.authInProgress = false;

            if (error) {
              reject(new Error(`OAuth error: ${error}`));
              return;
            }

            if (!code) {
              reject(new Error('No authorization code received'));
              return;
            }

            // Verify state
            const storedState = await AsyncStorage.getItem('oauth_state');
            if (returnedState !== storedState) {
              reject(new Error('Invalid state parameter'));
              return;
            }

            // Exchange code for tokens
            console.log('✅ Authorization successful, exchanging code for tokens...');
            const tokens = await this.exchangeCodeForTokens(code, redirectUri);
            
            // Get user info
            const userInfo = await this.getUserInfo(tokens.access_token);
            console.log('👤 User info retrieved:', userInfo.login);
            
            // Register/login user with backend
            console.log('🔗 Registering user with backend...');
            const backendAuth = await this.authenticateWithBackend(tokens.access_token);
            
            // Store tokens and user data
            await this.storeTokens(tokens);
            await AsyncStorage.setItem('userData', JSON.stringify(backendAuth.user));
            await AsyncStorage.setItem('appToken', backendAuth.token); // Store backend JWT
            await AsyncStorage.setItem('userRole', backendAuth.user.role); // Store user role for navigation
            
            resolve({
              success: true,
              user: backendAuth.user,
              tokens: tokens,
              appToken: backendAuth.token,
              isNewUser: backendAuth.user.isNewUser
            });

          } catch (error) {
            console.error('❌ Deep link processing error:', error);
            subscription?.remove();
            this.authInProgress = false;
            reject(error);
          }
        });

        // Set a timeout for the auth process
        setTimeout(() => {
          subscription?.remove();
          this.authInProgress = false;
          reject(new Error('Authentication timeout'));
        }, 5 * 60 * 1000); // 5 minutes
      });

    } catch (error) {
      console.error('❌ Login failed:', error);
      this.authInProgress = false;
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  async exchangeCodeForTokens(code, redirectUri) {
    try {
      console.log('🔄 Exchanging code for tokens...');
      
      // Use FormData for multipart/form-data (as shown in 42 API docs)
      const formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('client_id', FORTYTWO_CONFIG.CLIENT_ID);
      formData.append('client_secret', FORTYTWO_CONFIG.CLIENT_SECRET);
      formData.append('code', code);
      formData.append('redirect_uri', redirectUri);

      console.log('📝 Token exchange using FormData (multipart/form-data)');
      console.log('📝 Parameters:', {
        grant_type: 'authorization_code',
        client_id: FORTYTWO_CONFIG.CLIENT_ID,
        client_secret: FORTYTWO_CONFIG.CLIENT_SECRET.substring(0, 10) + '...',
        code: code.substring(0, 10) + '...',
        redirect_uri: redirectUri
      });

      const response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        body: formData, // FormData automatically sets multipart/form-data
      });

      const responseText = await response.text();
      console.log('🎫 Token exchange response:', response.status, responseText);
      console.log('🎫 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let error;
        try {
          error = JSON.parse(responseText);
        } catch (e) {
          error = { error: responseText };
        }
        throw new Error(error.error_description || error.error || 'Token exchange failed');
      }

      const tokens = JSON.parse(responseText);
      // Add timestamp for expiry calculation
      tokens.created_at = Date.now();
      return tokens;
    } catch (error) {
      console.error('❌ Token exchange error:', error);
      throw error;
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info from 42 API');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const storedTokens = await this.getStoredTokens();
      if (!storedTokens || !storedTokens.refresh_token) {
        throw new Error('No refresh token available');
      }

      console.log('🔄 Refreshing access token...');
      
      const response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: FORTYTWO_CONFIG.CLIENT_ID,
          client_secret: FORTYTWO_CONFIG.CLIENT_SECRET,
          refresh_token: storedTokens.refresh_token,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || error.error || 'Token refresh failed');
      }

      const result = await response.json();
      await this.storeTokens(result);
      console.log('✅ Token refreshed successfully');
      return result;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      console.log('🚪 Logging out...');
      const storedTokens = await this.getStoredTokens();
      if (storedTokens && storedTokens.access_token) {
        // Revoke the token
        try {
          await fetch('https://api.intra.42.fr/oauth/revoke', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              token: storedTokens.access_token,
              client_id: FORTYTWO_CONFIG.CLIENT_ID,
              client_secret: FORTYTWO_CONFIG.CLIENT_SECRET,
            }),
          });
          console.log('✅ Token revoked successfully');
        } catch (error) {
          console.error('❌ Token revocation failed:', error);
        }
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Clear stored tokens regardless of revocation success
      await this.clearTokens();
      console.log('🧹 Tokens cleared from storage');
    }
  }

  async storeTokens(tokens) {
    try {
      await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens));
      await AsyncStorage.setItem('authToken', tokens.access_token); // For compatibility
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  async getStoredTokens() {
    try {
      const tokens = await AsyncStorage.getItem('auth_tokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return null;
    }
  }

  async clearTokens() {
    try {
      await AsyncStorage.removeItem('auth_tokens');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('appToken'); // Clear backend JWT token
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userRole'); // Clear stored role
      await AsyncStorage.removeItem('oauth_state');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  async isLoggedIn() {
    const tokens = await this.getStoredTokens();
    const appToken = await AsyncStorage.getItem('appToken');
    
    // Check if we have both 42 tokens and backend app token
    if (!tokens || !appToken) return false;

    // Check if token is expired (if expires_in is available)
    if (tokens.created_at && tokens.expires_in) {
      const expirationTime = tokens.created_at + (tokens.expires_in * 1000);
      const now = Date.now();
      return now < expirationTime;
    }

    // If no expiration info, assume valid and let API calls handle expiry
    return true;
  }

  async makeAuthenticatedRequest(url, options = {}) {
    try {
      const appToken = await AsyncStorage.getItem('appToken');
      
      if (!appToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${appToken}`, // Use backend JWT token
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Authenticated request failed:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }

      // If no stored user data, try to fetch from backend
      const appToken = await AsyncStorage.getItem('appToken');
      if (appToken) {
        const userInfo = await this.makeAuthenticatedRequest(`${BACKEND_CONFIG.BASE_URL}/api/users/profile`);
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
        return userInfo;
      }

      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async authenticateWithBackend(accessToken) {
    try {
      console.log('🔗 Authenticating with backend...');
      
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/api/users/auth/42/frontend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken
        }),
      });

      const responseText = await response.text();
      console.log('🏢 Backend auth response:', response.status, responseText);

      if (!response.ok) {
        let error;
        try {
          error = JSON.parse(responseText);
        } catch (e) {
          error = { error: responseText };
        }
        throw new Error(error.error || 'Backend authentication failed');
      }

      const result = JSON.parse(responseText);
      console.log('✅ Backend authentication successful');
      
      return result;
    } catch (error) {
      console.error('❌ Backend authentication error:', error);
      throw error;
    }
  }
}

export default new AuthService(); 