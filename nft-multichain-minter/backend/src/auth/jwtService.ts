import jwt from "jsonwebtoken";
import config from "../config/env";

const JWT_SECRET = config.jwtSecret;

/**
 * Issue JWT token for authenticated wallet
 * Token expires in 2 hours
 */
export function issueJwt(wallet: string): string {
    return jwt.sign(
        { wallet },
        JWT_SECRET,
        { expiresIn: "2h" }
    );
}

/**
 * Verify JWT token with clock tolerance
 * Returns decoded payload or throws error
 */
export function verifyJwt(token: string): { wallet: string } {
    return jwt.verify(token, JWT_SECRET, {
        clockTolerance: 5 // 5 seconds tolerance for clock drift
    }) as { wallet: string };
}