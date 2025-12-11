import { Request, Response, NextFunction } from "express";
/**
 * Rate limiter for Ethereum wallet operations
 * Limits minting operations per wallet address
 */
export declare function ethWalletLimiter(req: Request, res: Response, next: NextFunction): Promise<void>;
export default ethWalletLimiter;
//# sourceMappingURL=ethWalletLimiter.d.ts.map