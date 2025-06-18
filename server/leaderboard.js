// server/leaderboard.js
function getLeaderboard(playersArray) {
  // playersArray is an array of player objects [{ id, name, score, ... }]
  // Sort players by score in descending order
  return [...playersArray].sort((a, b) => b.score - a.score);
}

module.exports = { getLeaderboard };