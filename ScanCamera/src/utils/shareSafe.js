import { NativeModules, Share as RNShareCore } from 'react-native';

let ShareInstance = null;

const isShareNativeAvailable = () => {
  try {
    return !!(
      NativeModules.RNShare ||
      (global.TurboModuleRegistry && global.TurboModuleRegistry.get && global.TurboModuleRegistry.get('RNShare'))
    );
  } catch (e) {
    return false;
  }
};

if (isShareNativeAvailable()) {
  try {
    ShareInstance = require('react-native-share').default;
  } catch (e) {
    console.log('react-native-share module require error:', e);
  }
}

const mockShare = {
  open: async (options = {}) => {
    console.log('Using fallback Share in Expo Go');
    const msg = options.message || options.url || '';
    return RNShareCore.share({ message: msg, title: options.title });
  },
  shareSingle: async (options = {}) => {
    console.log('Using fallback shareSingle in Expo Go');
    const msg = options.message || options.url || '';
    return RNShareCore.share({ message: msg, title: options.title });
  },
  Social: {
    WHATSAPP: 'whatsapp',
  },
};

const safeShare = ShareInstance || mockShare;
if (!safeShare.Social) {
  safeShare.Social = mockShare.Social;
}

export default safeShare;
