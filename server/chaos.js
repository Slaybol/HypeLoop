// server/chaos.js
const chaosModes = {
  "reverse-voting": {
    name: "Reverse Voting",
    description: "Vote for the WORST answer instead of the best!",
    effect: (players, gameState) => {
      // Reverse the voting logic - lowest votes win
      return players;
    },
    announcement: "🌀 CHAOS MODE: Vote for the WORST answer! The most terrible answer wins!",
    duration: 1 // One round
  },

  "speed-round": {
    name: "Speed Round",
    description: "You only have 30 seconds to answer!",
    effect: (players, gameState) => {
      gameState.speedRound = true;
      gameState.timeLimit = 30; // 30 seconds
      return players;
    },
    announcement: "🌀 CHAOS MODE: SPEED ROUND! You have 30 seconds to answer!",
    duration: 1
  },

  "double-points": {
    name: "Double Points",
    description: "All votes count double this round!",
    effect: (players, gameState) => {
      gameState.pointMultiplier = 2;
      return players;
    },
    announcement: "🌀 CHAOS MODE: DOUBLE POINTS! All votes count double!",
    duration: 1
  },

  "silent-round": {
    name: "Silent Round",
    description: "No talking allowed! Only text answers!",
    effect: (players, gameState) => {
      gameState.silentRound = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: SILENT ROUND! No voice input allowed!",
    duration: 1
  },

  "impersonation": {
    name: "Impersonation Round",
    description: "Answer as if you're a famous person!",
    effect: (players, gameState) => {
      const celebrities = [
        "Arnold Schwarzenegger", "Darth Vader", "SpongeBob", "Gordon Ramsay",
        "Yoda", "Dr. Evil", "Austin Powers", "Borat", "Gollum", "Homer Simpson"
      ];
      gameState.impersonationTarget = celebrities[Math.floor(Math.random() * celebrities.length)];
      return players;
    },
    announcement: (gameState) => `🌀 CHAOS MODE: Answer as ${gameState.impersonationTarget}!`,
    duration: 1
  },

  "rhyme-time": {
    name: "Rhyme Time",
    description: "All answers must rhyme!",
    effect: (players, gameState) => {
      gameState.rhymeRequired = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: RHYME TIME! All answers must rhyme!",
    duration: 1
  },

  "backwards": {
    name: "Backwards Round",
    description: "Write your answer backwards!",
    effect: (players, gameState) => {
      gameState.backwardsRequired = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: Write your answer BACKWARDS!",
    duration: 1
  },

  "emoji-only": {
    name: "Emoji Only",
    description: "Answer using only emojis!",
    effect: (players, gameState) => {
      gameState.emojiOnly = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: EMOJI ONLY! Answer with just emojis!",
    duration: 1
  },

  "swapped-scores": {
    name: "Score Swap",
    description: "Everyone swaps scores with another player!",
    effect: (players, gameState) => {
      const playerIds = Object.keys(players);
      const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
      
      const tempScores = {};
      playerIds.forEach((id, index) => {
        tempScores[id] = players[shuffled[index]].score;
      });
      
      playerIds.forEach(id => {
        players[id].score = tempScores[id];
      });
      
      return players;
    },
    announcement: "🌀 CHAOS MODE: SCORE SWAP! Everyone trades scores!",
    duration: 1
  },

  "voting-roulette": {
    name: "Voting Roulette",
    description: "Random votes are worth 5 points!",
    effect: (players, gameState) => {
      gameState.votingRoulette = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: VOTING ROULETTE! Random votes are worth 5 points!",
    duration: 1
  },

  "time-bomb": {
    name: "Time Bomb",
    description: "Last person to answer loses points!",
    effect: (players, gameState) => {
      gameState.timeBomb = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: TIME BOMB! Last to answer loses points!",
    duration: 1
  },

  "mirror-mirror": {
    name: "Mirror Mirror",
    description: "Vote for yourself!",
    effect: (players, gameState) => {
      gameState.selfVoting = true;
      return players;
    },
    announcement: "🌀 CHAOS MODE: MIRROR MIRROR! Vote for yourself!",
    duration: 1
  }
};

// Chaos mode triggers
const chaosTriggers = {
  // Trigger chaos every 3-5 rounds
  roundBased: (round) => {
    return round > 1 && round % Math.floor(Math.random() * 3 + 3) === 0;
  },
  
  // Trigger chaos when someone gets too many points
  scoreBased: (players) => {
    const maxScore = Math.max(...Object.values(players).map(p => p.score));
    return maxScore >= 10; // Trigger when someone reaches 10 points
  },
  
  // Trigger chaos randomly (10% chance per round)
  random: () => {
    return Math.random() < 0.1;
  }
};

function selectChaosMode(excludeModes = []) {
  const availableModes = Object.keys(chaosModes).filter(mode => !excludeModes.includes(mode));
  const randomMode = availableModes[Math.floor(Math.random() * availableModes.length)];
  return chaosModes[randomMode];
}

function shouldTriggerChaos(gameState) {
  // Don't trigger chaos if it's already active
  if (gameState.chaos) return false;
  
  // Check different trigger conditions
  return chaosTriggers.roundBased(gameState.round) ||
         chaosTriggers.scoreBased(gameState.players) ||
         chaosTriggers.random();
}

function applyChaosMode(players, gameState) {
  if (!shouldTriggerChaos(gameState)) {
    return { players, chaosMode: null };
  }

  const chaosMode = selectChaosMode();
  const chaosKey = Object.keys(chaosModes).find(key => chaosModes[key] === chaosMode);
  
  // Apply the chaos effect
  const updatedPlayers = chaosMode.effect(players, gameState);
  
  // Update game state
  gameState.chaos = chaosKey;
  gameState.chaosMode = chaosMode;
  gameState.chaosRound = gameState.round;
  
  console.log(`🌀 Chaos mode activated: ${chaosMode.name}`);
  
  return {
    players: updatedPlayers,
    chaosMode: chaosMode,
    announcement: typeof chaosMode.announcement === 'function' 
      ? chaosMode.announcement(gameState) 
      : chaosMode.announcement
  };
}

function clearChaosMode(gameState) {
  if (gameState.chaos && gameState.chaosMode) {
    const duration = gameState.chaosMode.duration || 1;
    const roundsSinceChaos = gameState.round - gameState.chaosRound;
    
    if (roundsSinceChaos >= duration) {
      console.log(`🌀 Chaos mode ended: ${gameState.chaosMode.name}`);
      gameState.chaos = null;
      gameState.chaosMode = null;
      gameState.chaosRound = null;
      
      // Clear chaos-specific game state
      delete gameState.speedRound;
      delete gameState.timeLimit;
      delete gameState.pointMultiplier;
      delete gameState.silentRound;
      delete gameState.impersonationTarget;
      delete gameState.rhymeRequired;
      delete gameState.backwardsRequired;
      delete gameState.emojiOnly;
      delete gameState.votingRoulette;
      delete gameState.timeBomb;
      delete gameState.selfVoting;
    }
  }
}

module.exports = {
  applyChaosMode,
  clearChaosMode,
  chaosModes,
  shouldTriggerChaos
};