import { Router } from "express";
import { generateNonce, storeNonce } from "../../auth/nonceService";

const router = Router();

router.post("/", async (req, res) => {
    const { wallet } = req.body;

    if (!wallet) {
        return res.status(400).json({ error: "wallet is required" });
    }

    const nonce = generateNonce();
    await storeNonce(wallet, nonce);

    res.json({ nonce });
});

export default router;
