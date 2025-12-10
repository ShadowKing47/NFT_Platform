import apiClient from "../apiClient";

export async function verifySignature(
  wallet: string,
  signature: string
): Promise<string> {
  const response = await apiClient.post<{ token: string }>("/api/auth/verify", {
    wallet,
    signature,
  });
  
  return response.data.token;
}
