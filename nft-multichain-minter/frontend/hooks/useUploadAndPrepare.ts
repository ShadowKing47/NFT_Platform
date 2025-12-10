"use client";

import { useState } from "react";
import { ethereumAPI } from "../lib/apiClient";

interface UploadParams {
  file: File;
  name: string;
  description: string;
  walletAddress: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

interface UploadResult {
  tokenUri: string;
  imageIpfsUri: string;
  metadata: any;
}

export function useUploadAndPrepare() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({
    uploading: false,
    ipfsImage: false,
    ipfsMetadata: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const uploadAndPrepare = async (params: UploadParams): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);
    setProgress({ uploading: true, ipfsImage: false, ipfsMetadata: false });

    try {
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("name", params.name);
      formData.append("description", params.description);
      formData.append("walletAddress", params.walletAddress);

      if (params.attributes && params.attributes.length > 0) {
        formData.append("attributes", JSON.stringify(params.attributes));
      }

      setProgress({ uploading: true, ipfsImage: true, ipfsMetadata: false });

      const response = await ethereumAPI.prepareMint(formData);

      setProgress({ uploading: true, ipfsImage: true, ipfsMetadata: true });

      const resultData = {
        tokenUri: response.data.tokenUri,
        imageIpfsUri: response.data.imageIpfsUri,
        metadata: response.data.metadata,
      };

      setResult(resultData);
      return resultData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Upload failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress({ uploading: false, ipfsImage: false, ipfsMetadata: false });
    setError(null);
    setResult(null);
  };

  return {
    uploadAndPrepare,
    isUploading,
    progress,
    error,
    result,
    reset,
  };
}
