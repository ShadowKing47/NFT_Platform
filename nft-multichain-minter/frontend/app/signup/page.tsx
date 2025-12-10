"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignUpPage() {
  const router = useRouter();
  const { loginEthereum, loginHedera, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedChain, setSelectedChain] = useState<"ethereum" | "hedera">("ethereum");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push("/");
    return null;
  }

  const handleSignUp = async (chain: "ethereum" | "hedera") => {
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (chain === "ethereum") {
        await loginEthereum();
      } else {
        await loginHedera();
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-grow w-full px-6 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Sign Up Form */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-8 shadow-2xl">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
                  <span className="material-symbols-outlined text-white text-3xl">hexagon</span>
                </div>
                <h1 className="text-3xl font-black text-text-main-light dark:text-white mb-2">
                  Create Account
                </h1>
                <p className="text-text-sec-light dark:text-text-sec-dark">
                  Join the NFT revolution
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
                      <span className="material-symbols-outlined text-2xl text-green-500">
                        token
                      </span>
                      <span className="text-text-main-light dark:text-white font-bold text-sm">
                        Hedera
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-text-sec-light dark:text-text-sec-dark text-sm">
                    I agree to the{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                onClick={() => handleSignUp(selectedChain)}
                disabled={loading || !agreedToTerms}
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
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <Link
                href="/login"
                className="w-full bg-transparent border-2 border-border-light dark:border-border-dark hover:border-primary text-text-main-light dark:text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined">login</span>
                <span>Sign In</span>
              </Link>
            </div>

            {/* Right Column - Benefits */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-black text-text-main-light dark:text-white mb-6">
                Why Join NFT Nexus?
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h3 className="text-text-main-light dark:text-white font-bold text-lg mb-1">
                      Create & Mint NFTs
                    </h3>
                    <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                      Easily mint your digital art on Ethereum or Hedera with our user-friendly
                      platform
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">security</span>
                  </div>
                  <div>
                    <h3 className="text-text-main-light dark:text-white font-bold text-lg mb-1">
                      Secure & Decentralized
                    </h3>
                    <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                      Your NFTs are stored on the blockchain with true ownership and provenance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      diversity_3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-text-main-light dark:text-white font-bold text-lg mb-1">
                      Join the Community
                    </h3>
                    <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                      Connect with creators, collectors, and enthusiasts in the NFT space
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                  </div>
                  <div>
                    <h3 className="text-text-main-light dark:text-white font-bold text-lg mb-1">
                      Trade & Earn
                    </h3>
                    <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                      Buy, sell, and trade NFTs on a secure marketplace with low fees
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">hub</span>
                  </div>
                  <div>
                    <h3 className="text-text-main-light dark:text-white font-bold text-lg mb-1">
                      Multi-Chain Support
                    </h3>
                    <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                      Choose between Ethereum and Hedera networks for your NFTs
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-primary mb-1">10K+</div>
                  <div className="text-text-sec-light dark:text-text-sec-dark text-xs">
                    NFTs Minted
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary mb-1">5K+</div>
                  <div className="text-text-sec-light dark:text-text-sec-dark text-xs">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary mb-1">2</div>
                  <div className="text-text-sec-light dark:text-text-sec-dark text-xs">
                    Blockchains
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
