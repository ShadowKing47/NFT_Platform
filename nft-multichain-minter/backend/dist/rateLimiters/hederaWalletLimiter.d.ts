import { Request, Response, NextFunction } from "express";
/**
 * Rate limiter for Hedera wallet operations
 * Limits minting operations per wallet address
 */
export declare function hederaWalletLimiter(req: Request, res: Response, next: NextFunction): Promise<void>;
export default hederaWalletLimiter;
//# sourceMappingURL=hederaWalletLimiter.d.ts.map