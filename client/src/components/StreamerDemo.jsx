import React, { useState } from 'react';
import { AnimatedCard, AnimatedButton, LoadingSpinner } from './AnimationManager';
import StreamerDashboard from './StreamerDashboard';
import ChatIntegration from './ChatIntegration';
import AutoClipGenerator from './AutoClipGenerator';

const StreamerDemo = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [demoGameState, setDemoGameState] = useState('waiting');
  const [demoPlayers, setDemoPlayers] = useState([
    { id: 1, name: 'Streamer', score: 15, isHost: true, isActive: true },
    { id: 2, name: 'ChatUser123', score: 8, isChatUser: true, isActive: true },
    { id: 3, name: 'GamerGirl', score: 12, isActive: true },
    { id: 4, name: 'ChaosLover', score: 5, isActive: true }
  ]);
  const [demoChaosMode, setDemoChaosMode] = useState(false);
  const [demoRoundWinner, setDemoRoundWinner] = useState(null);

  const demoPrompt = {
    text: "If _______ was a sport, the rules would be",
    round: 3
  };

  const handleChatCommand = (command, data) => {
    console.log('Demo chat command:', command, data);
  };

  const simulateGameEvent = (event) => {
    switch (event) {
      case 'chaos':
        setDemoChaosMode(true);
        setTimeout(() => setDemoChaosMode(false), 3000);
        break;
      case 'winner':
        setDemoRoundWinner({ name: 'ChatUser123', score: 8 });
        setTimeout(() => setDemoRoundWinner(null), 3000);
        break;
      case 'gameStart':
        setDemoGameState('answering');
        setTimeout(() => setDemoGameState('voting'), 5000);
        setTimeout(() => setDemoGameState('results'), 8000);
        break;
      default:
        break;
    }
  };

  const renderFeatureCard = (title, description, icon, onClick, color = 'purple') => (
    <AnimatedCard className="cursor-pointer hover:scale-105 transition-transform">
      <div className="text-center p-6">
        <div className={`text-4xl mb-4 ${color === 'purple' ? 'text-purple-500' : color === 'blue' ? 'text-blue-500' : 'text-green-500'}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <AnimatedButton onClick={onClick} className="w-full">
          Try It
        </AnimatedButton>
      </div>
    </AnimatedCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🎮 HypeLoop Streamer Tools</h1>
          <p className="text-xl text-purple-300 mb-8">
            Professional streamer tools for maximum engagement and content creation
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <AnimatedButton
              onClick={() => simulateGameEvent('gameStart')}
              className="bg-green-600 hover:bg-green-700"
            >
              🎮 Start Demo Game
            </AnimatedButton>
            <AnimatedButton
              onClick={() => simulateGameEvent('chaos')}
              className="bg-red-600 hover:bg-red-700"
            >
              🔥 Trigger Chaos
            </AnimatedButton>
            <AnimatedButton
              onClick={() => simulateGameEvent('winner')}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              🏆 Simulate Winner
            </AnimatedButton>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {renderFeatureCard(
            "📊 Streamer Dashboard",
            "Real-time analytics, player tracking, and game controls all in one place",
            "📊",
            () => setActiveTool('dashboard'),
            'purple'
          )}
          
          {renderFeatureCard(
            "💬 Chat Integration",
            "Let your Twitch chat participate with commands like !join, !vote, !chaos",
            "💬",
            () => setActiveTool('chat'),
            'blue'
          )}
          
          {renderFeatureCard(
            "🎬 Auto-Clip Generation",
            "Automatically save funny moments and game highlights",
            "🎬",
            () => setActiveTool('clips'),
            'green'
          )}
          
          {renderFeatureCard(
            "🎨 Custom Branding",
            "Add your logo and customize colors to match your brand",
            "🎨",
            () => setActiveTool('branding'),
            'purple'
          )}
          
          {renderFeatureCard(
            "⚡ Quick Actions",
            "Trigger chaos, pause game, and control the flow instantly",
            "⚡",
            () => setActiveTool('actions'),
            'blue'
          )}
          
          {renderFeatureCard(
            "📱 Mobile Optimized",
            "Perfect experience on phones, tablets, and all devices",
            "📱",
            () => alert('Mobile optimization is built-in!'),
            'green'
          )}
        </div>

        {/* Demo Stats */}
        <AnimatedCard className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Live Demo Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{demoPlayers.length}</div>
              <div className="text-gray-300">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{demoGameState}</div>
              <div className="text-gray-300">Game State</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{demoChaosMode ? '🔥' : '😐'}</div>
              <div className="text-gray-300">Chaos Mode</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{demoRoundWinner ? '🏆' : '⏳'}</div>
              <div className="text-gray-300">Round Winner</div>
            </div>
          </div>
        </AnimatedCard>

        {/* Current Players */}
        <AnimatedCard className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Current Players</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demoPlayers.map(player => (
              <div key={player.id} className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-white">{player.name}</div>
                <div className="text-purple-300">{player.score} points</div>
                {player.isHost && <div className="text-blue-400 text-sm">Host</div>}
                {player.isChatUser && <div className="text-green-400 text-sm">Chat User</div>}
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Current Prompt */}
        {demoGameState === 'answering' && (
          <AnimatedCard className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Current Prompt</h2>
            <div className="text-center">
              <p className="text-xl text-white">{demoPrompt.text}</p>
              <p className="text-gray-300 mt-2">Round {demoPrompt.round}</p>
            </div>
          </AnimatedCard>
        )}

        {/* Chaos Mode Alert */}
        {demoChaosMode && (
          <AnimatedCard className="mb-8 bg-red-500/20 border border-red-500/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-2">🔥 CHAOS MODE ACTIVATED! 🔥</h3>
              <p className="text-red-300">Random rule changes are in effect!</p>
            </div>
          </AnimatedCard>
        )}

        {/* Winner Announcement */}
        {demoRoundWinner && (
          <AnimatedCard className="mb-8 bg-yellow-500/20 border border-yellow-500/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">🏆 ROUND WINNER! 🏆</h3>
              <p className="text-yellow-300">{demoRoundWinner.name} wins with {demoRoundWinner.score} points!</p>
            </div>
          </AnimatedCard>
        )}

        {/* Streamer Tools */}
        {activeTool === 'dashboard' && (
          <StreamerDashboard
            gameState={demoGameState}
            players={demoPlayers}
            currentPrompt={demoPrompt}
            chaosMode={demoChaosMode}
            onChatCommand={handleChatCommand}
          />
        )}

        {activeTool === 'chat' && (
          <ChatIntegration
            enabled={true}
            onChatCommand={handleChatCommand}
            gameState={demoGameState}
            players={demoPlayers}
            currentPrompt={demoPrompt}
            chaosMode={demoChaosMode}
            onToggle={() => setActiveTool(null)}
          />
        )}

        {activeTool === 'clips' && (
          <AutoClipGenerator
            enabled={true}
            gameState={demoGameState}
            players={demoPlayers}
            currentPrompt={demoPrompt}
            chaosMode={demoChaosMode}
            roundWinner={demoRoundWinner}
            onToggle={() => setActiveTool(null)}
          />
        )}

        {/* Close Tool Button */}
        {activeTool && (
          <div className="fixed top-4 right-4 z-50">
            <AnimatedButton
              onClick={() => setActiveTool(null)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              ✕ Close Tool
            </AnimatedButton>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Stream?</h3>
          <p className="text-purple-300 mb-6">
            HypeLoop provides everything you need to create engaging, interactive content
          </p>
          <div className="flex justify-center space-x-4">
            <AnimatedButton className="bg-purple-600 hover:bg-purple-700">
              🚀 Get Started
            </AnimatedButton>
            <AnimatedButton className="bg-blue-600 hover:bg-blue-700">
              📖 Read Guide
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamerDemo; 