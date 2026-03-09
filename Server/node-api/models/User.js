import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: String,
  company: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: String,
  otpExpiresAt: Date,
  isVerified:{
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", UserSchema);

export default User;