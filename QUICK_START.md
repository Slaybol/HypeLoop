# 🚀 Quick Start - Share HypeLoop with Friends

## ⚡ Fastest Method (5 minutes)

### Step 1: Build and Deploy
```bash
# Windows
deploy.bat

# Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

### Step 2: Share the URL
The script will show you a URL like:
```
http://192.168.1.100:3001
```

Share this with your friends!

---

## 🔧 Manual Method

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Build for Production
```bash
npm run build
```

### 3. Start Server
```bash
npm start
```

### 4. Find Your IP
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### 5. Share URL
`http://YOUR_IP:3001`

---

## 🌐 Cloud Deployment (Recommended)

### Railway (Free)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Deploy automatically
4. Share the provided URL

### Render (Free)
1. Go to [render.com](https://render.com)
2. Create Web Service
3. Connect GitHub repo
4. Set build: `npm install && npm run build`
5. Set start: `npm start`

---

## 🐳 Docker Method

### Build and Run
```bash
docker build -t hypeloop .
docker run -p 3001:3001 hypeloop
```

### Or with Docker Compose
```bash
docker-compose up -d
```

---

## 📱 What Your Friends Need

- **Any modern browser** (Chrome, Firefox, Safari, Edge)
- **Internet connection** (for cloud deployment)
- **Same WiFi network** (for local network sharing)

---

## 🎮 How to Play

1. **Join a room** with a unique name
2. **Wait for the host** to start the game
3. **Answer prompts** when they appear
4. **Vote** on the best answers
5. **Laugh** at the results!

---

## 🔒 Security Note

For local network sharing:
- Only share with trusted friends
- Your computer must stay on
- Consider cloud deployment for wider access

---

## 🆘 Need Help?

1. **Check the console** for error messages
2. **Verify port 3001** is not blocked by firewall
3. **Try cloud deployment** if local doesn't work
4. **Check DEPLOYMENT_GUIDE.md** for detailed options

---

**Happy gaming! 🎮** 