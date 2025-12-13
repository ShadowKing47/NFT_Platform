# Deployment Configuration Index

Quick reference to all deployment-related files in this project.

## Documentation Files  

| File | Size | Purpose | Audience |
|------|------|---------|----------|
| [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) | 4.4K | Fast deployment guide (~15 min) | Experienced developers |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 16K | Comprehensive deployment guide | All users |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | 9.7K | Pre/post-deployment verification | DevOps, QA |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | 16K | Technical overview of changes | Team leads, architects |

## Configuration Files

### Backend

| File | Size | Purpose |
|------|------|---------|
| [backend/src/worker.ts](./backend/src/worker.ts) | 941B | Background worker process entry point |
| [backend/.env.production.example](./backend/.env.production.example) | 4.9K | Production environment template |
| [backend/package.json](./backend/package.json) | Updated | Production scripts added |

### Frontend

| File | Size | Purpose |
|------|------|---------|
| [frontend/.env.production.example](./frontend/.env.production.example) | 1.8K | Frontend production environment template |
| [frontend/vercel.json](./frontend/vercel.json) | 213B | Vercel deployment configuration |

### Platform Configurations

| File | Size | Purpose |
|------|------|---------|
| [railway.json](./railway.json) | 386B | Railway backend API deployment config |
| [railway.worker.json](./railway.worker.json) | 324B | Railway background worker deployment config |

## Quick Navigation

### I want to...

#### Deploy to production for the first time
→ Start with [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)

#### Get detailed deployment instructions
→ Read [DEPLOYMENT.md](./DEPLOYMENT.md)

#### Verify my deployment is correct
→ Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

#### Understand what was added
→ Review [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

#### Configure backend for production
→ Copy [backend/.env.production.example](./backend/.env.production.example) to `.env` and fill in values

#### Configure frontend for production
→ Copy [frontend/.env.production.example](./frontend/.env.production.example) to `.env.production` and fill in values

#### Deploy a separate worker service
→ Use [railway.worker.json](./railway.worker.json) configuration

#### Troubleshoot deployment issues
→ See [DEPLOYMENT.md](./DEPLOYMENT.md) Troubleshooting section

## Deployment Architecture

```
Production Stack:
├── Vercel (Frontend)
│   ├── Next.js Application
│   ├── Configuration: frontend/vercel.json
│   └── Environment: frontend/.env.production.example
│
├── Railway (Backend API)
│   ├── Express.js Server
│   ├── Configuration: railway.json
│   ├── Start Script: npm run start:prod
│   └── Environment: backend/.env.production.example
│
├── Railway (Worker) [Optional]
│   ├── BullMQ Queue Processor
│   ├── Configuration: railway.worker.json
│   ├── Entry Point: backend/src/worker.ts
│   ├── Start Script: npm run start:worker:prod
│   └── Environment: Shared with Backend API
│
└── Railway (Redis)
    ├── Queue Storage (BullMQ)
    ├── Rate Limiting Data
    └── Auto-configured
```

## Environment Variables

### Backend (Railway)

See [backend/.env.production.example](./backend/.env.production.example) for complete list.

**Critical Variables**:
- `NODE_ENV=production`
- `JWT_SECRET` (64+ characters)
- `REDIS_URL` (auto-injected by Railway)
- `NFT_STORAGE_API_KEY`
- `ETH_RPC_URL`
- `HEDERA_OPERATOR_ID`
- `HEDERA_OPERATOR_KEY`
- `FRONTEND_URL`

### Frontend (Vercel)

See [frontend/.env.production.example](./frontend/.env.production.example) for complete list.

**Required Variables**:
- `NEXT_PUBLIC_API_URL` (Railway backend URL)
- `NEXT_PUBLIC_CHAIN_ENV` (sepolia/mainnet)
- `NEXT_PUBLIC_ETH_CHAIN_ID` (chain ID number)

## Deployment Scripts

### Backend Scripts (package.json)

```bash
npm run build              # Compile TypeScript to dist/
npm run start:prod         # Start production API server
npm run start:worker:prod  # Start production queue worker
```

### Frontend Scripts

```bash
npm run build             # Build optimized production bundle
npm run start             # Start production server (local testing)
```

Vercel handles building and starting automatically in production.

## Health Checks

### Backend API
```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Frontend
Open browser and check for:
- ✅ No console errors
- ✅ API calls succeeding
- ✅ Wallet connection working

## Common Commands

```bash
# Generate secure JWT secret
openssl rand -hex 64

# Test backend build locally
cd backend && npm run build

# Test frontend build locally
cd frontend && npm run build

# Start production simulation locally
npm run start:prod  # Backend
npm start           # Frontend
```

## Support

For help with deployment:

1. **Check Documentation**:
   - Quick issues → [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) Troubleshooting
   - Detailed issues → [DEPLOYMENT.md](./DEPLOYMENT.md) Troubleshooting section

2. **Verify Configuration**:
   - Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
   - Compare your `.env` with `.env.production.example`

3. **Check Logs**:
   - Railway: Service → Logs tab
   - Vercel: Project → Deployments → Click deployment

4. **External Resources**:
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)

## Changes from Default Configuration

This project includes production-ready deployment configuration:

**Added**:
- ✅ Separate worker process for queue processing
- ✅ Production environment templates with inline documentation
- ✅ Platform-specific deployment configurations (Railway, Vercel)
- ✅ Comprehensive deployment guides (3 levels of detail)
- ✅ Deployment verification checklist
- ✅ Health check monitoring
- ✅ Automatic restart policies
- ✅ Security best practices documentation

**Benefits**:
- 🚀 Deploy to production in ~15 minutes
- 🔒 Security warnings and best practices built-in
- 📈 Optimized for free-tier hosting (Railway + Vercel)
- 🔄 Automatic deployments on git push
- 📊 Health monitoring and auto-restart
- 🛠️ Separate worker service reduces API server load
- 📚 Multiple documentation levels for different needs

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
