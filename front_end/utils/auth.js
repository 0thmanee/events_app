import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const userData = await AsyncStorage.getItem('userData');
    
    return !!(token && userData);
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get authentication token
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Clear authentication data
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'userData', 'userRole']);
    console.log('✅ Authentication data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Check if user is staff/admin
export const isStaff = async () => {
  try {
    const userData = await getCurrentUser();
    const userRole = await AsyncStorage.getItem('userRole');
    
    // Check both user data and stored role
    return userData?.role === 'admin' || 
           userData?.role === 'staff' || 
           userRole === 'staff' ||
           userRole === 'admin';
  } catch (error) {
    console.error('Error checking staff status:', error);
    return false;
  }
};

// Update user role
export const updateUserRole = async (role) => {
  try {
    await AsyncStorage.setItem('userRole', role);
    console.log(`✅ User role updated to: ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}; 