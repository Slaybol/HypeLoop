// server/index.js
require('dotenv').config();
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

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  initTwitchVoting(socket);

  socket.on("join-room", ({ name, room, theme }) => {
    if (!room || !name) {
      socket.emit("join-error", "Room name and player name are required.");
      return;
    }

    const { success, message, roomState } = roomManager.joinRoom(socket.id, name, room, theme);

    if (success) {
      socket.join(room);
      io.to(room).emit("room-updated", roomState);
      socket.emit("join-success", { room, name, roomState });
      console.log(`${name} joined room: ${room}`);
    } else {
      socket.emit("join-error", message);
    }
  });

  socket.on("start-game", async ({ room }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState && Object.keys(roomState.players).length >= 1) {
      await gameLogic.startGame(io, room, roomState);
    } else {
      socket.emit("game-start-error", "Cannot start game: Room not found or not enough players.");
    }
  });

  socket.on("submit-answer", ({ room, answer }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState && roomState.currentPhase === "answering") {
      gameLogic.submitAnswer(io, socket.id, room, answer);
    }
  });

  socket.on("end-answer-phase", ({ room }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState && roomState.currentPhase === "answering") {
      gameLogic.transitionToVoting(io, room);
    }
  });

  socket.on("submit-vote", ({ room, votedPlayerId }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState && roomState.currentPhase === "voting") {
      gameLogic.submitVote(io, socket.id, room, votedPlayerId);
    }
  });

  socket.on("end-voting-phase", ({ room }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState && roomState.currentPhase === "voting") {
      gameLogic.transitionToResults(io, room);
    }
  });

  socket.on("next-round", async ({ room }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState) {
      await gameLogic.startNextRound(io, room);
    }
  });

  socket.on("get-leaderboard", ({ room }) => {
    const roomState = roomManager.getRoom(room);
    if (roomState) {
      const leaderboard = getLeaderboard(Object.values(roomState.players));
      socket.emit("leaderboard-data", leaderboard);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    roomManager.handleDisconnect(socket.id, io);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
