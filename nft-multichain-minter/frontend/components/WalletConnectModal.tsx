"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface WalletConnectModalProps {
  uri: string | null;
  onClose: () => void;
}

export default function WalletConnectModal({ uri, onClose }: WalletConnectModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!uri) return;

    // Auto-close modal on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [uri, onClose]);

  if (!uri) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInHashPack = () => {
    const hashpackUri = `hashpack://wc?uri=${encodeURIComponent(uri)}`;
    window.open(hashpackUri, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full border border-border-light dark:border-border-dark overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <div>
            <h3 className="text-xl font-bold text-text-main-light dark:text-white">
              Connect Wallet
            </h3>
            <p className="text-sm text-text-sec-light dark:text-text-sec-dark mt-1">
              Scan with your mobile wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-text-sec-light dark:text-text-sec-dark">
              close
            </span>
          </button>
        </div>

        {/* QR Code */}
        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG value={uri} size={256} level="H" />
          </div>

          <div className="mt-6 w-full space-y-3">
            {/* Open in HashPack button */}
            <button
              onClick={openInHashPack}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              <span>Open HashPack</span>
            </button>

            {/* Copy URI button */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 bg-surface-light dark:bg-surface-dark hover:bg-black/5 dark:hover:bg-white/10 text-text-main-light dark:text-white font-medium py-3 px-4 rounded-lg transition-all border border-border-light dark:border-border-dark"
            >
              <span className="material-symbols-outlined">
                {copied ? "check" : "content_copy"}
              </span>
              <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-xs text-text-sec-light dark:text-text-sec-dark">
              Don't have HashPack?{" "}
              <a
                href="https://www.hashpack.app/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Download here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
