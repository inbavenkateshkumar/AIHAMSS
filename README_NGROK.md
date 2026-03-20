# 🚀 Quick Start: Get Public URL with Ngrok

## In 3 Steps:

### 1. Install Ngrok

**Option A - Download:**
- Windows: https://ngrok.com/download
- Extract to project folder

**Option B - NPM:**
```bash
npm install -g ngrok
```

### 2. Start Your Server

```bash
npm start
```

Keep this running!

### 3. Start Ngrok (New Terminal)

```bash
ngrok http 3000
```

**Or use the script:**
- Windows: Double-click `start-with-ngrok.bat`
- Mac/Linux: `./start-with-ngrok.sh`

---

## ✅ You'll Get a URL Like:

```
https://abc123def456.ngrok.io
```

**Share this URL with anyone!** ✅

---

## 💡 Pro Tip

Sign up for free ngrok account to remove time limits:
1. Go to: https://dashboard.ngrok.com/signup
2. Get authtoken
3. Run: `ngrok config add-authtoken YOUR_TOKEN`

---

For detailed instructions, see `NGROK_SETUP.md`