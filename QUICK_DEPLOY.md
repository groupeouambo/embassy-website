# Quick Deployment Steps - HostGator

## 1. Upload & Extract
- Upload `deployment-package.zip` to cPanel File Manager
- Extract in public_html directory

## 2. Create Database
**cPanel → MySQL Databases:**
- Create database: `yourusername_embassy`
- Create user with strong password
- Grant ALL PRIVILEGES

**cPanel → phpMyAdmin:**
- Import `db/mysql/schema.sql`

## 3. Configure Server
**SSH into server, then:**
```bash
cd public_html/server
npm install
nano .env
```

**Add to .env:**
```env
PORT=4000
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_USER=yourusername_dbuser
DB_PASSWORD=your_password
DB_NAME=yourusername_embassy
SENDGRID_API_KEY=your_sendgrid_key
CONTACT_TO=ouambo5r@yahoo.fr
CONTACT_FROM=no-reply@usrcaembassy.org
```

## 4. Start Node.js App
**cPanel → Setup Node.js App:**
- Application root: `/home/yourusername/public_html/server`
- Startup file: `index.js`
- Click "Create" then "Start"

## 5. Deploy Frontend
```bash
cp -r build/* public_html/
```

**Create .htaccess in public_html:**
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:4000/api/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 6. Test
- Visit: https://yourdomain.com
- Test signup/login
- Submit test application

## Done! 🎉

See HOSTGATOR_DEPLOYMENT.md for detailed instructions.
