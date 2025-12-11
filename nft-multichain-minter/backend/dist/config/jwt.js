"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromHeader = getTokenFromHeader;
exports.decodeToken = decodeToken;
exports.attachTokenToHeaders = attachTokenToHeaders;
exports.getWalletFromRequest = getWalletFromRequest;
exports.isTokenValid = isTokenValid;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("./env"));
/**
 * Extract JWT token from request header
 */
function getTokenFromHeader(req) {
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
function decodeToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtSecret);
        return decoded;
    }
    catch (error) {
        console.error("JWT decode error:", error);
        return null;
    }
}
/**
 * Attach JWT token to axios request config headers
 */
function attachTokenToHeaders(requestConfig, token) {
    if (!requestConfig.headers) {
        requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = `Bearer ${token}`;
    return requestConfig;
}
/**
 * Extract wallet address from request (via JWT)
 */
function getWalletFromRequest(req) {
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
function isTokenValid(token) {
    const payload = decodeToken(token);
    return payload !== null;
}
//# sourceMappingURL=jwt.js.map