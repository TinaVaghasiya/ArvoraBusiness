import express from "express";
import { adminLogin, getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, verifyToken } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getUsers, getRecentUsers, deleteUser, updateUser } from "../controllers/userController.js";
import { getAdminCards, deleteAdminCard, updateAdminCard } from "../controllers/admincardController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Public Routes
router.post("/login", adminLogin);
router.get("/verify", verifyToken);

// Admin Management Routes
router.get("/admins", adminAuth, getAdmins);
router.get("/admins/:id", adminAuth, getAdminById);
router.post("/admins", adminAuth, createAdmin);
router.put("/admins/:id", adminAuth, updateAdmin);
router.delete("/admins/:id", adminAuth, deleteAdmin);

// Apply authentication to all routes below
router.use(adminAuth);

// Dashboard Routes
router.get("/dashboard/stats", getDashboardStats);

// User Management Routes
router.get("/users", getUsers);
router.get("/users/recent", getRecentUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

// Card Management Routes
router.get("/cards", getAdminCards);
router.delete("/cards/:id", deleteAdminCard);
router.put("/cards/:id", updateAdminCard);

export default router;
