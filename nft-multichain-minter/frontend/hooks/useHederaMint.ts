"use client";

import { useState } from "react";
import { hederaAPI } from "../lib/apiClient";

interface HederaMintParams {
  file: File;
  name: string;
  description: string;
  userAccountId: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface HederaMintResult {
  tokenId: string;
  serialNumber: number;
  imageIpfsUri: string;
  metadataIpfsUri: string;
  metadata: any;
}

export function useHederaMint() {
  const [isMinting, setIsMinting] = useState(false);
  const [progress, setProgress] = useState({
    uploading: false,
    ipfsImage: false,
    ipfsMetadata: false,
    minting: false,
    complete: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HederaMintResult | null>(null);

  const mint = async (params: HederaMintParams): Promise<HederaMintResult | null> => {
    setIsMinting(true);
    setError(null);
    setProgress({
      uploading: true,
      ipfsImage: false,
      ipfsMetadata: false,
      minting: false,
      complete: false,
    });

    try {
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("name", params.name);
      formData.append("description", params.description);
      formData.append("userAccountId", params.userAccountId);

      if (params.attributes && params.attributes.length > 0) {
        formData.append("attributes", JSON.stringify(params.attributes));
      }

      setProgress((prev) => ({ ...prev, ipfsImage: true }));

      // Backend handles all steps
      const response = await hederaAPI.mint(formData);

      setProgress({
        uploading: true,
        ipfsImage: true,
        ipfsMetadata: true,
        minting: true,
        complete: true,
      });

      const mintResult = {
        tokenId: response.data.tokenId,
        serialNumber: response.data.serialNumber,
        imageIpfsUri: response.data.imageIpfsUri,
        metadataIpfsUri: response.data.metadataIpfsUri,
        metadata: response.data.metadata,
      };

      setResult(mintResult);
      return mintResult;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Hedera minting failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsMinting(false);
    }
  };

  const reset = () => {
    setIsMinting(false);
    setProgress({
      uploading: false,
      ipfsImage: false,
      ipfsMetadata: false,
      minting: false,
      complete: false,
    });
    setError(null);
    setResult(null);
  };

  return {
    mint,
    isMinting,
    progress,
    error,
    result,
    reset,
  };
}
