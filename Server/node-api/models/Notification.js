import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['card_scanned', 'profile_update', 'system', 'success', 'warning'], 
    default: 'system' 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Object, default: {} },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

export default mongoose.model('Notification', notificationSchema);
