import { Router } from "express";
import { getNonce, deleteNonce } from "../../auth/nonceService";
import { verifyEthereumSignature } from "../../auth/signatureService";
import { issueJwt } from "../../auth/jwtService";
import { isValidEthereumAddress, normalizeEthereumAddress } from "../../utils/validation";
import { logAuthEvent } from "../../utils/auditLog";

const router = Router();

router.post("/", async (req, res) => {
    const { wallet, signature } = req.body;
    const requestId = req.id || "unknown";

    // Validate wallet address
    if (!wallet || typeof wallet !== "string" || !isValidEthereumAddress(wallet)) {
        logAuthEvent(requestId, wallet || "unknown", "auth_failed", false, "Invalid wallet address");
        return res.status(400).json({ error: "Valid wallet address is required" });
    }

    // Validate signature - reject empty signatures
    if (!signature || typeof signature !== "string" || signature.trim().length === 0) {
        logAuthEvent(requestId, wallet, "auth_failed", false, "Empty signature");
        return res.status(400).json({ error: "Valid signature is required" });
    }

    // Normalize wallet address for consistent lookups
    const normalizedWallet = normalizeEthereumAddress(wallet);

    const nonce = await getNonce(normalizedWallet);
    if (!nonce) {
        logAuthEvent(requestId, normalizedWallet, "auth_failed", false, "Nonce not found or expired");
        return res.status(400).json({ error: "Nonce not found or expired" });
    }

    const message = `Sign this message to authenticate: ${nonce}`;

    try {
        // Verify signature with case-insensitive address comparison
        const valid = verifyEthereumSignature(message, signature, wallet);

        if (!valid) {
            await deleteNonce(normalizedWallet);
            logAuthEvent(requestId, normalizedWallet, "signature_verified", false, "Invalid signature");
            return res.status(401).json({ error: "Invalid signature" });
        }

        // Delete nonce immediately to prevent replay attacks
        await deleteNonce(normalizedWallet);
        logAuthEvent(requestId, normalizedWallet, "signature_verified", true);

        const jwt = issueJwt(normalizedWallet);
        
        // Set JWT in httpOnly cookie for XSS protection
        res.cookie("token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });

        logAuthEvent(requestId, normalizedWallet, "jwt_issued", true);
        
        // Also return token for compatibility with existing frontend
        return res.json({ token: jwt });
    } catch (error: any) {
        // Delete nonce even on failure to prevent replay attacks
        await deleteNonce(normalizedWallet);
        logAuthEvent(requestId, normalizedWallet, "auth_failed", false, error.message);
        return res.status(401).json({ error: "Signature verification failed" });
    }
});

export default router;