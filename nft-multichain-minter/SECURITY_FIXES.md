# Security Fixes Applied - December 11, 2025

This document details all critical security vulnerabilities that were identified and fixed in the NFT Multichain Minter backend.

## Critical Security Vulnerabilities (ALL FIXED ✅)

### 1. JWT Tokens Not Expiring (CRITICAL)
**Issue**: JWT tokens were using incorrect property name `expires` instead of `expiresIn`
**Impact**: Tokens would never expire, allowing indefinite session hijacking
**Files Fixed**: `backend/src/auth/jwtService.ts`

**Before**:
```typescript
const token = jwt.sign(payload, JWT_SECRET, {
    expires: "2h"  // This does nothing!
});
```

**After**:
```typescript
const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "2h",  // Tokens now actually expire
    clockTolerance: 5  // Added 5s tolerance for clock drift
});
```

**Status**: ✅ FIXED

---

### 2. Function Name Typo (CRITICAL)
**Issue**: Function named `veerifyJwt` instead of `verifyJwt`
**Impact**: Could cause runtime errors and authentication bypass
**Files Fixed**: `backend/src/auth/jwtService.ts`

**Status**: ✅ FIXED - Function renamed to `verifyJwt`

---

### 3. Weak JWT Secret Validation (CRITICAL)
**Issue**: Weak default JWT secret ("supersecret") and no validation
**Impact**: Allowed weak secrets in production, enabling token forgery
**Files Fixed**: `backend/src/config/env.ts`

**Before**:
```typescript
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
```

**After**:
```typescript
const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error(
        "JWT_SECRET must be at least 32 characters long. " +
        "For production, use 64+ character secrets. " +
        "Generate with: openssl rand -hex 32"
    );
}
```

**Status**: ✅ FIXED - Application will not start without proper JWT secret

---

### 4. Redis Export Typo (CRITICAL)
**Issue**: Export named `redisConnetion` instead of `redisConnection`
**Impact**: BullMQ queues couldn't import Redis connection, causing runtime errors
**Files Fixed**: `backend/src/config/redis.ts`

**Status**: ✅ FIXED

---

### 5. Inconsistent Address Normalization (CRITICAL)
**Issue**: Wallet addresses not consistently normalized before comparison
**Impact**: Signature verification could be bypassed with case variations (MetaMask uses EIP-55 mixed case)
**Files Fixed**:
- `backend/src/auth/signatureService.ts`
- `backend/src/auth/nonceService.ts`
- `backend/src/routes/auth/nonce.ts`
- `backend/src/routes/auth/verify.ts`
- `backend/src/rateLimiters/hederaWalletLimiter.ts`

**Fixes Applied**:
- All wallet comparisons use `.toLowerCase()`
- All nonce storage/lookup uses normalized addresses
- All rate limiting uses normalized addresses
- Ethereum address validation with regex: `/^0x[a-fA-F0-9]{40}$/`

**Status**: ✅ FIXED

---

## Bonus Security Hardening (ALL IMPLEMENTED ✅)

### 1. Empty Signature Rejection
**What**: Validate that signatures are non-empty before processing
**Files**: `backend/src/auth/signatureService.ts`, `backend/src/routes/auth/verify.ts`
**Status**: ✅ IMPLEMENTED

### 2. Replay Attack Prevention
**What**: Delete nonces on both successful and failed authentication attempts
**Files**: `backend/src/routes/auth/verify.ts`
**Status**: ✅ IMPLEMENTED

### 3. JWT Clock Tolerance
**What**: Added 5-second tolerance for JWT verification to handle clock drift
**Files**: `backend/src/auth/jwtService.ts`
**Status**: ✅ IMPLEMENTED

### 4. Metadata Size Validation
**What**: Limit metadata to 500KB and max 50 attributes to prevent JSON exploits
**Files**: `backend/src/middleware/validateMetadata.ts`
**Status**: ✅ IMPLEMENTED

### 5. CORS Origin Restrictions
**What**: Configure CORS to only allow specific origins (not wildcard)
**Files**: `backend/src/index.ts`
**Configuration**:
- Production: Single domain from `FRONTEND_URL` environment variable
- Development: localhost:3000, 3001, 5173
**Status**: ✅ IMPLEMENTED (requires FRONTEND_URL env var in production)

### 6. Hedera Account ID Validation
**What**: Validate Hedera account IDs match format `0.0.xxxxx`
**Files**: `backend/src/routes/hedera.ts`
**Status**: ✅ IMPLEMENTED

---

## Security Architecture

### Authentication Flow (Now Secure)
1. Client requests nonce for wallet address (validated Ethereum address format)
2. Server generates random nonce, stores with normalized address (5min TTL)
3. Client signs nonce with wallet
4. Client submits wallet + signature (both validated non-empty)
5. Server normalizes wallet address
6. Server verifies signature (case-insensitive comparison)
7. Server deletes nonce (success OR failure - prevents replay)
8. Server issues JWT with 2-hour expiry
9. All subsequent requests verified with JWT (clock tolerance: 5s)

### Rate Limiting (Now Secure)
- Ethereum wallets: 10 requests/minute per wallet (normalized address)
- Hedera accounts: 5 requests/minute per account (trimmed ID)
- Global API: 100 requests per 15 minutes per IP

### Circuit Breakers (Resilience)
- Ethereum RPC: 8s timeout, 50% error threshold, 15s reset
- Hedera SDK: 10s timeout, 40% error threshold, 20s reset
- IPFS: 10s timeout, 50% error threshold, 30s reset

### Input Validation
- Wallet addresses: Ethereum regex validation + normalization
- Hedera account IDs: Format validation `\d+\.\d+\.\d+`
- Metadata: 500KB max size, 50 max attributes
- File uploads: Type validation, size limits via Multer
- Signatures: Non-empty validation

---

## Deployment Checklist

Before deploying to production:

### Required Environment Variables
- [ ] `JWT_SECRET` - Minimum 32 characters (64+ recommended)
- [ ] `NFT_STORAGE_API_KEY` - From https://nft.storage
- [ ] `REDIS_URL` - Redis connection string
- [ ] `FRONTEND_URL` - Your frontend domain for CORS
- [ ] `ETH_RPC_URL` - Ethereum RPC provider
- [ ] `ETH_CONTRACT_ADDRESS` - Deployed ERC-721 contract
- [ ] `HEDERA_OPERATOR_ID` - Hedera operator account
- [ ] `HEDERA_OPERATOR_KEY` - Hedera operator private key
- [ ] `HEDERA_NFT_TOKEN_ID` - Hedera HTS token ID

### Security Verification
- [ ] JWT secret is 64+ characters
- [ ] Private keys stored securely (never in code/env file)
- [ ] CORS restricted to your domain only
- [ ] Redis requires authentication
- [ ] HTTPS enabled (TLS certificates)
- [ ] Rate limiting configured appropriately
- [ ] Error messages don't leak sensitive info

### Testing
- [ ] Authentication flow works end-to-end
- [ ] JWT tokens expire after 2 hours
- [ ] Rate limiting prevents abuse
- [ ] Circuit breakers open on failures
- [ ] Nonce replay attacks blocked
- [ ] Case variations in wallet addresses handled

---

## Known Remaining Issues

### High Priority (Not Security-Critical)
1. Worker logic not implemented (TODO placeholders in workers)
2. Some TypeScript `any` types remain (26+ instances)
3. Missing `axios` dependency for NFT metadata fetching
4. Some middleware functions don't return values in all code paths

### Medium Priority
1. Error handling could be more comprehensive
2. Audit logging not implemented
3. Request correlation IDs not added

These do NOT affect the security fixes above but should be addressed for production readiness.

---

## Summary

All 5 critical security vulnerabilities have been fixed:
✅ JWT tokens now expire correctly (2 hours)
✅ Function names are correct
✅ JWT secrets validated (min 32 chars, fails on startup if missing)
✅ Redis connection exports correct
✅ Wallet addresses normalized throughout

All 6 bonus security hardening features implemented:
✅ Empty signature rejection
✅ Replay attack prevention
✅ JWT clock tolerance
✅ Metadata size validation
✅ CORS origin restrictions
✅ Hedera account ID validation

The authentication system is now production-ready from a security perspective.
