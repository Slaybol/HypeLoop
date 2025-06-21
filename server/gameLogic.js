// server/gameLogic.js
const roomManager = require("./roomManager");
const { getPrompt } = require("./promptService");
const { getLeaderboard } = require("./leaderboard");
const { applyChaosMode, clearChaosMode } = require("./chaos");

const gameLogic = {
  startGame: async (io, roomId, roomState) => {
    if (!roomState) return;

    roomState.round = 1;
    roomState.currentPhase = "answering";
    roomState.answers = [];
    roomState.votes = {};
    roomState.hypeCoins = {}; // Track HypeCoins per player
    
    // Initialize HypeCoins for all players
    Object.keys(roomState.players).forEach(playerId => {
      roomState.hypeCoins[playerId] = 0;
    });
    
    // Get prompt for players to fill in
    const prompt = await getPrompt(roomState.theme.name);
    roomState.currentPrompt = prompt;

    roomManager.updateRoomState(roomId, roomState);
    
    io.to(roomId).emit("game-started", {
      prompt: roomState.currentPrompt,
      players: Object.values(roomState.players),
      round: roomState.round,
      phase: roomState.currentPhase,
      hypeCoins: roomState.hypeCoins
    });
    
    console.log(`🎮 HypeLoop started in room ${roomId}. Round 1, Phase: Answering.`);
    console.log(`🎤 Prompt: ${prompt.text}`);
  },

  submitAnswer: (io, playerId, roomId, answerText) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState || roomState.currentPhase !== "answering") return;

    // Apply chaos mode effects to the answer
    let processedAnswer = answerText;
    
    if (roomState.backwardsRequired) {
      processedAnswer = answerText.split('').reverse().join('');
    }
    
    if (roomState.emojiOnly) {
      // Filter to only emojis (simplified check)
      processedAnswer = answerText.replace(/[^😀-🙏🌀-🗿🚀-🛿]/g, '');
    }

    const existingAnswer = roomState.answers.find(a => a.playerId === playerId);
    if (existingAnswer) {
      existingAnswer.text = processedAnswer;
      existingAnswer.originalText = answerText; // Keep original for display
    } else {
      roomState.answers.push({ 
        playerId, 
        text: processedAnswer, 
        originalText: answerText,
        id: playerId 
      });
    }

    roomManager.updateRoomState(roomId, roomState);
    
    io.to(roomId).emit("game-update", {
      players: Object.values(roomState.players),
      gameStarted: true,
      currentPhase: roomState.currentPhase,
      answersCount: roomState.answers.length,
      hypeCoins: roomState.hypeCoins,
      chaosMode: roomState.chaosMode
    });
    
    console.log(`🎤 Player ${playerId} submitted answer: "${processedAnswer}"`);

    // Check if all players have submitted answers
    const playerIds = Object.keys(roomState.players);
    const answeredPlayerIds = roomState.answers.map(a => a.playerId);
    
    if (playerIds.length === answeredPlayerIds.length) {
      // All players have answered, transition to voting
      setTimeout(() => {
        gameLogic.transitionToVoting(io, roomId);
      }, 2000); // Give players time to see all answers
    }
  },

  transitionToVoting: (io, roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return;

    roomState.currentPhase = "voting";
    roomState.votes = {};

    // Prepare answers for voting with proper format
    const answersForVoting = roomState.answers.map(answer => ({
      id: answer.playerId,
      answer: answer.text,
      originalAnswer: answer.originalText || answer.text,
      playerId: answer.playerId,
      playerName: roomState.players[answer.playerId]?.name || "Unknown"
    }));

    roomManager.updateRoomState(roomId, roomState);
    
    io.to(roomId).emit("answers-update", answersForVoting);
    io.to(roomId).emit("game-update", {
      players: Object.values(roomState.players),
      gameStarted: true,
      currentPhase: roomState.currentPhase,
      hypeCoins: roomState.hypeCoins,
      chaosMode: roomState.chaosMode
    });
    
    console.log(`🗳️ Transitioned to voting phase in room ${roomId}.`);
    console.log(`📝 Answers for voting:`, answersForVoting.map(a => `${a.playerName}: "${a.answer}"`));
  },

  submitVote: (io, voterId, roomId, votedPlayerId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState || roomState.currentPhase !== "voting") return;

    // Chaos mode voting rules
    if (roomState.selfVoting && voterId !== votedPlayerId) {
      io.to(voterId).emit("vote-error", { message: "🌀 CHAOS MODE: You must vote for yourself!" });
      return;
    }
    
    if (!roomState.selfVoting && voterId === votedPlayerId) {
      io.to(voterId).emit("vote-error", { message: "You can't vote for yourself! 😅" });
      return;
    }
    
    if (roomState.votes[voterId]) {
      io.to(voterId).emit("vote-error", { message: "You've already voted! 🗳️" });
      return;
    }

    roomState.votes[voterId] = votedPlayerId;
    roomManager.updateRoomState(roomId, roomState);
    
    // Send vote confirmation with visual feedback
    io.to(roomId).emit("vote-submitted", { 
      voterId, 
      votedPlayerId,
      voterName: roomState.players[voterId]?.name,
      votedPlayerName: roomState.players[votedPlayerId]?.name
    });
    
    console.log(`🗳️ ${roomState.players[voterId]?.name} voted for ${roomState.players[votedPlayerId]?.name}`);

    // Check if all players who submitted answers have voted
    const playersWhoAnswered = roomState.answers.map(a => a.playerId);
    const uniqueVoters = new Set(Object.keys(roomState.votes));

    if (playersWhoAnswered.every(pId => uniqueVoters.has(pId))) {
      // All eligible players have voted, show results
      setTimeout(() => {
        gameLogic.transitionToResults(io, roomId);
      }, 1500); // Small delay for UI feedback
    }
  },

  transitionToResults: (io, roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return;

    roomState.currentPhase = "results";
    let roundWinner = null;
    let maxVotes = 0;
    const playerScoresThisRound = {};

    // Calculate votes for each player
    for (const voterId in roomState.votes) {
      const votedPlayerId = roomState.votes[voterId];
      playerScoresThisRound[votedPlayerId] = (playerScoresThisRound[votedPlayerId] || 0) + 1;
    }

    // Apply chaos mode voting logic
    if (roomState.chaos === "reverse-voting") {
      // Reverse voting: lowest votes win
      const minVotes = Math.min(...Object.values(playerScoresThisRound));
      for (const playerId in playerScoresThisRound) {
        if (playerScoresThisRound[playerId] === minVotes) {
          maxVotes = minVotes;
          roundWinner = roomState.players[playerId];
        }
      }
    } else {
      // Normal voting: highest votes win
      for (const playerId in playerScoresThisRound) {
        const scoreToAdd = playerScoresThisRound[playerId];
        if (scoreToAdd > maxVotes) {
          maxVotes = scoreToAdd;
          roundWinner = roomState.players[playerId];
        }
      }
    }

    // Update player scores, HypeCoins, and find winner
    for (const playerId in playerScoresThisRound) {
      let scoreToAdd = playerScoresThisRound[playerId];
      
      // Apply chaos mode point multipliers
      if (roomState.pointMultiplier) {
        scoreToAdd *= roomState.pointMultiplier;
      }
      
      if (roomState.players[playerId]) {
        roomState.players[playerId].score += scoreToAdd;
        
        // Award HypeCoins based on votes received
        const hypeCoinsEarned = scoreToAdd * 10; // 10 coins per vote
        roomState.hypeCoins[playerId] = (roomState.hypeCoins[playerId] || 0) + hypeCoinsEarned;
        
        console.log(`💰 ${roomState.players[playerId].name} earned ${hypeCoinsEarned} HypeCoins!`);
      }
    }

    const leaderboard = getLeaderboard(Object.values(roomState.players));
    roomManager.updateRoomState(roomId, roomState);
    
    // Send results to all players
    io.to(roomId).emit("round-results", {
      roundWinner,
      leaderboard,
      phase: roomState.currentPhase,
      playerScoresThisRound,
      answers: roomState.answers,
      votes: roomState.votes,
      hypeCoins: roomState.hypeCoins,
      chaosMode: roomState.chaosMode
    });
    
    console.log(`🏆 Round ${roomState.round} winner: ${roundWinner?.name || 'No winner'}!`);
  },

  startNextRound: async (io, roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return;

    roomState.round += 1;
    roomState.currentPhase = "answering";
    roomState.answers = [];
    roomState.votes = {};
    
    // Clear previous chaos mode
    clearChaosMode(roomState);
    
    // Check for new chaos mode
    const chaosResult = applyChaosMode(roomState.players, roomState);
    if (chaosResult.chaosMode) {
      roomState.chaosMode = chaosResult.chaosMode;
      roomState.players = chaosResult.players;
      console.log(`🌀 Chaos mode activated: ${chaosResult.chaosMode.name}`);
    }
    
    // Get new prompt for next round
    const prompt = await getPrompt(roomState.theme.name);
    roomState.currentPrompt = prompt;

    roomManager.updateRoomState(roomId, roomState);
    
    io.to(roomId).emit("new-round", {
      prompt: roomState.currentPrompt,
      players: Object.values(roomState.players),
      round: roomState.round,
      phase: roomState.currentPhase,
      hypeCoins: roomState.hypeCoins,
      chaosMode: roomState.chaosMode,
      chaosAnnouncement: chaosResult.announcement
    });
    
    io.to(roomId).emit("game-update", {
      players: Object.values(roomState.players),
      gameStarted: true,
      currentPhase: roomState.currentPhase,
      hypeCoins: roomState.hypeCoins,
      chaosMode: roomState.chaosMode
    });
    
    console.log(`🎮 Starting round ${roomState.round} in room ${roomId}.`);
    console.log(`🎤 New prompt: ${prompt.text}`);
    if (chaosResult.chaosMode) {
      console.log(`🌀 Chaos mode: ${chaosResult.chaosMode.name}`);
    }
  },

  // Helper function to get current game state
  getGameState: (roomId) => {
    const roomState = roomManager.getRoom(roomId);
    if (!roomState) return null;
    
    return {
      players: Object.values(roomState.players),
      gameStarted: roomState.currentPhase !== "waiting",
      currentPhase: roomState.currentPhase,
      round: roomState.round,
      prompt: roomState.currentPrompt,
      answers: roomState.answers,
      votes: roomState.votes,
      hypeCoins: roomState.hypeCoins,
      chaosMode: roomState.chaosMode
    };
  },

  // Helper function to broadcast game state
  broadcastGameState: (io, roomId) => {
    const gameState = gameLogic.getGameState(roomId);
    if (gameState) {
      io.to(roomId).emit("game-update", gameState);
    }
  }
};

module.exports = gameLogic;