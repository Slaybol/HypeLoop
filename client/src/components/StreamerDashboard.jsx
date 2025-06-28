import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCard, AnimatedButton, LoadingSpinner } from './AnimationManager';

const StreamerDashboard = ({ gameState, players, currentPrompt, chaosMode, onChatCommand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [chatEnabled, setChatEnabled] = useState(false);
  const [autoClips, setAutoClips] = useState(true);
  const [chatCommands, setChatCommands] = useState(true);
  const [branding, setBranding] = useState({
    logo: '',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2'
  });
  const [analytics, setAnalytics] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    totalVotes: 0,
    chaosTriggers: 0,
    averageResponseTime: 0,
    topPerformer: null,
    chatParticipation: 0
  });
  const [recentClips, setRecentClips] = useState([]);
  const [chatLog, setChatLog] = useState([]);

  const dashboardRef = useRef(null);

  useEffect(() => {
    // Update analytics based on game state
    setAnalytics(prev => ({
      ...prev,
      totalPlayers: players.length,
      activePlayers: players.filter(p => p.isActive).length,
      totalVotes: Object.keys(prev.votes || {}).length,
      chaosTriggers: chaosMode ? prev.chaosTriggers + 1 : prev.chaosTriggers
    }));
  }, [players, chaosMode]);

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  const handleChatCommand = (command, username) => {
    if (!chatCommands) return;

    switch (command) {
      case '!join':
        onChatCommand('join', { username });
        break;
      case '!vote':
        onChatCommand('vote', { username });
        break;
      case '!chaos':
        onChatCommand('chaos', { username });
        break;
      case '!stats':
        onChatCommand('stats', { username });
        break;
      default:
        break;
    }
  };

  const generateClip = () => {
    const clip = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      title: `HypeLoop - ${gameState} - ${currentPrompt?.text || 'Game Moment'}`,
      duration: '30s',
      players: players.length,
      chaosMode: chaosMode
    };
    
    setRecentClips(prev => [clip, ...prev.slice(0, 4)]);
  };

  const renderAnalytics = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Real-Time Analytics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{analytics.totalPlayers}</div>
          <div className="text-sm text-gray-300">Total Players</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{analytics.activePlayers}</div>
          <div className="text-sm text-gray-300">Active Players</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{analytics.totalVotes}</div>
          <div className="text-sm text-gray-300">Total Votes</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{analytics.chaosTriggers}</div>
          <div className="text-sm text-gray-300">Chaos Triggers</div>
        </div>
      </div>

      {analytics.topPerformer && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-400 mb-2">🏆 Top Performer</h4>
          <p className="text-white">{analytics.topPerformer.name} - {analytics.topPerformer.score} points</p>
        </div>
      )}
    </div>
  );

  const renderChatIntegration = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Chat Integration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white">Enable Chat Participation</span>
          <AnimatedButton
            onClick={() => setChatEnabled(!chatEnabled)}
            className={`px-4 py-2 ${chatEnabled ? 'bg-green-500' : 'bg-gray-500'}`}
          >
            {chatEnabled ? 'Enabled' : 'Disabled'}
          </AnimatedButton>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white">Chat Commands</span>
          <AnimatedButton
            onClick={() => setChatCommands(!chatCommands)}
            className={`px-4 py-2 ${chatCommands ? 'bg-green-500' : 'bg-gray-500'}`}
          >
            {chatCommands ? 'Enabled' : 'Disabled'}
          </AnimatedButton>
        </div>

        {chatCommands && (
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Available Commands</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">!join</span>
                <span className="text-white">Join the game</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">!vote [player]</span>
                <span className="text-white">Vote for a player</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">!chaos</span>
                <span className="text-white">Trigger chaos mode</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">!stats</span>
                <span className="text-white">Show game stats</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
          <h4 className="font-semibold text-white mb-2">Recent Chat Activity</h4>
          <div className="space-y-1 text-sm">
            {chatLog.slice(-5).map((log, index) => (
              <div key={index} className="text-gray-300">
                <span className="text-purple-400">{log.username}:</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutoClips = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Auto-Clip Generation</h3>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-white">Auto-Generate Clips</span>
        <AnimatedButton
          onClick={() => setAutoClips(!autoClips)}
          className={`px-4 py-2 ${autoClips ? 'bg-green-500' : 'bg-gray-500'}`}
        >
          {autoClips ? 'Enabled' : 'Disabled'}
        </AnimatedButton>
      </div>

      <AnimatedButton
        onClick={generateClip}
        className="w-full bg-blue-500"
      >
        Generate Manual Clip
      </AnimatedButton>

      <div className="space-y-2">
        <h4 className="font-semibold text-white">Recent Clips</h4>
        {recentClips.map(clip => (
          <div key={clip.id} className="bg-white/10 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white text-sm">{clip.title}</h5>
                <p className="text-gray-300 text-xs">{clip.timestamp} • {clip.duration}</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                {clip.players} players
                {clip.chaosMode && <span className="text-red-400 ml-2">🔥</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBranding = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Custom Branding</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Streamer Logo URL
          </label>
          <input
            type="url"
            value={branding.logo}
            onChange={(e) => setBranding(prev => ({ ...prev, logo: e.target.value }))}
            placeholder="https://your-logo-url.com/logo.png"
            className="input-field w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Primary Color
            </label>
            <input
              type="color"
              value={branding.primaryColor}
              onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-full h-10 rounded border-0"
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Secondary Color
            </label>
            <input
              type="color"
              value={branding.secondaryColor}
              onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
              className="w-full h-10 rounded border-0"
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Preview</h4>
          <div 
            className="h-20 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`
            }}
          >
            {branding.logo ? (
              <img src={branding.logo} alt="Logo" className="h-12 w-auto" />
            ) : (
              <span className="text-white font-bold">Your Brand</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <AnimatedButton
          onClick={() => handleChatCommand('!chaos', { username: 'Streamer' })}
          className="bg-red-500 text-sm"
        >
          Trigger Chaos
        </AnimatedButton>
        
        <AnimatedButton
          onClick={generateClip}
          className="bg-blue-500 text-sm"
        >
          Save Clip
        </AnimatedButton>
        
        <AnimatedButton
          onClick={() => {/* Pause game */}}
          className="bg-yellow-500 text-sm"
        >
          Pause Game
        </AnimatedButton>
        
        <AnimatedButton
          onClick={() => {/* End game */}}
          className="bg-gray-500 text-sm"
        >
          End Game
        </AnimatedButton>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <AnimatedButton
          onClick={toggleDashboard}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          📊 Streamer Tools
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      <div 
        ref={dashboardRef}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Streamer Dashboard</h2>
          <AnimatedButton
            onClick={toggleDashboard}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            ✕
          </AnimatedButton>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'analytics', label: '📊 Analytics', icon: '📊' },
            { id: 'chat', label: '💬 Chat', icon: '💬' },
            { id: 'clips', label: '🎬 Clips', icon: '🎬' },
            { id: 'branding', label: '🎨 Branding', icon: '🎨' },
            { id: 'actions', label: '⚡ Actions', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'chat' && renderChatIntegration()}
          {activeTab === 'clips' && renderAutoClips()}
          {activeTab === 'branding' && renderBranding()}
          {activeTab === 'actions' && renderQuickActions()}
        </div>
      </div>
    </div>
  );
};

export default StreamerDashboard; 