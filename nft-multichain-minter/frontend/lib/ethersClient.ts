import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.Signer | null> {
  const provider = await getProvider();
  if (!provider) return null;
  return provider.getSigner();
}

export async function connectMetaMask(): Promise<string | null> {
  try {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return null;
    }

    const provider = await getProvider();
    if (!provider) return null;

    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0] || null;
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return null;
  }
}

export async function getConnectedAddress(): Promise<string | null> {
  try {
    const provider = await getProvider();
    if (!provider) return null;

    const accounts = await provider.send("eth_accounts", []);
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting connected address:", error);
    return null;
  }
}
