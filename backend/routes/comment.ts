import { Router } from "express";
import {
  createComment,
  getComments,
  getTimeline,
} from "../controllers/comment";
import { authenticate } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";
import { idempotencyCheck } from "../middleware/idempotency";
import { pagination } from "../middleware/pagination";

const router = Router();

// All comment routes require authentication
router.use(authenticate);

// Protected routes
router.post("/:ticketId/comments", rateLimit, idempotencyCheck, createComment);
router.get("/:ticketId/comments", pagination, getComments);
router.get("/:ticketId/timeline", pagination, getTimeline);

export default router;
