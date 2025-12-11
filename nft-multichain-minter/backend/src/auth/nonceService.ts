import redisClient from "../config/redis";
import { randomBytes} from "crypto";

export function generateNonce(): string {
    return randomBytes(16).toString("hex");
}

export async function storeNonce(wallet: string, nonce: string): Promise<void> {
    await redisClient.set(`nonce:${wallet}`, nonce, "EX", 300);
}

export async function getNonce(wallet: string): Promise<string | null> {
    return redisClient.get(`nonce:${wallet}`);
}

export async function deleteNonce(wallet: string): Promise<number> {
    return redisClient.del(`nonce:${wallet}`);
}