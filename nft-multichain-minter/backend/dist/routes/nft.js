"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sdk_1 = require("@hashgraph/sdk");
const axios_1 = __importDefault(require("axios"));
const htsClient_1 = require("../chains/hedera/htsClient");
const ethers_1 = require("ethers");
const router = (0, express_1.Router)();
// Get NFT details for Hedera
router.get("/hedera/:tokenId/:serialNumber?", async (req, res, next) => {
    try {
        const { tokenId, serialNumber } = req.params;
        if (!tokenId) {
            return res.status(400).json({ error: "Token ID is required" });
        }
        // Parse token ID
        const hederaTokenId = sdk_1.TokenId.fromString(tokenId);
        const serial = serialNumber ? parseInt(serialNumber) : 1;
        // Get NFT info from Hedera
        const nftInfoArray = await new sdk_1.TokenNftInfoQuery()
            .setNftId(new sdk_1.NftId(hederaTokenId, serial))
            .execute(htsClient_1.hederaClient);
        const nftInfo = Array.isArray(nftInfoArray) ? nftInfoArray[0] : nftInfoArray;
        // Parse metadata from IPFS
        let metadata = {};
        let imageUrl = "";
        let properties = [];
        if (nftInfo.metadata && nftInfo.metadata.length > 0) {
            try {
                const metadataString = Buffer.from(nftInfo.metadata).toString("utf8");
                // Check if it's an IPFS CID
                if (metadataString.startsWith("ipfs://") || metadataString.startsWith("Qm") || metadataString.startsWith("bafy")) {
                    const ipfsCid = metadataString.replace("ipfs://", "");
                    const ipfsGateway = `https://ipfs.io/ipfs/${ipfsCid}`;
                    try {
                        const response = await axios_1.default.get(ipfsGateway, { timeout: 5000 });
                        metadata = response.data;
                    }
                    catch (ipfsError) {
                        console.error("Failed to fetch from IPFS:", ipfsError);
                    }
                }
                else {
                    // Try to parse as JSON
                    metadata = JSON.parse(metadataString);
                }
                // Extract image URL
                if (metadata.image) {
                    imageUrl = metadata.image.startsWith("ipfs://")
                        ? `https://ipfs.io/ipfs/${metadata.image.replace("ipfs://", "")}`
                        : metadata.image;
                }
                // Extract properties/attributes
                if (metadata.attributes && Array.isArray(metadata.attributes)) {
                    properties = metadata.attributes.map((attr) => ({
                        trait_type: attr.trait_type || attr.name || "Property",
                        value: attr.value || "",
                        rarity: attr.rarity || undefined,
                    }));
                }
            }
            catch (parseError) {
                console.error("Failed to parse metadata:", parseError);
            }
        }
        // Mock data for now (replace with actual blockchain queries)
        const nftDetails = {
            tokenId: tokenId,
            serialNumber: serial.toString(),
            name: metadata.name || `NFT #${serial}`,
            description: metadata.description || "Rare NFT from the collection",
            imageUrl: imageUrl || "https://via.placeholder.com/500",
            collectionName: "CyberPunk Legends",
            collectionVerified: true,
            creator: {
                name: "@neo_artist",
                address: nftInfo.accountId?.toString() || "0.0.0",
                avatar: undefined,
            },
            owner: {
                address: nftInfo.accountId?.toString() || "0.0.0",
            },
            chain: "hedera",
            contractAddress: tokenId,
            tokenStandard: "HIP-412 (HTS)",
            metadata: {
                ipfsCid: nftInfo.metadata ? Buffer.from(nftInfo.metadata).toString("utf8") : "",
                status: "frozen",
            },
            pricing: {
                currentPrice: "1,500",
                currency: "HBAR",
                usdEquivalent: "120.00",
                saleEndTime: "Sale ends in 2d 14h 32m",
            },
            properties: properties.length > 0 ? properties : [
                { trait_type: "Background", value: "Midnight", rarity: 12 },
                { trait_type: "Skin", value: "Gold Plated", rarity: 2 },
                { trait_type: "Eyes", value: "Laser Red", rarity: 5 },
            ],
            stats: {
                likes: 2400,
                views: 12500,
            },
            tags: metadata.tags || ["Art", "PFP", "Legendary"],
            activity: [
                {
                    event: "Sale",
                    price: "1,500 HBAR",
                    from: "0.0.12345",
                    to: "0.0.67890",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                    event: "Transfer",
                    from: "0.0.11111",
                    to: "0.0.12345",
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    event: "Minted",
                    from: "NullAddress",
                    to: "0.0.11111",
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ],
        };
        return res.json(nftDetails);
    }
    catch (error) {
        console.error("Error fetching Hedera NFT details:", error);
        return next(error);
    }
});
// Get NFT details for Ethereum
router.get("/ethereum/:tokenId", async (req, res, next) => {
    try {
        const { tokenId } = req.params;
        const contractAddress = process.env.ETH_CONTRACT_ADDRESS;
        if (!tokenId) {
            return res.status(400).json({ error: "Token ID is required" });
        }
        if (!contractAddress) {
            return res.status(500).json({ error: "Contract address not configured" });
        }
        // Setup provider
        const provider = new ethers_1.ethers.JsonRpcProvider(process.env.ETH_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
        // Minimal ERC721 ABI
        const abi = [
            "function tokenURI(uint256 tokenId) view returns (string)",
            "function ownerOf(uint256 tokenId) view returns (address)",
        ];
        const contract = new ethers_1.ethers.Contract(contractAddress, abi, provider);
        // Get token URI and owner
        let tokenURI = "";
        let owner = "";
        let metadata = {};
        let imageUrl = "";
        let properties = [];
        try {
            [tokenURI, owner] = await Promise.all([
                contract.tokenURI(tokenId),
                contract.ownerOf(tokenId),
            ]);
            // Fetch metadata from IPFS or HTTP
            if (tokenURI.startsWith("ipfs://")) {
                const ipfsCid = tokenURI.replace("ipfs://", "");
                tokenURI = `https://ipfs.io/ipfs/${ipfsCid}`;
            }
            const response = await axios_1.default.get(tokenURI, { timeout: 5000 });
            metadata = response.data;
            // Extract image
            if (metadata.image) {
                imageUrl = metadata.image.startsWith("ipfs://")
                    ? `https://ipfs.io/ipfs/${metadata.image.replace("ipfs://", "")}`
                    : metadata.image;
            }
            // Extract properties
            if (metadata.attributes && Array.isArray(metadata.attributes)) {
                properties = metadata.attributes.map((attr) => ({
                    trait_type: attr.trait_type || attr.name || "Property",
                    value: attr.value || "",
                    rarity: attr.rarity || undefined,
                }));
            }
        }
        catch (err) {
            console.error("Error fetching token metadata:", err);
        }
        const nftDetails = {
            tokenId: tokenId,
            name: metadata.name || `NFT #${tokenId}`,
            description: metadata.description || "Unique NFT from the collection",
            imageUrl: imageUrl || "https://via.placeholder.com/500",
            collectionName: "Ethereum Collection",
            collectionVerified: true,
            creator: {
                name: "@creator",
                address: contractAddress,
            },
            owner: {
                address: owner || "0x0000000000000000000000000000000000000000",
            },
            chain: "ethereum",
            contractAddress: contractAddress,
            tokenStandard: "ERC-721",
            metadata: {
                ipfsCid: tokenURI,
                status: "frozen",
            },
            pricing: {
                currentPrice: "0.5",
                currency: "ETH",
                usdEquivalent: "1,200.00",
            },
            properties: properties.length > 0 ? properties : [
                { trait_type: "Background", value: "Blue", rarity: 15 },
                { trait_type: "Type", value: "Rare", rarity: 5 },
            ],
            stats: {
                likes: 1250,
                views: 8500,
            },
            tags: metadata.tags || ["Art", "Digital"],
            activity: [
                {
                    event: "Minted",
                    from: "NullAddress",
                    to: owner || "0x0000",
                    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ],
        };
        return res.json(nftDetails);
    }
    catch (error) {
        console.error("Error fetching Ethereum NFT details:", error);
        return next(error);
    }
});
exports.default = router;
//# sourceMappingURL=nft.js.map