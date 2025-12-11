import {Router} from "express";
import { getNonce, deleteNonce } from "../../auth/nonceService";
import { verifyEthereumSignature } from "../../auth/signatureService";
import { issueJwt } from "../../auth/jwtService";

const router = Router();

router.post("/", async(req,res)=> {
    const {wallet,signature} = req.body;

    if(!wallet || !signature)
        return res.status(400).json({error: "wallet and signature required"});

    const nonce = await getNonce(wallet);
    if (!nonce) return res.status(400).json({error: "Invalid signature"});

    await deleteNonce(wallet);

    const jwt = issueJwt(wallet);
    res.json({token:jwt});
});

export default router;