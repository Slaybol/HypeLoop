# 🎥 HypeLoop Stream Overlay Guide

Welcome to HypeLoop's professional stream overlay system! This guide will help you set up the overlay in OBS, Streamlabs, or any other streaming software.

## 🚀 Quick Setup

### 1. Access the Overlay
- **Main Game**: `http://localhost:5173` (for players)
- **Stream Overlay**: `http://localhost:5173/overlay?room=YOUR_ROOM_CODE`

### 2. OBS/Streamlabs Setup
1. Add a **Browser Source** to your scene
2. Set the URL to: `http://localhost:5173/overlay?room=YOUR_ROOM_CODE`
3. Set dimensions: **1920x1080** (or your stream resolution)
4. Check **"Shutdown source when not visible"**
5. Set **"Refresh browser when scene becomes active"** (optional)

## 🎮 How It Works

The overlay automatically displays different screens based on the game state:

### Waiting Screen
- Shows the HypeLoop logo with a glowing effect
- Displays all connected players with avatars
- Shows a "Ready to start!" indicator when players are ready

### Answering Screen
- Large, prominent prompt text
- Player status indicators (✅ answered, ⏳ thinking)
- Chaos mode alerts with spinning icons
- Speed round countdown timer (when active)

### Voting Screen
- All answers displayed in cards
- Real-time vote counts
- Progress bar showing voting completion
- Player avatars and names

### Results Screen
- Winner announcement with trophy icon
- All answers with final vote counts
- Winner badge on the winning answer
- Golden highlight for the winner

## 🎨 Customization Options

### Overlay Settings
- **Show Player Avatars**: Toggle player profile pictures
- **Show Vote Counts**: Display real-time voting numbers
- **Show Chaos Alerts**: Chaos mode notifications
- **Show Speed Timer**: Countdown for speed rounds
- **Overlay Opacity**: Adjust transparency (10%-100%)
- **Font Size**: Small, Medium, or Large
- **Theme**: Default, Dark, Neon, or Minimal

### Quick Presets
- **Reset to Default**: Restore all default settings
- **Minimal Mode**: Clean, minimal appearance for subtle overlay

## 🌟 Features

### Chaos Mode Integration
- Automatic chaos alerts with spinning icons
- Visual indicators for active chaos modes
- Speed round countdown timers
- Special styling for chaos events

### Real-Time Updates
- Live vote counting
- Player status updates
- Automatic phase transitions
- Dynamic content updates

### Professional Design
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Responsive design for different resolutions
- Streamer-friendly color schemes

## 🔧 Advanced Setup

### Multiple Overlays
You can create multiple browser sources for different parts of the overlay:

1. **Main Overlay**: Full screen overlay
2. **Player List**: Just the player status section
3. **Vote Counter**: Only the voting progress
4. **Chaos Alert**: Standalone chaos notifications

### Custom Positioning
- Use **Crop/Pad** filters to show only specific sections
- Adjust **Position** and **Scale** for custom layouts
- Use **Color Correction** for theme matching

### Stream Deck Integration
Create Stream Deck buttons for:
- Toggle overlay visibility
- Switch between overlay themes
- Reset overlay settings
- Trigger manual chaos modes

## 🎯 Best Practices

### Visual Design
- **Placement**: Position overlay in areas that don't cover important game content
- **Transparency**: Use 70-90% opacity for best readability
- **Font Size**: Choose based on your stream resolution
- **Theme**: Match your stream's color scheme

### Performance
- **Refresh Rate**: Set to 30fps for smooth animations
- **Browser Cache**: Clear cache if overlay doesn't update
- **Network**: Ensure stable connection for real-time updates

### Content Strategy
- **Chaos Mode**: Great for building hype and engagement
- **Vote Reveals**: Dramatic reveals of voting results
- **Player Reactions**: Show player status for audience engagement
- **Winner Celebrations**: Highlight round winners for excitement

## 🐛 Troubleshooting

### Overlay Not Showing
1. Check the room code in the URL
2. Verify the game server is running
3. Ensure browser source is active
4. Check OBS browser source settings

### Not Updating
1. Refresh the browser source
2. Clear browser cache
3. Check network connection
4. Verify socket connection

### Performance Issues
1. Reduce overlay opacity
2. Use minimal theme
3. Disable unnecessary features
4. Check system resources

## 📱 Mobile Streaming

For mobile streamers using apps like Streamlabs Mobile:

1. Use the mobile-optimized overlay
2. Set smaller font sizes
3. Enable minimal mode
4. Position overlay carefully on smaller screens

## 🎪 Pro Tips

### Engagement
- Use chaos mode alerts to build excitement
- Highlight player reactions during voting
- Celebrate winners with the trophy animation
- Use speed rounds for high-energy moments

### Branding
- Customize colors to match your brand
- Use consistent overlay positioning
- Create overlay presets for different content types
- Integrate with your stream graphics

### Analytics
- Monitor viewer engagement during overlay usage
- Track which chaos modes get the best reactions
- Use overlay data to improve game flow
- Analyze voting patterns for content insights

## 🔗 Support

- **Discord**: Join our community for support
- **Documentation**: Check our full documentation
- **Updates**: Follow for new overlay features
- **Feedback**: Share your overlay suggestions

---

**Happy Streaming! 🎮✨**

*HypeLoop - Where Chaos Meets Comedy* 