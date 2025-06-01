import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export async function handleIntent(intent) {
  const url = intent.url;
  
  if (url?.includes('hackathon://')) {
    console.log('📱 Deep link received:', url);
    
    // Complete auth session for OAuth flows
    WebBrowser.maybeCompleteAuthSession();
    
    // Parse the URL to handle different types of deep links
    const urlObj = new URL(url);
    
    if (urlObj.pathname.includes('oauth') || urlObj.searchParams.get('code')) {
      // This is an OAuth callback
      console.log('🔐 OAuth callback detected');
      
      // Navigate to a processing screen or directly to app
      router.replace('/');
      return true;
    }
  }
  
  return false;
} 