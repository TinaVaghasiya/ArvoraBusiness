import { NativeModules } from 'react-native';

let messagingInstance = null;

const isFirebaseNativeAvailable = () => {
  return !!(
    NativeModules.RNFBAppModule ||
    NativeModules.RNFBMessagingModule
  );
};

if (isFirebaseNativeAvailable()) {
  try {
    messagingInstance = require('@react-native-firebase/messaging').default;
  } catch (e) {
    console.log('Firebase messaging native module require error:', e);
  }
}

const mockMessaging = () => ({
  requestPermission: async () => 0,
  hasPermission: async () => 0,
  getToken: async () => null,
  onMessage: () => () => {},
  onNotificationOpenedApp: () => () => {},
  getInitialNotification: async () => null,
});

mockMessaging.AuthorizationStatus = {
  NOT_DETERMINED: -1,
  DENIED: 0,
  AUTHORIZED: 1,
  PROVISIONAL: 2,
};

const safeMessaging = messagingInstance || mockMessaging;
if (!safeMessaging.AuthorizationStatus) {
  safeMessaging.AuthorizationStatus = mockMessaging.AuthorizationStatus;
}

export default safeMessaging;
