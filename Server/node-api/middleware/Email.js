import { transporter } from "./Email.config.js";

// For User Login OTP 
export const SendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"OTP Verification" <anshikavaghasiya8001@gmail.com>',
      to: email,
      subject: "OTP for login",
      html: `<h3>Your verification code is: <br><h2><b>${verificationCode}</b></h2></h3>`,
    });
    console.log("Email successfully sent!!", response);
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
          <p style="color: #6b7280;">This OTP will expire in 5 minutes.</p>
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
