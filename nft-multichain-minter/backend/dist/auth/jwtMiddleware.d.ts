import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    wallet?: string;
}
export declare const jwtMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=jwtMiddleware.d.ts.map