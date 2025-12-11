import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Extend Express Request type to include request ID
 */
declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

/**
 * Middleware to add unique request correlation ID
 * Enables request tracing across logs and services
 */
export function requestIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    req.id = randomUUID();
    res.setHeader("X-Request-ID", req.id);
    next();
}
