/**
 * Issue JWT token for authenticated wallet
 * Token expires in 2 hours
 */
export declare function issueJwt(wallet: string): string;
/**
 * Verify JWT token with clock tolerance
 * Returns decoded payload or throws error
 */
export declare function verifyJwt(token: string): {
    wallet: string;
};
//# sourceMappingURL=jwtService.d.ts.map