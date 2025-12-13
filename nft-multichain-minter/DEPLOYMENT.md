# Deployment Guide - NFT Multichain Minter

Complete guide for deploying the NFT Multichain Minter to production using Railway (backend) and Vercel (frontend).

---

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Vercel         │ ──────► │  Railway        │ ──────► │  Redis          │
│  (Frontend)     │  HTTPS  │  (Backend API)  │  Queue  │  (Railway)      │
│  Next.js        │         │  Express.js     │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                     │                           ▲
                                     │                           │
                                     ▼                           │
                            ┌─────────────────┐                 │
                            │  Railway        │ ────────────────┘
                            │  (Worker)       │   Queue Jobs
                            │  BullMQ         │
                            └─────────────────┘
                                     │
                                     ▼
                     ┌───────────────────────────────┐
                     │  External Services            │
                     ├───────────────────────────────┤
                     │  • NFT.Storage (IPFS)         │
                     │  • Ethereum RPC (Infura, etc) │
                     │  • Hedera Network             │
                     └───────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- GitHub account with repository access
- Railway account (free tier available)
- Vercel account (free tier available)
- NFT.Storage API key (free at https://nft.storage)
- Ethereum RPC provider (Infura, Alchemy, or QuickNode)
- Hedera testnet/mainnet account credentials

### 1. Backend Deployment (Railway)

#### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your NFT Multichain Minter repository
5. Railway will detect the monorepo structure

#### Step 2: Deploy Backend API Service

1. **Configure Service**:
   - Service Name: `nft-minter-backend`
   - Root Directory: Leave empty (railway.json handles pathing)

2. **Add Railway Redis**:
   - Click **New** → **Database** → **Add Redis**
   - Railway will automatically inject `REDIS_URL` variable

3. **Set Environment Variables**:
   
   Navigate to service → **Variables** tab and add:

   ```bash
   NODE_ENV=production
   JWT_SECRET=<generate with: openssl rand -hex 64>
   JWT_EXPIRES_IN=2h
   
   # Redis (auto-injected by Railway Redis service)
   # REDIS_URL=redis://default:password@redis.railway.internal:6379
   
   # Frontend CORS
   FRONTEND_URL=https://your-app.vercel.app
   
   # NFT.Storage
   NFT_STORAGE_API_KEY=<your-nft-storage-api-key>
   
   # Ethereum
   ETH_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ETH_CONTRACT_ADDRESS=<your-deployed-contract-address>
   ETH_NETWORK=sepolia
   
   # Hedera
   HEDERA_NETWORK=testnet
   HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
   HEDERA_OPERATOR_KEY=<your-hedera-private-key>
   HEDERA_NFT_TOKEN_ID=0.0.YOUR_TOKEN_ID
   
   # Rate Limiting (optional, defaults provided)
   ETH_RATE_LIMIT_PER_WALLET=10
   HEDERA_RATE_LIMIT_PER_WALLET=5
   GLOBAL_RATE_LIMIT=100
   ```

4. **Deploy**:
   - Click **Deploy**
   - Monitor build logs for any errors
   - Once deployed, note your Railway URL (e.g., `https://nft-minter-backend-production.up.railway.app`)

5. **Verify Deployment**:
   ```bash
   curl https://your-backend.railway.app/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

#### Step 3: Deploy Background Worker Service (Recommended)

1. **Create New Service** in same Railway project:
   - Click **New** → **GitHub Repo** (same repository)
   - Service Name: `nft-minter-worker`

2. **Configure Worker**:
   - Root Directory: Leave empty
   - Add **reference variable**: Link `REDIS_URL` from Redis service

3. **Add Worker-Specific Configuration**:
   - Copy ALL environment variables from backend service
   - Railway will use `railway.worker.json` for build/start commands

4. **Deploy Worker**:
   - Click **Deploy**
   - Verify in logs: "Worker process is running and processing queue jobs"

---

### 2. Frontend Deployment (Vercel)

#### Step 1: Import Project

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

#### Step 2: Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

#### Step 3: Environment Variables

Add these in the **Environment Variables** section:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_CHAIN_ENV=sepolia
NEXT_PUBLIC_ETH_CHAIN_ID=11155111
```

**Important**: Set these for:
- ✅ Production
- ✅ Preview (optional, for testing)
- ❌ Development (use `.env.local` instead)

#### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (2-5 minutes)
3. Note your Vercel URL (e.g., `https://nft-minter.vercel.app`)

#### Step 5: Update Backend CORS

After frontend deploys, update backend environment variable:

1. Go to Railway → Backend Service → Variables
2. Update `FRONTEND_URL` to your Vercel URL: `https://nft-minter.vercel.app`
3. Click **Redeploy** to apply changes

---

### 3. Custom Domain Setup (Optional)

#### Vercel Custom Domain

1. Go to Project → **Settings** → **Domains**
2. Add your custom domain (e.g., `app.yourdomain.com`)
3. Configure DNS records as shown by Vercel:
   - Type: `CNAME`
   - Name: `app` (or `@` for root domain)
   - Value: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-60 minutes)
5. Update backend `FRONTEND_URL` to match custom domain

#### Railway Custom Domain

1. Go to Service → **Settings** → **Networking**
2. Click **Generate Domain** or **Custom Domain**
3. For custom domain, add DNS records:
   - Type: `CNAME`
   - Name: `api` (e.g., `api.yourdomain.com`)
   - Value: provided by Railway
4. Update frontend `NEXT_PUBLIC_API_URL` to custom domain

---

## Environment Configuration Reference

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `JWT_SECRET` | Yes | JWT signing secret (64+ chars) | `<openssl rand -hex 64>` |
| `REDIS_URL` | Yes | Redis connection string | Auto-injected by Railway |
| `NFT_STORAGE_API_KEY` | Yes | IPFS storage API key | Get from nft.storage |
| `ETH_RPC_URL` | Yes | Ethereum RPC endpoint | Infura/Alchemy URL |
| `ETH_CONTRACT_ADDRESS` | Yes | Deployed contract address | `0x123...` |
| `HEDERA_OPERATOR_ID` | Yes | Hedera account ID | `0.0.12345` |
| `HEDERA_OPERATOR_KEY` | Yes | Hedera private key | DER-encoded hex |
| `HEDERA_NFT_TOKEN_ID` | Yes | HTS token ID | `0.0.67890` |
| `FRONTEND_URL` | Yes | Frontend origin for CORS | Vercel URL |
| `PORT` | No | Server port (Railway auto-injects) | `8000` |

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL | Railway backend URL |
| `NEXT_PUBLIC_CHAIN_ENV` | Yes | Blockchain network | `sepolia` or `mainnet` |
| `NEXT_PUBLIC_ETH_CHAIN_ID` | Yes | Ethereum chain ID | `11155111` (Sepolia) |

---

## Deployment Scripts Reference

### Backend Scripts

```bash
# Development
npm run dev              # Start with hot-reload

# Production
npm run build           # Compile TypeScript to dist/
npm run start:prod      # Start production API server
npm run start:worker:prod  # Start production worker

# Testing
npm run lint            # Check code style
npm test                # Run tests (if configured)
```

### Frontend Scripts

```bash
# Development
npm run dev             # Start dev server (localhost:3000)

# Production
npm run build          # Build optimized production bundle
npm run start          # Start production server (locally)

# Testing
npm run lint           # Check code style
```

---

## Monitoring & Health Checks

### Backend Health Endpoint

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "services": {
    "redis": "connected",
    "ethereum": "connected",
    "hedera": "connected"
  }
}
```

**Railway Auto-Monitoring**:
- Health checks run every 60 seconds
- Service restarts automatically on failure (up to 10 retries)
- Logs accessible via Railway dashboard

### Frontend Monitoring

**Vercel Analytics**:
- Automatic performance monitoring
- Core Web Vitals tracking
- Error reporting

**Enable**:
1. Go to Project → **Analytics**
2. Enable Vercel Analytics
3. View metrics in dashboard

---

## Troubleshooting

### Backend Issues

#### Build Fails

```bash
# Check TypeScript compilation locally
cd backend
npm install
npm run build

# View specific error in Railway logs
# Go to: Service → Deployments → Click failed deployment
```

**Common fixes**:
- Missing dependencies: Check `package.json`
- TypeScript errors: Run `npm run lint`
- Wrong Node version: Railway uses Node 18+ by default

#### Runtime Errors

```bash
# Check Railway logs
# Service → Logs → Filter by level (error, warn)
```

**Common issues**:
- Missing environment variables (check Variables tab)
- Redis connection failed (verify Redis service is running)
- RPC provider rate limit (check Infura/Alchemy dashboard)

#### CORS Errors

If frontend shows CORS errors:

1. Verify `FRONTEND_URL` in backend exactly matches frontend URL
2. Include protocol: `https://app.vercel.app` (not `app.vercel.app`)
3. No trailing slash
4. Redeploy backend after changing `FRONTEND_URL`

### Frontend Issues

#### Build Fails on Vercel

```bash
# Test build locally
cd frontend
npm install
npm run build
```

**Common fixes**:
- Missing environment variables (check Vercel Variables section)
- TypeScript errors: Check build logs
- Dependency issues: Clear Vercel build cache and redeploy

#### API Connection Issues

If frontend can't reach backend:

1. Check `NEXT_PUBLIC_API_URL` includes `https://`
2. Verify Railway backend is deployed and healthy
3. Test backend directly: `curl https://your-backend.railway.app/api/health`
4. Check browser console for specific error messages

#### Wallet Connection Issues

- Ensure correct chain ID configured
- Check if wallet is on correct network (Sepolia vs Mainnet)
- Verify contract address is correct for selected network

---

## Scaling & Performance

### Railway Free Tier Limits

- **Execution Time**: 500 hours/month
- **Resources**: Shared CPU, 512MB RAM, 1GB disk
- **Egress**: 100GB/month

**Optimization Tips**:
- Use separate worker service to distribute load
- Enable Redis connection pooling
- Implement request caching where appropriate
- Monitor usage in Railway dashboard

### Vercel Free Tier Limits

- **Bandwidth**: 100GB/month
- **Builds**: 100 hours/month
- **Serverless Function Execution**: 100GB-hours/month

**Optimization Tips**:
- Enable Vercel Edge caching
- Use Image Optimization (built-in)
- Implement ISR (Incremental Static Regeneration) where applicable

### Upgrading for Production

**When to upgrade**:
- Consistently hitting resource limits
- Need guaranteed uptime SLA
- Require dedicated resources
- High traffic volumes (>10k requests/day)

**Railway Pro**: $20/month
- 500 hours → Unlimited
- Dedicated resources
- Priority support

**Vercel Pro**: $20/month
- Increased bandwidth and builds
- Enhanced analytics
- Priority support

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use Railway/Vercel dashboards for secrets
- ✅ Rotate `JWT_SECRET` quarterly
- ✅ Use strong secrets (64+ characters)
- ✅ Limit `FRONTEND_URL` to exact domain (no wildcards)

### Network Security

- ✅ Enable CORS restrictions (configured by default)
- ✅ Use HTTPS only (enforced by Railway/Vercel)
- ✅ Implement rate limiting (configured in code)
- ✅ Validate all inputs (configured in code)
- ✅ Use Helmet security headers (configured in code)

### Private Key Management

- ⚠️  **CRITICAL**: Never expose private keys
- ✅ Store `ETH_PRIVATE_KEY` and `HEDERA_OPERATOR_KEY` only in Railway
- ✅ Use separate keys for testnet and mainnet
- ✅ Consider using managed wallet services for production
- ✅ Implement key rotation strategy

---

## Maintenance & Updates

### Regular Tasks

**Weekly**:
- Check Railway and Vercel logs for errors
- Monitor API response times
- Verify queue processing working correctly

**Monthly**:
- Update dependencies: `npm outdated && npm update`
- Review and optimize database queries
- Check RPC provider usage and costs
- Audit security logs

**Quarterly**:
- Rotate JWT secrets (with migration plan)
- Review and update rate limits
- Performance testing and optimization
- Security audit

### Updating Code

```bash
# 1. Make changes locally
git checkout -b feature/update-something
# Make changes...
git commit -m "feat: add new feature"

# 2. Push to GitHub
git push origin feature/update-something

# 3. Railway and Vercel auto-deploy from main branch
# Merge PR to trigger deployment
```

**Automatic Deployments**:
- Railway: Deploys on push to `main` branch
- Vercel: Deploys on push to `main` branch
- Preview deployments for PRs (Vercel)

---

## Support & Resources

### Documentation

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NFT.Storage API](https://nft.storage/docs)
- [Hedera SDK](https://docs.hedera.com)
- [Ethers.js](https://docs.ethers.org)

### Community

- [Railway Community](https://community.railway.app)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Hedera Discord](https://hedera.com/discord)

### Getting Help

1. **Check logs first**: Railway/Vercel dashboards
2. **Review this guide**: Common issues covered above
3. **Check documentation**: Links provided above
4. **Search GitHub issues**: Existing solutions
5. **Ask for help**: Create GitHub issue with logs

---

## Deployment Checklist

Before deploying, complete the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to ensure:

- ✅ All environment variables configured
- ✅ Smart contracts deployed
- ✅ Services healthy and responding
- ✅ End-to-end testing completed
- ✅ Security verification passed
- ✅ Monitoring configured

---

**Last Updated**: 2024-01-15  
**Maintainer**: NFT Multichain Minter Team  
**Version**: 1.0.0
