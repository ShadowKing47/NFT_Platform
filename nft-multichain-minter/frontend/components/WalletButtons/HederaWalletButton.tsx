"use client";

import { useAuth } from "../../hooks/useAuth";

export default function HederaWalletButton() {
  const { loginHedera, isLoading, error } = useAuth();

  const handleConnect = async () => {
    await loginHedera();
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.5 3.75v7.14L12 18.82l-7.5-3.75V7.93L12 4.18z" />
      </svg>
      {isLoading ? "Connecting..." : "Connect HashPack"}
    </button>
  );
}
