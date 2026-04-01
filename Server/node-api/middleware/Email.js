import { transporter } from "./Email.config.js";

// For User Login OTP 
export const SendVerificationEmail = async (email, verificationCode, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"OTP Verification" <anshikavaghasiya8001@gmail.com>',
      to: email,
      subject: "OTP for login",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${name}</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 36px; margin: 10px 0;">${verificationCode}</h1>
          </div>
          <p style="color: #6b7280;">This OTP is valid for the next <strong>1 minute</strong>. Please do not share this code with anyone for security reasons.</p>
          <p style="color: #6b7280;">If you did not request this, please ignore this email.</p>
          <p style="margin-top: 30px;">Thank you,<br><strong>Arvora Business Team</strong></p>
        </div>
      `,
    });
    console.log("Email successfully sent!!");
    console.log("Sended to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// For Admin Password Reset OTP
export const SendPasswordResetEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"Update Password" <anshikavaghasiya8001@gmail.com>',
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You have requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0;">${verificationCode}</h1>
          </div>
          <p style="color: #6b7280;">This OTP will expire in 1 minutes.</p>
          <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log("Password reset email successfully sent!!", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
