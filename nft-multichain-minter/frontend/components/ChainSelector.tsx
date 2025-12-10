"use client";

import { useState } from "react";

interface ChainSelectorProps {
  onChainSelect: (chain: "ethereum" | "hedera") => void;
  selectedChain: "ethereum" | "hedera";
}

export default function ChainSelector({
  onChainSelect,
  selectedChain,
}: ChainSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Blockchain *
      </label>
      <div className="grid grid-cols-2 gap-4">
        {/* Ethereum Option */}
        <button
          onClick={() => onChainSelect("ethereum")}
          className={`relative p-6 border-2 rounded-lg transition-all ${
            selectedChain === "ethereum"
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill={selectedChain === "ethereum" ? "#7C3AED" : "#9CA3AF"}
            >
              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
            </svg>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">Ethereum</h3>
              <p className="text-xs text-gray-500 mt-1">Sepolia Testnet</p>
            </div>
          </div>
          {selectedChain === "ethereum" && (
            <div className="absolute top-3 right-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>

        {/* Hedera Option */}
        <button
          onClick={() => onChainSelect("hedera")}
          className={`relative p-6 border-2 rounded-lg transition-all ${
            selectedChain === "hedera"
              ? "border-green-600 bg-green-50"
              : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill={selectedChain === "hedera" ? "#059669" : "#9CA3AF"}
            >
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.5 3.75v7.14L12 18.82l-7.5-3.75V7.93L12 4.18z" />
            </svg>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">Hedera</h3>
              <p className="text-xs text-gray-500 mt-1">Testnet</p>
            </div>
          </div>
          {selectedChain === "hedera" && (
            <div className="absolute top-3 right-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
