import { Request } from "express";
export interface JWTPayload {
    wallet: string;
    iat?: number;
    exp?: number;
}
/**
 * Extract JWT token from request header
 */
export declare function getTokenFromHeader(req: Request): string | null;
/**
 * Decode and verify JWT token
 */
export declare function decodeToken(token: string): JWTPayload | null;
/**
 * Attach JWT token to axios request config headers
 */
export declare function attachTokenToHeaders(requestConfig: any, token: string): any;
/**
 * Extract wallet address from request (via JWT)
 */
export declare function getWalletFromRequest(req: Request): string | null;
/**
 * Verify token is valid and not expired
 */
export declare function isTokenValid(token: string): boolean;
//# sourceMappingURL=jwt.d.ts.map