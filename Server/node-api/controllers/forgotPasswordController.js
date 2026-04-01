import Admin from '../models/Admin.js';
import { SendPasswordResetEmail } from '../middleware/Email.js';

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        const otp = generateOTP();
        console.log('Reset Password OTP:', otp);

        admin.resetPasswordOTP = otp;
        admin.resetPasswordOTPExpiresAt = Date.now() + 1 * 60 * 1000;
        await admin.save();

        await SendPasswordResetEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email successfully'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again.'
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (!admin.resetPasswordOTP) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new one'
            });
        }

        if (!admin.resetPasswordOTPExpiresAt || admin.resetPasswordOTPExpiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new OTP'
            });
        }

        if (admin.resetPasswordOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP, and new password are required'
            });
        }

        if (newPassword.length < 8 || newPassword.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Password must be between 8-15 characters'
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (!admin.resetPasswordOTP) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new one'
            });
        }

        if (!admin.resetPasswordOTPExpiresAt || admin.resetPasswordOTPExpiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new OTP'
            });
        }

        if (admin.resetPasswordOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }
        admin.password = newPassword;
        admin.resetPasswordOTP = null;
        admin.resetPasswordOTPExpiresAt = null;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
};
