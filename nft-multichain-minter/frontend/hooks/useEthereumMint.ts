"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getSigner } from "../lib/ethersClient";

interface MintParams {
  tokenUri: string;
  recipientAddress: string;
  contractAddress: string;
  contractAbi: any[];
}

export function useEthereumMint() {
  const [isMinting, setIsMinting] = useState(false);
  const [progress, setProgress] = useState({
    preparingContract: false,
    minting: false,
    confirmed: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mint = async (params: MintParams): Promise<string | null> => {
    setIsMinting(true);
    setError(null);
    setProgress({ preparingContract: true, minting: false, confirmed: false });

    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error("Failed to get signer. Please connect your wallet.");
      }

      const contract = new ethers.Contract(
        params.contractAddress,
        params.contractAbi,
        signer
      );

      setProgress({ preparingContract: true, minting: true, confirmed: false });

      // Call mintTo function
      const tx = await contract.mintTo(params.recipientAddress, params.tokenUri);
      setTxHash(tx.hash);

      // Wait for confirmation
      await tx.wait();

      setProgress({ preparingContract: true, minting: true, confirmed: true });

      return tx.hash;
    } catch (err: any) {
      const errorMessage =
        err.reason || err.message || "Minting failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsMinting(false);
    }
  };

  const reset = () => {
    setIsMinting(false);
    setProgress({ preparingContract: false, minting: false, confirmed: false });
    setError(null);
    setTxHash(null);
  };

  return {
    mint,
    isMinting,
    progress,
    error,
    txHash,
    reset,
  };
}
