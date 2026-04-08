import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateEmail, validatePhone } from '../services/validation.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-mpin -verificationCode -otpExpiresAt -emailVerificationCode -emailVerificationExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profileupdate', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email !== undefined && email !== user.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
      const existingEmail = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      updateData.email = email;
    }

    if (phone !== undefined && phone !== user.phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format' });
      }
      const existingPhone = await User.findOne({ phone, _id: { $ne: req.user.id } });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'Phone number already exists' });
      }
      updateData.phone = phone;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-mpin -verificationCode -otpExpiresAt -emailVerificationCode -emailVerificationExpires');

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;