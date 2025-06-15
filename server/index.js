
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-your-key-here" });

async function generatePrompt() {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Generate a hilarious, creative, and clean prompt for a party game." }],
    temperature: 0.9,
  });
  return response.choices[0].message.content;
}

async function rewriteAnswer(text) {
  if (!text || text.trim().length < 3) {
    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Make up a funny or absurd party game answer." }],
      temperature: 1,
    });
    return res.choices[0].message.content;
  }
  return text;
}

let rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, room }) => {
    if (!rooms[room]) rooms[room] = { players: [], answers: [], votes: {}, round: 1 };
    const existing = rooms[room].players.find(p => p.id === socket.id);
    if (!existing) {
      rooms[room].players.push({ id: socket.id, name });
      socket.join(room);
      io.to(room).emit("player-list", rooms[room].players);
    }
  });

  socket.on("start-game", async (room) => {
    if (!rooms[room]) return;
    const prompt = await generatePrompt();
    rooms[room].prompt = prompt;
    io.to(room).emit("game-started", { prompt });
  });

  socket.on("submit-answer", async ({ room, answer }) => {
    if (!rooms[room]) return;
    const cleaned = await rewriteAnswer(answer);
    rooms[room].answers.push({ playerId: socket.id, text: cleaned });
  });

  socket.on("end-answer-phase", (room) => {
    if (!rooms[room]) return;
    io.to(room).emit("voting-phase", rooms[room].answers);
  });

  socket.on("submit-vote", ({ room, votedPlayerId }) => {
    if (!rooms[room]) return;
    rooms[room].votes[votedPlayerId] = (rooms[room].votes[votedPlayerId] || 0) + 1;
  });

  socket.on("next-round", async (room) => {
    if (!rooms[room]) return;
    const votes = rooms[room].votes;
    let winner = null;
    let max = 0;
    for (let id in votes) {
      if (votes[id] > max) {
        max = votes[id];
        winner = rooms[room].players.find(p => p.id === id);
      }
    }
    io.to(room).emit("round-winner", { winner, votes });

    // Reset for next round
    const prompt = await generatePrompt();
    rooms[room].answers = [];
    rooms[room].votes = {};
    rooms[room].prompt = prompt;
    rooms[room].round += 1;
    io.to(room).emit("game-started", { prompt });
  });

  socket.on("disconnect", () => {
    for (let room in rooms) {
      rooms[room].players = rooms[room].players.filter(p => p.id !== socket.id);
      io.to(room).emit("player-list", rooms[room].players);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
