import { Request, Response, NextFunction } from "express";
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
export declare function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=requestId.d.ts.map