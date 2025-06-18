// server/chaos.js
// This function needs to modify the players object based on chaos type
// players is an object { playerId: {id, name, score, avatar}, ...}
function applyChaosMode(players, chaosType) {
  switch (chaosType) {
    case 'reverse_scores':
      console.log('Applying Chaos: Reverse Scores!');
      for (const playerId in players) {
        players[playerId].score *= -1; // Example: reverse scores
      }
      break;
    case 'double_points':
        console.log('Applying Chaos: Double Points!');
        // This is typically applied to the *next* round's points,
        // or for the winner of the current round.
        // For simplicity, let's say it doubles everyone's current total score.
        for (const playerId in players) {
          players[playerId].score *= 2;
        }
        break;
    case 'mute_next':
        console.log('Applying Chaos: Mute Next Round!');
        // This would require client-side logic to temporarily mute players
        // So, this function might just set a flag on the player object
        for (const playerId in players) {
            players[playerId].isMuted = true; // Example flag
        }
        break;
    case 'improv_round':
        console.log('Applying Chaos: Improv Round!');
        // This might not directly change scores but sets a specific round type
        // The gameLogic would need to interpret this flag.
        break;
    default:
      console.log('Unknown chaos mode:', chaosType);
  }
  return players; // Return the modified players object
}

module.exports = { applyChaosMode };