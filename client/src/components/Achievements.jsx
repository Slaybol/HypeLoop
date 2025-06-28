import React, { useState } from 'react';
import powerUpService from '../services/PowerUpService';

const Achievements = ({ playerId, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const playerStats = powerUpService.getPlayerStats(playerId);
  const achievementProgress = powerUpService.getAchievementProgress(playerId);

  const categories = {
    all: { name: 'All Achievements', icon: '🏆' },
    answer: { name: 'Answer Achievements', icon: '📝' },
    voting: { name: 'Voting Achievements', icon: '🗳️' },
    winning: { name: 'Winning Achievements', icon: '🥇' },
    chaos: { name: 'Chaos Achievements', icon: '⚡' },
    social: { name: 'Social Achievements', icon: '👥' },
    powerup: { name: 'Power-up Achievements', icon: '⚡' },
    special: { name: 'Special Achievements', icon: '⭐' }
  };

  const getCategoryForAchievement = (achievementId) => {
    if (achievementId.includes('Answer') || achievementId.includes('answer')) return 'answer';
    if (achievementId.includes('Vote') || achievementId.includes('vote')) return 'voting';
    if (achievementId.includes('Win') || achievementId.includes('Victory')) return 'winning';
    if (achievementId.includes('Chaos')) return 'chaos';
    if (achievementId.includes('Team') || achievementId.includes('Player')) return 'social';
    if (achievementId.includes('Power') || achievementId.includes('power')) return 'powerup';
    return 'special';
  };

  const filteredAchievements = Object.entries(achievementProgress).filter(([id, achievement]) => {
    if (selectedCategory === 'all') return true;
    return getCategoryForAchievement(id) === selectedCategory;
  });

  const unlockedCount = Object.values(achievementProgress).filter(a => a.unlocked).length;
  const totalCount = Object.keys(achievementProgress).length;
  const totalPoints = Object.values(achievementProgress)
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🏆 Achievements</h2>
              <p className="text-yellow-100">Track your progress and unlock rewards</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">🪙 {playerStats.coins}</div>
              <div className="text-sm text-yellow-100">Total Coins</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{unlockedCount}/{totalCount}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.round((unlockedCount / totalCount) * 100)}%</div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">🪙 {totalPoints}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{playerStats.powerUpsUsed}</div>
              <div className="text-sm text-gray-600">Power-ups Used</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map(([id, achievement]) => (
              <div
                key={id}
                className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                  achievement.unlocked
                    ? 'border-green-300 bg-green-50 shadow-lg'
                    : 'border-gray-300 bg-gray-50 opacity-75'
                }`}
              >
                {/* Unlock Status */}
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2 text-green-500 text-xl">✓</div>
                )}

                {/* Achievement Icon */}
                <div className={`text-4xl mb-3 text-center ${
                  achievement.unlocked ? 'animate-pulse' : 'grayscale'
                }`}>
                  {achievement.icon}
                </div>

                {/* Achievement Info */}
                <div className="text-center">
                  <h3 className={`font-bold text-lg mb-1 ${
                    achievement.unlocked ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  
                  {/* Points */}
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-yellow-600 font-bold">🪙 {achievement.points}</span>
                    <span className="text-sm text-gray-500">points</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>

                  {/* Status */}
                  <div className={`text-xs font-semibold ${
                    achievement.unlocked ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {achievement.unlocked ? 'UNLOCKED' : 'IN PROGRESS'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No achievements found in this category</p>
            </div>
          )}
        </div>

        {/* Player Stats Summary */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-bold mb-4">📊 Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold">Answers Submitted:</span>
              <div className="text-lg font-bold text-blue-600">{playerStats.answersSubmitted}</div>
            </div>
            <div>
              <span className="font-semibold">Votes Cast:</span>
              <div className="text-lg font-bold text-green-600">{playerStats.votesCast}</div>
            </div>
            <div>
              <span className="font-semibold">Votes Received:</span>
              <div className="text-lg font-bold text-purple-600">{playerStats.votesReceived}</div>
            </div>
            <div>
              <span className="font-semibold">Rounds Won:</span>
              <div className="text-lg font-bold text-yellow-600">{playerStats.roundsWon}</div>
            </div>
            <div>
              <span className="font-semibold">Win Streak:</span>
              <div className="text-lg font-bold text-red-600">{playerStats.currentWinStreak}</div>
            </div>
            <div>
              <span className="font-semibold">Chaos Wins:</span>
              <div className="text-lg font-bold text-orange-600">{playerStats.chaosWins}</div>
            </div>
            <div>
              <span className="font-semibold">Power-ups Used:</span>
              <div className="text-lg font-bold text-indigo-600">{playerStats.powerUpsUsed}</div>
            </div>
            <div>
              <span className="font-semibold">Perfect Rounds:</span>
              <div className="text-lg font-bold text-pink-600">{playerStats.perfectRounds}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 