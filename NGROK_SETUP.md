# 🚀 Ngrok Setup - Get Public URL from Localhost

## Quick Setup Guide

### Step 1: Install Ngrok

**Windows:**
1. Download: https://ngrok.com/download
2. Extract `ngrok.exe` to your project folder
   OR
3. Add ngrok to your PATH

**Mac:**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux:**
```bash
# Download and extract
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

# OR install via package manager
sudo apt install ngrok
```

**Or use npm (all platforms):**
```bash
npm install -g ngrok
```

### Step 2: Sign Up for Free Ngrok Account (Optional but Recommended)

1. Go to: https://dashboard.ngrok.com/signup
2. Sign up (free)
3. Get your authtoken from dashboard
4. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

**Why?** Free account removes time/session limits!

---

## Step 3: Run Your Application with Ngrok

### Option A: Automatic Script (Recommended)

**Windows:**
Double-click: `start-with-ngrok.bat`

**Mac/Linux:**
```bash
chmod +x start-with-ngrok.sh
./start-with-ngrok.sh
```

### Option B: Manual Method

**Terminal 1 - Start Server:**
```bash
npm start
```

**Terminal 2 - Start Ngrok:**
```bash
ngrok http 3000
```

---

## Step 4: Get Your Public URL! 🎉

When ngrok starts, you'll see:

```
Forwarding   https://abc123def456.ngrok.io -> http://localhost:3000
```

**Your Public URL:**
```
https://abc123def456.ngrok.io
```

✅ **This URL works from anywhere!**
✅ **Share with anyone!**
✅ **HTTPS automatically included!**

---

## 📱 How to Share

1. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
2. Send to anyone via:
   - Email
   - WhatsApp
   - Text message
   - Link sharing
3. They can access from any device, anywhere!

---

## 🔧 Advanced Options

### Custom Domain (Free Account)

If you have a free ngrok account, you can use custom domains:

```bash
ngrok http 3000 --domain=your-custom-domain.ngrok-free.app
```

### Keep URL Same (Reserved Domain - Paid)

Ngrok free accounts get a different URL each time. For same URL:
- Use free account and set authtoken (URL changes but lasts longer)
- Or upgrade to paid plan for reserved domain

---

## ⚠️ Important Notes

### Free Ngrok (No Account):
- ✅ Works immediately
- ⚠️ URL changes every restart
- ⚠️ 2-hour session limit

### Free Ngrok (With Account):
- ✅ Works immediately  
- ✅ Longer sessions
- ⚠️ URL still changes (but lasts longer)

### Paid Ngrok:
- ✅ Reserved domain (same URL always)
- ✅ No time limits
- ✅ Custom domains

---

## 🛠️ Troubleshooting

### "ngrok: command not found"
- Make sure ngrok is installed
- Add ngrok to your PATH
- Or use full path: `./ngrok http 3000` (if in same folder)

### Port already in use
- Make sure nothing else is using port 3000
- Or change PORT in `.env` and update ngrok: `ngrok http NEW_PORT`

### Connection refused
- Make sure your server is running first: `npm start`
- Wait a few seconds before starting ngrok
- Check server is listening on port 3000

### Ngrok URL not loading
- Check your server is running
- Verify server works on localhost:3000 first
- Check ngrok status: `ngrok status`

---

## 📋 Quick Command Reference

```bash
# Start ngrok on port 3000
ngrok http 3000

# Start with custom domain (free account)
ngrok http 3000 --domain=your-domain.ngrok-free.app

# View ngrok web interface
# Open: http://localhost:4040 (shows all requests)

# Check ngrok status
ngrok status

# Get your URL programmatically
curl http://localhost:4040/api/tunnels
```

---

## 🎯 Quick Start (Copy & Paste)

```bash
# 1. Start your server (Terminal 1)
npm start

# 2. Start ngrok (Terminal 2)
ngrok http 3000

# 3. Copy the HTTPS URL shown
# Example: https://abc123.ngrok.io

# 4. Share with anyone!
```

---

## ✅ Benefits of Ngrok

- ✅ **Instant public URL** - No deployment needed
- ✅ **HTTPS included** - Secure connection
- ✅ **Works anywhere** - Access from any device
- ✅ **Easy sharing** - Just send the link
- ✅ **Free tier available** - No credit card needed

---

## 🔗 Your Ngrok Dashboard

When ngrok is running, visit:
```
http://localhost:4040
```

This shows:
- All incoming requests
- Request/response details
- Replay requests
- Inspect traffic

---

**That's it! Once ngrok is running, you'll have a public URL to share!** 🚀

Copy the URL from the ngrok terminal and send it to anyone!