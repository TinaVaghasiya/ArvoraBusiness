import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: String,
  company: String,
  verificationCode: String,
  otpExpiresAt: Date,
  isVerified:{
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;