"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintHederaNftToUser = mintHederaNftToUser;
const sdk_1 = require("@hashgraph/sdk");
const htsClient_1 = require("./htsClient");
const HEDERA_NFT_TOKEN_ID = process.env.HEDERA_NFT_TOKEN_ID || "";
if (!HEDERA_NFT_TOKEN_ID) {
    console.warn("HEDERA_NFT_TOKEN_ID is not set. Hedera NFT minting will not work until configured");
}
async function mintHederaNftToUser(params) {
    const client = (0, htsClient_1.getHederaClient)();
    const operatorAccountId = (0, htsClient_1.getOperatorAccountId)();
    if (!operatorAccountId) {
        throw new Error("Hedera operator account is not configured.");
    }
    if (!HEDERA_NFT_TOKEN_ID) {
        throw new Error("HEDERA_NFT_TOKEN_ID env var is not set");
    }
    const tokenId = sdk_1.TokenId.fromString(HEDERA_NFT_TOKEN_ID);
    const userId = sdk_1.AccountId.fromString(params.userAccountId);
    const metadataBytes = Buffer.from(params.metadataIpfsUri, "utf8");
    const mintTx = await new sdk_1.TokenMintTransaction()
        .setTokenId(tokenId)
        .addMetadata(metadataBytes)
        .freezeWith(client);
    const mintTxSubmit = await mintTx.execute(client);
    const mintRx = await mintTxSubmit.getReceipt(client);
    const serials = mintRx.serials;
    if (!serials || serials.length === 0) {
        throw new Error("No serial number from mint transaction.");
    }
    const serialNumber = Number(serials[0].toString());
    const transferTx = await new sdk_1.TransferTransaction()
        .addNftTransfer(tokenId, serialNumber, operatorAccountId, userId)
        .freezeWith(client)
        .execute(client);
    await transferTx.getReceipt(client);
    return {
        tokenId: tokenId.toString(),
        serialNumber,
    };
}
//# sourceMappingURL=mint.js.map