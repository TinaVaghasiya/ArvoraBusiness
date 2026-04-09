import mongoose from 'mongoose';

const adSettingsSchema = new mongoose.Schema({
  displayType: {
    type: String,
    enum: ['static', 'dynamic', 'both'],
    default: 'both',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AdSettings = mongoose.model('AdSettings', adSettingsSchema);

export default AdSettings;
