import React, { useState } from "react";
import mobileOptimizer from "./MobileOptimizer";

export default function MobileNav({ 
  gameState, 
  onAudioSettings, 
  onVoiceToggle, 
  voiceEnabled, 
  voiceSupported,
  players = [],
  currentPrompt = null,
  chaosMode = null
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!mobileOptimizer.isMobile) return null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getGameStateIcon = () => {
    switch (gameState) {
      case 'waiting': return '⏳';
      case 'answering': return '✍️';
      case 'voting': return '🗳️';
      case 'results': return '🏆';
      default: return '🎮';
    }
  };

  const getGameStateText = () => {
    switch (gameState) {
      case 'waiting': return 'Waiting';
      case 'answering': return 'Answering';
      case 'voting': return 'Voting';
      case 'results': return 'Results';
      default: return 'Game';
    }
  };

  return (
    <div className="mobile-nav">
      {/* Main Navigation Bar */}
      <div className="mobile-nav-main">
        <div className="mobile-nav-left">
          <div className="mobile-game-status">
            <span className="mobile-status-icon">{getGameStateIcon()}</span>
            <span className="mobile-status-text">{getGameStateText()}</span>
          </div>
          
          {players.length > 0 && (
            <div className="mobile-player-count">
              <span className="mobile-player-icon">👥</span>
              <span className="mobile-player-number">{players.length}</span>
            </div>
          )}
        </div>

        <div className="mobile-nav-center">
          {chaosMode && (
            <div className="mobile-chaos-indicator">
              <span className="mobile-chaos-icon">🌀</span>
              <span className="mobile-chaos-text">{chaosMode.name}</span>
            </div>
          )}
        </div>

        <div className="mobile-nav-right">
          <button
            onClick={toggleExpanded}
            className="mobile-nav-toggle"
            aria-label="Toggle mobile menu"
          >
            {isExpanded ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mobile-nav-expanded">
          <div className="mobile-nav-section">
            <h4>🎵 Audio</h4>
            <div className="mobile-button-group">
              <button
                onClick={onAudioSettings}
                className="mobile-nav-btn"
              >
                Audio Settings
              </button>
              
              {voiceSupported && (
                <button
                  onClick={onVoiceToggle}
                  className={`mobile-nav-btn ${voiceEnabled ? 'mobile-nav-btn-active' : ''}`}
                >
                  {voiceEnabled ? '🎤 Voice On' : '🎤 Voice Off'}
                </button>
              )}
            </div>
          </div>

          {currentPrompt && (
            <div className="mobile-nav-section">
              <h4>📝 Current Prompt</h4>
              <div className="mobile-prompt-preview">
                <p>{currentPrompt.text}</p>
              </div>
            </div>
          )}

          <div className="mobile-nav-section">
            <h4>📱 Device Info</h4>
            <div className="mobile-device-info">
              <p>Screen: {mobileOptimizer.screenSize}</p>
              <p>Orientation: {mobileOptimizer.orientation}</p>
              <p>Touch: {mobileOptimizer.touchSupported ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .mobile-nav-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          min-height: 60px;
        }

        .mobile-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-game-status {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
        }

        .mobile-status-icon {
          font-size: 1.2rem;
        }

        .mobile-status-text {
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .mobile-player-count {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(139, 92, 246, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
        }

        .mobile-player-icon {
          font-size: 0.9rem;
        }

        .mobile-player-number {
          color: #a78bfa;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .mobile-nav-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .mobile-chaos-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #dc2626, #7c3aed);
          padding: 6px 12px;
          border-radius: 20px;
          animation: pulse 2s ease-in-out infinite;
        }

        .mobile-chaos-icon {
          font-size: 1rem;
          animation: spin 2s linear infinite;
        }

        .mobile-chaos-text {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .mobile-nav-right {
          display: flex;
          align-items: center;
        }

        .mobile-nav-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          width: 44px;
          height: 44px;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-nav-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .mobile-nav-expanded {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
        }

        .mobile-nav-section {
          margin-bottom: 20px;
        }

        .mobile-nav-section h4 {
          color: #a78bfa;
          font-size: 1rem;
          margin: 0 0 12px 0;
          font-weight: 600;
        }

        .mobile-button-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-nav-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .mobile-nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .mobile-nav-btn-active {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .mobile-prompt-preview {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
        }

        .mobile-prompt-preview p {
          color: white;
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0;
          font-style: italic;
        }

        .mobile-device-info {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
        }

        .mobile-device-info p {
          color: #d1d5db;
          font-size: 0.8rem;
          margin: 4px 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Landscape optimizations */
        @media (orientation: landscape) {
          .mobile-nav {
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 80px;
          }

          .mobile-nav-expanded {
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
} 