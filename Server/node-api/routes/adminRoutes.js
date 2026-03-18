import express from "express";
import { adminLogin, getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, verifyToken } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getUsers, getRecentUsers, deleteUser, updateUser, toggleUserStatus  } from "../controllers/userController.js";
import { getAdminCards, deleteAdminCard, updateAdminCard, getCardsByUser  } from "../controllers/admincardController.js";
import { sendOTP, verifyOTP, resetPassword } from "../controllers/forgotPasswordController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Public Routes
router.post("/login", adminLogin);
router.get("/verify", verifyToken);

// Forgot Password Routes 
router.post("/forgot-password/send-otp", sendOTP);
router.post("/forgot-password/verify-otp", verifyOTP);
router.post("/forgot-password/reset-password", resetPassword);

// Admin Management Routes
router.get("/admins", adminAuth, getAdmins);
router.get("/admins/:id", adminAuth, getAdminById);
router.post("/admins", adminAuth, createAdmin);
router.put("/admins/:id", adminAuth, updateAdmin);
router.delete("/admins/:id", adminAuth, deleteAdmin);

// Dashboard Routes
router.get("/dashboard/stats", adminAuth, getDashboardStats);

// User Management Routes
router.get("/users", adminAuth, getUsers);
router.get("/users/recent", adminAuth, getRecentUsers);
router.delete("/users/:id", adminAuth,deleteUser);
router.put("/users/:id", adminAuth, updateUser);
router.patch("/users/:id/status", adminAuth, toggleUserStatus);

// Card Management Routes
router.get("/cards", adminAuth, getAdminCards);
router.delete("/cards/:id", adminAuth, deleteAdminCard);
router.put("/cards/:id", adminAuth,updateAdminCard);
router.get("/users/:id/cards", adminAuth, getCardsByUser);

export default router;
