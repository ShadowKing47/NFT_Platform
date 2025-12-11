"use client";

import { useState, useEffect } from "react";
import { connectMetaMask, getSigner } from "../lib/ethersClient";
import { hederaWallet } from "../lib/hederaWallet";
import { getNonce } from "../lib/auth/getNonce";
import { signMessageEthereum, signMessageHedera } from "../lib/auth/signMessage";
import { verifySignature } from "../lib/auth/verifySignature";

interface AuthState {
  isLoggedIn: boolean;
  walletAddress: string | null;
  jwtToken: string | null;
  chain: "ethereum" | "hedera" | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    walletAddress: null,
    jwtToken: null,
    chain: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const address = localStorage.getItem("wallet_address");
    const chain = localStorage.getItem("wallet_chain") as "ethereum" | "hedera" | null;

    if (token && address) {
      setAuthState({
        isLoggedIn: true,
        walletAddress: address,
        jwtToken: token,
        chain: chain || null,
      });
    }
    
    setIsInitializing(false);

    // Listen for logout events
    const handleLogout = () => {
      setAuthState({
        isLoggedIn: false,
        walletAddress: null,
        jwtToken: null,
        chain: null,
      });
    };

    window.addEventListener("auth-logout", handleLogout);
    return () => window.removeEventListener("auth-logout", handleLogout);
  }, []);

  const loginEthereum = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Connect MetaMask
      const address = await connectMetaMask();
      if (!address) {
        throw new Error("Failed to connect MetaMask");
      }

      // Get nonce
      const nonce = await getNonce(address);

      // Sign message
      const signer = await getSigner();
      if (!signer) {
        throw new Error("Failed to get signer");
      }

      const message = `Sign this message to authenticate: ${nonce}`;
      const signature = await signMessageEthereum(message, signer);

      // Verify and get JWT
      const jwt = await verifySignature(address, signature);

      // Store auth data
      localStorage.setItem("jwt_token", jwt);
      localStorage.setItem("wallet_address", address);
      localStorage.setItem("wallet_chain", "ethereum");

      setAuthState({
        isLoggedIn: true,
        walletAddress: address,
        jwtToken: jwt,
        chain: "ethereum",
      });

      return { success: true, address };
    } catch (err: any) {
      const errorMessage = err.message || "Ethereum login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const loginHedera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize and connect HashPack
      await hederaWallet.init();
      await hederaWallet.connectWallet();

      const accountId = hederaWallet.accountId;
      if (!accountId) {
        throw new Error("Failed to connect HashPack");
      }

      // Get nonce
      const nonce = await getNonce(accountId);

      // Sign message
      const message = `Sign this message to authenticate: ${nonce}`;
      const signature = await signMessageHedera(
        message,
        hederaWallet
      );

      // Verify and get JWT
      const jwt = await verifySignature(accountId, signature);

      // Store auth data
      localStorage.setItem("jwt_token", jwt);
      localStorage.setItem("wallet_address", accountId);
      localStorage.setItem("wallet_chain", "hedera");

      setAuthState({
        isLoggedIn: true,
        walletAddress: accountId,
        jwtToken: jwt,
        chain: "hedera",
      });

      return { success: true, address: accountId };
    } catch (err: any) {
      const errorMessage = err.message || "Hedera login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("wallet_chain");

    setAuthState({
      isLoggedIn: false,
      walletAddress: null,
      jwtToken: null,
      chain: null,
    });

    window.dispatchEvent(new Event("auth-logout"));
  };

  return {
    ...authState,
    isLoading,
    isInitializing,
    error,
    loginEthereum,
    loginHedera,
    logout,
  };
}
