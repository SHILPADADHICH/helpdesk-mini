import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface IdempotencyStore {
  [key: string]: {
    response?: any;
    statusCode?: number;
    timestamp: number;
  };
}

const store: IdempotencyStore = {};
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const idempotencyCheck = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const idempotencyKey = req.headers["idempotency-key"] as string;
  
  if (!idempotencyKey && req.method === "POST") {
    // Generate a key based on request content for POST requests
    const bodyHash = crypto
      .createHash("md5")
      .update(JSON.stringify(req.body))
      .digest("hex");
    const generatedKey = `${req.user?._id || "anonymous"}-${req.path}-${bodyHash}`;
    req.headers["idempotency-key"] = generatedKey;
  }
  
  const key = idempotencyKey || req.headers["idempotency-key"] as string;
  
  if (!key) {
    return next();
  }
  
  // Clean up expired entries
  const now = Date.now();
  Object.keys(store).forEach(k => {
    if (store[k].timestamp + TTL_MS < now) {
      delete store[k];
    }
  });
  
  if (key && store[key]) {
    return res.status(store[key].statusCode || 200).json(store[key].response);
  }
  
  // Store the original send method
  const originalSend = res.send;
  
  res.send = function(body) {
    if (key) {
      store[key] = {
        response: body,
        statusCode: res.statusCode,
        timestamp: now,
      };
    }
    return originalSend.call(this, body);
  };
  
  next();
};
