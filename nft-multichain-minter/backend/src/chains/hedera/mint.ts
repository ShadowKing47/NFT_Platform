import {
    TokenId,
    TokenMintTransaction,
    TransferTransaction,
    AccountId
} from "@hashgraph/sdk";

import {getHederaClient, getOperatorAccountId} from "./htsClient";

const HEDERA_NFT_TOKEN_ID = process.env.HEDERA_NFT_TOKEN_ID || "";

if (!HEDERA_NFT_TOKEN_ID){
    console.warn("HEDERA_NFT_TOKEN_ID is not set. Hedera NFT minting will not work until configured");
}

export interface HederaMintResult {
    tokenId: string;
    serialNumber: number;
}

export async function mintHederaNftToUser(params: {
    userAccountId: string; 
    metadataIpfsUri: string;
}): Promise<HederaMintResult> {
    const client = getHederaClient();
    const operatorAccountId = getOperatorAccountId();

    if(!operatorAccountId){
        throw new Error("Hedera operator account is not configured.");
    }

    if(!HEDERA_NFT_TOKEN_ID){
        throw new Error("HEDERA_NFT_TOKEN_ID env var is not set");
    }

    const tokenId = TokenId.fromString(HEDERA_NFT_TOKEN_ID);
    const userId = AccountId.fromString(params.userAccountId);

    const metadataBytes = Buffer.from(params.metadataIpfsUri, "utf8");

    const mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .addMetadata(metadataBytes)
        .freezeWith(client)
        .sign(client._operatorPublicKey ? undefined as any : undefined);

    const mintTxSubmit = await mintTx.execute(client);
    const mintRx = await mintTxSubmit.getReceipt(client);


    const serials = mintRx.serials;
    if (!serials || serials.length === 0){
        throw new Error("No serial number from mint transaction.");
    }

    const serialNumber = Number(serials[0].toString());

    const transferTx = await new TransferTransaction()
    .addNftTransfer(tokenId, serialNumber, operatorAccountId, userId)
    .freezeWith(client)
    .execute(client);

    await transferTx.getReceipt(client);

    return {
        tokenId: tokenId.toString(),
        serialNumber,
    };

}