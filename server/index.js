const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.static('public'));

let rooms = {}; // { roomName: { players: [], gameStarted: false, round: 1, prompt: '', answers: [], votes: {} } }

const prompts = [
  "What's something you shouldn't do on a first date?",
  "Describe your weirdest dream in 5 words.",
  "What’s an unexpected use for a banana?",
  "If pets could talk, what would be the first thing yours would say?"
];

function getPrompt() {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', ({ name, room }) => {
    if (!rooms[room]) {
      rooms[room] = {
        players: [],
        gameStarted: false,
        round: 1,
        prompt: '',
        answers: [],
        votes: {},
      };
    }

    const player = { id: socket.id, name };
    rooms[room].players.push(player);
    socket.join(room);

    io.to(room).emit('player-list', rooms[room].players);
    console.log(`${name} joined room ${room}`);
  });

  socket.on('start-game', (room) => {
    const game = rooms[room];
    if (game) {
      game.gameStarted = true;
      game.prompt = getPrompt();
      game.answers = [];
      game.votes = {};
      io.to(room).emit('game-started', game);
    }
  });

  socket.on('submit-answer', ({ room, answer }) => {
    const game = rooms[room];
    if (game) {
      game.answers.push({ playerId: socket.id, text: answer });
      if (game.answers.length === game.players.length) {
        io.to(room).emit('voting-phase', game.answers);
      }
    }
  });

  socket.on('submit-vote', ({ room, votedPlayerId }) => {
    const game = rooms[room];
    if (game) {
      if (!game.votes[votedPlayerId]) game.votes[votedPlayerId] = 0;
      game.votes[votedPlayerId]++;

      const totalVotes = Object.values(game.votes).reduce((a, b) => a + b, 0);
      if (totalVotes === game.players.length) {
        const winnerId = Object.entries(game.votes).sort((a, b) => b[1] - a[1])[0][0];
        const winner = game.players.find(p => p.id === winnerId);
        io.to(room).emit('round-winner', { winner, votes: game.votes });
      }
    }
  });

  socket.on('next-round', (room) => {
    const game = rooms[room];
    if (game) {
      game.round++;
      game.prompt = getPrompt();
      game.answers = [];
      game.votes = {};
      io.to(room).emit('game-started', game);
    }
  });

  socket.on('disconnect', () => {
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter(p => p.id !== socket.id);
      io.to(room).emit('player-list', rooms[room].players);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});