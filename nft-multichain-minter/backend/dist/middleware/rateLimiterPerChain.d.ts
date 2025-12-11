import { Request, Response, NextFunction } from "express";
export declare const rateLimiterPerChain: (chain: "ethereum" | "hedera") => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=rateLimiterPerChain.d.ts.map