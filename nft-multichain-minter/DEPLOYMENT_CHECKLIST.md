# NFT Multichain Minter - Deployment Checklist

Complete this checklist before and after deploying to production to ensure a smooth, secure deployment.

---

## Pre-Deployment Preparation

### 1. Code Quality & Testing

- [ ] All TypeScript compilation errors resolved (`npm run build` in both frontend and backend)
- [ ] No ESLint errors or critical warnings (`npm run lint`)
- [ ] All tests passing (if applicable)
- [ ] Code reviewed and approved
- [ ] Git repository clean (no uncommitted changes)
- [ ] All sensitive data removed from codebase (no hardcoded keys, secrets, or passwords)

### 2. Environment Configuration

#### Backend Environment Variables

- [ ] `JWT_SECRET` generated (minimum 64 characters) using `openssl rand -hex 64`
- [ ] `REDIS_URL` configured with production Redis instance
- [ ] `NFT_STORAGE_API_KEY` obtained from https://nft.storage
- [ ] `ETH_RPC_URL` configured with production RPC provider (Infura, Alchemy, QuickNode)
- [ ] `ETH_CONTRACT_ADDRESS` set to deployed production contract
- [ ] `ETH_PRIVATE_KEY` secured (only if server-side minting enabled)
- [ ] `HEDERA_OPERATOR_ID` and `HEDERA_OPERATOR_KEY` configured
- [ ] `HEDERA_NFT_TOKEN_ID` set to production HTS token
- [ ] `FRONTEND_URL` set to production frontend domain (Vercel)
- [ ] `NODE_ENV` set to `production`
- [ ] All circuit breaker and rate limit values reviewed for production load

#### Frontend Environment Variables

- [ ] `NEXT_PUBLIC_API_URL` set to deployed backend URL (Railway)
- [ ] `NEXT_PUBLIC_CHAIN_ENV` matches backend configuration (mainnet/testnet)
- [ ] `NEXT_PUBLIC_ETH_CHAIN_ID` set correctly (1 for mainnet, 11155111 for Sepolia)
- [ ] All `NEXT_PUBLIC_*` variables added to Vercel dashboard

### 3. Smart Contract Deployment

- [ ] ERC-721 contract deployed to target network (mainnet or testnet)
- [ ] Contract address verified on block explorer (Etherscan, etc.)
- [ ] Contract ownership/permissions configured correctly
- [ ] Hedera Token Service (HTS) token created and configured
- [ ] Contract addresses updated in backend `.env` file

### 4. Infrastructure Setup

- [ ] Redis instance provisioned (Railway Redis or external provider like Upstash)
- [ ] Redis connection tested and verified
- [ ] Database backups configured (if using persistent storage)
- [ ] SSL/TLS certificates configured (handled by Railway/Vercel by default)

---

## Backend Deployment (Railway)

### Main API Service

- [ ] Create new Railway project or use existing
- [ ] Connect GitHub repository to Railway
- [ ] Set root directory to `/backend` (if monorepo) or leave empty
- [ ] Configure environment variables in Railway dashboard:
  - Copy all variables from `.env.production.example`
  - Add Railway-generated `REDIS_URL` from Redis service
  - Ensure `PORT` variable is NOT set (Railway injects automatically)
- [ ] Deploy using `railway.json` configuration
- [ ] Verify build completes successfully
- [ ] Check deployment logs for errors
- [ ] Confirm service is running and healthy

### Background Worker Service (Optional but Recommended)

- [ ] Create separate Railway service in same project
- [ ] Use same GitHub repository and branch
- [ ] Set root directory to `/backend`
- [ ] Configure same environment variables as main API service
- [ ] Deploy using `railway.worker.json` configuration
- [ ] Verify worker starts and connects to Redis
- [ ] Check logs for successful queue processing
- [ ] Confirm no duplicate job processing between API and worker

### Railway Configuration Notes

```bash
# Build Command (automatic via railway.json)
cd backend && npm install && npm run build

# Start Command - API Service
cd backend && npm run start:prod

# Start Command - Worker Service  
cd backend && npm run start:worker:prod
```

---

## Frontend Deployment (Vercel)

### Vercel Setup

- [ ] Import project from GitHub to Vercel
- [ ] Set framework preset to **Next.js**
- [ ] Set root directory to `/frontend`
- [ ] Configure build settings:
  - Build Command: `npm run build` (default)
  - Output Directory: `.next` (default)
  - Install Command: `npm install` (default)
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_API_URL` = Railway backend URL
  - `NEXT_PUBLIC_CHAIN_ENV` = production network
  - `NEXT_PUBLIC_ETH_CHAIN_ID` = chain ID number
- [ ] Enable automatic deployments from main branch
- [ ] Deploy and wait for build completion
- [ ] Verify no build errors in deployment logs

### Vercel Domain Configuration

- [ ] Configure custom domain (optional)
- [ ] Verify DNS settings propagated
- [ ] Update `FRONTEND_URL` in backend environment variables to match Vercel domain
- [ ] Redeploy backend to pick up updated CORS configuration

---

## Post-Deployment Verification

### Backend Health Checks

- [ ] Health endpoint responding: `GET https://your-backend.railway.app/api/health`
- [ ] Response status: `200 OK`
- [ ] Response includes `"status": "ok"` and service component statuses
- [ ] Backend logs show no critical errors
- [ ] Redis connection established successfully
- [ ] Worker process running and processing jobs (if deployed separately)

### Frontend Functionality Tests

- [ ] Frontend loads without errors
- [ ] No console errors in browser developer tools
- [ ] API calls reach backend successfully (check Network tab)
- [ ] CORS working correctly (no CORS errors in console)
- [ ] Wallet connection works (MetaMask, WalletConnect)
- [ ] Authentication flow completes (nonce request → signature → JWT token)
- [ ] Chain selector displays correct networks

### End-to-End NFT Minting Tests

#### Ethereum NFT Minting

- [ ] Select Ethereum network
- [ ] Connect wallet successfully
- [ ] Upload NFT image/media (< 100MB)
- [ ] Fill metadata form (name, description, attributes)
- [ ] Submit minting request
- [ ] Receive transaction hash or confirmation
- [ ] Verify NFT appears in wallet
- [ ] Check NFT on block explorer (Etherscan)
- [ ] Verify metadata on IPFS

#### Hedera NFT Minting

- [ ] Select Hedera network
- [ ] Connect wallet successfully
- [ ] Upload NFT media
- [ ] Fill metadata form
- [ ] Submit minting request
- [ ] Receive transaction ID
- [ ] Verify NFT on Hedera explorer (HashScan)
- [ ] Check metadata availability

### Security Verification

- [ ] JWT tokens being issued correctly
- [ ] Tokens include expiration (`exp` claim)
- [ ] Signature verification working for wallet authentication
- [ ] Rate limiting active and enforcing limits
- [ ] File upload size limits enforced (100MB max)
- [ ] File type validation working (images, videos, audio)
- [ ] CORS restricted to production frontend domain only
- [ ] Helmet security headers present in responses
- [ ] No sensitive data exposed in API responses
- [ ] Private keys and secrets not logged or exposed

### Performance Checks

- [ ] Backend response times acceptable (< 2s for most endpoints)
- [ ] Frontend loads quickly (Core Web Vitals passing)
- [ ] IPFS uploads completing within reasonable time (< 30s)
- [ ] Queue processing working efficiently (background workers)
- [ ] Circuit breakers not tripping under normal load
- [ ] No memory leaks after extended operation

---

## Monitoring & Maintenance

### Ongoing Monitoring

- [ ] Set up error tracking (Sentry, LogRocket, or similar)
- [ ] Configure log aggregation (Railway logs, external service)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Monitor API response times and error rates
- [ ] Track queue processing metrics (job success/failure rates)
- [ ] Monitor Redis memory usage and connection pool
- [ ] Track RPC provider rate limits and usage

### Regular Maintenance Tasks

- [ ] Review application logs weekly for errors and warnings
- [ ] Monitor blockchain network status (mainnet/testnet)
- [ ] Check NFT.Storage API quota and usage
- [ ] Review rate limiting effectiveness
- [ ] Update dependencies monthly (security patches)
- [ ] Test backup and recovery procedures
- [ ] Rotate JWT secrets quarterly (with migration plan)
- [ ] Review and optimize database queries if applicable

---

## Rollback Plan

If critical issues arise post-deployment:

### Immediate Actions

- [ ] Revert to previous stable deployment via Railway/Vercel dashboard
- [ ] Notify users of temporary service interruption (if applicable)
- [ ] Capture error logs and traces for debugging
- [ ] Disable problematic features via feature flags if possible

### Investigation & Resolution

- [ ] Identify root cause from logs and error tracking
- [ ] Reproduce issue in staging/development environment
- [ ] Implement fix and test thoroughly
- [ ] Deploy fix with this checklist verification
- [ ] Monitor closely for 24-48 hours post-fix

---

## Support & Resources

### Documentation References

- [Railway Deployment Docs](https://docs.railway.app)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [NFT.Storage API Docs](https://nft.storage/docs)
- [Hedera SDK Docs](https://docs.hedera.com)
- [Ethers.js Documentation](https://docs.ethers.org)

### Useful Commands

```bash
# Check backend build locally
cd backend && npm run build

# Check frontend build locally  
cd frontend && npm run build

# Generate secure JWT secret
openssl rand -hex 64

# Test backend health endpoint
curl https://your-backend.railway.app/api/health

# View Railway logs
railway logs

# View Vercel logs
vercel logs
```

---

## Deployment Complete

- [ ] All checklist items verified and checked
- [ ] Production URLs documented and shared with team
- [ ] Deployment notes and any issues documented
- [ ] Monitoring dashboards configured and accessible
- [ ] Team trained on rollback procedures
- [ ] Success! NFT Multichain Minter is live in production

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Backend URL**: _______________  
**Frontend URL**: _______________  
**Notes**: _______________
