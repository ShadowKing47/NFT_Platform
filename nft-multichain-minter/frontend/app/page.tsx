"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useUploadAndPrepare } from "../hooks/useUploadAndPrepare";
import { useEthereumMint } from "../hooks/useEthereumMint";
import { useHederaMint } from "../hooks/useHederaMint";
import { ToastProvider, useToast } from "../components/ToastProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

// NFT Contract ABI (minimal - just mintTo function)
const NFT_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "mintTo",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function MintPageContent() {
  const router = useRouter();
  const { isLoggedIn, walletAddress, chain, loginEthereum, loginHedera } = useAuth();
  const { showToast } = useToast();

  const [selectedChain, setSelectedChain] = useState<"ethereum" | "hedera">("ethereum");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    attributes: [] as Array<{ trait_type: string; value: string }>,
  });
  const [mintState, setMintState] = useState<"idle" | "minting" | "success">("idle");
  const [mintResult, setMintResult] = useState<any>(null);

  const uploadHook = useUploadAndPrepare();
  const ethereumMintHook = useEthereumMint();
  const hederaMintHook = useHederaMint();

  const canMint =
    isLoggedIn &&
    selectedFile &&
    metadata.name.trim() &&
    metadata.description.trim();

  const handleMint = async () => {
    if (!canMint || !walletAddress) {
      showToast("Please complete all required fields", "error");
      return;
    }

    setMintState("minting");

    try {
      if (selectedChain === "ethereum") {
        // Ethereum Flow: Upload & Prepare → Mint
        showToast("Preparing NFT data...", "info");

        const prepareResult = await uploadHook.uploadAndPrepare({
          file: selectedFile!,
          name: metadata.name,
          description: metadata.description,
          walletAddress,
          attributes: metadata.attributes,
        });

        if (!prepareResult) {
          throw new Error(uploadHook.error || "Failed to prepare NFT");
        }

        showToast("Minting on Ethereum...", "info");

        const contractAddress = process.env.NEXT_PUBLIC_ETH_CONTRACT_ADDRESS!;
        
        const txHash = await ethereumMintHook.mint({
          tokenUri: prepareResult.tokenUri,
          recipientAddress: walletAddress,
          contractAddress,
          contractAbi: NFT_CONTRACT_ABI,
        });

        if (!txHash) {
          throw new Error(ethereumMintHook.error || "Ethereum minting failed");
        }

        setMintResult({
          chain: "ethereum",
          txHash,
          imageUrl: prepareResult.imageIpfsUri,
          tokenUri: prepareResult.tokenUri,
          metadata: prepareResult.metadata,
        });

        showToast("NFT minted successfully on Ethereum!", "success");
      } else {
        // Hedera Flow: All-in-one backend call
        showToast("Minting on Hedera...", "info");

        const result = await hederaMintHook.mint({
          file: selectedFile!,
          name: metadata.name,
          description: metadata.description,
          userAccountId: walletAddress,
          attributes: metadata.attributes,
        });

        if (!result) {
          throw new Error(hederaMintHook.error || "Hedera minting failed");
        }

        setMintResult({
          chain: "hedera",
          tokenId: result.tokenId,
          serialNumber: result.serialNumber,
          imageUrl: result.imageIpfsUri,
          tokenUri: result.metadataIpfsUri,
          metadata: result.metadata,
        });

        showToast("NFT minted successfully on Hedera!", "success");
      }

      setMintState("success");
    } catch (error: any) {
      console.error("Mint error:", error);
      showToast(error.message || "Minting failed", "error");
      setMintState("idle");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setMetadata({ name: "", description: "", attributes: [] });
    setMintState("idle");
    setMintResult(null);
    uploadHook.reset();
    ethereumMintHook.reset();
    hederaMintHook.reset();
  };

  const getProgressSteps = () => {
    if (selectedChain === "ethereum") {
      const uploadActive = uploadHook.isUploading;
      const mintActive = ethereumMintHook.isMinting;

      return [
        {
          label: "Upload",
          status: uploadHook.progress.uploading
            ? "completed"
            : uploadActive
            ? "active"
            : "pending",
        },
        {
          label: "IPFS: Image",
          status: uploadHook.progress.ipfsImage
            ? "completed"
            : uploadActive
            ? "active"
            : "pending",
        },
        {
          label: "IPFS: Metadata",
          status: uploadHook.progress.ipfsMetadata
            ? "completed"
            : uploadActive || mintActive
            ? "active"
            : "pending",
        },
        {
          label: "Minting",
          status: ethereumMintHook.progress.confirmed
            ? "completed"
            : mintActive
            ? "active"
            : "pending",
        },
        {
          label: "Complete",
          status: mintState === "success" ? "completed" : "pending",
        },
      ];
    } else {
      const mintActive = hederaMintHook.isMinting;

      return [
        {
          label: "Upload",
          status: hederaMintHook.progress.uploading ? "completed" : mintActive ? "active" : "pending",
        },
        {
          label: "IPFS: Image",
          status: hederaMintHook.progress.ipfsImage ? "completed" : mintActive ? "active" : "pending",
        },
        {
          label: "IPFS: Metadata",
          status: hederaMintHook.progress.ipfsMetadata ? "completed" : mintActive ? "active" : "pending",
        },
        {
          label: "Minting",
          status: hederaMintHook.progress.minting ? "completed" : mintActive ? "active" : "pending",
        },
        {
          label: "Complete",
          status: hederaMintHook.progress.complete ? "completed" : "pending",
        },
      ];
    }
  };

  if (mintState === "success" && mintResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <MintSuccess
          chain={mintResult.chain}
          imageUrl={mintResult.imageUrl}
          metadata={mintResult.metadata}
          tokenId={mintResult.tokenId}
          serialNumber={mintResult.serialNumber}
          txHash={mintResult.txHash}
          tokenUri={mintResult.tokenUri}
          onMintAnother={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            NFT Multichain Minter
          </h1>
          <p className="text-xl text-gray-600">
            Mint your NFTs on Ethereum or Hedera
          </p>
        </div>

        {/* Auth Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <WalletAuthButton />
        </div>

        {/* Main Content */}
        {isLoggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Create Your NFT
                </h2>

                <div className="space-y-6">
                  <ChainSelector
                    selectedChain={selectedChain}
                    onChainSelect={setSelectedChain}
                  />

                  <UploadDropzone
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                  />

                  <MetadataForm onChange={setMetadata} />

                  <button
                    onClick={handleMint}
                    disabled={!canMint || mintState === "minting"}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-lg"
                  >
                    {mintState === "minting" ? (
                      <div className="flex items-center justify-center gap-3">
                        <LoadingSpinner size="sm" />
                        <span>Minting...</span>
                      </div>
                    ) : (
                      "Mint NFT"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Preview
                </h2>
                <NftPreview
                  file={selectedFile}
                  metadata={
                    metadata.name || metadata.description
                      ? metadata
                      : null
                  }
                />
              </div>

              {/* Progress */}
              {mintState === "minting" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Minting Progress
                  </h3>
                  <ProgressSteps steps={getProgressSteps()} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600">
              Please connect your wallet to start minting NFTs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <MintPageContent />
    </ToastProvider>
  );
}
