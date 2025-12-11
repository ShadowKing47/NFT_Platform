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
  hederaWallet: any
): Promise<string> {
  // Sign using WalletConnect
  const signature = await hederaWallet.signMessage(message);
  return signature;
}
