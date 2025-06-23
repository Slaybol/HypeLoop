// Power-up and Achievement System
class PowerUpService {
  constructor() {
    this.powerUps = {
      // Answer Power-ups
      doublePoints: {
        id: 'doublePoints',
        name: 'Double Points',
        description: 'Get double points for this round',
        icon: '⚡',
        rarity: 'rare',
        cost: 100,
        duration: 'round',
        effect: (player, gameState) => {
          player.powerUpMultiplier = 2;
          return { message: `${player.name} activated Double Points!`, duration: 1 };
        }
      },
      
      extraTime: {
        id: 'extraTime',
        name: 'Extra Time',
        description: 'Get 30 extra seconds to answer',
        icon: '⏰',
        rarity: 'common',
        cost: 50,
        duration: 'round',
        effect: (player, gameState) => {
          return { message: `${player.name} got Extra Time!`, extraTime: 30 };
        }
      },
      
      hint: {
        id: 'hint',
        name: 'Hint',
        description: 'Get a hint for the current prompt',
        icon: '💡',
        rarity: 'common',
        cost: 75,
        duration: 'instant',
        effect: (player, gameState) => {
          const hints = [
            "Think about the opposite of what's expected",
            "Consider something that would be funny in this context",
            "What would be the most unexpected answer?",
            "Think about something that would make people laugh",
            "Consider a popular meme or trend"
          ];
          const hint = hints[Math.floor(Math.random() * hints.length)];
          return { message: `💡 Hint: ${hint}`, hint: hint };
        }
      },
      
      // Voting Power-ups
      voteSteal: {
        id: 'voteSteal',
        name: 'Vote Steal',
        description: 'Steal a vote from another player',
        icon: '🔄',
        rarity: 'epic',
        cost: 150,
        duration: 'instant',
        effect: (player, gameState) => {
          return { message: `${player.name} can steal a vote!`, action: 'voteSteal' };
        }
      },
      
      voteMultiplier: {
        id: 'voteMultiplier',
        name: 'Vote Multiplier',
        description: 'Your vote counts as 2 votes',
        icon: '📊',
        rarity: 'rare',
        cost: 120,
        duration: 'round',
        effect: (player, gameState) => {
          player.voteMultiplier = 2;
          return { message: `${player.name}'s vote counts double!`, duration: 1 };
        }
      },
      
      // Chaos Power-ups
      chaosImmunity: {
        id: 'chaosImmunity',
        name: 'Chaos Immunity',
        description: 'Immune to chaos mode effects for one round',
        icon: '🛡️',
        rarity: 'epic',
        cost: 200,
        duration: 'round',
        effect: (player, gameState) => {
          player.chaosImmune = true;
          return { message: `${player.name} is immune to chaos!`, duration: 1 };
        }
      },
      
      chaosTrigger: {
        id: 'chaosTrigger',
        name: 'Chaos Trigger',
        description: 'Force chaos mode to activate',
        icon: '🔥',
        rarity: 'legendary',
        cost: 300,
        duration: 'instant',
        effect: (player, gameState) => {
          return { message: `${player.name} triggered chaos mode!`, action: 'triggerChaos' };
        }
      },
      
      // Special Power-ups
      answerReveal: {
        id: 'answerReveal',
        name: 'Answer Reveal',
        description: 'See one other player\'s answer',
        icon: '👁️',
        rarity: 'rare',
        cost: 100,
        duration: 'instant',
        effect: (player, gameState) => {
          return { message: `${player.name} can peek at an answer!`, action: 'answerReveal' };
        }
      },
      
      skipRound: {
        id: 'skipRound',
        name: 'Skip Round',
        description: 'Skip this round and get average points',
        icon: '⏭️',
        rarity: 'epic',
        cost: 250,
        duration: 'instant',
        effect: (player, gameState) => {
          return { message: `${player.name} skipped the round!`, action: 'skipRound' };
        }
      }
    };

    this.achievements = {
      // Answer Achievements
      firstAnswer: {
        id: 'firstAnswer',
        name: 'First Answer',
        description: 'Submit your first answer',
        icon: '🎯',
        points: 10,
        condition: (stats) => stats.answersSubmitted >= 1
      },
      
      answerMaster: {
        id: 'answerMaster',
        name: 'Answer Master',
        description: 'Submit 50 answers',
        icon: '📝',
        points: 50,
        condition: (stats) => stats.answersSubmitted >= 50
      },
      
      // Voting Achievements
      firstVote: {
        id: 'firstVote',
        name: 'First Vote',
        description: 'Cast your first vote',
        icon: '🗳️',
        points: 10,
        condition: (stats) => stats.votesCast >= 1
      },
      
      voteCollector: {
        id: 'voteCollector',
        name: 'Vote Collector',
        description: 'Receive 100 total votes',
        icon: '🏆',
        points: 100,
        condition: (stats) => stats.votesReceived >= 100
      },
      
      // Winning Achievements
      firstWin: {
        id: 'firstWin',
        name: 'First Victory',
        description: 'Win your first round',
        icon: '🥇',
        points: 25,
        condition: (stats) => stats.roundsWon >= 1
      },
      
      winStreak: {
        id: 'winStreak',
        name: 'Win Streak',
        description: 'Win 3 rounds in a row',
        icon: '🔥',
        points: 75,
        condition: (stats) => stats.currentWinStreak >= 3
      },
      
      // Chaos Achievements
      chaosSurvivor: {
        id: 'chaosSurvivor',
        name: 'Chaos Survivor',
        description: 'Win a round during chaos mode',
        icon: '🌀',
        points: 50,
        condition: (stats) => stats.chaosWins >= 1
      },
      
      // Power-up Achievements
      powerUser: {
        id: 'powerUser',
        name: 'Power User',
        description: 'Use 10 power-ups',
        icon: '⚡',
        points: 40,
        condition: (stats) => stats.powerUpsUsed >= 10
      },
      
      // Special Achievements
      comeback: {
        id: 'comeback',
        name: 'Comeback King',
        description: 'Win after being in last place',
        icon: '🔄',
        points: 100,
        condition: (stats) => stats.comebackWins >= 1
      },
      
      perfectRound: {
        id: 'perfectRound',
        name: 'Perfect Round',
        description: 'Get all votes in a round',
        icon: '⭐',
        points: 150,
        condition: (stats) => stats.perfectRounds >= 1
      }
    };

    this.playerStats = new Map();
  }

  // Initialize player stats
  initializePlayer(playerId) {
    this.playerStats.set(playerId, {
      answersSubmitted: 0,
      votesCast: 0,
      votesReceived: 0,
      roundsWon: 0,
      currentWinStreak: 0,
      maxWinStreak: 0,
      chaosWins: 0,
      uniquePlayersMet: new Set(),
      powerUpsUsed: 0,
      comebackWins: 0,
      perfectRounds: 0,
      achievements: new Set(),
      powerUps: [],
      coins: 1000 // Starting coins
    });
  }

  // Get player stats
  getPlayerStats(playerId) {
    return this.playerStats.get(playerId) || this.initializePlayer(playerId);
  }

  // Update player stats
  updatePlayerStats(playerId, updates) {
    const stats = this.getPlayerStats(playerId);
    Object.assign(stats, updates);
    this.checkAchievements(playerId);
  }

  // Check for new achievements
  checkAchievements(playerId) {
    const stats = this.getPlayerStats(playerId);
    const newAchievements = [];

    Object.entries(this.achievements).forEach(([id, achievement]) => {
      if (!stats.achievements.has(id) && achievement.condition(stats)) {
        stats.achievements.add(id);
        stats.coins += achievement.points;
        newAchievements.push(achievement);
      }
    });

    return newAchievements;
  }

  // Get available power-ups for a player
  getAvailablePowerUps(playerId) {
    const stats = this.getPlayerStats(playerId);
    return Object.values(this.powerUps).filter(powerUp => 
      stats.coins >= powerUp.cost
    );
  }

  // Purchase and use a power-up
  usePowerUp(playerId, powerUpId, gameState) {
    const stats = this.getPlayerStats(playerId);
    const powerUp = this.powerUps[powerUpId];

    if (!powerUp) {
      throw new Error('Power-up not found');
    }

    if (stats.coins < powerUp.cost) {
      throw new Error('Not enough coins');
    }

    // Deduct coins
    stats.coins -= powerUp.cost;
    stats.powerUpsUsed++;

    // Apply power-up effect
    const effect = powerUp.effect({ name: gameState.players.find(p => p.id === playerId)?.name || 'Player' }, gameState);

    // Add to active power-ups if it has duration
    if (powerUp.duration === 'round') {
      stats.powerUps.push({
        id: powerUpId,
        roundsLeft: 1
      });
    }

    return {
      powerUp,
      effect,
      remainingCoins: stats.coins
    };
  }

  // End round - update power-ups and stats
  endRound(gameState) {
    gameState.players.forEach(player => {
      const stats = this.getPlayerStats(player.id);
      
      // Update power-up durations
      stats.powerUps = stats.powerUps.map(powerUp => ({
        ...powerUp,
        roundsLeft: powerUp.roundsLeft - 1
      })).filter(powerUp => powerUp.roundsLeft > 0);

      // Reset multipliers
      player.powerUpMultiplier = 1;
      player.voteMultiplier = 1;
      player.chaosImmune = false;
    });
  }

  // Get leaderboard
  getLeaderboard() {
    const players = Array.from(this.playerStats.entries()).map(([id, stats]) => ({
      id,
      coins: stats.coins,
      achievements: stats.achievements.size,
      roundsWon: stats.roundsWon,
      powerUpsUsed: stats.powerUpsUsed
    }));

    return players.sort((a, b) => b.coins - a.coins);
  }

  // Get achievement progress
  getAchievementProgress(playerId) {
    const stats = this.getPlayerStats(playerId);
    const progress = {};

    Object.entries(this.achievements).forEach(([id, achievement]) => {
      const isUnlocked = stats.achievements.has(id);
      progress[id] = {
        ...achievement,
        unlocked: isUnlocked,
        progress: this.calculateProgress(achievement, stats)
      };
    });

    return progress;
  }

  // Calculate achievement progress
  calculateProgress(achievement, stats) {
    // This would be more sophisticated based on the achievement type
    return stats.achievements.has(achievement.id) ? 100 : 0;
  }

  // Award coins for various actions
  awardCoins(playerId, action, amount) {
    const stats = this.getPlayerStats(playerId);
    stats.coins += amount;
    return stats.coins;
  }

  // Get power-up shop
  getPowerUpShop() {
    return Object.values(this.powerUps).map(powerUp => ({
      ...powerUp,
      available: true
    }));
  }
}

// Create singleton instance
const powerUpService = new PowerUpService();

export default powerUpService; 