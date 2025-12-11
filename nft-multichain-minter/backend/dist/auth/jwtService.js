"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueJwt = issueJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const JWT_SECRET = env_1.default.jwtSecret;
/**
 * Issue JWT token for authenticated wallet
 * Token expires in 2 hours
 */
function issueJwt(wallet) {
    return jsonwebtoken_1.default.sign({ wallet }, JWT_SECRET, { expiresIn: "2h" });
}
/**
 * Verify JWT token with clock tolerance
 * Returns decoded payload or throws error
 */
function verifyJwt(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
        clockTolerance: 5 // 5 seconds tolerance for clock drift
    });
}
//# sourceMappingURL=jwtService.js.map