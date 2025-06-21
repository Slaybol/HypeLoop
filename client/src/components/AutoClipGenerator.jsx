import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCard, AnimatedButton, LoadingSpinner } from './AnimationManager';

const AutoClipGenerator = ({ 
  enabled, 
  gameState, 
  players, 
  currentPrompt, 
  chaosMode, 
  roundWinner,
  onToggle 
}) => {
  const [clips, setClips] = useState([]);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [clipSettings, setClipSettings] = useState({
    duration: 30,
    quality: 'high',
    includeAudio: true,
    includeChat: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [clipTriggers, setClipTriggers] = useState({
    chaosMode: true,
    winner: true,
    funnyAnswers: true,
    highVotes: true,
    gameStart: false
  });

  const clipContainerRef = useRef(null);

  // Auto-generate clips based on game events
  useEffect(() => {
    if (!enabled || !autoGenerate) return;

    const generateClip = (trigger, title, description) => {
      const clip = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        title,
        description,
        trigger,
        duration: clipSettings.duration,
        quality: clipSettings.quality,
        players: players.length,
        chaosMode,
        gameState,
        round: currentPrompt?.round || 1,
        status: 'generating'
      };

      setIsGenerating(true);
      
      // Simulate clip generation
      setTimeout(() => {
        clip.status = 'completed';
        clip.url = `https://clips.twitch.tv/${Math.random().toString(36).substr(2, 9)}`;
        setClips(prev => [clip, ...prev.slice(0, 9)]);
        setIsGenerating(false);
      }, 2000);
    };

    // Trigger clips based on game events
    if (chaosMode && clipTriggers.chaosMode) {
      generateClip(
        'chaos',
        `🔥 Chaos Mode Activated - Round ${currentPrompt?.round || 1}`,
        'Chaos mode was triggered, creating unexpected gameplay!'
      );
    }

    if (roundWinner && clipTriggers.winner) {
      generateClip(
        'winner',
        `🏆 ${roundWinner.name} Wins Round ${currentPrompt?.round || 1}`,
        `${roundWinner.name} won with ${roundWinner.score} points!`
      );
    }

  }, [chaosMode, roundWinner, enabled, autoGenerate, clipTriggers]);

  const generateManualClip = () => {
    const clip = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      title: `Manual Clip - ${gameState} - Round ${currentPrompt?.round || 1}`,
      description: 'Manually generated clip by streamer',
      trigger: 'manual',
      duration: clipSettings.duration,
      quality: clipSettings.quality,
      players: players.length,
      chaosMode,
      gameState,
      round: currentPrompt?.round || 1,
      status: 'generating'
    };

    setIsGenerating(true);
    
    setTimeout(() => {
      clip.status = 'completed';
      clip.url = `https://clips.twitch.tv/${Math.random().toString(36).substr(2, 9)}`;
      setClips(prev => [clip, ...prev.slice(0, 9)]);
      setIsGenerating(false);
    }, 2000);
  };

  const deleteClip = (clipId) => {
    setClips(prev => prev.filter(clip => clip.id !== clipId));
  };

  const shareClip = (clip) => {
    if (clip.url) {
      navigator.clipboard.writeText(clip.url);
      // Show success message
    }
  };

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'chaos': return '🔥';
      case 'winner': return '🏆';
      case 'funny': return '😂';
      case 'highVotes': return '📊';
      case 'manual': return '✋';
      default: return '🎬';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generating': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const renderClipSettings = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-white mb-3">Clip Settings</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Duration (seconds)
          </label>
          <input
            type="range"
            min="15"
            max="60"
            value={clipSettings.duration}
            onChange={(e) => setClipSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            className="w-full"
          />
          <span className="text-gray-300 text-sm">{clipSettings.duration}s</span>
        </div>
        
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Quality
          </label>
          <select
            value={clipSettings.quality}
            onChange={(e) => setClipSettings(prev => ({ ...prev, quality: e.target.value }))}
            className="input-field w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={clipSettings.includeAudio}
            onChange={(e) => setClipSettings(prev => ({ ...prev, includeAudio: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-white text-sm">Include Audio</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={clipSettings.includeChat}
            onChange={(e) => setClipSettings(prev => ({ ...prev, includeChat: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-white text-sm">Include Chat Overlay</span>
        </label>
      </div>
    </div>
  );

  const renderTriggerSettings = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-white mb-3">Auto-Trigger Settings</h4>
      
      <div className="space-y-2">
        {Object.entries(clipTriggers).map(([trigger, enabled]) => (
          <label key={trigger} className="flex items-center justify-between">
            <span className="text-white text-sm capitalize">
              {getTriggerIcon(trigger)} {trigger.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setClipTriggers(prev => ({ ...prev, [trigger]: e.target.checked }))}
              className="ml-2"
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderClips = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-white">Recent Clips</h4>
        <AnimatedButton
          onClick={generateManualClip}
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          {isGenerating ? <LoadingSpinner size={16} /> : 'Generate Clip'}
        </AnimatedButton>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {clips.map(clip => (
          <div key={clip.id} className="bg-white/10 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTriggerIcon(clip.trigger)}</span>
                <div>
                  <h5 className="font-semibold text-white text-sm">{clip.title}</h5>
                  <p className="text-gray-300 text-xs">{clip.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${getStatusColor(clip.status)}`}>
                  {clip.status === 'generating' ? '⏳' : clip.status === 'completed' ? '✅' : '❌'}
                </span>
                <button
                  onClick={() => deleteClip(clip.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{clip.timestamp} • {clip.duration}s • {clip.players} players</span>
              {clip.status === 'completed' && (
                <button
                  onClick={() => shareClip(clip)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Share
                </button>
              )}
            </div>
            
            {clip.status === 'completed' && clip.url && (
              <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                {clip.url}
              </div>
            )}
          </div>
        ))}
        
        {clips.length === 0 && (
          <p className="text-gray-400 text-center text-sm py-4">No clips generated yet</p>
        )}
      </div>
    </div>
  );

  if (!enabled) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <AnimatedButton
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          🎬 Enable Clips
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-96">
      <AnimatedCard className="bg-gray-900 border border-blue-500/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">🎬 Auto-Clip Generator</h3>
          <AnimatedButton
            onClick={onToggle}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
          >
            ✕
          </AnimatedButton>
        </div>

        <div className="space-y-4">
          {/* Settings */}
          {renderClipSettings()}
          
          {/* Trigger Settings */}
          {renderTriggerSettings()}
          
          {/* Clips */}
          {renderClips()}
          
          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400">● Auto-Clips Active</span>
            <span className="text-gray-400">
              {clips.length} clips • {clipSettings.quality} quality
            </span>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AutoClipGenerator; 