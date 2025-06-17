const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

// 🎯 Hardcoded fallback prompts
const fallbackPrompts = {
  "1990s": [
    "Invent a wild new Nickelodeon game show.",
    "What's in your Y2K bug-out bag?",
    "Describe your dream 90s toy mashup."
  ],
  "sci-fi": [
    "Describe a malfunctioning AI assistant.",
    "Name a new alien species and their favorite food.",
    "Pitch a bad sci-fi sequel."
  ],
  "adult": [
    "Write a terrible Tinder bio.",
    "Invent a new adult party game.",
    "Describe an awkward Zoom call."
  ]
};

function getPrompt(themeName = "1990s") {
  const prompts = fallbackPrompts[themeName] || fallbackPrompts["1990s"];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, room, theme }) => {
    if (!rooms[room]) {
      rooms[room] = {
        players: [],
        answers: [],
        votes: {},
        round: 1,
        theme: theme || { name: "1990s" },
      };
    }

    const playerExists = rooms[room].players.find((p) => p.id === socket.id);
    if (!playerExists) {
      rooms[room].players.push({ id: socket.id, name });
    }

    socket.join(room);
    io.to(room).emit("player-list", rooms[room].players);
  });

  socket.on("game-started", ({ prompt }) => {
    const room = Object.keys(rooms).find(r => rooms[r].players.some(p => p.id === socket.id));
    if (!room) return;

    rooms[room].prompt = prompt;
    rooms[room].answers = [];
    rooms[room].votes = {};
    io.to(room).emit("game-started", { prompt });
  });

  socket.on("submit-answer", ({ room, answer }) => {
    if (!rooms[room]) return;
    rooms[room].answers.push({ playerId: socket.id, text: answer });
  });

  socket.on("end-answer-phase", (room) => {
    if (!rooms[room]) return;
    io.to(room).emit("voting-phase", rooms[room].answers);
  });

  socket.on("submit-vote", ({ room, votedPlayerId }) => {
    if (!rooms[room]) return;
    rooms[room].votes[votedPlayerId] = (rooms[room].votes[votedPlayerId] || 0) + 1;
  });

  socket.on("next-round", (room) => {
    if (!rooms[room]) return;

    const votes = rooms[room].votes;
    let winner = null;
    let maxVotes = 0;

    for (let id in votes) {
      if (votes[id] > maxVotes) {
        maxVotes = votes[id];
        winner = rooms[room].players.find((p) => p.id === id);
      }
    }

    io.to(room).emit("round-winner", { winner });

    // Get new prompt based on theme
    const prompt = getPrompt(rooms[room].theme?.name);
    rooms[room].prompt = prompt;
    rooms[room].answers = [];
    rooms[room].votes = {};
    rooms[room].round += 1;

    io.to(room).emit("game-started", { prompt });
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter((p) => p.id !== socket.id);
      io.to(room).emit("player-list", rooms[room].players);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
