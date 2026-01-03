# Domain Update - kessetest.com

## New Frontend Domain

Your frontend is now accessible at:
**https://kessetest.com**

## What Was Updated

### Frontend Repository
- ✅ [.env](.env) - Development environment
- ✅ [.env.production](.env.production) - Production build
- ✅ Both now reference the backend API URL

### Backend Repository
- ✅ [embassy-backend/.env.example](embassy-backend/.env.example) - Updated FRONTEND_URL
- ✅ [embassy-backend/DOKPLOY_ENV_CONFIG.md](embassy-backend/DOKPLOY_ENV_CONFIG.md) - Updated documentation
- ✅ [embassy-backend/DOKPLOY_SETUP_STEPS.md](embassy-backend/DOKPLOY_SETUP_STEPS.md) - Updated documentation

## IMPORTANT: Update Backend Environment Variable in Dokploy

You need to update the backend's CORS configuration to accept requests from the new domain:

1. **Go to Dokploy Dashboard**
2. **Select your backend application**
3. **Go to Environment Variables**
4. **Update the `FRONTEND_URL` variable:**
   ```
   Old Value: https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me
   New Value: https://kessetest.com
   ```
5. **Save and Redeploy** the backend

## Why This Is Needed

The backend uses CORS (Cross-Origin Resource Sharing) to control which domains can access its API. The backend code at [index.js:33-36](embassy-backend/index.js#L33-36) checks the `FRONTEND_URL` environment variable:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

Without updating this, the backend will reject requests from `kessetest.com` with CORS errors.

## Current URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (New Domain)** | https://kessetest.com | ✅ Active |
| **Frontend (Old Traefik)** | https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me | Still works |
| **Backend** | https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me | ✅ Running |

## Testing After Update

Once you update and redeploy the backend:

1. Visit https://kessetest.com
2. Try to sign up or log in
3. Check browser console (F12) - no CORS errors should appear
4. All API requests should work successfully

## Optional: Multiple Domain Support

If you want the backend to accept requests from both the old Traefik domain AND the new custom domain, you can update the backend code to accept multiple origins. But for now, updating to just `kessetest.com` is sufficient.

---

**Summary:** Update `FRONTEND_URL=https://kessetest.com` in your backend's Dokploy environment variables and redeploy!
