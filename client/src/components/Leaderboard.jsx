import React, { useState, useEffect } from 'react';
import powerUpService from '../services/PowerUpService';

const Leaderboard = ({ onClose }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedTab, setSelectedTab] = useState('coins');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    // Refresh leaderboard data
    const data = powerUpService.getLeaderboard();
    setLeaderboard(data);
  }, []);

  const tabs = [
    { id: 'coins', name: 'Coins', icon: '🪙' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'wins', name: 'Wins', icon: '🥇' },
    { id: 'powerups', name: 'Power-ups', icon: '⚡' }
  ];

  const timeFilters = [
    { id: 'all', name: 'All Time' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' }
  ];

  const getSortedLeaderboard = () => {
    return [...leaderboard].sort((a, b) => {
      switch (selectedTab) {
        case 'coins':
          return b.coins - a.coins;
        case 'achievements':
          return b.achievements - a.achievements;
        case 'wins':
          return b.roundsWon - a.roundsWon;
        case 'powerups':
          return b.powerUpsUsed - a.powerUpsUsed;
        default:
          return b.coins - a.coins;
      }
    });
  };

  const getValue = (player, tab) => {
    switch (tab) {
      case 'coins':
        return { value: player.coins, icon: '🪙', color: 'text-yellow-600' };
      case 'achievements':
        return { value: player.achievements, icon: '🏆', color: 'text-yellow-600' };
      case 'wins':
        return { value: player.roundsWon, icon: '🥇', color: 'text-yellow-600' };
      case 'powerups':
        return { value: player.powerUpsUsed, icon: '⚡', color: 'text-blue-600' };
      default:
        return { value: player.coins, icon: '🪙', color: 'text-yellow-600' };
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-white hover:bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📊 Leaderboard</h2>
              <p className="text-purple-100">See how you rank against other players</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeFilter === filter.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="overflow-y-auto max-h-[50vh]">
          {getSortedLeaderboard().length > 0 ? (
            <div className="divide-y divide-gray-200">
              {getSortedLeaderboard().map((player, index) => {
                const rank = index + 1;
                const { value, icon, color } = getValue(player, selectedTab);
                
                return (
                  <div
                    key={player.id}
                    className={`p-4 transition-all duration-200 ${getRankColor(rank)}`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Rank */}
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold min-w-[40px]">
                          {getRankIcon(rank)}
                        </div>
                        
                        {/* Player Info */}
                        <div className="flex-1">
                          <div className="font-semibold text-lg">
                            {player.id === 'current' ? 'You' : `Player ${player.id.slice(-4)}`}
                          </div>
                          <div className="text-sm opacity-75">
                            {player.id === 'current' ? 'Your Stats' : 'Anonymous Player'}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6">
                        {/* Primary Stat */}
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${color}`}>
                            {icon} {value.toLocaleString()}
                          </div>
                          <div className="text-sm opacity-75">
                            {selectedTab === 'coins' && 'Coins'}
                            {selectedTab === 'achievements' && 'Achievements'}
                            {selectedTab === 'wins' && 'Wins'}
                            {selectedTab === 'powerups' && 'Power-ups'}
                          </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="hidden md:flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">🪙 {player.coins}</div>
                            <div className="opacity-75">Coins</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">🏆 {player.achievements}</div>
                            <div className="opacity-75">Achievements</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">🥇 {player.roundsWon}</div>
                            <div className="opacity-75">Wins</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>No leaderboard data available yet</p>
              <p className="text-sm">Play some games to see rankings!</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {leaderboard.length}
              </div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {leaderboard.reduce((sum, p) => sum + p.coins, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Coins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {leaderboard.reduce((sum, p) => sum + p.achievements, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {leaderboard.reduce((sum, p) => sum + p.roundsWon, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Wins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 