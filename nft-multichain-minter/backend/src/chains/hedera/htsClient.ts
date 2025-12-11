import {
    Client,
    AccountId,
    PrivateKey,
} from "@hashgraph/sdk";

import {config as loadEnv} from "dotenv";

loadEnv();

const HEDERA_NETWORK = process.env.HEDERA_NETWORK || "testnet";
const HEDERA_OPERATOR_ID = process.env.HEDERA_OPERATOR_ID || "";
const HEDERA_OPERATOR_KEY = process.env.HEDERA_OPERATOR_KEY || "";

let client: Client | null = null;

export function getHederaClient(): Client {
    if(client) return client;

    if(!HEDERA_OPERATOR_ID || !HEDERA_OPERATOR_KEY){
        throw new Error("Hedera operator credentials are not configured");
    }

    const operatorId = AccountId.fromString(HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(HEDERA_OPERATOR_KEY);

    client = 
        HEDERA_NETWORK === "mainnet"
        ? Client.forMainnet()
        : HEDERA_NETWORK === "previewnet"
        ? Client.forPreviewnet()
        : Client.forTestnet();

    client.setOperator(operatorId, operatorKey);
    return client;    
}

export const hederaClient = getHederaClient();

export function getOperatorAccountId(): AccountId | null{
    if(!HEDERA_OPERATOR_ID) return null;
    return AccountId.fromString(HEDERA_OPERATOR_ID);
}