import { NativeModules } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

let DocumentScannerInstance = null;

const isDocumentScannerAvailable = () => {
  try {
    return !!(
      NativeModules.DocumentScanner ||
      (global.TurboModuleRegistry && global.TurboModuleRegistry.get && global.TurboModuleRegistry.get('DocumentScanner'))
    );
  } catch (e) {
    return false;
  }
};

if (isDocumentScannerAvailable()) {
  try {
    DocumentScannerInstance = require('react-native-document-scanner-plugin').default;
  } catch (e) {
    console.log('DocumentScanner module require error:', e);
  }
}

const imagePickerScanner = {
  scanDocument: async () => {
    console.log('📷 Using ImagePicker as camera fallback...');
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      console.log('❌ Camera permission denied');
      return { scannedImages: [] };
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.length) {
      console.log('📷 Camera cancelled');
      return { scannedImages: [] };
    }
    console.log('✅ Image captured:', result.assets[0].uri);
    return { scannedImages: [result.assets[0].uri] };
  },
};

const safeDocumentScanner = DocumentScannerInstance || imagePickerScanner;

export default safeDocumentScanner;
