# Deployment Guide - Accessing via URL

## ✅ Changes Made

The application has been updated to automatically detect and use the current URL instead of hardcoded `localhost`. This means:

- ✅ Works with `localhost:3000`
- ✅ Works with IP addresses like `192.168.1.100:3000`
- ✅ Works with domain names like `yourdomain.com:3000`
- ✅ Works with any deployed URL

## How It Works

The JavaScript files now use `window.location.origin` to dynamically get the current URL:

```javascript
const API_BASE_URL = `${window.location.origin}/api`;
```

This automatically uses:
- Protocol (http/https)
- Hostname (localhost, IP, or domain)
- Port number

## Access Methods

### 1. Localhost (Same Machine)
```
http://localhost:3000
```

### 2. Local Network (Same WiFi/LAN)
```
http://YOUR_IP_ADDRESS:3000
```

To find your IP address:
- **Windows**: Open CMD and type `ipconfig`, look for IPv4 Address
- **Mac/Linux**: Open Terminal and type `ifconfig` or `ip addr`

Example:
```
http://192.168.1.100:3000
```

### 3. Domain Name
If you have a domain name pointing to your server:
```
http://yourdomain.com:3000
```
or
```
https://yourdomain.com
```

### 4. Using ngrok (For Testing/Sharing)
If you want to share your local server temporarily:

1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Use the provided URL (e.g., `https://abc123.ngrok.io`)

## Network Access Configuration

The server is configured to listen on all network interfaces (`0.0.0.0`), so it can be accessed from:
- The same machine
- Other devices on the same network
- Remote servers (if firewall allows)

## Firewall Configuration

If you want to access from other machines, make sure:

### Windows Firewall
1. Open Windows Firewall
2. Add an inbound rule for port 3000
3. Allow TCP connections on port 3000

### Linux Firewall (iptables/ufw)
```bash
# For ufw
sudo ufw allow 3000/tcp

# For iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

## Production Deployment

For production deployment to a server:

1. **Set Environment Variables** (`.env` file):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=teacher_substitution
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_strong_secret_key_here
   ```

2. **Use PM2** (Process Manager):
   ```bash
   npm install -g pm2
   pm2 start server.js --name teacher-substitution
   pm2 save
   pm2 startup
   ```

3. **Use Nginx** (Reverse Proxy):
   Configure Nginx to proxy requests to your Node.js app on port 3000

4. **Use SSL/HTTPS**:
   - Install SSL certificate (Let's Encrypt)
   - Configure Nginx for HTTPS
   - Update CORS settings if needed

## CORS Configuration

Current CORS setting allows all origins (good for development):
```javascript
app.use(cors());
```

For production, you may want to restrict to specific domains:
```javascript
app.use(cors({
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
}));
```

## Testing

1. Start your server:
   ```bash
   npm start
   ```

2. Access from different URLs:
   - Local: `http://localhost:3000`
   - Network: `http://YOUR_IP:3000`
   - Domain: `http://yourdomain.com:3000`

3. The API will automatically use the correct base URL based on where you access it from!

## Troubleshooting

**Can't access from other devices?**
- Check firewall settings
- Verify server is listening on `0.0.0.0` (all interfaces)
- Check if both devices are on the same network

**CORS errors?**
- Server already allows all origins by default
- Check browser console for specific error messages

**Port already in use?**
- Change PORT in `.env` file
- Or kill the process using port 3000

## Security Notes

⚠️ **Important for Production:**
- Use HTTPS instead of HTTP
- Restrict CORS to your domain only
- Use strong JWT_SECRET
- Keep database credentials secure
- Regularly update dependencies