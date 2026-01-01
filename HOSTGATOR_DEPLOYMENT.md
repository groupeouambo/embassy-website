# HostGator Deployment Guide - Embassy Application

## Prerequisites
- HostGator account with Node.js support
- SSH access enabled
- MySQL database access via cPanel

## Step 1: Upload Files to HostGator

1. **Login to cPanel**
   - Go to your HostGator cPanel dashboard

2. **Upload deployment-package.zip**
   - Navigate to File Manager
   - Go to your public_html directory (or app directory)
   - Click "Upload" and upload `deployment-package.zip`
   - After upload completes, select the zip file
   - Click "Extract" to unzip the files

## Step 2: Setup MySQL Database

1. **Create Database via cPanel**
   - Go to cPanel → MySQL Databases
   - Create a new database (e.g., `yourusername_embassy`)
   - Create a new MySQL user with a strong password
   - Add the user to the database with ALL PRIVILEGES
   - **Write down these credentials:**
     - Database name: `yourusername_embassy`
     - Database user: `yourusername_dbuser`
     - Database password: `your_password`
     - Database host: `localhost`

2. **Import Database Schema**
   - Go to cPanel → phpMyAdmin
   - Select your newly created database from the left sidebar
   - Click "Import" tab
   - Click "Choose File" and select `db/mysql/schema.sql`
   - Click "Go" at the bottom
   - Wait for success message

## Step 3: Install Dependencies via SSH

1. **Connect via SSH**
   ```bash
   ssh yourusername@yourdomain.com
   ```

2. **Navigate to your application directory**
   ```bash
   cd public_html  # or wherever you extracted the files
   ```

3. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Install Frontend Dependencies** (if not using pre-built)
   ```bash
   npm install
   ```

## Step 4: Configure Environment Variables

1. **Create .env file in server directory**
   ```bash
   cd server
   nano .env
   ```

2. **Add the following configuration** (replace with your actual values):
   ```env
   # Server Configuration
   PORT=4000
   FRONTEND_URL=https://yourdomain.com

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   JWT_EXPIRES_IN=7d

   # Database Configuration
   DB_HOST=localhost
   DB_USER=yourusername_dbuser
   DB_PASSWORD=your_database_password
   DB_NAME=yourusername_embassy

   # SendGrid Email Configuration
   SENDGRID_API_KEY=your-sendgrid-api-key-here
   CONTACT_TO=ouambo5r@yahoo.fr
   CONTACT_FROM=no-reply@usrcaembassy.org
   ```

3. **Save and exit** (Ctrl+X, then Y, then Enter)

## Step 5: Setup Node.js Application in cPanel

1. **Go to cPanel → Setup Node.js App**

2. **Create New Application**
   - **Node.js version**: Select latest LTS (18.x or 20.x)
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/public_html/server`
   - **Application URL**: Choose your domain
   - **Application startup file**: `index.js`
   - **Environment variables**: Add if needed (or use .env file)

3. **Click "Create"**

4. **Start the Application**
   - Click "Start" or "Restart" button

## Step 6: Build and Serve Frontend

### Option A: Serve Pre-built React App (Recommended)

1. **The build folder is already included in deployment package**

2. **Configure .htaccess for React Router** (in public_html or your web root)
   Create/edit `.htaccess`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /

     # API requests to backend
     RewriteRule ^api/(.*)$ http://localhost:4000/api/$1 [P,L]

     # Serve React app
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

3. **Copy build files to web root**
   ```bash
   cp -r build/* public_html/
   ```

### Option B: Build on Server

1. **Run build command**
   ```bash
   npm run build
   ```

2. **Copy to web root**
   ```bash
   cp -r build/* public_html/
   ```

## Step 7: Verify Deployment

1. **Check Backend API**
   - Visit: `https://yourdomain.com/api/health` (should return success)

2. **Check Frontend**
   - Visit: `https://yourdomain.com`
   - You should see the embassy application homepage

3. **Test Signup/Login**
   - Create a test account
   - Try logging in
   - Submit a test application

## Step 8: Setup Process Manager (Keep Server Running)

HostGator's Node.js app manager should keep your server running, but if you need manual control:

```bash
# Install PM2 globally
npm install -g pm2

# Start your server with PM2
cd server
pm2 start index.js --name embassy-server

# Save PM2 configuration
pm2 save

# Setup PM2 to start on reboot
pm2 startup
```

## Troubleshooting

### Server Won't Start
1. Check Node.js app logs in cPanel
2. Verify .env file has correct database credentials
3. Test database connection in phpMyAdmin

### Database Connection Errors
1. Verify MySQL user has ALL PRIVILEGES
2. Check database name is correct (including username prefix)
3. Ensure DB_HOST is set to `localhost`

### 404 Errors on React Routes
1. Verify .htaccess file exists and has rewrite rules
2. Check that mod_rewrite is enabled in cPanel

### Email Not Sending
1. Add valid SendGrid API key to .env
2. Verify SendGrid account is active
3. Check server logs for email errors

### API Connection Refused
1. Verify Node.js app is running in cPanel
2. Check PORT matches in both .env and Node.js app settings
3. Ensure reverse proxy rules are correct

## Security Checklist

- [ ] Changed JWT_SECRET to a unique, strong value (min 32 characters)
- [ ] Database user has strong password
- [ ] .env file permissions set to 600 (not publicly readable)
- [ ] Removed any test/debug code
- [ ] HTTPS enabled (HostGator provides free SSL)
- [ ] Firewall rules configured if available
- [ ] Regular database backups enabled

## Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild if needed
npm run build

# Restart server
pm2 restart embassy-server
# OR use cPanel Node.js App interface
```

### View Server Logs
```bash
# If using PM2
pm2 logs embassy-server

# If using cPanel
# Check logs in cPanel → Setup Node.js App → View logs
```

### Backup Database
```bash
# Via command line
mysqldump -u yourusername_dbuser -p yourusername_embassy > backup.sql

# OR use cPanel → phpMyAdmin → Export
```

## Support

If you encounter issues:
1. Check server logs in cPanel
2. Verify all environment variables are correct
3. Test database connection separately
4. Contact HostGator support for server-specific issues

## Post-Deployment Tasks

1. **Test all application types:**
   - Visa applications
   - Marriage certificates
   - Birth certificates
   - Travel passes

2. **Verify email notifications work** (with SendGrid configured)

3. **Test admin functions:**
   - Tracking number assignment
   - Carrier selection (USPS, UPS, FedEx)
   - PDF generation

4. **Setup monitoring:**
   - Configure uptime monitoring
   - Setup email alerts for errors

---

**Deployment Package Location:** `deployment-package.zip` (367 MB)
**Includes:** Frontend build, server code, database schema, environment templates
**Excludes:** node_modules (will be installed on server)
