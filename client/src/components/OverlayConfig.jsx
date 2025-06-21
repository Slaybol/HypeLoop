import React, { useState } from "react";

export default function OverlayConfig({ onConfigChange }) {
  const [config, setConfig] = useState({
    showPlayerAvatars: true,
    showVoteCounts: true,
    showChaosAlerts: true,
    showSpeedTimer: true,
    overlayOpacity: 0.9,
    fontSize: "medium",
    theme: "default"
  });

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="overlay-config">
      <h3>🎨 Overlay Settings</h3>
      
      <div className="config-section">
        <h4>Display Options</h4>
        
        <div className="config-item">
          <label>
            <input
              type="checkbox"
              checked={config.showPlayerAvatars}
              onChange={(e) => handleConfigChange('showPlayerAvatars', e.target.checked)}
            />
            Show Player Avatars
          </label>
        </div>
        
        <div className="config-item">
          <label>
            <input
              type="checkbox"
              checked={config.showVoteCounts}
              onChange={(e) => handleConfigChange('showVoteCounts', e.target.checked)}
            />
            Show Vote Counts
          </label>
        </div>
        
        <div className="config-item">
          <label>
            <input
              type="checkbox"
              checked={config.showChaosAlerts}
              onChange={(e) => handleConfigChange('showChaosAlerts', e.target.checked)}
            />
            Show Chaos Mode Alerts
          </label>
        </div>
        
        <div className="config-item">
          <label>
            <input
              type="checkbox"
              checked={config.showSpeedTimer}
              onChange={(e) => handleConfigChange('showSpeedTimer', e.target.checked)}
            />
            Show Speed Round Timer
          </label>
        </div>
      </div>
      
      <div className="config-section">
        <h4>Appearance</h4>
        
        <div className="config-item">
          <label>Overlay Opacity:</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={config.overlayOpacity}
            onChange={(e) => handleConfigChange('overlayOpacity', parseFloat(e.target.value))}
          />
          <span>{Math.round(config.overlayOpacity * 100)}%</span>
        </div>
        
        <div className="config-item">
          <label>Font Size:</label>
          <select
            value={config.fontSize}
            onChange={(e) => handleConfigChange('fontSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        <div className="config-item">
          <label>Theme:</label>
          <select
            value={config.theme}
            onChange={(e) => handleConfigChange('theme', e.target.value)}
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="neon">Neon</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>
      
      <div className="config-section">
        <h4>Quick Actions</h4>
        
        <div className="quick-actions">
          <button
            onClick={() => {
              const newConfig = {
                showPlayerAvatars: true,
                showVoteCounts: true,
                showChaosAlerts: true,
                showSpeedTimer: true,
                overlayOpacity: 0.9,
                fontSize: "medium",
                theme: "default"
              };
              setConfig(newConfig);
              onConfigChange(newConfig);
            }}
            className="reset-btn"
          >
            Reset to Default
          </button>
          
          <button
            onClick={() => {
              const newConfig = {
                ...config,
                overlayOpacity: 0.7,
                fontSize: "small",
                theme: "minimal"
              };
              setConfig(newConfig);
              onConfigChange(newConfig);
            }}
            className="minimal-btn"
          >
            Minimal Mode
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .overlay-config {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .overlay-config h3 {
          margin: 0 0 20px 0;
          color: #a78bfa;
          font-size: 1.3rem;
        }
        
        .config-section {
          margin-bottom: 25px;
        }
        
        .config-section h4 {
          margin: 0 0 15px 0;
          color: #e5e7eb;
          font-size: 1.1rem;
        }
        
        .config-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          gap: 10px;
        }
        
        .config-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.95rem;
        }
        
        .config-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #8b5cf6;
        }
        
        .config-item input[type="range"] {
          flex: 1;
          accent-color: #8b5cf6;
        }
        
        .config-item select {
          padding: 6px 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.9rem;
        }
        
        .config-item select option {
          background: #1f2937;
          color: white;
        }
        
        .quick-actions {
          display: flex;
          gap: 10px;
        }
        
        .reset-btn,
        .minimal-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reset-btn {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
        }
        
        .minimal-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .reset-btn:hover,
        .minimal-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
} 