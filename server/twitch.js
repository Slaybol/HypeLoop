// server/twitch.js (Assuming this is a server-side module to be integrated with your Node.js backend)
// You would need to install tmi.js: npm install tmi.js
const tmi = require('tmi.js');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

/**
 * Initializes and connects to Twitch IRC to listen for chat messages.
 * @param {SocketIOServer} io - The Socket.IO server instance to emit game-related events.
 * @param {object} roomManager - Reference to your room management module if needed.
 */
exports.init = (io, roomManager) => {
  const twitchClient = new tmi.Client({
    options: { debug: process.env.NODE_ENV === 'development' },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      username: process.env.TWITCH_USERNAME, // Your Twitch bot username
      password: process.env.TWITCH_OAUTH_TOKEN // Your Twitch OAuth token (oauth:...)
    },
    channels: [
      // List of Twitch channels to initially join.
      // In a full implementation, this might be dynamic based on active game rooms.
      // Example: process.env.TWITCH_MAIN_CHANNEL || '#your_twitch_channel'
    ]
  });

  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    const username = tags['display-name'] || tags.username;
    const roomId = channel.replace('#', ''); // Assuming room IDs can map to Twitch channel names

    console.log(`[Twitch Chat - ${channel}] ${username}: ${message}`);

    // Example: Process for voting or chaos commands
    // if (message.toLowerCase().startsWith('!vote')) {
    //   const voteTarget = message.substring(5).trim();
    //   // You'd need logic to map voteTarget to a playerId in the room
    //   // Then emit a socket event: io.to(roomId).emit('twitch-vote', { voter: username, target: voteTarget });
    // } else if (message.toLowerCase().startsWith('!chaos')) {
    //   // Trigger chaos event via your game logic
    //   // const roomState = roomManager.getRoomState(roomId);
    //   // if (roomState) triggerRandomChaosEvent(io, roomId, roomState); // Assuming chaos.js handles this
    // }

    // Always emit for general chat display in the game (optional)
    io.to(roomId).emit('twitch-chat-message', { username, message });
  });

  twitchClient.on('connected', (addr, port) => {
    console.log(`Connected to Twitch IRC: ${addr}:${port}`);
  });

  twitchClient.on('disconnected', (reason) => {
    console.warn(`Disconnected from Twitch IRC: ${reason}`);
  });

  twitchClient.on('error', (err) => {
    console.error('Twitch client error:', err);
  });

  twitchClient.connect().catch(console.error);
  console.log("Twitch client initialization complete.");
};

// To be used in server/index.js:
// const twitchIntegration = require('./twitch');
// twitchIntegration.init(io, roomManager); // Pass io and roomManager