// Hedera Wallet Integration using WalletConnect
// Reference: https://docs.walletconnect.com/

import SignClient from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";

const PROJECT_ID = "f91636665f4a1e8fe1a41c9d87a15f2f"; // WalletConnect Project ID
const RELAY_URL = "wss://relay.walletconnect.com";

const APP_METADATA = {
    name: "NFT Multichain Minter",
    description: "Mint NFTs on Ethereum or Hedera",
    url: "https://nft-nexus.app",
    icons: ["https://nft-nexus.app/icon.png"],
};

// Hedera namespace and chain IDs
const HEDERA_NAMESPACE = "hedera";
const HEDERA_TESTNET_CHAIN = "hedera:testnet";
const HEDERA_MAINNET_CHAIN = "hedera:mainnet";

// Hedera JSON-RPC methods
const HEDERA_METHODS = [
    "hedera_signMessage",
    "hedera_signAndExecuteTransaction",
    "hedera_executeTransaction",
    "hedera_signAndExecuteQuery",
    "hedera_getAccountBalance",
    "hedera_getAccountInfo",
];

// Hedera events
const HEDERA_EVENTS = ["chainChanged", "accountsChanged"];

class HederaWallet {
    private static instance: HederaWallet;
    public accountId: string | null = null;
    private signClient: SignClient | null = null;
    private session: SessionTypes.Struct | null = null;
    private isInitialized: boolean = false;
    private uriCallback: ((uri: string) => void) | null = null;

    private constructor() {}

    public static getInstance(): HederaWallet {
        if (!HederaWallet.instance) {
            HederaWallet.instance = new HederaWallet();
        }
        return HederaWallet.instance;
    }

    // Allow setting a callback for URI display
    setUriCallback(callback: (uri: string) => void) {
        this.uriCallback = callback;
    }

    async init() {
        if (this.isInitialized && this.signClient) {
            console.log("WalletConnect already initialized");
            return true;
        }

        if (typeof window === "undefined") {
            throw new Error("WalletConnect can only be initialized in browser environment");
        }

        try {
            console.log("Initializing WalletConnect SignClient...");
            
            this.signClient = await SignClient.init({
                projectId: PROJECT_ID,
                relayUrl: RELAY_URL,
                metadata: APP_METADATA,
            });

            // Set up event listeners
            this.signClient.on("session_event", (event) => {
                console.log("Session event:", event);
            });

            this.signClient.on("session_update", ({ topic, params }) => {
                console.log("Session updated:", topic, params);
                const { namespaces } = params;
                const session = this.signClient?.session.get(topic);
                if (session) {
                    this.session = session;
                }
            });

            this.signClient.on("session_delete", () => {
                console.log("Session deleted");
                this.reset();
            });
            
            this.isInitialized = true;
            console.log("WalletConnect initialized successfully");
            return true;
        } catch (error) {
            console.error("WalletConnect initialization failed:", error);
            this.isInitialized = false;
            throw new Error("Failed to initialize WalletConnect. Please try again.");
        }
    }

    async connectWallet() {
        if (!this.isInitialized || !this.signClient) {
            await this.init();
        }

        if (!this.signClient) {
            throw new Error("WalletConnect not initialized");
        }

        try {
            console.log("Initiating WalletConnect pairing...");
            
            // Check for existing sessions
            const lastSession = this.signClient.session.getAll().pop();
            if (lastSession) {
                console.log("Restoring existing session:", lastSession.topic);
                this.session = lastSession;
                const hederaAccount = lastSession.namespaces[HEDERA_NAMESPACE]?.accounts?.[0];
                if (hederaAccount) {
                    this.accountId = hederaAccount.split(":")[2];
                    console.log("Restored session with account:", this.accountId);
                    return this.accountId;
                }
            }

            // Create new pairing
            const { uri, approval } = await this.signClient.connect({
                requiredNamespaces: {
                    [HEDERA_NAMESPACE]: {
                        chains: [HEDERA_TESTNET_CHAIN],
                        methods: HEDERA_METHODS,
                        events: HEDERA_EVENTS,
                    },
                },
            });

            if (uri) {
                // Trigger callback to show QR modal
                console.log("WalletConnect URI:", uri);
                if (this.uriCallback) {
                    this.uriCallback(uri);
                }
            }

            // Wait for session approval
            console.log("Waiting for wallet approval...");
            this.session = await approval();
            
            if (!this.session) {
                throw new Error("Failed to establish session");
            }

            // Get account ID from session
            const hederaAccount = this.session.namespaces[HEDERA_NAMESPACE]?.accounts?.[0];
            
            if (!hederaAccount) {
                throw new Error("No Hedera account found in session");
            }

            // Extract account ID (format: "hedera:testnet:0.0.xxxxx")
            this.accountId = hederaAccount.split(":")[2];
            
            console.log("Successfully connected via WalletConnect:", this.accountId);
            
            return this.accountId;
        } catch (error: any) {
            console.error("WalletConnect connection failed:", error);
            
            if (error.message?.includes("User rejected") || error.message?.includes("User closed")) {
                throw new Error("Connection rejected. Please approve the connection in your wallet.");
            }
            
            throw new Error(error.message || "Failed to connect wallet via WalletConnect");
        }
    }

    async signMessage(message: string): Promise<string> {
        if (!this.accountId || !this.signClient || !this.session) {
            throw new Error("Wallet not connected");
        }

        try {
            const messageBytes = new TextEncoder().encode(message);
            const messageBase64 = Buffer.from(messageBytes).toString("base64");
            
            const result = await this.signClient.request({
                topic: this.session.topic,
                chainId: HEDERA_TESTNET_CHAIN,
                request: {
                    method: "hedera_signMessage",
                    params: {
                        signerAccountId: `hedera:testnet:${this.accountId}`,
                        message: messageBase64,
                    },
                },
            });
            
            if (!result || typeof result !== "object" || !("signature" in result)) {
                throw new Error("No signature returned");
            }
            
            return (result as any).signature;
        } catch (error: any) {
            console.error("Message signing failed:", error);
            
            if (error.message?.includes("User rejected") || error.message?.includes("User declined")) {
                throw new Error("Signature rejected. Please approve the signature in your wallet.");
            }
            
            throw new Error(error.message || "Failed to sign message");
        }
    }

    async disconnect() {
        if (this.signClient && this.session) {
            try {
                await this.signClient.disconnect({
                    topic: this.session.topic,
                    reason: {
                        code: 6000,
                        message: "User disconnected",
                    },
                });
            } catch (error) {
                console.error("Disconnect error:", error);
            }
        }
        this.reset();
        console.log("Wallet disconnected");
    }

    private reset() {
        this.accountId = null;
        this.session = null;
    }
}

export const hederaWallet = HederaWallet.getInstance();