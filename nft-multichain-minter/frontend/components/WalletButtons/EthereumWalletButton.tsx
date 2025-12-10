"use client";

import { useAuth } from "../../hooks/useAuth";

export default function EthereumWalletButton() {
  const { loginEthereum, isLoading, error } = useAuth();

  const handleConnect = async () => {
    await loginEthereum();
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
      </svg>
      {isLoading ? "Connecting..." : "Connect MetaMask"}
    </button>
  );
}
