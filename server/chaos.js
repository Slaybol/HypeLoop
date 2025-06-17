// server/chaos.js

/**
 * Defines available chaos rules and their effects.
 * Each effect function takes (io, roomId, roomState) and modifies roomState or emits events.
 */
const chaosRules = {
  'reverse_scores': {
    name: 'Reverse Scores',
    description: 'Player scores are temporarily reversed!',
    applyEffect: (io, roomId, roomState) => {
      // Example: This would likely involve more complex score manipulation
      // For now, let's just log and emit
      io.to(roomId).emit('chaos:activate', { type: 'reverse_scores', message: 'Scores have been reversed!' });
      console.log(`Chaos: Scores reversed in room ${roomId}`);
      // Actual score reversal logic would go here, possibly modifying player scores in roomState
      // For a temporary effect, you might set a flag and a timer.
    }
  },
  'double_points': {
    name: 'Double Points',
    description: 'All points earned this round are doubled!',
    applyEffect: (io, roomId, roomState) => {
      roomState.isDoublePointsActive = true; // Set a flag on the room state
      io.to(roomId).emit('chaos:activate', { type: 'double_points', message: 'Double points are active!' });
      console.log(`Chaos: Double points active in room ${roomId}`);
      // Logic in score calculation needs to check roomState.isDoublePointsActive
    }
  },
  'mute_next': {
    name: 'Mute Next',
    description: 'The next player to submit an answer is muted!',
    applyEffect: (io, roomId, roomState) => {
      // This is a more complex effect, potentially targeting a player or next N players
      io.to(roomId).emit('chaos:activate', { type: 'mute_next', message: 'Someone might be muted next!' });
      console.log(`Chaos: Mute Next activated in room ${roomId}`);
      // Logic for muting (e.g., disabling voice input or forcing text for a player)
    }
  },
  'improv_round': {
    name: 'Improv Round',
    description: 'This round requires an improvised answer, no typing allowed!',
    applyEffect: (io, roomId, roomState) => {
      roomState.isImprovRound = true; // Flag for client to disable typing
      io.to(roomId).emit('chaos:activate', { type: 'improv_round', message: 'Improv Round! Speak your answer!' });
      console.log(`Chaos: Improv Round activated in room ${roomId}`);
    }
  }
};

/**
 * Applies a random chaos mode to the given room state and notifies clients.
 * @param {SocketIOServer} io - The Socket.IO server instance.
 * @param {string} roomId - The ID of the room to apply chaos to.
 * @param {object} roomState - The current state object of the room.
 * @returns {object} The updated roomState with the active chaos rule.
 */
export function triggerRandomChaosEvent(io, roomId, roomState) {
  const ruleKeys = Object.keys(chaosRules);
  const randomRuleKey = ruleKeys[Math.floor(Math.random() * ruleKeys.length)];
  const selectedRule = chaosRules[randomRuleKey];

  // Set the active chaos rule in the room state
  roomState.activeChaos = {
    type: randomRuleKey,
    name: selectedRule.name,
    description: selectedRule.description,
    // Add any specific data needed by the client for this chaos type
  };

  // Apply the actual effect of the chaos rule
  selectedRule.applyEffect(io, roomId, roomState);

  return roomState;
}

// Optionally, you might export the rules themselves for external access if needed
// export { chaosRules };