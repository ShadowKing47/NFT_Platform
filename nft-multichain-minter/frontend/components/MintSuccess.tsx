"use client";

interface MintSuccessProps {
  chain: "ethereum" | "hedera";
  imageUrl: string;
  metadata: any;
  tokenId?: string;
  serialNumber?: number;
  txHash?: string;
  tokenUri?: string;
  onMintAnother: () => void;
}

export default function MintSuccess({
  chain,
  imageUrl,
  metadata,
  tokenId,
  serialNumber,
  txHash,
  tokenUri,
  onMintAnother,
}: MintSuccessProps) {
  const explorerUrl =
    chain === "ethereum"
      ? `https://sepolia.etherscan.io/tx/${txHash}`
      : `https://hashscan.io/testnet/transaction/${txHash}`;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
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
      </div>

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
        NFT Minted Successfully!
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Your NFT has been minted on {chain === "ethereum" ? "Ethereum" : "Hedera"}
      </p>

      {/* NFT Preview */}
      <div className="mb-6">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            src={imageUrl}
            alt={metadata?.name || "NFT"}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center">
          {metadata?.name || "Untitled NFT"}
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {chain === "ethereum" && txHash && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Transaction Hash</p>
            <p className="font-mono text-xs text-gray-900 break-all">
              {txHash}
            </p>
          </div>
        )}

        {chain === "hedera" && tokenId && (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Token ID</p>
              <p className="font-mono text-sm text-gray-900">{tokenId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Serial Number</p>
              <p className="font-mono text-sm text-gray-900">{serialNumber}</p>
            </div>
          </>
        )}

        {tokenUri && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Metadata URI</p>
            <p className="font-mono text-xs text-gray-900 break-all">
              {tokenUri}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          View on Explorer
        </a>
        <button
          onClick={onMintAnother}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Mint Another
        </button>
      </div>
    </div>
  );
}
