#!/bin/bash

echo "🚀 HypeLoop Deployment Script"
echo "============================="

echo ""
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

echo ""
echo "📦 Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
cd ..

echo ""
echo "🔨 Building for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build application"
    exit 1
fi

echo ""
echo "🌐 Getting your IP address..."

# Try different methods to get IP address
if command -v ipconfig &> /dev/null; then
    # Windows
    IP=$(ipconfig | grep "IPv4 Address" | head -1 | awk '{print $NF}')
elif command -v ifconfig &> /dev/null; then
    # Mac/Linux
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif command -v ip &> /dev/null; then
    # Modern Linux
    IP=$(ip route get 1.1.1.1 | awk '{print $7}' | head -1)
else
    IP="YOUR_IP_ADDRESS"
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "🌐 Your HypeLoop game is ready to share!"
echo ""
echo "📱 Share this URL with your friends:"
echo "   http://$IP:3001"
echo ""
echo "💡 Make sure your firewall allows connections on port 3001"
echo ""
echo "🎮 Starting server..."
echo ""
npm start 