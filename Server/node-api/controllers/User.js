import jwt from "jsonwebtoken";
import { SendVerificationEmail } from "../middleware/Email.js";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, name, phone, company } = req.body;
    if (!email || !name || !phone) {
      return res.status(400).json({ message: "Fields are required" });
    }
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }],
     });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const newUser = new User({
      email,
      name,
      phone,
      company,
      verificationCode,
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
    });
    await newUser.save();
    await SendVerificationEmail(newUser.email, verificationCode);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        // verificationCode: newUser.verificationCode,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Email or phone is required" });
    }
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register" });
    }

    if(!user.isVerified){
      return res.status(400).json({ message: "Please verify your account" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.log(verificationCode);
    await User.findByIdAndUpdate(user._id, {
      verificationCode,
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
    });
    await SendVerificationEmail(user.email, verificationCode);

    res.status(200).json({
      message: "OTP sent successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        // verificationCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getLogin = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }
    // user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // otp expire
    if (!user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired. Please request new OTP",
      });
    }
    // otp verification
    if (user.verificationCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id , email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES },
    );

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: true,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};
