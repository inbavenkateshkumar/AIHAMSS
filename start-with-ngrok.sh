#!/bin/bash

echo "================================================"
echo "  Holy Angels Substitution - Ngrok Setup"
echo "================================================"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "[ERROR] Ngrok is not installed!"
    echo ""
    echo "Please install ngrok:"
    echo "1. Download from: https://ngrok.com/download"
    echo "2. Extract and add to PATH"
    echo "   OR run: sudo apt install ngrok (Linux)"
    echo "   OR run: brew install ngrok/ngrok/ngrok (Mac)"
    echo ""
    exit 1
fi

echo "[1/3] Starting Node.js server..."
npm start &
SERVER_PID=$!

echo "[2/3] Waiting for server to start..."
sleep 5

echo "[3/3] Starting ngrok tunnel..."
echo ""
echo "================================================"
echo "  Your public URL will appear below:"
echo "================================================"
echo ""

# Start ngrok
ngrok http 3000

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null" EXIT
