import express from 'express';
import { register, login, getLogin, verifyOTP } from '../controllers/User.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/get-users', getLogin);
authRoutes.post('/verify-otp', verifyOTP);

export default authRoutes;