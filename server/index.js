// server/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import modular components (these files would need to be created)
const roomManager = require('./roomManager'); // Manages rooms and players
const gameLogic = require('./gameLogic');     // Manages game phases, prompts, answers, votes
const openaiService = require('./openaiService'); // Handles OpenAI API calls
const twitchIntegration = require('./twitch'); // Handles Twitch chat integration

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO and Express
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow your client origin
    methods: ["GET", "POST"]
  },
});

app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json() (bodyParser is often deprecated for Express 4.16+)
app.use(express.static("public")); // Serve static files from 'public' directory

// --- Socket.IO Event Handlers ---
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Join Room
  socket.on("join-room", ({ name, room, theme }) => {
    try {
      const roomState = roomManager.joinRoom(socket.id, name, room, theme);
      socket.join(room); // Add socket to the specific room
      io.to(room).emit("room-updated", roomState); // Notify everyone in the room
      console.log(`${name} (${socket.id}) joined room ${room}`);
    } catch (error) {
      socket.emit("room-error", error.message);
      console.error(`Error joining room ${room}:`, error.message);
    }
  });

  // Create Room
  socket.on("create-room", ({ name, theme }) => {
    try {
      const newRoomId = roomManager.createRoom(socket.id, name, theme);
      socket.join(newRoomId);
      const roomState = roomManager.getRoomState(newRoomId);
      io.to(newRoomId).emit("room-updated", roomState);
      console.log(`${name} (${socket.id}) created room ${newRoomId}`);
    } catch (error) {
      socket.emit("room-error", error.message);
      console.error("Error creating room:", error.message);
    }
  });

  // Start Game
  socket.on("start-game", async (roomId) => {
    try {
      const roomState = await gameLogic.startGame(io, roomId); // Pass io for emitting
      io.to(roomId).emit("game-started", roomState);
      console.log(`Game started in room ${roomId}`);
    } catch (error) {
      io.to(roomId).emit("game-error", error.message);
      console.error(`Error starting game in room ${roomId}:`, error.message);
    }
  });

  // Submit Answer
  socket.on("submit-answer", ({ roomId, answer }) => {
    try {
      const roomState = gameLogic.submitAnswer(io, roomId, socket.id, answer);
      // Check if all players have answered to move to voting phase
      if (roomState.allPlayersAnswered) {
        gameLogic.startVotingPhase(io, roomId);
      } else {
        io.to(roomId).emit("player-answered", { playerId: socket.id, roomState: roomState });
      }
    } catch (error) {
      socket.emit("game-error", error.message);
      console.error(`Error submitting answer in room ${roomId}:`, error.message);
    }
  });

  // Submit Vote
  socket.on("submit-vote", ({ roomId, votedPlayerId }) => {
    try {
      const roomState = gameLogic.submitVote(io, roomId, socket.id, votedPlayerId);
      // Check if all players have voted to process round winner
      if (roomState.allPlayersVoted) {
        gameLogic.processRoundWinner(io, roomId);
      } else {
        io.to(roomId).emit("player-voted", { playerId: socket.id, roomState: roomState });
      }
    } catch (error) {
      socket.emit("game-error", error.message);
      console.error(`Error submitting vote in room ${roomId}:`, error.message);
    }
  });

  // Next Round
  socket.on("next-round", async (roomId) => {
    try {
      const roomState = await gameLogic.startNewRound(io, roomId);
      io.to(roomId).emit("game-started", roomState); // Emits same as game-started to reset client UI
      console.log(`New round started in room ${roomId}`);
    } catch (error) {
      io.to(roomId).emit("game-error", error.message);
      console.error(`Error starting new round in room ${roomId}:`, error.message);
    }
  });

  // Disconnect
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    const roomLeft = roomManager.removePlayer(socket.id);
    if (roomLeft) {
      io.to(roomLeft.id).emit("room-updated", roomLeft); // Update room for remaining players
      console.log(`Player ${socket.id} left room ${roomLeft.id}`);
      // If room becomes empty, consider deleting it
      if (Object.keys(roomLeft.players).length === 0) {
        roomManager.deleteRoom(roomLeft.id);
        console.log(`Room ${roomLeft.id} deleted as it is empty.`);
      }
    }
  });
});

// Initialize Twitch Integration (if desired and server-side)
// twitchIntegration.init(io, roomManager);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Dummy implementations for modular files (YOU NEED TO CREATE THESE)
// server/roomManager.js
const rooms = new Map(); // Use Map for better performance for lookups

function generateRoomCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 6).toUpperCase();
  } while (rooms.has(code));
  return code;
}

exports.createRoom = (playerId, playerName, theme) => {
  const roomId = generateRoomCode();
  rooms.set(roomId, {
    id: roomId,
    players: new Map([[playerId, { id: playerId, name: playerName, score: 0, hasAnswered: false, hasVoted: false }]]),
    prompt: null,
    answers: [],
    votes: {},
    round: 0,
    theme: theme,
    timer: null, // To manage timers for phases
    activePhase: 'joining', // 'joining', 'answering', 'voting', 'winner'
    allPlayersAnswered: false, // Track state for phase transitions
    allPlayersVoted: false,
    // Add more game state properties as needed
  });
  return roomId;
};

exports.joinRoom = (playerId, playerName, roomId, theme) => {
  const room = rooms.get(roomId);
  if (!room) throw new Error("Room not found.");
  if (room.players.has(playerId)) throw new Error("Already in this room.");
  room.players.set(playerId, { id: playerId, name: playerName, score: 0, hasAnswered: false, hasVoted: false });
  return room;
};

exports.removePlayer = (playerId) => {
  for (const room of rooms.values()) {
    if (room.players.has(playerId)) {
      room.players.delete(playerId);
      // Clean up player states related to this room if necessary
      if (room.answers) room.answers = room.answers.filter(a => a.playerId !== playerId);
      if (room.votes) delete room.votes[playerId];
      return room;
    }
  }
  return null;
};

exports.getRoomState = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) throw new Error("Room not found.");
  // Return a plain object copy for clients (Maps don't serialize well via Socket.IO directly)
  return { ...room, players: Array.from(room.players.values()) };
};

exports.deleteRoom = (roomId) => {
  if (rooms.has(roomId)) {
    rooms.delete(roomId);
    return true;
  }
  return false;
};

// server/gameLogic.js
// This module would contain the core game logic
const { getRoomState, updateRoomState } = require('./roomManager'); // Assuming updateRoomState
const { getPrompt } = require('./promptService'); // Assuming this service exists
const { triggerRandomChaosEvent } = require('./chaos'); // Import chaos logic

exports.startGame = async (io, roomId) => {
  const room = getRoomState(roomId);
  if (!room) throw new Error("Game cannot start: Room not found.");
  if (room.players.length < 2) throw new Error("Not enough players to start the game."); // Minimum players

  // Reset game state for a fresh start
  room.round = 1;
  room.scores = new Map(room.players.map(p => [p.id, 0])); // Initialize scores
  room.answers = [];
  room.votes = {};
  room.activePhase = 'answering';
  room.allPlayersAnswered = false;
  room.allPlayersVoted = false;
  room.winner = null;

  // Get initial prompt
  room.prompt = await getPrompt(room.theme?.name);

  // Apply initial chaos if desired
  // triggerRandomChaosEvent(io, roomId, room);

  // Update room state in roomManager (if roomManager holds the mutable state)
  // And then emit the updated state
  io.to(roomId).emit('room-updated', room);
  io.to(roomId).emit('timer-start', { phase: 'answering', duration: 60 }); // Start a timer

  return room;
};

exports.submitAnswer = (io, roomId, playerId, answer) => {
  const room = getRoomState(roomId);
  if (!room) throw new Error("Room not found.");
  if (room.activePhase !== 'answering') throw new Error("Not in answering phase.");

  const player = room.players.find(p => p.id === playerId);
  if (!player) throw new Error("Player not found in room.");
  if (player.hasAnswered) throw new Error("You have already answered.");

  room.answers.push({ playerId: playerId, text: answer });
  player.hasAnswered = true; // Mark player as answered

  room.allPlayersAnswered = room.players.every(p => p.hasAnswered);

  // Send partial update
  io.to(roomId).emit('player-answered', { playerId: playerId });

  return room;
};

exports.startVotingPhase = (io, roomId) => {
  const room = getRoomState(roomId);
  if (!room) throw new Error("Room not found.");
  room.activePhase = 'voting';
  room.allPlayersVoted = false; // Reset voting status for players
  room.players.forEach(p => p.hasVoted = false); // Reset individual player vote status

  io.to(roomId).emit('voting-phase', room.answers);
  io.to(roomId).emit('timer-start', { phase: 'voting', duration: 30 }); // Start vote timer
};

exports.submitVote = (io, roomId, voterId, votedForPlayerId) => {
  const room = getRoomState(roomId);
  if (!room) throw new Error("Room not found.");
  if (room.activePhase !== 'voting') throw new Error("Not in voting phase.");

  const voter = room.players.find(p => p.id === voterId);
  if (!voter) throw new Error("Voter not found.");
  if (voter.hasVoted) throw new Error("You have already voted.");

  room.votes[votedForPlayerId] = (room.votes[votedPlayerId] || 0) + 1;
  voter.hasVoted = true;

  room.allPlayersVoted = room.players.every(p => p.hasVoted);

  // Send partial update
  io.to(roomId).emit('player-voted', { playerId: voterId });

  return room;
};

exports.processRoundWinner = (io, roomId) => {
  const room = getRoomState(roomId);
  if (!room) throw new Error("Room not found.");

  let winningPlayers = [];
  let maxVotes = 0;

  for (let playerId in room.votes) {
    const votes = room.votes[playerId];
    if (votes > maxVotes) {
      maxVotes = votes;
      winningPlayers = [room.players.find(p => p.id === playerId)]; // Start new list
    } else if (votes === maxVotes) {
      winningPlayers.push(room.players.find(p => p.id === playerId)); // Add to list for ties
    }
  }

  // Handle scoring: assign points to winner(s)
  winningPlayers.forEach(winner => {
    room.scores.set(winner.id, (room.scores.get(winner.id) || 0) + 1); // 1 point per round win
  });

  room.winner = winningPlayers.map(p => ({ id: p.id, name: p.name })); // Store winner info
  room.activePhase = 'winner';

  io.to(roomId).emit("round-winner", { winners: room.winner, scores: Object.fromEntries(room.scores) }); // Send all winners
  io.to(roomId).emit('room-updated', room); // Send full room state update
};

exports.startNewRound = async (io, roomId) => {
  const room = getRoomState(roomId);
  if (!room) throw new Error("Room not found.");

  room.round += 1;
  room.prompt = await getPrompt(room.theme?.name);
  room.answers = [];
  room.votes = {};
  room.winner = null;
  room.activePhase = 'answering';
  room.allPlayersAnswered = false;
  room.allPlayersVoted = false;
  room.players.forEach(p => { p.hasAnswered = false; p.hasVoted = false; }); // Reset player state

  // Apply potential new chaos event
  // triggerRandomChaosEvent(io, roomId, room);

  io.to(roomId).emit("room-updated", room); // Send full update for next round
  io.to(roomId).emit('timer-start', { phase: 'answering', duration: 60 });
  return room;
};


// server/promptService.js (Mockup, integrate OpenAI here)
const fallbackPrompts = {
  "1990s": ["Invent a wild new Nickelodeon game show.", "What's in your Y2K bug-out bag?", "Describe your dream 90s toy mashup."],
  "sci-fi": ["Describe a malfunctioning AI assistant.", "Name a new alien species and their favorite food.", "Pitch a bad sci-fi sequel."],
  "adult": ["Write a terrible Tinder bio.", "Invent a new adult party game.", "Describe an awkward Zoom call."]
};

exports.getPrompt = async (themeName = "1990s") => {
  // In a real scenario, this would call OpenAI
  // if (process.env.OPENAI_API_KEY && !process.env.DISABLE_AI_PROMPTS) {
  //   try {
  //     const aiPrompt = await openaiService.generatePrompt(themeName);
  //     return aiPrompt;
  //   } catch (error) {
  //     console.error("AI prompt generation failed, falling back to hardcoded:", error);
  //     // Fallback if AI fails
  //     const prompts = fallbackPrompts[themeName] || fallbackPrompts["1990s"];
  //     return prompts[Math.floor(Math.random() * prompts.length)];
  //   }
  // } else {
    const prompts = fallbackPrompts[themeName] || fallbackPrompts["1990s"];
    return prompts[Math.floor(Math.random() * prompts.length)];
  // }
};

// server/openaiService.js (Placeholder, if you re-enable AI)
/*
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generatePrompt = async (theme) => {
  // Logic to call GPT-4 for prompt generation
  // const completion = await openai.chat.completions.create({...});
  // return completion.choices[0].message.content;
};

exports.rewriteAnswer = async (answer) => {
  // Logic to call GPT-4 for answer rewriting
  // const completion = await openai.chat.completions.create({...});
  // return completion.choices[0].message.content;
};
*/

// server/twitch.js (Placeholder for server-side Twitch client using tmi.js)
/*
const tmi = require('tmi.js');

exports.init = (io, roomManager) => {
  const twitchClient = new tmi.Client({
    options: { debug: process.env.NODE_ENV === 'development' },
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_OAUTH_TOKEN,
    },
    channels: [process.env.TWITCH_CHANNEL || 'your_channel_name'] // Dynamically join rooms later
  });

  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    const roomId = channel.replace('#', ''); // Assuming room name is twitch channel name
    const username = tags['display-name'] || tags.username;

    // Example: Pass message to chaos logic
    // const roomState = roomManager.getRoomState(roomId);
    // if (roomState) {
    //   triggerRandomChaosEvent(io, roomId, roomState); // If message matches a chaos command
    // }

    // Or just emit raw twitch message for client to react
    // io.to(roomId).emit('twitch-message', { username, message });
  });

  twitchClient.connect().catch(console.error);
  console.log("Twitch client initialized.");
};
*/