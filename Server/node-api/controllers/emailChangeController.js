import User from "../models/User.js";
import { transporter } from "../middleware/Email.config.js";

const sendEmailChangeOTP = async (email, otp, name) => {
  try {
    await transporter.sendMail({
      from: '"Email Verification" <anshikavaghasiya8001@gmail.com>',
      to: email,
      subject: "Verify Your New Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${name}</h2>
          <p>You have requested to change your email address. Please verify your new email using the OTP below:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 36px; margin: 10px 0;">${otp}</h1>
          </div>
          <p style="color: #6b7280;">This OTP is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
          <p style="color: #6b7280;">If you did not request this change, please ignore this email.</p>
          <p style="margin-top: 30px;">Thank you,<br><strong>Arvora Business Team</strong></p>
        </div>
      `,
    });
    console.log("Email change OTP sent to:", email);
  } catch (error) {
    console.error("Error sending email change OTP:", error);
    throw error;
  }
};

export const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const userId = req.user.id;

    if (!newEmail || !newEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: "New email is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.email === newEmail.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "New email is same as current email",
      });
    }

    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.pendingEmail = newEmail.toLowerCase();
    user.emailVerificationCode = otp;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    
    console.log("OTP for new email:", otp);

    await sendEmailChangeOTP(newEmail, otp, user.name);

    res.json({
      success: true,
      message: "OTP sent to new email address",
    });
  } catch (error) {
    console.error("Error requesting email change:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyEmailChange = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const userId = req.user.id;

    if (!newEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.pendingEmail || !user.emailVerificationCode) {
      return res.status(400).json({
        success: false,
        message: "No pending email change request",
      });
    }

    if (user.pendingEmail !== newEmail.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Email does not match pending request",
      });
    }

    if (user.emailVerificationExpires < new Date()) {
      user.pendingEmail = null;
      user.emailVerificationCode = null;
      user.emailVerificationExpires = null;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (user.emailVerificationCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Email updated successfully",
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error verifying email change:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};
