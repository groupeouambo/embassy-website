# Temporary Traefik Backend Configuration

## Current Setup

Since `backend.kessetest.com` DNS is not configured yet, we're temporarily using the Traefik URL:

**Backend URL:** https://usrcaembassyorg-backend-lj9ktg-d7ef14-72-62-164-26.traefik.me

## SSL Certificate Warning

The Traefik URL will show an SSL certificate warning in your browser. This is normal and expected.

### How to Test (Bypass Certificate Warning)

1. **Visit the backend URL directly:**
   - Go to: https://usrcaembassyorg-backend-lj9ktg-d7ef14-72-62-164-26.traefik.me/api/health
   - Your browser will show: "Your connection is not private" or similar
   - Click **"Advanced"**
   - Click **"Proceed to ... (unsafe)"** or **"Accept the Risk and Continue"**
   - This accepts the self-signed certificate

2. **After accepting the certificate:**
   - Your frontend at https://kessetest.com will be able to make API calls
   - The warning only needs to be accepted once per browser session

## Alternative: Configure Custom Domain

To avoid certificate warnings, configure `backend.kessetest.com` DNS:

### Step 1: Add DNS Record
In your domain registrar (where you registered kessetest.com):

**Option A - A Record:**
```
Type: A
Host: backend
Value: [Your Dokploy server IP]
TTL: 300 (or automatic)
```

**Option B - CNAME Record:**
```
Type: CNAME
Host: backend
Value: usrcaembassyorg-backend-lj9ktg-d7ef14-72-62-164-26.traefik.me
TTL: 300 (or automatic)
```

### Step 2: Configure in Dokploy
1. Go to Dokploy → Backend Application
2. Add custom domain: `backend.kessetest.com`
3. Traefik will automatically provision an SSL certificate via Let's Encrypt

### Step 3: Update Frontend Configuration
Once DNS propagates (5-30 minutes), update the frontend:

**`.env` and `.env.production`:**
```env
REACT_APP_API_URL=https://backend.kessetest.com
```

Then commit and push:
```bash
git add .env .env.production
git commit -m "Switch to custom domain backend.kessetest.com"
git push origin main
```

And redeploy the frontend in Dokploy.

## Current Configuration

**Frontend Repository:** https://github.com/ouambo5r1/embassy-website
**Backend Repository:** https://github.com/ouambo5r1/embassy-backend

**Environment Variables:**
- Frontend `.env`: Points to Traefik URL
- Frontend `.env.production`: Points to Traefik URL
- Backend `FRONTEND_URL`: Set to `https://kessetest.com`

## Testing Checklist

With the Traefik URL:
- [x] Backend URL pushed to GitHub
- [ ] Accept SSL certificate warning in browser
- [ ] Test backend health: https://usrcaembassyorg-backend-lj9ktg-d7ef14-72-62-164-26.traefik.me/api/health
- [ ] Redeploy frontend in Dokploy (to pull new backend URL)
- [ ] Test signup/login on https://kessetest.com
- [ ] Configure backend.kessetest.com DNS (optional but recommended)

## Why Use Custom Domain?

✅ **No SSL Warnings** - Proper Let's Encrypt certificate
✅ **Professional** - backend.kessetest.com vs long Traefik URL
✅ **Easier to Remember** - Shorter, cleaner URLs
✅ **Production Ready** - No browser security warnings

The Traefik URL works fine for testing, but for production use, configure the custom domain!
