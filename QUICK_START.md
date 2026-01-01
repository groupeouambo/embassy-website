# Quick Start Guide - Embassy Website

## What's Included

Your deployment package contains:
- ✅ Production build of React frontend
- ✅ Node.js backend server
- ✅ PDF application forms
- ✅ Database configuration (`zirhmute_Embassy`)
- ✅ Chat widget with intelligent responses
- ✅ All application forms (Visa, Birth Certificate, Marriage, Travel Pass)

## Deployment Files

1. **deployment-package.zip** - Complete deployment package
   - `build/` - Frontend production files
   - `server/` - Backend API
   - `public/` - PDF forms
   - `.env.example` - Configuration template
   - `DEPLOYMENT_INSTRUCTIONS.md` - Full deployment guide

## Quick Deploy (5 Steps)

### 1. Extract Files
```bash
unzip deployment-package.zip
```

### 2. Setup Database
Create MySQL database:
```sql
CREATE DATABASE zirhmute_Embassy;
```

### 3. Configure Environment
```bash
cd server
cp ../.env.example .env
# Edit .env with your database credentials
```

### 4. Install & Start Server
```bash
npm install
node index.js
```

### 5. Deploy Frontend
- Upload `build/` folder contents to your web server
- Copy PDF files from `public/` to the build folder

## Testing Locally

### Start Backend:
```bash
cd server
node index.js
```
Server runs on http://localhost:5000

### View Frontend:
```bash
npx serve -s build
```
Frontend runs on http://localhost:3000

## Features Included

### Application Forms
- ✅ Visa Application
- ✅ Birth Certificate
- ✅ Marriage Certificate
- ✅ Travel Pass (Laissez-Passer)
- ✅ Downloadable PDF forms

### Chat Widget
- ✅ Collects user name and email
- ✅ Intelligent responses for common questions
- ✅ Directs users to appropriate forms
- ✅ Provides contact information
- ✅ Stores conversations in database

### User Dashboard
- ✅ Track application status
- ✅ View submitted applications
- ✅ Secure authentication

### Admin Panel
- ✅ Manage applications
- ✅ Update application status
- ✅ View user submissions

## Important URLs

After deployment, these URLs will be available:

- **Homepage**: http://yourdomain.com
- **Visa**: http://yourdomain.com/visa
- **Birth Certificate**: http://yourdomain.com/apply/birth-certificate
- **Marriage**: http://yourdomain.com/apply/marriage
- **Travel Pass**: http://yourdomain.com/apply/travel-pass
- **Sign In**: http://yourdomain.com/signin
- **Dashboard**: http://yourdomain.com/dashboard
- **Admin**: http://yourdomain.com/admin

## Database Tables

The system automatically creates:

1. **login** - User accounts
2. **visa_applications** - Visa applications
3. **chat_conversations** - Chat history (name, email, messages)

## Production Checklist

- [ ] Database `zirhmute_Embassy` created
- [ ] .env file configured with correct database credentials
- [ ] Server dependencies installed (`npm install` in server folder)
- [ ] Frontend build deployed to web server
- [ ] PDF files copied to build folder
- [ ] Server running (use PM2 for production)
- [ ] HTTPS/SSL configured
- [ ] Tested all forms and chat widget

## Need Help?

See [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) for:
- Detailed VPS deployment
- cPanel deployment
- Heroku deployment
- Nginx configuration
- SSL setup
- Troubleshooting

## Contact

Central African Republic Embassy
- Phone: +1 (202) 483-7800
- Email: info@rcaembassy.org
- Address: 2704 Ontario Rd NW, Washington, DC 20009
