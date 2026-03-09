import { transporter } from "./Email.config.js";

export const SendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"OTP Verification" <anshikavaghasiya8001@gmail.com>', // sender email address
      to: email, // list of receivers
      subject: "OTP for login", // Subject line
      html: `<h3>Your verification code is: <br><h2><b>${verificationCode}</b></h2></h3>`, // HTML version of the message
    });
console.log("Email successfully send !!", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
