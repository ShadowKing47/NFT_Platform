"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nonceService_1 = require("../../auth/nonceService");
const validation_1 = require("../../utils/validation");
const auditLog_1 = require("../../utils/auditLog");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { wallet } = req.body;
    const requestId = req.id || "unknown";
    // Validate wallet address
    if (!wallet || typeof wallet !== "string" || wallet.trim().length === 0) {
        return res.status(400).json({ error: "Valid wallet address is required" });
    }
    // Strict Ethereum address validation
    if (!(0, validation_1.isValidEthereumAddress)(wallet)) {
        (0, auditLog_1.logAuthEvent)(requestId, wallet, "nonce_generated", false, "Invalid address format");
        return res.status(400).json({ error: "Invalid Ethereum address format" });
    }
    const normalizedWallet = (0, validation_1.normalizeEthereumAddress)(wallet);
    const nonce = (0, nonceService_1.generateNonce)();
    await (0, nonceService_1.storeNonce)(normalizedWallet, nonce);
    (0, auditLog_1.logAuthEvent)(requestId, normalizedWallet, "nonce_generated", true);
    return res.json({ nonce });
});
exports.default = router;
//# sourceMappingURL=nonce.js.map