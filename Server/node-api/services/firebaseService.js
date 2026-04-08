import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) return;
  
  try {
    const serviceAccountPath = join(__dirname, '../firebase-service-account.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase init error:', error.message);
    console.log('⚠️  Please add firebase-service-account.json to Server/node-api/');
  }
};

initializeFirebase();

export const sendNotification = async (token, title, message, data = {}) => {
  if (!firebaseInitialized) {
    return { success: false, error: 'Firebase not initialized' };
  }

  try {
    const payload = {
      notification: { title, body: message },
      data: { ...data, type: data.type || 'system' },
      token: token,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default',
        }
      }
    };

    const response = await admin.messaging().send(payload);
    console.log('✅ Notification sent:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Notification error:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendMultipleNotifications = async (tokens, title, message, data = {}) => {
  if (!firebaseInitialized) {
    return { success: false, error: 'Firebase not initialized' };
  }

  try {
    const payload = {
      notification: { title, body: message },
      data: { ...data, type: data.type || 'system' },
      tokens: tokens,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default',
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log(`✅ Sent ${response.successCount}/${tokens.length} notifications`);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Batch notification error:', error.message);
    return { success: false, error: error.message };
  }
};
