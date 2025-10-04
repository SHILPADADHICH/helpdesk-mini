import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export const rateLimit = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const key = req.user ? `user:${req.user._id}` : `ip:${req.ip}`;
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(store).forEach(k => {
    if (store[k].resetTime < now) {
      delete store[k];
    }
  });
  
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return next();
  }
  
  if (store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return next();
  }
  
  if (store[key].count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: {
        code: "RATE_LIMIT",
        message: "Too many requests, please try again later",
      },
    });
  }
  
  store[key].count++;
  next();
};
