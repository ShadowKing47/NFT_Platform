"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import WalletConnectModal from "@/components/WalletConnectModal";
import { hederaWallet } from "@/lib/hederaWallet";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginEthereum, loginHedera, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedChain, setSelectedChain] = useState<"ethereum" | "hedera">("ethereum");
  const [wcUri, setWcUri] = useState<string | null>(null);

  // Get redirect URL from query params or default to dashboard
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Set up WalletConnect URI callback
  useEffect(() => {
    hederaWallet.setUriCallback((uri: string) => {
      setWcUri(uri);
    });
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, router, redirectTo]);

  const handleLogin = async (chain: "ethereum" | "hedera") => {
    try {
      setLoading(true);
      setError("");
      setWcUri(null);

      if (chain === "ethereum") {
        await loginEthereum();
      } else {
        await loginHedera();
      }

      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      setWcUri(null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setWcUri(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-grow w-full px-6 py-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-8 shadow-2xl">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
                <span className="material-symbols-outlined text-white text-3xl">hexagon</span>
              </div>
              <h1 className="text-3xl font-black text-text-main-light dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-text-sec-light dark:text-text-sec-dark">
                Connect your wallet to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Chain Selection */}
            <div className="mb-6">
              <label className="block text-text-main-light dark:text-white text-sm font-bold mb-3">
                Select Blockchain
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedChain("ethereum")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedChain === "ethereum"
                      ? "border-primary bg-primary/5"
                      : "border-border-light dark:border-border-dark hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-primary">token</span>
                    <span className="text-text-main-light dark:text-white font-bold text-sm">
                      Ethereum
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedChain("hedera")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedChain === "hedera"
                      ? "border-primary bg-primary/5"
                      : "border-border-light dark:border-border-dark hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-green-500">token</span>
                    <span className="text-text-main-light dark:text-white font-bold text-sm">
                      Hedera
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={() => handleLogin(selectedChain)}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/25 mb-6"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  <span>Connect {selectedChain === "ethereum" ? "MetaMask" : "HashPack"}</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light dark:border-border-dark"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-light dark:bg-surface-dark text-text-sec-light dark:text-text-sec-dark">
                  New to NFT Nexus?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              href="/signup"
              className="w-full bg-transparent border-2 border-border-light dark:border-border-dark hover:border-primary text-text-main-light dark:text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined">person_add</span>
              <span>Create Account</span>
            </Link>

            {/* Info Text */}
            <p className="text-center text-text-sec-light dark:text-text-sec-dark text-xs mt-6">
              By connecting your wallet, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <h3 className="text-text-main-light dark:text-white font-bold mb-4">
              Why Connect a Wallet?
            </h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 text-left">
                <span className="material-symbols-outlined text-primary mt-1">verified_user</span>
                <div>
                  <h4 className="text-text-main-light dark:text-white font-semibold text-sm">
                    Secure Authentication
                  </h4>
                  <p className="text-text-sec-light dark:text-text-sec-dark text-xs">
                    No passwords needed - your wallet is your login
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="material-symbols-outlined text-primary mt-1">account_balance</span>
                <div>
                  <h4 className="text-text-main-light dark:text-white font-semibold text-sm">
                    Own Your NFTs
                  </h4>
                  <p className="text-text-sec-light dark:text-text-sec-dark text-xs">
                    True ownership stored on the blockchain
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="material-symbols-outlined text-primary mt-1">rocket_launch</span>
                <div>
                  <h4 className="text-text-main-light dark:text-white font-semibold text-sm">
                    Instant Access
                  </h4>
                  <p className="text-text-sec-light dark:text-text-sec-dark text-xs">
                    Start minting and trading immediately
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* WalletConnect Modal */}
      {wcUri && <WalletConnectModal uri={wcUri} onClose={closeModal} />}
    </div>
  );
}
