# HypeLoop Deployment Guide

## 🚀 How to Share HypeLoop with Friends

You have several options to make HypeLoop accessible to your friends for testing and feedback:

---

## Option 1: Local Network Sharing (Easiest - No Cost)

### For Windows:
1. **Find your IP address:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (usually starts with 192.168.x.x or 10.0.x.x)

2. **Configure the server for network access:**
   ```bash
   # In server/index.js, change the listen line to:
   server.listen(PORT, '0.0.0.0', () => {
     console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
   });
   ```

3. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

4. **Share the URL:**
   - Your friends can access: `http://YOUR_IP_ADDRESS:3001`
   - Example: `http://192.168.1.100:3001`

### For Mac/Linux:
1. **Find your IP address:**
   ```bash
   ifconfig
   ```

2. **Same steps as Windows above**

---

## Option 2: Cloud Deployment (Recommended for wider sharing)

### A. Railway (Free tier available)
1. **Sign up at [railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Add environment variables:**
   ```
   PORT=3001
   NODE_ENV=production
   ```
4. **Deploy automatically from your GitHub repo**

### B. Render (Free tier available)
1. **Sign up at [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Set build command:** `npm install && npm run build`
5. **Set start command:** `npm start`

### C. Heroku (Paid, but reliable)
1. **Sign up at [heroku.com](https://heroku.com)**
2. **Install Heroku CLI**
3. **Deploy:**
   ```bash
   heroku create hypeloop-game
   git push heroku main
   ```

---

## Option 3: Docker Container (Advanced)

### Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
```

### Build and run:
```bash
docker build -t hypeloop .
docker run -p 3001:3001 hypeloop
```

---

## Option 4: Vercel + Railway (Frontend + Backend)

### Frontend on Vercel:
1. **Sign up at [vercel.com](https://vercel.com)**
2. **Deploy the client folder**
3. **Update API endpoints to point to your backend**

### Backend on Railway:
1. **Deploy server separately on Railway**
2. **Update client to use Railway URL**

---

## 🔧 Quick Setup Scripts

### For Local Network Sharing:
```bash
# Windows PowerShell
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi").IPAddress
echo "Share this URL with friends: http://$ip`:3001"

# Mac/Linux
ip=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "Share this URL with friends: http://$ip:3001"
```

### Production Build:
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Build for production
npm run build

# Start production server
npm start
```

---

## 🌐 Domain & SSL (Optional)

### For a custom domain:
1. **Buy a domain (Namecheap, GoDaddy, etc.)**
2. **Point DNS to your cloud provider**
3. **Enable SSL/HTTPS (automatic on most platforms)**

---

## 📱 Mobile Access

Your friends can access HypeLoop on:
- **Desktop browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** (iOS Safari, Chrome Mobile)
- **Tablets** (iPad, Android tablets)

---

## 🔒 Security Considerations

### For local network sharing:
- Only share with trusted friends
- Your computer needs to stay on
- Firewall may block connections

### For cloud deployment:
- Environment variables are secure
- HTTPS is automatic
- No need to keep your computer on

---

## 🎯 Recommended Approach

**For quick testing with friends:**
1. Use **Option 1 (Local Network)** for immediate sharing
2. Move to **Option 2 (Railway/Render)** for wider access

**For long-term sharing:**
1. Use **Option 2 (Cloud deployment)** 
2. Consider adding a custom domain
3. Set up monitoring and analytics

---

## 🆘 Troubleshooting

### Common Issues:

**"Connection refused"**
- Check if server is running
- Verify port 3001 is open
- Check firewall settings

**"Cannot find module"**
- Run `npm install` in both root and client folders
- Clear node_modules and reinstall

**"Socket connection failed"**
- Ensure both client and server are running
- Check CORS settings
- Verify Socket.IO configuration

---

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure ports are not blocked
4. Test with a simple "Hello World" first

---

**Happy gaming! 🎮** 