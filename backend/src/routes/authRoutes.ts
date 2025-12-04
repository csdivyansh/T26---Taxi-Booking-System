import { Router } from "express";
import { signup, signin, getProfile } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);

// Protected routes
router.get("/profile", authMiddleware, getProfile);

export default router;
