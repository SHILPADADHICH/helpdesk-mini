import { Router } from "express";

// controllers
import { health, home } from "../controllers/base";
import { meta, hackathonManifest } from "../controllers/meta";

// routes
import authRoutes from "./auth";
import ticketRoutes from "./ticket";
import commentRoutes from "./comment";

const baseRoutes = Router();

// System routes
baseRoutes.get("/", home);
baseRoutes.get("/api/health", health);
baseRoutes.get("/api/_meta", meta);
baseRoutes.get("/.well-known/hackathon.json", hackathonManifest);

// API routes
baseRoutes.use("/api/auth", authRoutes);
baseRoutes.use("/api/tickets", ticketRoutes);
baseRoutes.use("/api/tickets", commentRoutes);

export default baseRoutes;
