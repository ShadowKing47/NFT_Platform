export interface NFTProperty {
  trait_type: string;
  value: string;
  rarity?: number;
}

export interface NFTActivity {
  event: "Sale" | "Transfer" | "Minted" | "Bid";
  price?: string;
  from: string;
  to: string;
  timestamp: string;
  txHash?: string;
}

export interface NFTDetails {
  tokenId: string;
  serialNumber?: string;
  name: string;
  description: string;
  imageUrl: string;
  collectionName: string;
  collectionVerified: boolean;
  creator: {
    name: string;
    address: string;
    avatar?: string;
  };
  owner: {
    name?: string;
    address: string;
  };
  chain: "ethereum" | "hedera";
  contractAddress: string;
  tokenStandard: string;
  metadata: {
    ipfsCid: string;
    status: "frozen" | "mutable";
  };
  pricing: {
    currentPrice?: string;
    currency: string;
    usdEquivalent?: string;
    saleEndTime?: string;
  };
  properties: NFTProperty[];
  stats: {
    likes: number;
    views: number;
  };
  tags: string[];
  activity: NFTActivity[];
}
