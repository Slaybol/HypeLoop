import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCard, AnimatedButton } from './AnimationManager';

const ChatIntegration = ({ 
  enabled, 
  onChatCommand, 
  gameState, 
  players, 
  currentPrompt, 
  chaosMode,
  onToggle 
}) => {
  const [chatLog, setChatLog] = useState([]);
  const [chatCommands, setChatCommands] = useState(true);
  const [chatParticipation, setChatParticipation] = useState(0);
  const [recentCommands, setRecentCommands] = useState([]);
  
  const chatContainerRef = useRef(null);

  // Simulate chat messages for demo
  useEffect(() => {
    if (!enabled) return;

    const demoMessages = [
      { username: 'TwitchUser123', message: '!join', type: 'command' },
      { username: 'GamerGirl', message: 'This game looks fun!', type: 'chat' },
      { username: 'ChaosLover', message: '!chaos', type: 'command' },
      { username: 'VoteMaster', message: '!vote Player1', type: 'command' },
      { username: 'StreamFan', message: 'Great answers everyone!', type: 'chat' },
      { username: 'StatsGuy', message: '!stats', type: 'command' },
      { username: 'NewPlayer', message: '!join', type: 'command' },
      { username: 'ChatMod', message: 'Remember to be respectful!', type: 'chat' }
    ];

    const interval = setInterval(() => {
      const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      const timestamp = new Date().toLocaleTimeString();
      
      setChatLog(prev => [...prev.slice(-19), { ...randomMessage, timestamp }]);
      
      if (randomMessage.type === 'command') {
        handleChatCommand(randomMessage.message, randomMessage.username);
        setRecentCommands(prev => [...prev.slice(-4), { command: randomMessage.message, username: randomMessage.username, timestamp }]);
        setChatParticipation(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [enabled]);

  const handleChatCommand = (command, username) => {
    if (!chatCommands) return;

    const cleanCommand = command.toLowerCase().trim();
    
    switch (cleanCommand) {
      case '!join':
        onChatCommand('join', { username });
        break;
      case '!vote':
        // Extract player name from vote command
        const voteMatch = command.match(/!vote\s+(.+)/i);
        if (voteMatch) {
          const playerName = voteMatch[1];
          onChatCommand('vote', { username, playerName });
        }
        break;
      case '!chaos':
        onChatCommand('chaos', { username });
        break;
      case '!stats':
        onChatCommand('stats', { username });
        break;
      case '!help':
        onChatCommand('help', { username });
        break;
      default:
        break;
    }
  };

  const getCommandDescription = (command) => {
    switch (command.toLowerCase()) {
      case '!join': return 'Join the game';
      case '!vote': return 'Vote for a player';
      case '!chaos': return 'Trigger chaos mode';
      case '!stats': return 'Show game statistics';
      case '!help': return 'Show available commands';
      default: return 'Unknown command';
    }
  };

  const renderChatLog = () => (
    <div className="bg-white/10 rounded-lg p-4 max-h-60 overflow-y-auto">
      <h4 className="font-semibold text-white mb-3">Live Chat Feed</h4>
      <div className="space-y-2 text-sm">
        {chatLog.map((log, index) => (
          <div key={index} className="flex items-start space-x-2">
            <span className="text-gray-400 text-xs min-w-[50px]">{log.timestamp}</span>
            <div className="flex-1">
              <span className={`font-medium ${log.type === 'command' ? 'text-purple-400' : 'text-blue-400'}`}>
                {log.username}:
              </span>
              <span className={`ml-1 ${log.type === 'command' ? 'text-yellow-300' : 'text-gray-300'}`}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommands = () => (
    <div className="bg-white/10 rounded-lg p-4">
      <h4 className="font-semibold text-white mb-3">Available Commands</h4>
      <div className="space-y-2 text-sm">
        {[
          { command: '!join', description: 'Join the game as a chat participant' },
          { command: '!vote [player]', description: 'Vote for a specific player' },
          { command: '!chaos', description: 'Request chaos mode activation' },
          { command: '!stats', description: 'Display current game statistics' },
          { command: '!help', description: 'Show this help message' }
        ].map((cmd, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-yellow-300 font-mono">{cmd.command}</span>
            <span className="text-gray-300 text-xs">{cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecentCommands = () => (
    <div className="bg-white/10 rounded-lg p-4">
      <h4 className="font-semibold text-white mb-3">Recent Commands</h4>
      <div className="space-y-2 text-sm">
        {recentCommands.map((cmd, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <span className="text-purple-400">{cmd.username}</span>
              <span className="text-yellow-300 ml-2 font-mono">{cmd.command}</span>
            </div>
            <span className="text-gray-400 text-xs">{cmd.timestamp}</span>
          </div>
        ))}
        {recentCommands.length === 0 && (
          <p className="text-gray-400 text-xs">No commands yet</p>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/10 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{chatParticipation}</div>
        <div className="text-sm text-gray-300">Chat Commands</div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-white">{chatLog.length}</div>
        <div className="text-sm text-gray-300">Total Messages</div>
      </div>
    </div>
  );

  if (!enabled) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <AnimatedButton
          onClick={onToggle}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          💬 Enable Chat
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80">
      <AnimatedCard className="bg-gray-900 border border-purple-500/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">💬 Chat Integration</h3>
          <AnimatedButton
            onClick={onToggle}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
          >
            ✕
          </AnimatedButton>
        </div>

        <div className="space-y-4">
          {/* Stats */}
          {renderStats()}

          {/* Commands */}
          {renderCommands()}

          {/* Recent Commands */}
          {renderRecentCommands()}

          {/* Chat Log */}
          {renderChatLog()}

          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400">● Live</span>
            <span className="text-gray-400">
              {gameState} • {players.length} players
              {chaosMode && <span className="text-red-400 ml-2">🔥</span>}
            </span>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ChatIntegration; 