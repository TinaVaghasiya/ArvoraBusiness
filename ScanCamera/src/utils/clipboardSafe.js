import { NativeModules, Clipboard as RNClipboardFallback } from 'react-native';

let ClipboardSafe = null;

const isClipboardAvailable = () => {
  try {
    return !!(
      NativeModules.RNCClipboard ||
      (global.TurboModuleRegistry && global.TurboModuleRegistry.get && global.TurboModuleRegistry.get('RNCClipboard'))
    );
  } catch (e) {
    return false;
  }
};

if (isClipboardAvailable()) {
  try {
    ClipboardSafe = require('@react-native-clipboard/clipboard').default;
  } catch (e) {
    console.log('Clipboard module require error:', e);
  }
}

const mockClipboard = {
  setString: (str) => {
    if (RNClipboardFallback && RNClipboardFallback.setString) {
      RNClipboardFallback.setString(str);
    }
  },
  getString: async () => {
    if (RNClipboardFallback && RNClipboardFallback.getString) {
      return RNClipboardFallback.getString();
    }
    return '';
  },
  setStringAsync: async (str) => {
    if (RNClipboardFallback && RNClipboardFallback.setString) {
      RNClipboardFallback.setString(str);
    }
  },
};

export default ClipboardSafe || mockClipboard;
