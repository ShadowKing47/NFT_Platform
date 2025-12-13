# Quick Deployment Reference

Fast reference for deploying NFT Multichain Minter to production.

## Prerequisites Checklist

- [ ] GitHub repository ready
- [ ] Railway account created
- [ ] Vercel account created
- [ ] NFT.Storage API key: https://nft.storage
- [ ] Ethereum RPC provider (Infura/Alchemy/QuickNode)
- [ ] Hedera account credentials
- [ ] Smart contract deployed

---

## Railway Backend Setup (5 minutes)

### 1. Create Project & Add Redis

```bash
# Railway Dashboard:
New Project → Deploy from GitHub repo → Select repository
Add Redis: New → Database → Add Redis
```

### 2. Configure Backend Service

**Root Directory**: Leave empty  
**Service Name**: `nft-minter-backend`

### 3. Essential Environment Variables

```bash
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 64)
NFT_STORAGE_API_KEY=your_key_here
ETH_RPC_URL=https://sepolia.infura.io/v3/YOUR_ID
ETH_CONTRACT_ADDRESS=0x_your_contract
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=your_hedera_key
HEDERA_NFT_TOKEN_ID=0.0.xxxxx
FRONTEND_URL=https://your-app.vercel.app
```

**Note**: `REDIS_URL` auto-injected by Railway Redis service

### 4. Deploy & Verify

```bash
# Test health endpoint
curl https://your-backend.railway.app/api/health
```

---

## Railway Worker Setup (Optional, 3 minutes)

### 1. Add Worker Service

```bash
# Railway Dashboard:
New → GitHub Repo (same repo) → Service Name: nft-minter-worker
```

### 2. Link Variables

- Copy ALL environment variables from backend service
- Link `REDIS_URL` reference from Redis service

### 3. Deploy

Railway will use `railway.worker.json` automatically.

---

## Vercel Frontend Setup (3 minutes)

### 1. Import Project

```bash
# Vercel Dashboard:
Add New → Project → Import from GitHub
```

### 2. Configure

**Framework**: Next.js (auto-detected)  
**Root Directory**: `frontend`  
**Build Command**: `npm run build`

### 3. Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_CHAIN_ENV=sepolia
NEXT_PUBLIC_ETH_CHAIN_ID=11155111
```

### 4. Deploy

Click **Deploy** and wait 2-3 minutes.

---

## Post-Deployment (2 minutes)

### 1. Update Backend CORS

```bash
# Railway → Backend Service → Variables
FRONTEND_URL=https://your-app.vercel.app  # Update to actual Vercel URL
# Click "Redeploy"
```

### 2. Test End-to-End

1. Open frontend URL
2. Connect wallet
3. Upload test NFT image
4. Submit minting transaction
5. Verify NFT minted successfully

---

## Quick Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` matches Vercel URL exactly (include `https://`, no trailing `/`)
- Redeploy backend after updating

### Backend Build Fails
```bash
cd backend && npm install && npm run build
# Fix any TypeScript errors shown
```

### Frontend Build Fails
```bash
cd frontend && npm install && npm run build
# Fix any build errors shown
```

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` includes `https://`
- Test: `curl https://your-backend.railway.app/api/health`
- Verify Railway backend is running (check Deployments tab)

---

## Environment Variables Quick Reference

### Backend (Railway)

| Variable | Example | Required |
|----------|---------|----------|
| `NODE_ENV` | `production` | ✅ |
| `JWT_SECRET` | `<64+ chars>` | ✅ |
| `REDIS_URL` | Auto-injected | ✅ |
| `NFT_STORAGE_API_KEY` | `eyJhb...` | ✅ |
| `ETH_RPC_URL` | `https://...infura.io/v3/...` | ✅ |
| `ETH_CONTRACT_ADDRESS` | `0x123...` | ✅ |
| `HEDERA_OPERATOR_ID` | `0.0.12345` | ✅ |
| `HEDERA_OPERATOR_KEY` | `302e02...` | ✅ |
| `HEDERA_NFT_TOKEN_ID` | `0.0.67890` | ✅ |
| `FRONTEND_URL` | `https://app.vercel.app` | ✅ |

### Frontend (Vercel)

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `https://backend.railway.app` | ✅ |
| `NEXT_PUBLIC_CHAIN_ENV` | `sepolia` | ✅ |
| `NEXT_PUBLIC_ETH_CHAIN_ID` | `11155111` | ✅ |

---

## Useful Commands

```bash
# Generate JWT secret
openssl rand -hex 64

# Test backend locally
cd backend && npm run build && npm run start:prod

# Test frontend locally
cd frontend && npm run build && npm start

# View Railway logs
railway logs

# View Vercel logs
vercel logs
```

---

## Support

- Full Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

---

**Total Setup Time**: ~15 minutes  
**Last Updated**: 2024-01-15
