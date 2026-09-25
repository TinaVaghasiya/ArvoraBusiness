import { NativeModules } from 'react-native';

let RNFSSafe = null;

const isFSAvailable = () => {
  try {
    return !!(
      NativeModules.RNFS ||
      (global.TurboModuleRegistry && global.TurboModuleRegistry.get && global.TurboModuleRegistry.get('RNFS'))
    );
  } catch (e) {
    return false;
  }
};

if (isFSAvailable()) {
  try {
    RNFSSafe = require('react-native-fs');
  } catch (e) {
    console.log('RNFS module require error:', e);
  }
}

const mockFS = {
  CachesDirectoryPath: '/tmp',
  downloadFile: () => ({
    promise: Promise.resolve({ statusCode: 400 }),
  }),
  unlink: async () => {},
};

export default RNFSSafe || mockFS;
