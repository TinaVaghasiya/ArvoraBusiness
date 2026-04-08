import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendMultipleNotifications } from '../services/firebaseService.js';

const router = express.Router();

// Send notification to users
router.post('/send', adminAuth, async (req, res) => {
  try {
    const { title, message, type, sendTo, userIds } = req.body;

    let allUsers = [];
    let usersWithTokens = [];
    
    if (sendTo === 'all') {
      allUsers = await User.find();
      usersWithTokens = allUsers.filter(u => u.fcmToken);
    } else if (sendTo === 'selected') {
      allUsers = await User.find({ _id: { $in: userIds } });
      usersWithTokens = allUsers.filter(u => u.fcmToken);
    }

    if (allUsers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No users found' 
      });
    }

    // Create notifications in database for ALL users (even without FCM tokens)
    const notifications = allUsers.map(user => ({
      userId: user._id,
      userName: user.name || user.email || 'User',
      type,
      title,
      message,
      read: false,
    }));
    
    await Notification.insertMany(notifications);

    // Send push notifications only to users with FCM tokens
    let pushNotificationResult = null;
    if (usersWithTokens.length > 0) {
      const tokens = usersWithTokens.map(u => u.fcmToken);
      pushNotificationResult = await sendMultipleNotifications(
        tokens,
        title,
        message,
        { type }
      );
    }

    res.json({
      success: true,
      message: `Notification sent to ${allUsers.length} users (${usersWithTokens.length} push notifications sent)`,
      data: {
        totalUsers: allUsers.length,
        pushNotificationsSent: usersWithTokens.length,
        successCount: pushNotificationResult?.response?.successCount || 0,
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
