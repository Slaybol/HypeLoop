// server/gameLogic.js
const roomManager = require("./roomManager");
const { getPrompt } = require("./promptService");
const { getLeaderboard } = require("./leaderboard");
const { applyChaosMode } = require("./chaos");

const gameLogic = {
  startGame: async (io, roomId, roomState) => {
    if (!roomState) return;

    roomState.round = 1;
    roomState.currentPhase = "answering";
    roomState.answers = [];
    roomState.votes = {};
    roomState.currentPrompt = await getPrompt(roomState.theme.name);

    roomManager.updateRoomState(roomId, roomState);
    io.to(roomId).emit("game-started", {
      prompt: roomState.currentPrompt,
      players: Object.values(roomState.players),
      round: roomState.round,
      phase: roomState.currentPhase,
    });
    console.log(`Game started in room ${roomId}. Round 1, Phase: Answering.`);
  },

  submitAnswer: (io, playerId, roomId, answerText) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState || roomState.currentPhase !== "answering") return;

    const existingAnswer = roomState.answers.find(a => a.playerId === playerId);
    if (existingAnswer) {
      existingAnswer.text = answerText;
    } else {
      roomState.answers.push({ playerId, text: answerText });
    }

    roomManager.updateRoomState(roomId, roomState);
    io.to(roomId).emit("answer-submitted", { playerId, answerText });
    console.log(`Player ${playerId} submitted answer in room ${roomId}.`);
  },

  transitionToVoting: (io, roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return;

    roomState.currentPhase = "voting";
    roomState.votes = {};

    roomManager.updateRoomState(roomId, roomState);
    io.to(roomId).emit("voting-phase", {
      answers: roomState.answers,
      phase: roomState.currentPhase,
    });
    console.log(`Transitioned to voting phase in room ${roomId}.`);
  },

  submitVote: (io, voterId, roomId, votedPlayerId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState || roomState.currentPhase !== "voting") return;

    if (voterId === votedPlayerId) {
      io.to(voterId).emit("vote-error", "Cannot vote for yourself.");
      return;
    }
    if (roomState.votes[voterId]) {
      io.to(voterId).emit("vote-error", "You have already voted.");
      return;
    }

    roomState.votes[voterId] = votedPlayerId;
    roomManager.updateRoomState(roomId, roomState);
    io.to(roomId).emit("vote-submitted", { voterId, votedPlayerId });
    console.log(`Player ${voterId} voted for ${votedPlayerId} in room ${roomId}.`);

    const playersWhoAnswered = roomState.answers.map(a => a.playerId);
    const uniqueVoters = new Set(Object.keys(roomState.votes));

    if (playersWhoAnswered.every(pId => uniqueVoters.has(pId))) {
      gameLogic.transitionToResults(io, roomId);
    }
  },

  transitionToResults: (io, roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return;

    roomState.currentPhase = "results";
    let roundWinner = null;
    let maxVotes = 0;
    const playerScoresThisRound = {};

    for (const voterId in roomState.votes) {
      const votedPlayerId = roomState.votes[voterId];
      playerScoresThisRound[votedPlayerId] = (playerScoresThisRound[votedPlayerId] || 0) + 1;
    }

    for (const playerId in playerScoresThisRound) {
      const scoreToAdd = playerScoresThisRound[playerId];
      if (roomState.players[playerId]) {
        roomState.players[playerId].score += scoreToAdd;
      }
      if (scoreToAdd > maxVotes) {
        maxVotes = scoreToAdd;
        roundWinner = roomState.players[playerId];
      }
    }

    if (roomState.chaos) {
      roomState.players = applyChaosMode(roomState.players, roomState.chaos);
      console.log(`Chaos mode '${roomState.chaos}' applied in room ${roomId}.`);
    }

    const leaderboard = getLeaderboard(Object.values(roomState.players));
    roomManager.updateRoomState(roomId, roomState);
    io.to(roomId).emit("round-results", {
      roundWinner,
      leaderboard,
      phase: roomState.currentPhase,
      playerScoresThisRound,
    });
    console.log(`Transitioned to results phase in room ${roomId}. Winner: ${roundWinner?.name || 'No winner'}.`);
  },

  startNextRound: async (io, roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return;

    roomState.round += 1;
    roomState.currentPhase = "answering";
    roomState.answers = [];
    roomState.votes = {};
    roomState.currentPrompt = await getPrompt(roomState.theme.name);
    roomState.chaos = null;

    roomManager.updateRoomState(roomId, roomState);
    io.to(roomId).emit("game-started", {
      prompt: roomState.currentPrompt,
      players: Object.values(roomState.players),
      round: roomState.round,
      phase: roomState.currentPhase,
    });
    console.log(`Starting round ${roomState.round} in room ${roomId}. Phase: Answering.`);
  },
};

module.exports = gameLogic;
