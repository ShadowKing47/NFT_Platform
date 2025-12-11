# NFT Multi-Chain Minter - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env` file and configure the following:

#### Required Configuration

1. **NFT.Storage API Key** (Required for IPFS uploads)
   - Go to [https://nft.storage](https://nft.storage)
   - Sign up for a free account (email or GitHub)
   - Create a new API key
   - Add it to `.env`:
     ```
     NFT_STORAGE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

2. **Redis** (Required for rate limiting and job queues)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server
   
   # macOS
   brew install redis
   
   # Start Redis
   redis-server
   ```

3. **JWT Secret** (Already set for development)
   - For production, generate a strong secret:
     ```bash
     openssl rand -base64 64
     ```

#### Optional Configuration

**For Ethereum NFT Minting:**
- `ETH_RPC_URL` - Get from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
- `ETH_CONTRACT_ADDRESS` - Your deployed ERC-721 contract address
- `ETH_NETWORK` - Network name (mainnet, sepolia, goerli, etc.)

**For Hedera NFT Minting:**
- `HEDERA_OPERATOR_ID` - Your Hedera account ID (format: 0.0.xxxxx)
- `HEDERA_OPERATOR_KEY` - Your Hedera private key
- `HEDERA_NFT_TOKEN_ID` - Your Hedera token ID (format: 0.0.xxxxx)
- `HEDERA_NETWORK` - testnet or mainnet

### 3. Start the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm run build
npm start
```

### 4. Verify Setup

```bash
# Check health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","uptime":"5.2s","services":{"redis":"connected"},"version":"1.0.0"}
```

## Common Issues

### "IPFS image upload failed"

**Cause:** NFT_STORAGE_API_KEY is not set or invalid

**Solution:**
1. Get a free API key from [nft.storage](https://nft.storage)
2. Add it to your `.env` file
3. Restart the server

### "Redis connection failed"

**Cause:** Redis server is not running

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not running, start it:
redis-server

# Or as a service:
sudo systemctl start redis
```

### "JWT_SECRET is required"

**Cause:** JWT_SECRET is missing from .env

**Solution:**
The JWT_SECRET is already set in .env for development. For production:
```bash
# Generate a secure secret
openssl rand -base64 64

# Add to .env
JWT_SECRET=<generated-secret>
```

## API Endpoints

### Authentication
- `POST /api/auth/nonce` - Get nonce for wallet signing
- `POST /api/auth/verify` - Verify signature and get JWT token

### NFT Minting
- `POST /api/ethereum/prepare-mint` - Prepare Ethereum NFT (uploads to IPFS)
- `POST /api/hedera/mint` - Mint Hedera NFT

### NFT Information
- `GET /api/nft/hedera/:tokenId/:serialNumber` - Get Hedera NFT details
- `GET /api/nft/ethereum/:tokenId` - Get Ethereum NFT details

### Health Check
- `GET /health` - Server health status

## Security Notes

1. **Never commit `.env` to version control**
2. **Use strong JWT secrets in production** (64+ characters)
3. **Keep API keys secure** - NFT.Storage, Alchemy, Infura keys
4. **Use HTTPS in production**
5. **Configure CORS properly** for your frontend domain
6. **Review rate limits** in config/env.ts

## Development Tips

1. **Watch mode with auto-restart:**
   ```bash
   npm run dev
   ```

2. **TypeScript type checking:**
   ```bash
   npm run type-check
   ```

3. **View logs:**
   - Logs are written to console in JSON format (Pino logger)
   - Each request has a unique `requestId` for tracing

4. **Test IPFS uploads:**
   ```bash
   curl -X POST http://localhost:8000/api/ethereum/prepare-mint \
     -H "Authorization: Bearer <your-jwt-token>" \
     -F "file=@test-image.png" \
     -F "name=Test NFT" \
     -F "description=Test Description"
   ```

## Production Deployment

1. **Set environment to production:**
   ```
   NODE_ENV=production
   ```

2. **Use strong secrets:**
   - JWT_SECRET: 64+ characters
   - NFT_STORAGE_API_KEY: Valid production key

3. **Configure reverse proxy (nginx/Apache)**

4. **Enable HTTPS**

5. **Set up process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name nft-minter
   pm2 save
   ```

6. **Configure firewall:**
   - Allow port 8000 (or your configured port)
   - Restrict Redis to localhost

## Support

For issues or questions:
1. Check the logs for detailed error messages
2. Review this setup guide
3. Check the API documentation in the code comments
