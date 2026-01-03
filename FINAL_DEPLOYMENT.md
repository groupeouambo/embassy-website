# Final Deployment Configuration

## Custom Domains

Your embassy application now uses custom domains:

- **Frontend:** https://kessetest.com
- **Backend:** https://backend.kessetest.com

## What Was Updated

### ✅ Frontend Repository (embassy-website)
- [.env](.env) - Updated to `REACT_APP_API_URL=https://backend.kessetest.com`
- [.env.production](.env.production) - Updated to `REACT_APP_API_URL=https://backend.kessetest.com`
- All changes pushed to GitHub

### ✅ Backend Repository (embassy-backend)
- [.env.example](embassy-backend/.env.example) - `FRONTEND_URL=https://kessetest.com`
- [db.js](embassy-backend/db.js) - All database tables added (marriage, birth cert, travel pass)
- All changes pushed to GitHub

## DNS Configuration

Make sure your DNS is configured:

| Domain | Type | Points To |
|--------|------|-----------|
| kessetest.com | A/CNAME | Frontend Dokploy Server |
| backend.kessetest.com | A/CNAME | Backend Dokploy Server |

## Dokploy Configuration Required

### Frontend (kessetest.com)
1. **Domain:** Configure `kessetest.com` in Dokploy
2. **Environment Variable:**
   ```
   REACT_APP_API_URL=https://backend.kessetest.com
   ```
3. **Redeploy** to pull latest code from GitHub

### Backend (backend.kessetest.com)
1. **Domain:** Configure `backend.kessetest.com` in Dokploy
2. **Environment Variables:**
   ```
   DB_HOST=usrcaembassyorg-zirhmuteembassy-pvq7ig
   DB_USER=root
   DB_PASSWORD=Admin
   DB_NAME=zirhmute_embassy
   DB_PORT=3306
   PORT=4000
   FRONTEND_URL=https://kessetest.com
   NODE_ENV=production
   JWT_SECRET=<generate-secure-secret>
   JWT_EXPIRES_IN=7d
   ```
3. **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **Redeploy** to:
   - Pull latest code from GitHub
   - Create all database tables
   - Enable CORS for kessetest.com

## SSL Certificates

With custom domains, Dokploy/Traefik will automatically provision **trusted SSL certificates** via Let's Encrypt. This resolves the `ERR_CERT_AUTHORITY_INVALID` error.

## Testing Checklist

After deploying with custom domains:

### Frontend (https://kessetest.com)
- [ ] Site loads without errors
- [ ] No WebSocket errors in production build
- [ ] Can navigate to all pages

### Backend (https://backend.kessetest.com)
- [ ] Health check works: https://backend.kessetest.com/api/health
- [ ] Returns: `{"status":"ok","service":"embassy-backend"}`
- [ ] SSL certificate is valid (green padlock)

### Full Application
- [ ] User can sign up
- [ ] User can log in
- [ ] User can submit visa application
- [ ] User can submit marriage certificate request
- [ ] User can submit birth certificate request
- [ ] User can submit travel pass application
- [ ] User can track application status
- [ ] Admin can view all applications
- [ ] Admin can update application status

## Repositories

- **Frontend:** https://github.com/ouambo5r1/embassy-website
- **Backend:** https://github.com/ouambo5r1/embassy-backend

## Benefits of Custom Domains

✅ **Trusted SSL Certificates** - No more certificate errors
✅ **Professional URLs** - Better user experience
✅ **Better SEO** - Custom domains rank better
✅ **Easier to Remember** - kessetest.com vs long Traefik URLs
✅ **Production Ready** - Proper setup for real users

## Next Steps

1. Configure `kessetest.com` domain in Dokploy frontend
2. Configure `backend.kessetest.com` domain in Dokploy backend
3. Add all environment variables to backend
4. Redeploy both frontend and backend
5. Test the complete application flow
6. (Optional) Add SendGrid API key for email notifications

Once deployed with custom domains, your embassy application will be fully production-ready! 🎉
