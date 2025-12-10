# NFT Multichain Minter

A full-stack NFT minting platform supporting both Ethereum (Sepolia) and Hedera networks with wallet-based authentication, IPFS storage, and a modern React frontend.

## Project Structure

```
nft-multichain-minter/
├── contracts/          # Smart contracts (Hardhat)
├── backend/           # Node.js/Express backend
│   ├── src/
│   │   ├── auth/      # JWT & signature verification
│   │   ├── chains/    # Ethereum & Hedera logic
│   │   ├── config/    # Configuration files
│   │   ├── middleware/# Validation & rate limiting
│   │   ├── queue/     # BullMQ workers
│   │   ├── routes/    # API routes
│   │   └── utils/     # Logger & utilities
│   └── package.json
└── frontend/          # Next.js frontend
    ├── app/           # Next.js 14 app directory
    ├── components/    # React components
    ├── hooks/         # Custom React hooks
    ├── lib/           # API client & utilities
    └── package.json
```

## Features Implemented

### Backend Features ✅

1. **JWT Authentication Middleware**
   - Protects all `/api/eth/*` and `/api/hedera/*` routes
   - Validates Bearer tokens from Authorization header
   - Extracts wallet address for request context

2. **Structured Logging with Pino**
   - Production-ready logging with JSON format
   - Pretty printing in development
   - Log levels: info, warn, error
   - Integrated across all backend components

3. **Validation Middleware**
   - **File Upload Validation**: PNG/JPG only, max 10MB
   - **Metadata Validation**: Name ≤100 chars, Description ≤1000 chars, Attributes as valid JSON array
   - **Rate Limiting per Chain**: Ethereum (3/min), Hedera (5/min) per wallet using Redis

4. **Queue Workers (BullMQ)**
   - `uploadWorker`: Processes file uploads
   - `ipfsWorker`: Handles IPFS image uploads
   - `metadataWorker`: Creates and uploads metadata
   - `hederaMintWorker`: Processes Hedera minting
   - Graceful shutdown handling
   - Comprehensive logging

### Frontend Features ✅

1. **Authentication System**
   - **MetaMask Integration**: EIP-191 message signing
   - **HashPack Integration**: Hedera wallet connection
   - **useAuth Hook**: Manages login state, JWT storage, auto-logout on 401
   - **WalletAuthButton**: Unified wallet connection UI

2. **File Upload & Preview**
   - **UploadDropzone**: Drag-and-drop with validation
   - **NftPreview**: Real-time NFT preview with metadata
   - File type and size validation (client-side)

3. **Metadata Management**
   - **MetadataForm**: Name, description, dynamic attributes
   - Character count validation
   - Add/remove trait functionality
   - Real-time preview updates

4. **Chain Selection**
   - **ChainSelector**: Toggle between Ethereum and Hedera
   - Visual chain indicators
   - Network information display

5. **Minting Flows**
   - **useEthereumMint**: Contract interaction with ethers.js
   - **useHederaMint**: Backend-powered Hedera minting
   - **useUploadAndPrepare**: IPFS upload coordination
   - Progress tracking for each step

6. **UI Components**
   - **ProgressSteps**: Animated step indicators
   - **LoadingSpinner**: Reusable loading states
   - **MintSuccess**: Success screen with blockchain links
   - **ToastProvider**: Global toast notifications

7. **Main Page**
   - Complete minting workflow
   - Responsive 2-column layout
   - Real-time preview
   - Progress tracking during minting
   - Success/error handling

## API Endpoints

### Authentication
- `POST /api/auth/nonce` - Get nonce for signing
- `POST /api/auth/verify` - Verify signature and get JWT

### Ethereum (Protected)
- `POST /api/eth/prepare-mint` - Upload to IPFS and prepare metadata

### Hedera (Protected)
- `POST /api/hedera/mint` - Full minting flow (upload + mint)

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with:
# - REDIS_URL
# - JWT_SECRET
# - PINATA_API_KEY (or other IPFS provider)
# - HEDERA_OPERATOR_ID
# - HEDERA_OPERATOR_KEY
# - HEDERA_NFT_TOKEN_ID

# Start backend
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with:
# - NEXT_PUBLIC_API_URL=http://localhost:8000
# - NEXT_PUBLIC_ETH_CONTRACT_ADDRESS=0x...

# Start frontend
npm run dev
```

### Contracts Setup

```bash
cd contracts
npm install

# Deploy to Sepolia
npx hardhat run scripts/deploy_sepolia.ts --network sepolia
```

## Technology Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT with wallet signature verification
- **Logging**: Pino (structured logging)
- **Queue**: BullMQ with Redis
- **Rate Limiting**: express-rate-limit + Redis
- **Validation**: Custom middleware
- **IPFS**: Pinata or similar
- **Blockchain**: ethers.js (Ethereum), @hashgraph/sdk (Hedera)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Client**: Axios with interceptors
- **Wallet Integration**: ethers.js (MetaMask), hashconnect (HashPack)
- **TypeScript**: Full type safety

## Security Features

- JWT-based authentication with wallet signatures
- Rate limiting per wallet per chain
- Input validation (file type, size, metadata length)
- CORS configuration
- Helmet.js security headers
- Environment variable management
- No credential exposure

## Development Notes

### Adding New Chains

1. Create chain-specific logic in `backend/src/chains/[chain]/`
2. Add routes in `backend/src/routes/`
3. Apply JWT middleware and validation
4. Create frontend hooks in `frontend/hooks/`
5. Update ChainSelector component

### Extending Queue Workers

Workers are structured for expansion:
- Add new queue in `backend/src/queue/bullmq.ts`
- Create worker in `backend/src/queue/workers/`
- Register in `backend/src/queue/workers/index.ts`
- Worker automatically starts with backend

## Environment Variables

### Backend (.env)
```
PORT=8000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=your_private_key
HEDERA_NFT_TOKEN_ID=0.0.xxxxx
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ETH_CONTRACT_ADDRESS=0x...
```

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

### Backend
- Deploy to VPS, AWS, or similar
- Ensure Redis is accessible
- Set production environment variables
- Use PM2 or similar for process management

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Or build static: `npm run build && npm start`
- Configure environment variables in deployment platform

## License

MIT

## Contributors

Built with best practices for production-ready NFT minting.
