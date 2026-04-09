import express from "express";
import { requestEmailChange, verifyEmailChange } from "../controllers/emailChangeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request-change", authMiddleware, requestEmailChange);
router.post("/verify-change", authMiddleware, verifyEmailChange);

export default router;
