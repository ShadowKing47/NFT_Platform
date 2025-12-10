import {ethers} from "ether";

export function verifyEthreumSignature(message: string, signature:string){
    const recovered = ethers.verifyMessage(message,signature);
    return recovered.toLowerCase();
}

export function verifyHederaSignature(){
    //Add signature verification
    return true;
}