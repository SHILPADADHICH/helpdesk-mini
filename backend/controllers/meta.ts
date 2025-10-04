import { Request, Response } from "express";
import mongoose from "mongoose";

export const health = async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(503).json({
      status: "error",
      message: "Health check failed",
    });
  }
};

export const meta = async (req: Request, res: Response) => {
  try {
    const apiInfo = {
      name: "HelpDesk Mini API",
      version: "1.0.0",
      description: "Ticketing system with SLA timers, assignments, threaded comments, and role-based access",
      endpoints: {
        authentication: {
          "POST /api/auth/register": "Register a new user",
          "POST /api/auth/login": "Login user",
          "GET /api/auth/me": "Get current user profile",
        },
        tickets: {
          "POST /api/tickets": "Create a new ticket",
          "GET /api/tickets": "Get tickets with pagination and filters",
          "GET /api/tickets/:id": "Get specific ticket",
          "PATCH /api/tickets/:id": "Update ticket (with optimistic locking)",
          "GET /api/tickets/breached": "Get SLA breached tickets",
        },
        comments: {
          "POST /api/tickets/:id/comments": "Add comment to ticket",
          "GET /api/tickets/:id/comments": "Get ticket comments",
          "GET /api/tickets/:id/timeline": "Get ticket timeline",
        },
        system: {
          "GET /api/health": "Health check",
          "GET /api/_meta": "API metadata",
          "GET /.well-known/hackathon.json": "Hackathon manifest",
        },
      },
      features: [
        "Role-based access control (user/agent/admin)",
        "SLA tracking with automatic deadlines",
        "Optimistic locking for concurrent updates",
        "Threaded comments system",
        "Search across tickets and comments",
        "Pagination support",
        "Rate limiting (60 req/min/user)",
        "Idempotency keys for POST requests",
        "Timeline logging for audit trail",
      ],
      pagination: {
        format: "?limit=20&offset=0",
        response: "{ items: [...], pagination: { limit, offset, total, next_offset } }",
      },
      rateLimits: {
        limit: "60 requests per minute per user",
        headers: "429 status code with { error: { code: 'RATE_LIMIT' } }",
      },
      idempotency: {
        header: "Idempotency-Key",
        description: "All POST requests support idempotency keys",
      },
    };

    res.status(200).json(apiInfo);
  } catch (error) {
    console.error("Meta endpoint error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve API metadata",
      },
    });
  }
};

export const hackathonManifest = async (req: Request, res: Response) => {
  try {
    const manifest = {
      name: "HelpDesk Mini",
      version: "1.0.0",
      description: "Ticketing system with SLA timers, assignments, threaded comments, and role-based access",
      problem_statement: "HelpDesk Mini (Tickets + SLA + Comments)",
      key_features: [
        "Ticket creation and management with SLA tracking",
        "Role-based access control (user/agent/admin)",
        "Threaded comments system",
        "Search functionality across tickets and comments",
        "Timeline logging for audit trail",
        "Optimistic locking for concurrent updates",
        "Pagination, rate limiting, and idempotency support",
      ],
      api_endpoints: [
        "POST /api/tickets - Create ticket",
        "GET /api/tickets - List tickets with pagination",
        "GET /api/tickets/:id - Get specific ticket",
        "PATCH /api/tickets/:id - Update ticket",
        "POST /api/tickets/:id/comments - Add comment",
        "GET /api/health - Health check",
        "GET /api/_meta - API metadata",
      ],
      test_credentials: {
        admin: { email: "admin@test.com", password: "admin123" },
        agent: { email: "agent@test.com", password: "agent123" },
        user: { email: "user@test.com", password: "user123" },
      },
      architecture: "Node.js + Express backend with MongoDB, Next.js frontend with TypeScript. Features JWT authentication, automatic SLA deadline calculation, optimistic locking using version fields, comprehensive timeline logging, and role-based permissions."
    };

    res.status(200).json(manifest);
  } catch (error) {
    console.error("Hackathon manifest error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve hackathon manifest",
      },
    });
  }
};
