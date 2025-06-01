import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

export const usePageTransition = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState('');
  const router = useRouter();

  const navigateWithTransition = useCallback(async (path, message = 'Loading...') => {
    setIsNavigating(true);
    setNavigationMessage(message);
    
    // Add a slightly longer delay for better visual feedback with new animations
    setTimeout(() => {
      router.push(path);
      // Clear navigation state after the enhanced animation completes
      setTimeout(() => {
        setIsNavigating(false);
        setNavigationMessage('');
      }, 400); // Increased duration for smoother experience
    }, 200); // Slightly longer initial delay
  }, [router]);

  const navigateBack = useCallback(() => {
    setIsNavigating(true);
    setNavigationMessage('Going back...');
    
    setTimeout(() => {
      router.back();
      setTimeout(() => {
        setIsNavigating(false);
        setNavigationMessage('');
      }, 400);
    }, 200);
  }, [router]);

  return {
    isNavigating,
    navigationMessage,
    navigateWithTransition,
    navigateBack
  };
};

export default usePageTransition; 