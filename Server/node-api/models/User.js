import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  company: String,
  verificationCode: String,
  otpExpiresAt: Date,
  isVerified:{
    type: Boolean,
    default: false
  },
  mpin: {
    type: String,
    default: null,
  },
  mpinEnabled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  fcmToken: {
    type: String,
    default: null,
  },
  pendingEmail: {
    type: String,
    default: null,
  },
  emailVerificationCode: {
    type: String,
    default: null,
  },
  emailVerificationExpires: {
    type: Date,
    default: null,
  },
});

// Indexes for better query performance
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

const User = mongoose.model("User", UserSchema);

export default User;