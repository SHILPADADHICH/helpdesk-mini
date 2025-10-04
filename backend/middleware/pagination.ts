import { Request, Response, NextFunction } from "express";

export interface PaginatedRequest extends Request {
  pagination?: {
    limit: number;
    offset: number;
    page: number;
  };
}

export const pagination = (
  req: PaginatedRequest,
  res: Response,
  next: NextFunction
) => {
  const limitParam = parseInt(req.query.limit as string) || 20;
  const offsetParam = parseInt(req.query.offset as string) || 0;
  
  const limit = Math.min(Math.max(limitParam, 1), 100); // Between 1 and 100
  const offset = Math.max(offsetParam, 0);
  const page = Math.floor(offset / limit) + 1;
  
  req.pagination = {
    limit,
    offset,
    page,
  };
  
  next();
};
