import { Request } from "express";
import jwt from "jsonwebtoken";
import config from "./env";

export interface JWTPayload {
    wallet: string;
    iat?: number;
    exp?: number;
}

/**
 * Extract JWT token from request header
 */
export function getTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return null;
    }
    
    // Support both "Bearer TOKEN" and just "TOKEN"
    if (authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }
    
    return authHeader;
}

/**
 * Decode and verify JWT token
 */
export function decodeToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error("JWT decode error:", error);
        return null;
    }
}

/**
 * Attach JWT token to axios request config headers
 */
export function attachTokenToHeaders(
    requestConfig: any,
    token: string
): any {
    if (!requestConfig.headers) {
        requestConfig.headers = {};
    }
    
    requestConfig.headers.Authorization = `Bearer ${token}`;
    return requestConfig;
}

/**
 * Extract wallet address from request (via JWT)
 */
export function getWalletFromRequest(req: Request): string | null {
    const token = getTokenFromHeader(req);
    
    if (!token) {
        return null;
    }
    
    const payload = decodeToken(token);
    return payload?.wallet || null;
}

/**
 * Verify token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
    const payload = decodeToken(token);
    return payload !== null;
}
