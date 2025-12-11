"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nonceService_1 = require("../../auth/nonceService");
const signatureService_1 = require("../../auth/signatureService");
const jwtService_1 = require("../../auth/jwtService");
const validation_1 = require("../../utils/validation");
const auditLog_1 = require("../../utils/auditLog");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { wallet, signature } = req.body;
    const requestId = req.id || "unknown";
    // Validate wallet address
    if (!wallet || typeof wallet !== "string" || !(0, validation_1.isValidEthereumAddress)(wallet)) {
        (0, auditLog_1.logAuthEvent)(requestId, wallet || "unknown", "auth_failed", false, "Invalid wallet address");
        return res.status(400).json({ error: "Valid wallet address is required" });
    }
    // Validate signature - reject empty signatures
    if (!signature || typeof signature !== "string" || signature.trim().length === 0) {
        (0, auditLog_1.logAuthEvent)(requestId, wallet, "auth_failed", false, "Empty signature");
        return res.status(400).json({ error: "Valid signature is required" });
    }
    // Normalize wallet address for consistent lookups
    const normalizedWallet = (0, validation_1.normalizeEthereumAddress)(wallet);
    const nonce = await (0, nonceService_1.getNonce)(normalizedWallet);
    if (!nonce) {
        (0, auditLog_1.logAuthEvent)(requestId, normalizedWallet, "auth_failed", false, "Nonce not found or expired");
        return res.status(400).json({ error: "Nonce not found or expired" });
    }
    const message = `Sign this message to authenticate: ${nonce}`;
    try {
        // Verify signature with case-insensitive address comparison
        const valid = (0, signatureService_1.verifyEthereumSignature)(message, signature, wallet);
        if (!valid) {
            await (0, nonceService_1.deleteNonce)(normalizedWallet);
            (0, auditLog_1.logAuthEvent)(requestId, normalizedWallet, "signature_verified", false, "Invalid signature");
            return res.status(401).json({ error: "Invalid signature" });
        }
        // Delete nonce immediately to prevent replay attacks
        await (0, nonceService_1.deleteNonce)(normalizedWallet);
        (0, auditLog_1.logAuthEvent)(requestId, normalizedWallet, "signature_verified", true);
        const jwt = (0, jwtService_1.issueJwt)(normalizedWallet);
        // Set JWT in httpOnly cookie for XSS protection
        res.cookie("token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });
        (0, auditLog_1.logAuthEvent)(requestId, normalizedWallet, "jwt_issued", true);
        // Also return token for compatibility with existing frontend
        return res.json({ token: jwt });
    }
    catch (error) {
        // Delete nonce even on failure to prevent replay attacks
        await (0, nonceService_1.deleteNonce)(normalizedWallet);
        (0, auditLog_1.logAuthEvent)(requestId, normalizedWallet, "auth_failed", false, error.message);
        return res.status(401).json({ error: "Signature verification failed" });
    }
});
exports.default = router;
//# sourceMappingURL=verify.js.map