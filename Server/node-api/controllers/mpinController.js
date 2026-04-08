import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { validateMPin } from '../services/validation.js';

export const setMPin = async (req, res) => {
    try {
        const {mpin} = req.body;
        const userId = req.user.id;

        if (!validateMPin(mpin)) {
            return res.status(400).json({ message: "M-PIN must be exactly 4 digits" });
        }

        const hashedPin = await bcrypt.hash(mpin, 10);

        await User.findByIdAndUpdate(userId, { mpin: hashedPin, mpinEnabled: true });

        res.json({ success: true, message: "M-PIN set successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error setting M-PIN", error: error.message });
    }
};

export const verifyMPin = async (req, res) => {
    try {
        const {mpin} = req.body;
        const userId = req.user.id;

        if (!mpin) {
            return res.status(400).json({ message: "PIN is required" });
        }

        const user = await User.findById(userId);

        if (!user || !user.mpin) {
            return res.status(400).json({ message: "PIN not set" });
        }

        const isMatch = await bcrypt.compare(mpin, user.mpin);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid PIN" });
        }

        res.json({success: true, message: "M-PIN verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error verifying PIN", error: error.message });
    }
};

export const disableMPin = async (req, res) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, { mpin: null, mpinEnabled: false });

        res.json({ success: true, message: "PIN disabled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error disabling PIN", error: error.message });
    }
};

export const getMPinStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("mpinEnabled");
        res.json({ success: true, mpinEnabled: user?.mpinEnabled || false });
    } catch (error) {
        res.status(500).json({ message: "Error fetching PIN status", error: error.message });
    }
};

export const changeMPin = async (req, res) => {
    try {
        const { currentMpin, newMpin } = req.body;
        const userId = req.user.id;

        if (!currentMpin || !newMpin) {
            return res.status(400).json({ message: "Current and new PIN are required" });
        }

        if (!validateMPin(newMpin)) {
            return res.status(400).json({ message: "New PIN must be exactly 4 digits" });
        }

        const user = await User.findById(userId);

        if (!user || !user.mpin) {
            return res.status(400).json({ message: "M-PIN not set" });
        }

        const isMatch = await bcrypt.compare(currentMpin, user.mpin);

        if (!isMatch) {
            return res.status(400).json({ message: "Current PIN is incorrect" });
        }

        const hashedNewPin = await bcrypt.hash(newMpin, 10);
        await User.findByIdAndUpdate(userId, { mpin: hashedNewPin });

        res.json({ success: true, message: "PIN changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing PIN", error: error.message });
    }
};