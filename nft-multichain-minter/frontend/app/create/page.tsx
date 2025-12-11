"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUploadAndPrepare } from "@/hooks/useUploadAndPrepare";
import { useEthereumMint } from "@/hooks/useEthereumMint";
import { useHederaMint } from "@/hooks/useHederaMint";
import { ToastProvider, useToast } from "@/components/ToastProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

// NFT Contract ABI
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

interface Attribute {
  trait_type: string;
  value: string;
}

function CreateNFTPageContent() {
  const router = useRouter();
  const { isLoggedIn, walletAddress, chain } = useAuth();
  const { showToast } = useToast();

  const [selectedChain, setSelectedChain] = useState<"ethereum" | "hedera">("ethereum");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("");
  const [royalties, setRoyalties] = useState("10");
  const [supply, setSupply] = useState("1");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newTraitType, setNewTraitType] = useState("");
  const [newTraitValue, setNewTraitValue] = useState("");
  
  const [mintState, setMintState] = useState<"idle" | "minting" | "success">("idle");
  const [mintResult, setMintResult] = useState<any>(null);

  const uploadHook = useUploadAndPrepare();
  const ethereumMintHook = useEthereumMint();
  const hederaMintHook = useHederaMint();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        showToast("File size must be less than 100MB", "error");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddAttribute = () => {
    if (newTraitType.trim() && newTraitValue.trim()) {
      setAttributes([...attributes, { trait_type: newTraitType.trim(), value: newTraitValue.trim() }]);
      setNewTraitType("");
      setNewTraitValue("");
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const canMint = isLoggedIn && selectedFile && name.trim() && description.trim();

  const handleMint = async () => {
    if (!canMint || !walletAddress) {
      showToast("Please complete all required fields", "error");
      return;
    }

    setMintState("minting");

    try {
      if (selectedChain === "ethereum") {
        showToast("Preparing NFT data...", "info");

        const prepareResult = await uploadHook.uploadAndPrepare({
          file: selectedFile!,
          name,
          description,
          walletAddress,
          attributes,
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
        showToast("Minting on Hedera...", "info");

        const result = await hederaMintHook.mint({
          file: selectedFile!,
          name,
          description,
          userAccountId: walletAddress,
          attributes,
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
    setPreviewUrl("");
    setName("");
    setDescription("");
    setCollection("");
    setRoyalties("10");
    setSupply("1");
    setAttributes([]);
    setMintState("idle");
    setMintResult(null);
    uploadHook.reset();
    ethereumMintHook.reset();
    hederaMintHook.reset();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  // Success State
  if (mintState === "success" && mintResult) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
        <Header />
        <main className="flex-grow w-full px-6 py-8 flex justify-center">
          <div className="max-w-[600px] w-full flex flex-col items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-6xl filled-icon">
                check_circle
              </span>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-black text-text-main-light dark:text-white mb-4">
                NFT Minted Successfully!
              </h1>
              <p className="text-text-sec-light dark:text-text-sec-dark text-lg">
                Your NFT has been created on {mintResult.chain === "ethereum" ? "Ethereum" : "Hedera"}
              </p>
            </div>

            <div className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${previewUrl})` }} />
              <div className="p-6">
                <h3 className="text-2xl font-black text-text-main-light dark:text-white mb-2">{name}</h3>
                <p className="text-text-sec-light dark:text-text-sec-dark mb-4">{description}</p>
                
                {mintResult.chain === "ethereum" ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-sec-light dark:text-text-sec-dark text-sm">Transaction Hash</span>
                      <span className="text-primary font-mono text-sm">{mintResult.txHash?.slice(0, 10)}...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-sec-light dark:text-text-sec-dark text-sm">Token ID</span>
                      <span className="text-primary font-mono text-sm">{mintResult.tokenId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-sec-light dark:text-text-sec-dark text-sm">Serial Number</span>
                      <span className="text-primary font-mono text-sm">{mintResult.serialNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>View Dashboard</span>
              </Link>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-border-light dark:border-border-dark hover:border-primary text-text-main-light dark:text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create Another</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-grow w-full px-6 py-8 flex justify-center">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="text-text-sec-light dark:text-text-sec-dark">/</span>
            <span className="text-text-main-light dark:text-white font-medium">Create NFT</span>
          </nav>

          {/* Header */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main-light dark:text-white mb-2">
              Create New NFT
            </h1>
            <p className="text-text-sec-light dark:text-text-sec-dark">
              Upload your artwork and mint it as an NFT on the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Upload & Preview */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Upload Section */}
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold text-lg mb-4">
                  <span className="material-symbols-outlined">upload</span>
                  Upload File
                </h3>

                <div
                  className={`relative group w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed transition-all ${
                    selectedFile
                      ? "border-primary bg-primary/5"
                      : "border-border-light dark:border-border-dark hover:border-primary bg-background-light dark:bg-background-dark"
                  }`}
                >
                  {previewUrl ? (
                    <>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${previewUrl})` }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <span className="flex items-center gap-2 bg-white/90 text-gray-900 font-bold py-3 px-6 rounded-lg">
                            <span className="material-symbols-outlined">swap_horiz</span>
                            Change File
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="material-symbols-outlined text-primary text-6xl mb-4">
                        cloud_upload
                      </span>
                      <p className="text-text-main-light dark:text-white font-bold mb-2">
                        Drop files here or click to upload
                      </p>
                      <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                        PNG, JPG, GIF, MP4 (Max 100MB)
                      </p>
                    </label>
                  )}
                </div>

                {selectedFile && (
                  <div className="mt-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">description</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-main-light dark:text-white text-sm font-bold truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-text-sec-light dark:text-text-sec-dark text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chain Selector */}
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold text-lg mb-4">
                  <span className="material-symbols-outlined">link</span>
                  Blockchain
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedChain("ethereum")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedChain === "ethereum"
                        ? "border-primary bg-primary/10"
                        : "border-border-light dark:border-border-dark hover:border-primary"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl">currency_bitcoin</span>
                      <span className="font-bold text-text-main-light dark:text-white">Ethereum</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedChain("hedera")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedChain === "hedera"
                        ? "border-primary bg-primary/10"
                        : "border-border-light dark:border-border-dark hover:border-primary"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl">token</span>
                      <span className="font-bold text-text-main-light dark:text-white">Hedera</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Details Form */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Basic Info */}
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold text-lg mb-6">
                  <span className="material-symbols-outlined">edit</span>
                  Details
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter NFT name"
                      className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your NFT"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                    />
                    <p className="text-text-sec-light dark:text-text-sec-dark text-xs mt-1">
                      {description.length}/1000 characters
                    </p>
                  </div>

                  {/* Collection */}
                  <div>
                    <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                      Collection
                    </label>
                    <input
                      type="text"
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                      placeholder="Enter collection name (optional)"
                      className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>

                  {/* Royalties & Supply Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                        Royalties (%)
                      </label>
                      <input
                        type="number"
                        value={royalties}
                        onChange={(e) => setRoyalties(e.target.value)}
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                        Supply
                      </label>
                      <input
                        type="number"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        min="1"
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold text-lg mb-6">
                  <span className="material-symbols-outlined">tune</span>
                  Properties
                </h3>

                <div className="space-y-4">
                  {/* Add Property Form */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newTraitType}
                      onChange={(e) => setNewTraitType(e.target.value)}
                      placeholder="Trait type (e.g. Color)"
                      className="flex-1 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                    <input
                      type="text"
                      value={newTraitValue}
                      onChange={(e) => setNewTraitValue(e.target.value)}
                      placeholder="Value (e.g. Blue)"
                      className="flex-1 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                    <button
                      onClick={handleAddAttribute}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>

                  {/* Properties List */}
                  {attributes.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {attributes.map((attr, idx) => (
                        <div
                          key={idx}
                          className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-primary text-xs font-bold uppercase mb-1">
                              {attr.trait_type}
                            </p>
                            <p className="text-text-main-light dark:text-white text-sm font-medium truncate">
                              {attr.value}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveAttribute(idx)}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={!canMint || mintState === "minting"}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25"
              >
                {mintState === "minting" ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Minting NFT...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span>Mint NFT</span>
                  </>
                )}
              </button>

              {/* Minting Progress */}
              {mintState === "minting" && (
                <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                  <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold mb-4">
                    <span className="material-symbols-outlined">progress_activity</span>
                    Minting Progress
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedChain === "ethereum" ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            uploadHook.progress.uploading ? "bg-green-500/20" : "bg-primary/20"
                          }`}>
                            {uploadHook.progress.uploading ? (
                              <span className="material-symbols-outlined text-green-500 text-sm filled-icon">check</span>
                            ) : (
                              <LoadingSpinner size="sm" />
                            )}
                          </div>
                          <span className="text-text-main-light dark:text-white">Uploading file...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            uploadHook.progress.ipfsImage ? "bg-green-500/20" : "bg-border-light dark:bg-border-dark"
                          }`}>
                            {uploadHook.progress.ipfsImage && (
                              <span className="material-symbols-outlined text-green-500 text-sm filled-icon">check</span>
                            )}
                          </div>
                          <span className="text-text-sec-light dark:text-text-sec-dark">Storing on IPFS...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            ethereumMintHook.progress.confirmed ? "bg-green-500/20" : "bg-border-light dark:bg-border-dark"
                          }`}>
                            {ethereumMintHook.progress.confirmed && (
                              <span className="material-symbols-outlined text-green-500 text-sm filled-icon">check</span>
                            )}
                          </div>
                          <span className="text-text-sec-light dark:text-text-sec-dark">Minting on blockchain...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            hederaMintHook.progress.uploading ? "bg-green-500/20" : "bg-primary/20"
                          }`}>
                            {hederaMintHook.progress.uploading ? (
                              <span className="material-symbols-outlined text-green-500 text-sm filled-icon">check</span>
                            ) : (
                              <LoadingSpinner size="sm" />
                            )}
                          </div>
                          <span className="text-text-main-light dark:text-white">Uploading file...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            hederaMintHook.progress.ipfsMetadata ? "bg-green-500/20" : "bg-border-light dark:bg-border-dark"
                          }`}>
                            {hederaMintHook.progress.ipfsMetadata && (
                              <span className="material-symbols-outlined text-green-500 text-sm filled-icon">check</span>
                            )}
                          </div>
                          <span className="text-text-sec-light dark:text-text-sec-dark">Storing metadata...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            hederaMintHook.progress.complete ? "bg-green-500/20" : "bg-border-light dark:bg-border-dark"
                          }`}>
                            {hederaMintHook.progress.complete && (
                              <span className="material-symbols-outlined text-green-500 text-sm filled-icon">check</span>
                            )}
                          </div>
                          <span className="text-text-sec-light dark:text-text-sec-dark">Minting NFT...</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CreateNFTPage() {
  return (
    <ToastProvider>
      <CreateNFTPageContent />
    </ToastProvider>
  );
}
