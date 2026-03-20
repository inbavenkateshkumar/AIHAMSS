# Quick URL Setup - From localhost to URL

## ✅ Already Configured!

Your application is **already set up** to work with URLs! The API automatically detects the current domain.

---

## 🚀 Quick Options (Choose One)

### Option 1: Use Your Local IP (Easiest - No Changes Needed)

**Find your IP:**
- Windows: Open CMD → Type `ipconfig` → Look for "IPv4 Address"
- Mac/Linux: Open Terminal → Type `ifconfig` → Look for inet address

**Example IP:** `192.168.1.100`

**Access via:**
```
http://192.168.1.100:3000
```

**That's it!** Works immediately on your local network. ✅

---

### Option 2: Use ngrok (For Public URL)

**Perfect for:**
- Sharing with others
- Testing from different locations
- Getting a public HTTPS URL

**Steps:**
1. Download ngrok: https://ngrok.com/download
2. Start your server: `npm start`
3. In another terminal: `ngrok http 3000`
4. Copy the URL shown (e.g., `https://abc123.ngrok.io`)
5. Access via that URL!

**Example:**
```
https://abc123def456.ngrok.io
```

---

### Option 3: Deploy to Cloud (Free Options)

#### Render.com (Recommended - Easiest)
1. Sign up: https://render.com (Free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Add environment variables (from `.env`)
5. Deploy!

**You'll get:** `https://your-app-name.onrender.com`

#### Railway.app
1. Sign up: https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL database
4. Configure environment variables

**You'll get:** `https://your-app.up.railway.app`

---

### Option 4: Use Your Own Domain

If you have a domain (e.g., `yourschool.com`):

1. **Point DNS to your server:**
   - Type: A Record
   - Name: `app` (or leave blank for main domain)
   - Value: Your server IP address

2. **Access via:**
   ```
   http://app.yourschool.com:3000
   ```
   Or set up Nginx reverse proxy for:
   ```
   https://app.yourschool.com
   ```

---

## 📋 What Your Server Shows When Started

When you run `npm start`, you'll see:

```
═══════════════════════════════════════════════════════════
🚀 Holy Substitution Server Started Successfully!
═══════════════════════════════════════════════════════════

📱 Access your application via:
   Local:    http://localhost:3000
   Network:  http://192.168.1.100:3000  ← Use this for other devices!
   API:      http://192.168.1.100:3000/api

🌐 Server is accessible on all network interfaces (0.0.0.0)
💡 Use the Network URL to access from other devices
```

Use the **Network URL** to access from phones, tablets, or other computers! 📱💻

---

## 🔧 No Code Changes Needed!

Your application **already uses dynamic URLs**:
- ✅ API automatically detects current domain
- ✅ Works with localhost, IP, or domain
- ✅ Server listens on all network interfaces
- ✅ CORS enabled for cross-origin requests

**Just start your server and use the URL shown!**

---

## 🧪 Test It

1. **Start server:**
   ```bash
   npm start
   ```

2. **Copy the Network URL** from console output

3. **Open in browser:**
   - On same computer: `http://localhost:3000`
   - On other device: `http://YOUR_IP:3000`

4. **Should work immediately!** ✅

---

## ❓ Troubleshooting

**Can't access from other devices?**
- Check Windows Firewall: Allow port 3000
- Make sure both devices on same network
- Use the IP shown in server console

**Port already in use?**
- Change PORT in `.env` file to another number (e.g., 3001)
- Or stop other application using port 3000

**Want HTTPS?**
- Use ngrok (automatic HTTPS)
- Or deploy to Render/Railway (automatic HTTPS)
- Or set up Nginx with Let's Encrypt SSL

---

## 📚 More Details

See `URL_CONFIGURATION.md` for detailed instructions on:
- Custom domain setup
- Nginx reverse proxy
- SSL/HTTPS configuration
- Production deployment

---

**That's it! Your application is ready to use with URLs instead of just localhost!** 🎉