import { ethers } from "ethers";

export async function signMessageEthereum(
  message: string,
  signer: ethers.Signer
): Promise<string> {
  const signature = await signer.signMessage(message);
  return signature;
}

export async function signMessageHedera(
  message: string,
  accountId: string,
  hashconnect: any
): Promise<string> {
  // HashPack message signing
  const messageBytes = new TextEncoder().encode(message);
  
  const signResult = await hashconnect.sign(
    accountId,
    messageBytes
  );
  
  return signResult.signature;
}
