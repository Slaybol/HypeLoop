import React, { useState, useEffect } from 'react';
import powerUpService from '../services/PowerUpService';

const Tournament = ({ onClose, onJoinTournament }) => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournamentStats, setTournamentStats] = useState({});

  useEffect(() => {
    // Simulate tournament data
    const mockTournaments = [
      {
        id: 'daily_1',
        name: 'Daily Challenge',
        description: 'Quick 5-round tournament with bonus rewards',
        rounds: 5,
        entryFee: 50,
        prizePool: 500,
        participants: 12,
        maxParticipants: 16,
        startTime: new Date(Date.now() + 3600000), // 1 hour from now
        status: 'upcoming',
        rewards: {
          first: 250,
          second: 150,
          third: 100
        }
      },
      {
        id: 'weekly_1',
        name: 'Weekly Championship',
        description: 'Epic 10-round tournament with legendary rewards',
        rounds: 10,
        entryFee: 200,
        prizePool: 2000,
        participants: 8,
        maxParticipants: 32,
        startTime: new Date(Date.now() + 86400000), // 24 hours from now
        status: 'upcoming',
        rewards: {
          first: 1000,
          second: 600,
          third: 400
        }
      },
      {
        id: 'chaos_1',
        name: 'Chaos Cup',
        description: 'Chaos mode enabled - anything can happen!',
        rounds: 7,
        entryFee: 100,
        prizePool: 1000,
        participants: 6,
        maxParticipants: 16,
        startTime: new Date(Date.now() + 7200000), // 2 hours from now
        status: 'upcoming',
        chaosMode: true,
        rewards: {
          first: 500,
          second: 300,
          third: 200
        }
      }
    ];

    setTournaments(mockTournaments);

    // Simulate tournament stats
    setTournamentStats({
      tournamentsPlayed: 3,
      tournamentsWon: 1,
      totalPrizeMoney: 350,
      bestFinish: '2nd place',
      favoriteMode: 'Chaos Cup'
    });
  }, []);

  const formatTimeUntil = (startTime) => {
    const now = new Date();
    const diff = startTime - now;
    
    if (diff <= 0) return 'Starting now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleJoinTournament = (tournament) => {
    if (onJoinTournament) {
      onJoinTournament(tournament);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🏆 Tournaments</h2>
              <p className="text-purple-100">Compete for glory and rewards</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-bold mb-3">📊 Your Tournament Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{tournamentStats.tournamentsPlayed || 0}</div>
              <div className="text-sm text-gray-600">Tournaments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{tournamentStats.tournamentsWon || 0}</div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">🪙 {tournamentStats.totalPrizeMoney || 0}</div>
              <div className="text-sm text-gray-600">Prize Money</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{tournamentStats.bestFinish || 'N/A'}</div>
              <div className="text-sm text-gray-600">Best Finish</div>
            </div>
          </div>
        </div>

        {/* Available Tournaments */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <h3 className="text-xl font-bold mb-4">🎮 Available Tournaments</h3>
          <div className="grid gap-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className={`border-2 rounded-lg p-6 transition-all duration-200 ${
                  selectedTournament?.id === tournament.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedTournament(tournament)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-800">{tournament.name}</h4>
                      {tournament.chaosMode && (
                        <span className="bg-gradient-to-r from-red-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          🌀 Chaos Mode
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tournament.status)}`}>
                        {tournament.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{tournament.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Rounds:</span> {tournament.rounds}
                      </div>
                      <div>
                        <span className="font-semibold">Entry Fee:</span> 🪙 {tournament.entryFee}
                      </div>
                      <div>
                        <span className="font-semibold">Prize Pool:</span> 🪙 {tournament.prizePool}
                      </div>
                      <div>
                        <span className="font-semibold">Players:</span> {tournament.participants}/{tournament.maxParticipants}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-purple-600">
                      {formatTimeUntil(tournament.startTime)}
                    </div>
                    <div className="text-sm text-gray-500">until start</div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-gray-800 mb-2">🏆 Rewards</h5>
                  <div className="flex justify-around text-sm">
                    <div className="text-center">
                      <div className="text-yellow-600 font-bold">🥇 1st</div>
                      <div className="text-gray-600">🪙 {tournament.rewards.first}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 font-bold">🥈 2nd</div>
                      <div className="text-gray-600">🪙 {tournament.rewards.second}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-600 font-bold">🥉 3rd</div>
                      <div className="text-gray-600">🪙 {tournament.rewards.third}</div>
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinTournament(tournament)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  🎮 Join Tournament
                </button>
              </div>
            ))}
          </div>

          {tournaments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🏆</div>
              <p>No tournaments available at the moment</p>
              <p className="text-sm">Check back later for new tournaments!</p>
            </div>
          )}
        </div>

        {/* Tournament Rules */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-bold mb-3">📋 Tournament Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🎯 How it Works</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Join a tournament before it starts</li>
                <li>• Play through all rounds with the same players</li>
                <li>• Earn points based on votes received</li>
                <li>• Top 3 players win prize money</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💰 Prize Distribution</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 1st Place: 50% of prize pool</li>
                <li>• 2nd Place: 30% of prize pool</li>
                <li>• 3rd Place: 20% of prize pool</li>
                <li>• Entry fees contribute to prize pool</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournament; 