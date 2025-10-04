import { Router } from "express";
import { register, login, getMe } from "../controllers/auth";
import { authenticate } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";
import { idempotencyCheck } from "../middleware/idempotency";

const router = Router();

// Public routes
router.post("/register", rateLimit, idempotencyCheck, register);
router.post("/login", rateLimit, idempotencyCheck, login);

// Protected routes
router.get("/me", authenticate, getMe);

export default router;
