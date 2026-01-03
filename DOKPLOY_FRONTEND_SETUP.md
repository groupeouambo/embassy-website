# Dokploy Frontend Setup Guide

## Current Issue

Frontend URL returns **502 Bad Gateway**:
- **URL:** https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me
- **Cause:** Frontend deployment not configured properly in Dokploy

## Prerequisites

✅ Backend is working: https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
✅ Frontend code is in GitHub: https://github.com/ouambo5r1/embassy-website.git
✅ Environment file (`.env`) is configured with backend URL

## Step-by-Step Setup in Dokploy

### Step 1: Create/Configure Frontend Application in Dokploy

1. **Go to Dokploy Dashboard**
2. **Select or Create Frontend Application**
   - Application Type: **Node.js** or **Static Site**
   - Repository: `https://github.com/ouambo5r1/embassy-website.git`
   - Branch: `main`

### Step 2: Build Configuration

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Install Command:** `npm install`
- **Output Directory:** `build`
- **Node Version:** 18.x or 20.x (LTS)

### Step 3: Environment Variables

Add this environment variable in Dokploy:

```
Variable Name: REACT_APP_API_URL
Value: https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
```

**Important:** React environment variables MUST start with `REACT_APP_` and are only read during build time.

### Step 4: Deploy Configuration

**Deployment Type Options:**

#### Option A: Static Site (Recommended for React)
- **Type:** Static Site / SPA
- **Serve Directory:** `build`
- **SPA Routing:** Enable (for React Router)

#### Option B: Node.js with Serve
If Dokploy requires a Node.js app:
- **Start Command:** `npx serve -s build -l 3000`
- **Port:** 3000
- **Install serve:** Will be installed via npx

### Step 5: Deploy

1. **Save all configurations**
2. **Click "Deploy" or "Rebuild"**
3. **Watch the deployment logs**

Expected build output:
```
npm install
npm run build
> Creating an optimized production build...
> Compiled successfully!
> Build folder is ready: build/
```

### Step 6: Verify Deployment

After successful deployment:

1. **Test the frontend URL:**
   ```
   https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me
   ```
   You should see the embassy website homepage.

2. **Test signup/login:**
   - Try creating an account
   - Check browser console (F12) - API requests should go to the backend URL
   - No CORS errors should appear

## Troubleshooting

### Build Fails - "npm ERR!"
- Check Node.js version is 18.x or higher
- Verify `package.json` exists in the repository
- Check deployment logs for specific error

### Still Getting 502 Bad Gateway
- Verify the deployment completed successfully
- Check if the build output directory is correct (`build`)
- Ensure the application is started and running

### Blank Page / White Screen
- Check browser console for errors
- Verify environment variable `REACT_APP_API_URL` was set **before** the build
- The variable must be set in Dokploy, not just in the `.env` file

### CORS Errors
- Backend must have `FRONTEND_URL` environment variable set to your frontend URL
- Backend CORS is configured in `embassy-backend/index.js:33-36`
- Current backend accepts: `https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me`

### API Connection Errors
- Verify backend is running: https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me/api/health
- Should return: `{"status":"ok"}`
- Check that `REACT_APP_API_URL` points to the correct backend URL

## Alternative: Deploy Pre-built Version

If you have issues with building in Dokploy, you can build locally and deploy:

```bash
# On your local machine
npm install
npm run build

# This creates a 'build' folder with optimized production files
# Upload the 'build' folder to Dokploy as a static site
```

## Files in Repository

✅ `package.json` - Dependencies and build scripts
✅ `public/` - Static assets (HTML, favicon, etc.)
✅ `src/` - React source code
✅ `.env` - Development environment variables
✅ `.env.production` - Production environment variables
✅ `build/` - Production build (generated, not in git)

## Current Configuration

**Frontend:**
- Repository: https://github.com/ouambo5r1/embassy-website.git
- Deployment URL: https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me
- Backend API: https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me

**Backend:**
- Repository: https://github.com/ouambo5r1/embassy-backend.git
- API URL: https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
- Status: ✅ Running successfully

## Next Steps After Frontend Deploys

1. ✅ Test complete user flow (signup → login → application submission)
2. ✅ Test all application types (visa, marriage, birth, travel pass)
3. ✅ Verify admin functions work
4. ⚠️ Add SendGrid API key for email notifications (optional)
5. 🔐 Update JWT_SECRET if using default (security)

---

Once the frontend is deployed successfully, your complete embassy application will be live and functional!
