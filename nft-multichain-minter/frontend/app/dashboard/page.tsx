"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, walletAddress, chain, isInitializing } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"owned" | "created" | "activity">("owned");

  // Mock data - replace with actual API calls
  const [stats] = useState({
    nftsOwned: 12,
    nftsCreated: 5,
    totalValue: "2,450 HBAR",
    totalSales: "5,200 HBAR",
  });

  const [ownedNFTs] = useState([
    {
      id: "1",
      name: "CyberPunk #4029",
      collection: "CyberPunk Legends",
      image: "https://via.placeholder.com/300",
      chain: "hedera",
      price: "1,500 HBAR",
    },
    {
      id: "2",
      name: "Abstract Art #152",
      collection: "Digital Dreams",
      image: "https://via.placeholder.com/300",
      chain: "ethereum",
      price: "0.5 ETH",
    },
    {
      id: "3",
      name: "Pixel Avatar #892",
      collection: "Pixel Heroes",
      image: "https://via.placeholder.com/300",
      chain: "hedera",
      price: "800 HBAR",
    },
  ]);

  const [recentActivity] = useState([
    {
      type: "Minted",
      nft: "CyberPunk #4029",
      timestamp: "2 hours ago",
      chain: "hedera",
    },
    {
      type: "Transfer",
      nft: "Abstract Art #152",
      timestamp: "1 day ago",
      chain: "ethereum",
    },
    {
      type: "Sale",
      nft: "Pixel Avatar #891",
      price: "900 HBAR",
      timestamp: "3 days ago",
      chain: "hedera",
    },
  ]);

  useEffect(() => {
    // Only redirect after initialization is complete
    if (!isInitializing && !isLoggedIn) {
      router.push("/login?redirect=/dashboard");
    } else if (!isInitializing && isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, isInitializing, router]);

  if (loading || isInitializing || !isLoggedIn) {
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
            <span className="text-text-main-light dark:text-white font-medium">Dashboard</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-text-main-light dark:text-white mb-2">
                My Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-primary text-sm font-bold">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </span>
                </div>
                <div className="px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-primary text-sm font-bold uppercase">{chain}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create NFT</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 bg-transparent border-2 border-border-light dark:border-border-dark hover:border-primary text-text-main-light dark:text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-sm">settings</span>
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">collections</span>
                <span className="text-green-500 text-sm font-bold">+12%</span>
              </div>
              <h3 className="text-3xl font-black text-text-main-light dark:text-white mb-1">
                {stats.nftsOwned}
              </h3>
              <p className="text-text-sec-light dark:text-text-sec-dark text-sm">NFTs Owned</p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  auto_awesome
                </span>
                <span className="text-green-500 text-sm font-bold">+5</span>
              </div>
              <h3 className="text-3xl font-black text-text-main-light dark:text-white mb-1">
                {stats.nftsCreated}
              </h3>
              <p className="text-text-sec-light dark:text-text-sec-dark text-sm">NFTs Created</p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  account_balance_wallet
                </span>
                <span className="text-green-500 text-sm font-bold">+8%</span>
              </div>
              <h3 className="text-3xl font-black text-text-main-light dark:text-white mb-1">
                {stats.totalValue}
              </h3>
              <p className="text-text-sec-light dark:text-text-sec-dark text-sm">Total Value</p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  trending_up
                </span>
                <span className="text-green-500 text-sm font-bold">+15%</span>
              </div>
              <h3 className="text-3xl font-black text-text-main-light dark:text-white mb-1">
                {stats.totalSales}
              </h3>
              <p className="text-text-sec-light dark:text-text-sec-dark text-sm">Total Sales</p>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
            {/* Tabs Header */}
            <div className="flex gap-6 border-b border-border-light dark:border-border-dark px-6">
              <button
                onClick={() => setActiveTab("owned")}
                className={`py-4 border-b-2 font-bold transition-colors ${
                  activeTab === "owned"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-white"
                }`}
              >
                Owned NFTs
              </button>
              <button
                onClick={() => setActiveTab("created")}
                className={`py-4 border-b-2 font-bold transition-colors ${
                  activeTab === "created"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-white"
                }`}
              >
                Created
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`py-4 border-b-2 font-bold transition-colors ${
                  activeTab === "activity"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-white"
                }`}
              >
                Activity
              </button>
            </div>

            {/* Tabs Content */}
            <div className="p-6">
              {activeTab === "owned" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedNFTs.map((nft) => (
                    <Link
                      key={nft.id}
                      href={`/nft/${nft.chain}/${nft.id}`}
                      className="group bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden hover:border-primary transition-all"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${nft.image})` }}
                        />
                        <div className="absolute top-3 right-3">
                          <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
                            <span className="text-white text-xs font-bold uppercase">
                              {nft.chain}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-text-sec-light dark:text-text-sec-dark text-xs mb-1">
                          {nft.collection}
                        </p>
                        <h3 className="text-text-main-light dark:text-white font-bold text-lg mb-2">
                          {nft.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-text-sec-light dark:text-text-sec-dark text-sm">
                            Price
                          </span>
                          <span className="text-primary font-bold">{nft.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {activeTab === "created" && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-text-sec-light dark:text-text-sec-dark mb-4">
                    auto_awesome
                  </span>
                  <h3 className="text-2xl font-bold text-text-main-light dark:text-white mb-2">
                    No Created NFTs Yet
                  </h3>
                  <p className="text-text-sec-light dark:text-text-sec-dark mb-6">
                    Start creating your own NFT collection today
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Create First NFT</span>
                  </Link>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            {activity.type === "Minted"
                              ? "auto_awesome"
                              : activity.type === "Transfer"
                              ? "sync_alt"
                              : "shopping_cart"}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-text-main-light dark:text-white font-bold">
                            {activity.type}
                          </h4>
                          <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                            {activity.nft}
                            {activity.price && ` for ${activity.price}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-2 py-1 bg-primary/10 rounded-lg mb-1">
                          <span className="text-primary text-xs font-bold uppercase">
                            {activity.chain}
                          </span>
                        </div>
                        <span className="text-text-sec-light dark:text-text-sec-dark text-sm">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/"
              className="flex items-center gap-4 p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl hover:border-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">add_circle</span>
              </div>
              <div>
                <h3 className="text-text-main-light dark:text-white font-bold text-lg">
                  Create NFT
                </h3>
                <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                  Mint a new NFT
                </p>
              </div>
            </Link>

            <Link
              href="/explore"
              className="flex items-center gap-4 p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl hover:border-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">explore</span>
              </div>
              <div>
                <h3 className="text-text-main-light dark:text-white font-bold text-lg">
                  Explore NFTs
                </h3>
                <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                  Discover collections
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-4 p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl hover:border-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">settings</span>
              </div>
              <div>
                <h3 className="text-text-main-light dark:text-white font-bold text-lg">
                  Account Settings
                </h3>
                <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                  Manage your account
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
