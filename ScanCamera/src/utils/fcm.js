import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API } from './api';
import messaging from '@react-native-firebase/messaging';
import { Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const notificationType = notification.request.content.data?.type;
    
    if (notificationType === 'warning') {
      Vibration.vibrate([0, 100, 50, 100]);
    } else if (notificationType === 'success') {
      Vibration.vibrate([0, 50, 50, 50]);
    } else {
      Vibration.vibrate(200);
    }

    return {
      shouldShowAlert: false,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export const registerForPushNotifications = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission not granted');
      return;
    }

    console.log('✅ Notification permission granted');

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        showBadge: true,
      });
    }

    const token = await messaging().getToken();
    console.log('✅ FCM Token:', token);

    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken && token) {
      await axios.post(
        `${BASE_API}/api/notifications/save-token`,
        { fcmToken: token },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      console.log('✅ FCM Token saved to backend');
    }

    return token;
  } catch (error) {
    console.log('Notification setup error:', error.message);
    console.error(error);
  }
};

export const setupNotificationHandler = () => {
  console.log('✅ Notification handler configured');
};
