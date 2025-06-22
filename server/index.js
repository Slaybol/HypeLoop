// server/index.js
require('dotenv').config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const { getPrompt } = require("./promptService");
const { applyChaosMode } = require("./chaos");
const { initTwitchVoting } = require("./twitch");
const { getLeaderboard } = require("./leaderboard");
const roomManager = require("./roomManager");
const gameLogic = require("./gameLogic");
const userService = require("./userService");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

// ✅ Add prompt endpoint that client expects
app.get("/prompt", async (req, res) => {
  try {
    const prompt = await getPrompt();
    res.json({ prompt });
  } catch (error) {
    console.error("Failed to get prompt:", error);
    res.status(500).json({ error: "Failed to get prompt" });
  }
});

// ✅ Serve decks from /server/decks/*.js as JSON
app.get("/decks/:theme.json", (req, res) => {
  const deckFile = path.join(__dirname, "decks", `${req.params.theme}.js`);
  try {
    const deck = require(deckFile);
    res.json(deck);
  } catch (err) {
    console.error(`Deck "${req.params.theme}" not found`);
    res.status(404).json({ error: "Deck not found" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

// Serve client build
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  initTwitchVoting(socket);

  socket.on("join-room", ({ name, room, theme }) => {
    console.log(`Join room request: ${name} wants to join ${room}`);
    
    if (!room || !name) {
      socket.emit("join-error", { message: "Room name and player name are required." });
      return;
    }

    try {
      const { success, message, roomState } = roomManager.joinRoom(socket.id, name, room, theme);
      if (success) {
        socket.join(room);
        // ✅ Emit to all clients in room with consistent event name
        io.to(room).emit("room-updated", roomState);
        socket.emit("join-success", { room, name, roomState });
        console.log(`${name} joined room: ${room}`);
      } else {
        socket.emit("join-error", { message });
      }
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("join-error", { message: "Failed to join room" });
    }
  });

  socket.on("start-game", async ({ room }) => {
    console.log(`Start game request for room: ${room}`);
    
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState && Object.keys(roomState.players).length >= 1) {
        await gameLogic.startGame(io, room, roomState);
        // ✅ Make sure gameLogic.startGame emits 'game-started' event
      } else {
        socket.emit("game-start-error", { message: "Cannot start game: Room not found or not enough players." });
      }
    } catch (error) {
      console.error("Error starting game:", error);
      socket.emit("game-start-error", { message: "Failed to start game" });
    }
  });

  socket.on("submit-answer", ({ room, answer }) => {
    console.log(`Answer submitted for room ${room}:`, answer);
    
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState && roomState.currentPhase === "answering") {
        gameLogic.submitAnswer(io, socket.id, room, answer);
      } else {
        socket.emit("submit-error", { message: "Cannot submit answer at this time" });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      socket.emit("submit-error", { message: "Failed to submit answer" });
    }
  });

  socket.on("end-answer-phase", ({ room }) => {
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState && roomState.currentPhase === "answering") {
        gameLogic.transitionToVoting(io, room);
      }
    } catch (error) {
      console.error("Error ending answer phase:", error);
    }
  });

  socket.on("submit-vote", ({ room, votedPlayerId }) => {
    console.log(`Vote submitted for room ${room}, voted for player:`, votedPlayerId);
    
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState && roomState.currentPhase === "voting") {
        gameLogic.submitVote(io, socket.id, room, votedPlayerId);
      } else {
        socket.emit("vote-error", { message: "Cannot vote at this time" });
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      socket.emit("vote-error", { message: "Failed to submit vote" });
    }
  });

  socket.on("end-voting-phase", ({ room }) => {
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState && roomState.currentPhase === "voting") {
        gameLogic.transitionToResults(io, room);
      }
    } catch (error) {
      console.error("Error ending voting phase:", error);
    }
  });

  socket.on("next-round", async ({ room }) => {
    console.log(`Next round request for room: ${room}`);
    
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState) {
        await gameLogic.startNextRound(io, room);
        // ✅ Make sure gameLogic.startNextRound emits 'new-round' event
      } else {
        socket.emit("next-round-error", { message: "Room not found" });
      }
    } catch (error) {
      console.error("Error starting next round:", error);
      socket.emit("next-round-error", { message: "Failed to start next round" });
    }
  });

  socket.on("get-leaderboard", ({ room }) => {
    try {
      const roomState = roomManager.getRoom(room);
      if (roomState) {
        const leaderboard = getLeaderboard(Object.values(roomState.players));
        socket.emit("leaderboard-data", leaderboard);
      } else {
        socket.emit("leaderboard-error", { message: "Room not found" });
      }
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      socket.emit("leaderboard-error", { message: "Failed to get leaderboard" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    try {
      roomManager.handleDisconnect(socket.id, io);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  // ✅ Handle connection errors gracefully
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// ✅ Enhanced error handling for server
server.on("error", (error) => {
  console.error("Server error:", error);
});

// User authentication endpoints
app.post("/api/auth/register", (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = userService.createUser({ username, email, password });
    res.json({ success: true, user: userService.sanitizeUser(user) });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const result = userService.authenticateUser(username, password);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
});

app.post("/api/auth/logout", (req, res) => {
  try {
    const { sessionId } = req.body;
    if (sessionId) {
      userService.logout(sessionId);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

app.get("/api/auth/me", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const user = userService.getUserBySession(sessionId);
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ error: "Authentication check failed" });
  }
});

// User profile endpoints
app.get("/api/users/profile", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const user = userService.getUserBySession(sessionId);
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    res.json({ success: true, profile: user.profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.put("/api/users/profile", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const session = userService.validateSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const updatedUser = userService.updateUserProfile(session.userId, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Friends endpoints
app.post("/api/friends/request", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const session = userService.validateSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const { username } = req.body;
    userService.sendFriendRequest(session.userId, username);
    res.json({ success: true });
  } catch (error) {
    console.error("Friend request error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/friends/accept", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const session = userService.validateSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const { friendId } = req.body;
    userService.acceptFriendRequest(session.userId, friendId);
    res.json({ success: true });
  } catch (error) {
    console.error("Friend accept error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/friends", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const session = userService.validateSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    const friends = userService.getFriendsList(session.userId);
    res.json({ success: true, friends });
  } catch (error) {
    console.error("Friends fetch error:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

// Stats endpoints
app.post("/api/stats/update", (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "No session provided" });
    }

    const session = userService.validateSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    userService.updateUserStats(session.userId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error("Stats update error:", error);
    res.status(500).json({ error: "Failed to update stats" });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
  console.log(`🌐 Access from other devices: http://YOUR_IP_ADDRESS:${PORT}`);
});

// ✅ Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});