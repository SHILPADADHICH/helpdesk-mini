import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  getBreachedTickets,
} from "../controllers/ticket";
import { authenticate, requireRole } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";
import { idempotencyCheck } from "../middleware/idempotency";
import { pagination } from "../middleware/pagination";

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

// Protected routes
router.post("/", rateLimit, idempotencyCheck, createTicket);
router.get("/", pagination, getTickets);
router.get("/breached", pagination, getBreachedTickets);
router.get("/:id", getTicket);
router.patch("/:id", rateLimit, updateTicket);

export default router;
