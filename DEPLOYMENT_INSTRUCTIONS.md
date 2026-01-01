# Embassy Website Deployment Instructions

## Database Setup

### Database Name
**zirhmute_Embassy**

### Tables Created Automatically
The application will automatically create these tables:
1. `login` - User authentication
2. `visa_applications` - Visa application data
3. `chat_conversations` - Chat conversation history

## Pre-Deployment Checklist

### 1. Database Configuration
- Create MySQL database named `zirhmute_Embassy`
- Update `.env` file with your database credentials
- Copy `.env.example` to `.env` and update values

### 2. Server Setup
```bash
cd server
npm install
```

### 3. Frontend Build
```bash
npm install
npm run build
```

## Deployment Steps

### Option 1: Deploy to cPanel/Shared Hosting

#### Upload Files:
1. Upload `build/` folder contents to `public_html/` or your domain folder
2. Upload `server/` folder to a directory outside `public_html`
3. Upload PDF files from `public/` to the build folder

#### Database Setup:
1. Create MySQL database `zirhmute_Embassy` in cPanel
2. Note the database credentials
3. Create `.env` file in server directory with database credentials

#### Start Server:
1. Access your hosting Node.js application manager
2. Set entry point to `server/index.js`
3. Start the application

### Option 2: Deploy to VPS (Linux)

#### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server
```

#### 2. Setup MySQL
```bash
sudo mysql_secure_installation
sudo mysql

# In MySQL:
CREATE DATABASE zirhmute_Embassy;
CREATE USER 'embassy_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON zirhmute_Embassy.* TO 'embassy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Upload and Configure
```bash
# Upload project to server (e.g., /var/www/embassy)
cd /var/www/embassy

# Install server dependencies
cd server
npm install

# Create .env file
nano .env
# Add database credentials and configuration
```

#### 4. Setup PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Start server
cd /var/www/embassy/server
pm2 start index.js --name embassy-api

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 5. Configure Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/embassy/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # PDF Files
    location ~ \.pdf$ {
        root /var/www/embassy/build;
        add_header Content-Disposition inline;
    }
}
```

#### 6. Enable Nginx and SSL
```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Install Certbot for SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Deploy to Heroku

#### 1. Prepare for Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create embassy-car

# Add MySQL addon
heroku addons:create cleardb:ignite
```

#### 2. Get Database Credentials
```bash
heroku config:get CLEARDB_DATABASE_URL
# This will show: mysql://user:password@host/database

# Set environment variables
heroku config:set DB_HOST=your_host
heroku config:set DB_USER=your_user
heroku config:set DB_PASSWORD=your_password
heroku config:set DB_NAME=zirhmute_Embassy
heroku config:set JWT_SECRET=your_secure_secret
```

#### 3. Deploy
```bash
git add .
git commit -m "Ready for deployment"
git push heroku main
```

## Post-Deployment

### 1. Test the Application
- Access your domain
- Test user registration and login
- Test visa application submission
- Test chat widget
- Test PDF downloads

### 2. Monitor Logs
```bash
# PM2 logs (VPS)
pm2 logs embassy-api

# Heroku logs
heroku logs --tail
```

### 3. Database Verification
```bash
# Check if tables were created
mysql -u your_user -p zirhmute_Embassy
SHOW TABLES;
```

## Important Files

- `build/` - Production React build
- `server/` - Backend API
- `public/*.pdf` - Downloadable PDF forms
- `.env` - Environment configuration (DO NOT commit to git)

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `.env`
- Check if MySQL is running
- Ensure database `zirhmute_Embassy` exists

### PDF Downloads Not Working
- Verify PDF files are in the `build` folder
- Check file permissions (755 for directories, 644 for files)

### API Not Responding
- Check if server is running (PM2 status or heroku ps)
- Verify PORT configuration
- Check firewall rules

## Security Recommendations

1. Change JWT_SECRET to a secure random string
2. Use HTTPS in production (Let's Encrypt)
3. Set strong database password
4. Keep Node.js and dependencies updated
5. Configure CORS properly for production domain

## Support

For issues, check:
- Server logs
- Database connection
- Nginx/Apache configuration
- File permissions
