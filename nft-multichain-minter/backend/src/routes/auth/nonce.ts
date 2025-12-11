import { Router } from "express";
import { generateNonce, storeNonce } from "../../auth/nonceService";
import { isValidEthereumAddress, normalizeEthereumAddress } from "../../utils/validation";
import { logAuthEvent } from "../../utils/auditLog";

const router = Router();

router.post("/", async (req, res) => {
    const { wallet } = req.body;
    const requestId = req.id || "unknown";

    // Validate wallet address
    if (!wallet || typeof wallet !== "string" || wallet.trim().length === 0) {
        return res.status(400).json({ error: "Valid wallet address is required" });
    }
    
    // Strict Ethereum address validation
    if (!isValidEthereumAddress(wallet)) {
        logAuthEvent(requestId, wallet, "nonce_generated", false, "Invalid address format");
        return res.status(400).json({ error: "Invalid Ethereum address format" });
    }

    const normalizedWallet = normalizeEthereumAddress(wallet);
    const nonce = generateNonce();
    await storeNonce(normalizedWallet, nonce);

    logAuthEvent(requestId, normalizedWallet, "nonce_generated", true);
    return res.json({ nonce });
});

export default router;
