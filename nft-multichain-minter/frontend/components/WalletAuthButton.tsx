"use client";

import { useAuth } from "../hooks/useAuth";
import EthereumWalletButton from "./WalletButtons/EthereumWalletButton";
import HederaWalletButton from "./WalletButtons/HederaWalletButton";

export default function WalletAuthButton() {
  const { isLoggedIn, walletAddress, chain, logout, error } = useAuth();

  if (isLoggedIn && walletAddress) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex-1">
          <p className="text-sm text-gray-600">Connected ({chain})</p>
          <p className="font-mono text-sm font-semibold text-gray-900">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 text-center">
        Connect Your Wallet
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Choose a wallet to get started
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EthereumWalletButton />
        <HederaWalletButton />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
