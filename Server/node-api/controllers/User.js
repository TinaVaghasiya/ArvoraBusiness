import jwt from "jsonwebtoken";
import { SendVerificationEmail } from "../middleware/Email.js";
import User from "../models/User.js";
import { validateEmail, validatePhone, sanitizeInput } from "../services/validation.js";

export const register = async (req, res) => {
  try {
    const { email, name, phone, company } = req.body;
    if (!email || !name || !phone) {
      return res.status(400).json({ message: "Fields are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (!existingUser.isVerified) {
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        console.log("🔑 Generated OTP (Resent):", verificationCode);
        existingUser.name = name;
        existingUser.phone = phone;
        existingUser.company = company || existingUser.company;
        existingUser.verificationCode = verificationCode;
        existingUser.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        await existingUser.save();
        
        try {
          await SendVerificationEmail(existingUser.email, verificationCode, existingUser.name);
        } catch (emailErr) {
          console.error("❌ Email send error:", emailErr.message);
        }

        return res.status(200).json({
          message: "OTP resent to your email",
          user: {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
          },
        });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.log("🔑 Generated OTP (Register):", verificationCode);

    const newUser = new User({
      email,
      name,
      phone,
      company,
      verificationCode,
      otpExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
    await newUser.save();

    try {
      await SendVerificationEmail(newUser.email, verificationCode, newUser.name);
    } catch (emailErr) {
      console.error("❌ Email send error:", emailErr.message);
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        company: newUser.company,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Register Controller Error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message || error });
  }
};

export const login = async (req, res) => {
  console.log("\n🔐 ===== LOGIN REQUEST =====");
  console.log("   Identifier:", req.body?.identifier);
  try {
    const { identifier } = req.body;
    if (!identifier) {
      console.log("❌ No identifier provided");
      return res.status(400).json({ message: "Email or phone is required" });
    }

    let user;
    if (identifier.includes("@")) {
      console.log("   Type: Email");
      if (!validateEmail(identifier)) {
        console.log("❌ Invalid email format");
        return res.status(400).json({ message: "Invalid email format" });
      }
      user = await User.findOne({ email: identifier });
    } else {
      console.log("   Type: Phone");
      if (!validatePhone(identifier)) {
        console.log("❌ Invalid phone format");
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      user = await User.findOne({ phone: identifier });
    }

    if (!user) {
      console.log("❌ User not found:", identifier);
      return res.status(404).json({ message: "User not found. Please register" });
    }
    console.log("✅ User found:", user.name, "|", user.email);

    if (!user.isActive) {
      console.log("❌ Account deactivated:", user.email);
      return res.status(403).json({ message: "Your account has been deactivated. Please contact support" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔑 OTP Generated:", verificationCode);

    await User.findByIdAndUpdate(user._id, {
      verificationCode,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
    });
    console.log("✅ OTP saved to DB");

    try {
      await SendVerificationEmail(user.email, verificationCode, user.name);
      console.log("✅ OTP email sent to:", user.email);
    } catch (emailErr) {
      console.error("❌ Email send error:", emailErr.message);
    }

    console.log("✅ Login success — OTP sent");
    res.status(200).json({
      message: "OTP sent successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("❌ Login Controller Error:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message || error });
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
  console.log("\n✅ ===== VERIFY OTP REQUEST =====");
  console.log("   Identifier:", req.body?.identifier);
  console.log("   OTP:", req.body?.otp);
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      console.log("❌ Missing identifier or OTP");
      return res.status(400).json({ message: "OTP is required" });
    }
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }
    if (!user) {
      console.log("❌ User not found:", identifier);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ User found:", user.name);
    if (!user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
      console.log("❌ OTP expired");
      return res.status(400).json({ message: "OTP expired. Please request new OTP" });
    }
    if (user.verificationCode !== otp) {
      console.log("❌ Wrong OTP — Expected:", user.verificationCode, "Got:", otp);
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.otpExpiresAt = null;
    await user.save();
    console.log("✅ OTP verified, user saved");

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES },
    );
    console.log("✅ JWT token generated");

    res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        isVerified: true,
        mpinEnabled: user.mpinEnabled || false,
      },
    });
  } catch (error) {
    console.error("❌ VerifyOTP Error:", error.message);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};
