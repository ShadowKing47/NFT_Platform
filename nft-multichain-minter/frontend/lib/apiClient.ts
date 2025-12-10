import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("wallet_address");
      window.dispatchEvent(new Event("auth-logout"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Typed API methods
export const authAPI = {
  getNonce: (wallet: string) =>
    apiClient.post<{ nonce: string }>("/api/auth/nonce", { wallet }),
  
  verifySignature: (wallet: string, signature: string) =>
    apiClient.post<{ token: string }>("/api/auth/verify", { wallet, signature }),
};

export const ethereumAPI = {
  prepareMint: (formData: FormData) =>
    apiClient.post<{
      success: boolean;
      tokenUri: string;
      imageIpfsUri: string;
      metadata: any;
    }>("/api/eth/prepare-mint", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const hederaAPI = {
  mint: (formData: FormData) =>
    apiClient.post<{
      success: boolean;
      tokenId: string;
      serialNumber: number;
      imageIpfsUri: string;
      metadataIpfsUri: string;
      metadata: any;
    }>("/api/hedera/mint", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const nftAPI = {
  getDetails: (chain: string, tokenId: string, serialNumber?: string) => {
    const url = serialNumber 
      ? `/api/nft/${chain}/${tokenId}/${serialNumber}`
      : `/api/nft/${chain}/${tokenId}`;
    return apiClient.get(url);
  },
};
