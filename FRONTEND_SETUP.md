# Frontend Setup - Connect to Dokploy Backend

## Issue
Your frontend is trying to connect to `localhost:4000` instead of the Dokploy backend URL.

**Error:** `POST http://localhost:4000/api/signup net::ERR_CONNECTION_REFUSED`

## Solution

I've created `.env` and `.env.production` files with the correct backend URL.

### Step 1: Restart Your Development Server

If you're running the frontend locally (`npm start`), you need to **restart it** for the environment variables to take effect:

1. **Stop the current development server** (Press `Ctrl+C` in the terminal where it's running)

2. **Start it again:**
   ```bash
   npm start
   ```

The frontend will now connect to: `https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me`

### Step 2: For Deployed Frontend (Dokploy)

If you're deploying the frontend to Dokploy, you need to configure the environment variable there:

1. **Go to Dokploy Dashboard** → Your frontend application
2. **Add Environment Variable:**
   ```
   Variable Name: REACT_APP_API_URL
   Value: https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
   ```
3. **Save and Redeploy**

## Environment Files Created

### `.env` (for local development)
```env
REACT_APP_API_URL=https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
```

### `.env.production` (for production builds)
```env
REACT_APP_API_URL=https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
```

## How It Works

The frontend code in `src/api.js` is already configured to use environment variables:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
```

It will use:
1. `REACT_APP_API_URL` from environment variables (if set)
2. Falls back to `http://localhost:4000` (if not set)

## Testing

After restarting, test the signup/login functionality:

1. Visit your frontend: `https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me`
2. Try to sign up or log in
3. Check the browser console (F12) - you should see API requests going to the Dokploy backend URL, not localhost

## Important Notes

- **Backend Must Be Running:** Before the frontend can work, the backend must be successfully deployed and running on Dokploy with all environment variables configured (see `DOKPLOY_SETUP_STEPS.md`)
- **CORS:** The backend is configured to accept requests from your frontend URL
- **HTTPS:** Both frontend and backend are using HTTPS via Traefik

## Current URLs

- **Frontend:** https://usrcaembassy-8n3wfn-eeeb70-72-62-164-26.traefik.me
- **Backend:** https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me
- **Backend Health Check:** https://usrcaembassyorg-backend-lj9ktg-ae1efa-72-62-164-26.traefik.me/api/health

## Troubleshooting

### Still getting localhost errors after restart?
- Make sure you fully stopped the dev server (Ctrl+C)
- Check that `.env` file exists in the root directory (same level as `src/`)
- Environment variables in React must start with `REACT_APP_`

### CORS errors?
- Make sure the backend has `FRONTEND_URL` environment variable set correctly in Dokploy
- Backend must be running successfully (check deployment logs)

### Backend "Bad Gateway"?
- Follow the steps in `embassy-backend/DOKPLOY_SETUP_STEPS.md`
- Add all required environment variables to the backend in Dokploy
- Redeploy the backend
