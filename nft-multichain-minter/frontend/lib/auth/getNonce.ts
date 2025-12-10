import apiClient from "../apiClient";

export async function getNonce(wallet: string): Promise<string> {
  const response = await apiClient.post<{ nonce: string }>("/api/auth/nonce", {
    wallet,
  });
  return response.data.nonce;
}
