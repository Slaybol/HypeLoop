// client/src/components/Leaderboard.jsx (assuming this is a client-side React component)
import React from 'react';
import PropTypes from 'prop-types'; // Recommended for React components

/**
 * Leaderboard component to display player scores.
 * @param {object} props
 * @param {Array<object>} props.players - Array of player objects with at least id, name, and score.
 */
function Leaderboard({ players }) {
  // Sort players by score in descending order
  // Create a copy of the array before sorting to avoid modifying props directly
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {sortedPlayers.length === 0 ? (
        <p>No scores yet. Start playing!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={player.id || index}> {/* Use player.id for a stable key */}
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

Leaderboard.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Leaderboard;

// server/leaderboard.js (The original file was probably meant for server-side utility)
// This function remains relevant for the server to sort and return leaderboard data
// exports.getLeaderboard = (players) => {
//   return players.sort((a, b) => b.score - a.score);
// };