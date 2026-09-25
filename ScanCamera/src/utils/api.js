export const BASE_API = "http://172.20.26.128:5000";
export const OCR_API = `${BASE_API}/api/ocr`;

// Helper function to check token expiration and handle logout
export const handleApiError = async (response, navigation) => {
  if (response.status === 401) {
    const data = await response.json().catch(() => ({}));
    if (data.message === 'Invalid or expired token' || data.message === 'No token provided') {
      // Clear storage and redirect to login
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
      return true;
    }
  }
  return false;
};
