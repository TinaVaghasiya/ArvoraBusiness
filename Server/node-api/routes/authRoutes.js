import express from 'express';
import { register, login, getLogin, verifyOTP } from '../controllers/User.js';
import { setMPin, verifyMPin, disableMPin, getMPinStatus, changeMPin } from '../controllers/mpinController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/get-users', getLogin);
authRoutes.post('/verify-otp', verifyOTP);

authRoutes.post('/mpin/set', authMiddleware, setMPin);
authRoutes.post('/mpin/verify', authMiddleware, verifyMPin);
authRoutes.post('/mpin/disable', authMiddleware, disableMPin);
authRoutes.get('/mpin/status', authMiddleware, getMPinStatus);
authRoutes.post('/mpin/change', authMiddleware, changeMPin);

export default authRoutes;