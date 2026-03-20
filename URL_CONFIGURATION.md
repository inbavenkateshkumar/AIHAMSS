# URL Configuration Guide

## How to Access via URL Instead of localhost:3000

You have several options to access your Holy Substitution system via a URL:

---

## Option 1: Access via Local Network IP (Easiest - No Setup)

### Step 1: Find Your IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

### Step 2: Access via IP
```
http://YOUR_IP_ADDRESS:3000
```

**Example:**
```
http://192.168.1.100:3000
```

✅ **Works immediately** - No configuration changes needed!
- Accessible from same network devices
- Uses your actual IP address instead of localhost

---

## Option 2: Use ngrok (For Public URL - Testing/Sharing)

### Step 1: Install ngrok
Download from: https://ngrok.com/download

### Step 2: Start Your Server
```bash
npm start
```

### Step 3: Run ngrok
```bash
ngrok http 3000
```

### Step 4: Use the ngrok URL
You'll get a URL like:
```
https://abc123def456.ngrok.io
```

✅ **Public URL** - Share with anyone
✅ **HTTPS enabled** - Secure connection
✅ **No DNS setup** - Works immediately

---

## Option 3: Deploy to a Cloud Server with Domain

### Deploy to Platforms:

#### A. Render.com (Free Tier Available)
1. Create account: https://render.com
2. New Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

**You'll get:** `https://your-app-name.onrender.com`

#### B. Railway.app
1. Create account: https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL database
4. Configure environment variables

**You'll get:** `https://your-app-name.up.railway.app`

#### C. Heroku
1. Create account: https://heroku.com
2. Install Heroku CLI
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`

**You'll get:** `https://your-app-name.herokuapp.com`

#### D. DigitalOcean / AWS / Azure
1. Set up a VPS/EC2 instance
2. Install Node.js and PostgreSQL
3. Deploy your application
4. Configure domain DNS

**You'll get:** Your custom domain (e.g., `https://holy-substitution.com`)

---

## Option 4: Configure Custom Domain

### If You Have a Domain Name:

#### Step 1: Point DNS to Your Server
Add an A record in your domain DNS settings:
```
Type: A
Name: @ (or subdomain like 'app')
Value: YOUR_SERVER_IP_ADDRESS
TTL: 3600
```

#### Step 2: Update Server Configuration

Your server already listens on all interfaces (`0.0.0.0`), so it's ready!

#### Step 3: Use Nginx as Reverse Proxy (Recommended)

**Install Nginx:**
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

**Configure Nginx:**
Create `/etc/nginx/sites-available/holy-substitution`:
```nginx
server {
    listen 80;
    server_name holy-substitution.com www.holy-substitution.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/holy-substitution /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 4: Add SSL (HTTPS)

**Using Let's Encrypt (Free SSL):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d holy-substitution.com -d www.holy-substitution.com
```

Now access via:
```
https://holy-substitution.com
```

---

## Option 5: Use a Subdomain

### If you have a main domain (e.g., `myschool.com`):

#### DNS Configuration:
```
Type: A
Name: holy-substitution (or app, or sub)
Value: YOUR_SERVER_IP
TTL: 3600
```

#### Access via:
```
http://holy-substitution.myschool.com:3000
# or with Nginx reverse proxy
https://holy-substitution.myschool.com
```

---

## Quick Test Commands

### Test if server is accessible:
```bash
# From another device on same network
curl http://YOUR_IP:3000/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

### Check if port is open:
```bash
# Windows
netstat -an | findstr 3000

# Linux/Mac
netstat -an | grep 3000
# or
ss -tuln | grep 3000
```

---

## Firewall Configuration

### Windows Firewall:
1. Open Windows Defender Firewall
2. Advanced Settings
3. Inbound Rules → New Rule
4. Port → TCP → 3000
5. Allow connection
6. Apply to all profiles

### Linux Firewall (ufw):
```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

### Linux Firewall (iptables):
```bash
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables-save
```

---

## Environment Variables for Production

Create `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teacher_substitution
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_strong_secret_key_here_change_this_in_production
NODE_ENV=production
```

---

## Recommended: Use PM2 for Production

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name holy-substitution

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

---

## Summary

| Method | URL Format | Setup Time | Public Access | Best For |
|--------|-----------|------------|---------------|----------|
| Local IP | `http://192.168.1.x:3000` | Immediate | Local Network | Quick testing |
| ngrok | `https://xxx.ngrok.io` | 2 minutes | Public (temporary) | Sharing/Demo |
| Render/Railway | `https://app-name.onrender.com` | 10 minutes | Public | Quick deploy |
| Custom Domain | `https://holy-substitution.com` | 30+ minutes | Public | Production |

---

## Current Configuration Status

✅ **Server already configured** to listen on all interfaces (`0.0.0.0`)
✅ **API URLs are dynamic** - automatically uses current domain
✅ **CORS enabled** - works with any domain
✅ **Ready for deployment** - no code changes needed!

Just choose your preferred method above and follow the steps!
