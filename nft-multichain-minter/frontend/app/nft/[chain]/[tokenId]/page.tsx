"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NFTDetails } from "@/lib/types/nft";
import apiClient from "@/lib/apiClient";

export default function NFTDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const chain = params.chain as string;
  const tokenId = params.tokenId as string;

  const [nft, setNft] = useState<NFTDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchNFTDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/nft/${chain}/${tokenId}`);
        setNft(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load NFT details");
      } finally {
        setLoading(false);
      }
    };

    if (chain && tokenId) {
      fetchNFTDetails();
    }
  }, [chain, tokenId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const handleLike = async () => {
    // TODO: Implement like functionality
    setLiked(!liked);
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `${hours} hrs ago`;
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-sec-light dark:text-text-sec-dark">Loading NFT details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-text-sec-light dark:text-text-sec-dark mb-4">
              error
            </span>
            <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-2">
              NFT Not Found
            </h2>
            <p className="text-text-sec-light dark:text-text-sec-dark mb-6">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-all"
            >
              Go Back Home
            </button>
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
            <a
              className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors"
              href="/"
            >
              Dashboard
            </a>
            <span className="text-text-sec-light dark:text-text-sec-dark">/</span>
            <a
              className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors"
              href="#"
            >
              Collections
            </a>
            <span className="text-text-sec-light dark:text-text-sec-dark">/</span>
            <a
              className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors"
              href="#"
            >
              {nft.collectionName}
            </a>
            <span className="text-text-sec-light dark:text-text-sec-dark">/</span>
            <span className="text-text-main-light dark:text-white font-medium">
              #{nft.tokenId}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Visual Asset */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative group w-full aspect-square rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-border-light dark:border-border-dark bg-surface-dark">
                {/* Main NFT Image */}
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${nft.imageUrl})` }}
                />

                {/* Floating Chain Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-white text-lg">token</span>
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      {nft.chain}
                    </span>
                  </div>
                </div>

                {/* Action Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-between items-center">
                    <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition text-white">
                      <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Actions Bar */}
              <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl">
                <div className="flex gap-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 group transition-colors ${
                      liked ? "text-red-500" : "text-text-sec-light dark:text-text-sec-dark hover:text-red-500"
                    }`}
                  >
                    <span className={`material-symbols-outlined transition-all ${liked ? "filled-icon" : ""}`}>
                      favorite
                    </span>
                    <span className="text-sm font-medium">{nft.stats.likes + (liked ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-2 group text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">visibility</span>
                    <span className="text-sm font-medium">{nft.stats.views}</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-lg text-text-sec-light dark:text-text-sec-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Share"
                  >
                    <span className="material-symbols-outlined">share</span>
                  </button>
                  <button
                    className="p-2 rounded-lg text-text-sec-light dark:text-text-sec-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Report"
                  >
                    <span className="material-symbols-outlined">flag</span>
                  </button>
                </div>
              </div>

              {/* Description Block */}
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold text-lg mb-4">
                  <span className="material-symbols-outlined">description</span>
                  Description
                </h3>
                <p className="text-text-sec-light dark:text-text-sec-dark leading-relaxed">
                  {nft.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Details & Data */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <a
                    className="text-primary font-bold text-sm hover:underline uppercase tracking-wider"
                    href="#"
                  >
                    {nft.collectionName}
                  </a>
                  {nft.collectionVerified && (
                    <span
                      className="material-symbols-outlined text-blue-400 text-sm filled-icon"
                      title="Verified Collection"
                    >
                      verified
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-text-main-light dark:text-white mb-6">
                  {nft.name}
                </h1>

                <div className="flex flex-wrap gap-4 items-center mb-8">
                  <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark pr-4 pl-1 py-1 rounded-full">
                    {nft.creator.avatar ? (
                      <div
                        className="w-8 h-8 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${nft.creator.avatar})` }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {nft.creator.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-sec-light dark:text-text-sec-dark uppercase font-bold leading-none mb-0.5">
                        Creator
                      </span>
                      <span className="text-xs text-text-main-light dark:text-white font-bold leading-none">
                        {nft.creator.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark pr-4 pl-1 py-1 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {formatAddress(nft.owner.address).slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-sec-light dark:text-text-sec-dark uppercase font-bold leading-none mb-0.5">
                        Owner
                      </span>
                      <span className="text-xs text-text-main-light dark:text-white font-bold leading-none">
                        {formatAddress(nft.owner.address)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Action Card */}
              {nft.pricing.currentPrice && (
                <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div>
                      <p className="text-text-sec-light dark:text-text-sec-dark text-sm font-medium mb-1">
                        Current Price
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-text-main-light dark:text-white">
                          {nft.pricing.currentPrice} {nft.pricing.currency}
                        </span>
                        {nft.pricing.usdEquivalent && (
                          <span className="text-text-sec-light dark:text-text-sec-dark text-lg font-medium">
                            ~${nft.pricing.usdEquivalent} USD
                          </span>
                        )}
                      </div>
                    </div>
                    {nft.pricing.saleEndTime && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-sec-light dark:text-text-sec-dark">
                          schedule
                        </span>
                        <span className="text-text-sec-light dark:text-text-sec-dark text-sm">
                          {nft.pricing.saleEndTime}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25">
                      <span className="material-symbols-outlined">shopping_bag</span>
                      Buy Now
                    </button>
                    <button className="flex-1 bg-transparent border-2 border-border-light dark:border-border-dark hover:border-primary text-text-main-light dark:text-white h-12 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all">
                      <span className="material-symbols-outlined">gavel</span>
                      Place Bid
                    </button>
                  </div>
                </div>
              )}

              {/* Metadata Grid (Properties) */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-text-main-light dark:text-text-main-dark font-bold text-lg">
                  <span className="material-symbols-outlined">tune</span>
                  Properties
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nft.properties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-default"
                    >
                      <span className="text-primary text-xs font-bold uppercase tracking-wide mb-1">
                        {prop.trait_type}
                      </span>
                      <span className="text-text-main-light dark:text-white font-medium">
                        {prop.value}
                      </span>
                      {prop.rarity && (
                        <span className="text-text-sec-light dark:text-text-sec-dark text-xs mt-1">
                          {prop.rarity}% have this
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Details Tabs */}
              <div className="mt-4">
                <div className="flex gap-6 border-b border-border-light dark:border-border-dark mb-6">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`pb-3 border-b-2 font-bold ${
                      activeTab === "details"
                        ? "border-primary text-primary"
                        : "border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-white transition-colors font-medium"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-3 border-b-2 ${
                      activeTab === "history"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-white transition-colors font-medium"
                    }`}
                  >
                    History
                  </button>
                </div>

                {/* Details Content */}
                {activeTab === "details" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark border-dashed">
                      <span className="text-text-sec-light dark:text-text-sec-dark font-medium">
                        Contract Address
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-mono text-sm">
                          {formatAddress(nft.contractAddress)}
                        </span>
                        <button
                          onClick={() => handleCopy(nft.contractAddress)}
                          className="text-text-sec-light dark:text-text-sec-dark hover:text-white"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark border-dashed">
                      <span className="text-text-sec-light dark:text-text-sec-dark font-medium">
                        Token ID
                      </span>
                      <span className="text-text-main-light dark:text-white font-mono text-sm">
                        {nft.tokenId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark border-dashed">
                      <span className="text-text-sec-light dark:text-text-sec-dark font-medium">
                        Token Standard
                      </span>
                      <span className="text-text-main-light dark:text-white font-mono text-sm">
                        {nft.tokenStandard}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark border-dashed">
                      <span className="text-text-sec-light dark:text-text-sec-dark font-medium">
                        Metadata Status
                      </span>
                      <span className="text-green-400 font-mono text-sm flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        {nft.metadata.status === "frozen" ? "Frozen" : "Mutable"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 py-2">
                      <span className="text-text-sec-light dark:text-text-sec-dark font-medium">
                        IPFS CID
                      </span>
                      <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between border border-border-light dark:border-border-dark">
                        <span className="text-text-sec-light dark:text-text-sec-dark font-mono text-xs truncate mr-4">
                          {nft.metadata.ipfsCid}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(nft.metadata.ipfsCid)}
                            className="text-primary hover:text-white transition-colors"
                            title="Copy"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                          <a
                            href={`https://ipfs.io/ipfs/${nft.metadata.ipfsCid.replace("ipfs://", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-white transition-colors"
                            title="Open Link"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              {activeTab === "history" && (
                <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden mt-4">
                  <div className="p-4 bg-black/5 dark:bg-white/5 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <h3 className="font-bold text-text-main-light dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined">history</span>
                      Activity
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-text-sec-light dark:text-text-sec-dark uppercase bg-black/5 dark:bg-black/20">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Event
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3">
                            From
                          </th>
                          <th scope="col" className="px-6 py-3">
                            To
                          </th>
                          <th scope="col" className="px-6 py-3 text-right">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {nft.activity.map((activity, idx) => (
                          <tr
                            key={idx}
                            className="bg-transparent border-b border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4 flex items-center gap-2 font-medium text-text-main-light dark:text-white">
                              <span className="material-symbols-outlined text-sm">
                                {activity.event === "Sale"
                                  ? "shopping_cart"
                                  : activity.event === "Transfer"
                                  ? "sync_alt"
                                  : activity.event === "Minted"
                                  ? "auto_awesome"
                                  : "gavel"}
                              </span>
                              {activity.event}
                            </td>
                            <td className="px-6 py-4 font-mono">
                              {activity.price || (
                                <span className="text-text-sec-light dark:text-text-sec-dark">--</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-primary truncate max-w-[100px]">
                              {formatAddress(activity.from)}
                            </td>
                            <td className="px-6 py-4 text-primary truncate max-w-[100px]">
                              {formatAddress(activity.to)}
                            </td>
                            <td className="px-6 py-4 text-right text-text-sec-light dark:text-text-sec-dark">
                              {formatTimeAgo(activity.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
