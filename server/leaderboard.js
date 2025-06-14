// server/leaderboard.js
export function getLeaderboard(players) {
  return players.sort((a, b) => b.score - a.score);
}
