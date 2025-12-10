import redisClient from "../config/redis";
import { randomBytes} from "crypto";

export async function generateNonce(wallet: string){
    const nonce = randomBytes(16).toString("hex");
    await redisClient.set(`nonce:${wallet}`,nonce, {EX:300});
    return nonce;
}

export async function getNonce(wallet: string){
    return redisClient.get(`nonce:${wallet}`);
}

export async function deleteNonce(wallet: string){
    return redisClinet.del(`nonce:%{wallet}`);
}