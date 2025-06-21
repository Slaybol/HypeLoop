import React, { useState, useEffect } from "react";
import audioManager from "./AudioManager";

export default function AudioSettings({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    sfxVolume: 0.7,
    musicVolume: 0.4,
    voiceVolume: 0.8,
    isMuted: false
  });

  useEffect(() => {
    // Load current settings from audio manager
    setSettings({
      sfxVolume: audioManager.volume.sfx,
      musicVolume: audioManager.volume.music,
      voiceVolume: audioManager.volume.voice,
      isMuted: audioManager.isMuted
    });
  }, []);

  const handleVolumeChange = (type, value) => {
    const newSettings = { ...settings, [type]: value };
    setSettings(newSettings);
    
    // Update audio manager
    audioManager.setVolume(type.replace('Volume', ''), value);
    
    // Play test sound for SFX
    if (type === 'sfxVolume') {
      audioManager.playSound('buttonClick');
    }
  };

  const handleMuteToggle = () => {
    const newMuted = !settings.isMuted;
    setSettings({ ...settings, isMuted: newMuted });
    audioManager.toggleMute();
  };

  const handleTestSound = (soundType) => {
    switch (soundType) {
      case 'sfx':
        audioManager.playSound('buttonClick');
        break;
      case 'music':
        audioManager.playMusic('gameplay', false);
        setTimeout(() => audioManager.stopMusic(), 3000);
        break;
      case 'voice':
        // Test voice with a sample announcement
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance("Audio test successful!");
          utterance.volume = settings.voiceVolume;
          speechSynthesis.speak(utterance);
        }
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="audio-settings-overlay">
      <div className="audio-settings-modal">
        <div className="settings-header">
          <h2>🎵 Audio Settings</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="settings-content">
          {/* Master Mute */}
          <div className="setting-group">
            <div className="setting-header">
              <h3>Master Audio</h3>
              <button 
                onClick={handleMuteToggle}
                className={`mute-btn ${settings.isMuted ? 'muted' : ''}`}
              >
                {settings.isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="setting-group">
            <div className="setting-header">
              <h3>Sound Effects</h3>
              <button 
                onClick={() => handleTestSound('sfx')}
                className="test-btn"
              >
                ▶️ Test
              </button>
            </div>
            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sfxVolume}
                onChange={(e) => handleVolumeChange('sfxVolume', parseFloat(e.target.value))}
                disabled={settings.isMuted}
                className="volume-slider"
              />
              <span className="volume-value">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
          </div>

          {/* Background Music */}
          <div className="setting-group">
            <div className="setting-header">
              <h3>Background Music</h3>
              <button 
                onClick={() => handleTestSound('music')}
                className="test-btn"
              >
                ▶️ Test
              </button>
            </div>
            <div className="volume-control">
              <span className="volume-icon">🎵</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={(e) => handleVolumeChange('musicVolume', parseFloat(e.target.value))}
                disabled={settings.isMuted}
                className="volume-slider"
              />
              <span className="volume-value">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
          </div>

          {/* Voice */}
          <div className="setting-group">
            <div className="setting-header">
              <h3>Voice Announcements</h3>
              <button 
                onClick={() => handleTestSound('voice')}
                className="test-btn"
              >
                ▶️ Test
              </button>
            </div>
            <div className="volume-control">
              <span className="volume-icon">🎤</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.voiceVolume}
                onChange={(e) => handleVolumeChange('voiceVolume', parseFloat(e.target.value))}
                disabled={settings.isMuted}
                className="volume-slider"
              />
              <span className="volume-value">{Math.round(settings.voiceVolume * 100)}%</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="setting-group">
            <h3>Quick Presets</h3>
            <div className="preset-buttons">
              <button
                onClick={() => {
                  const newSettings = {
                    sfxVolume: 0.8,
                    musicVolume: 0.3,
                    voiceVolume: 0.9,
                    isMuted: false
                  };
                  setSettings(newSettings);
                  audioManager.setVolume('sfx', 0.8);
                  audioManager.setVolume('music', 0.3);
                  audioManager.setVolume('voice', 0.9);
                }}
                className="preset-btn"
              >
                🎮 Gaming
              </button>
              <button
                onClick={() => {
                  const newSettings = {
                    sfxVolume: 0.5,
                    musicVolume: 0.6,
                    voiceVolume: 0.7,
                    isMuted: false
                  };
                  setSettings(newSettings);
                  audioManager.setVolume('sfx', 0.5);
                  audioManager.setVolume('music', 0.6);
                  audioManager.setVolume('voice', 0.7);
                }}
                className="preset-btn"
              >
                🎵 Music Focus
              </button>
              <button
                onClick={() => {
                  const newSettings = {
                    sfxVolume: 0.9,
                    musicVolume: 0.1,
                    voiceVolume: 1.0,
                    isMuted: false
                  };
                  setSettings(newSettings);
                  audioManager.setVolume('sfx', 0.9);
                  audioManager.setVolume('music', 0.1);
                  audioManager.setVolume('voice', 1.0);
                }}
                className="preset-btn"
              >
                🎤 Voice Focus
              </button>
            </div>
          </div>

          {/* Debug Section */}
          <div className="setting-group">
            <h3>🔧 Debug & Test</h3>
            <div className="debug-buttons">
              <button
                onClick={() => {
                  const status = audioManager.getStatus();
                  console.log('🎵 Audio Status:', status);
                  alert(`Audio Status:\n` +
                    `Initialized: ${status.isInitialized}\n` +
                    `Muted: ${status.isMuted}\n` +
                    `Current Music: ${status.currentMusic}\n` +
                    `Audio Context: ${status.audioContextState}\n` +
                    `Sounds Loaded: ${status.soundsLoaded}\n` +
                    `Music Loaded: ${status.musicLoaded}\n` +
                    `Volumes: ${JSON.stringify(status.volumes)}`
                  );
                }}
                className="debug-btn"
              >
                📊 Show Status
              </button>
              <button
                onClick={() => {
                  audioManager.playSound('buttonClick');
                }}
                className="debug-btn"
              >
                🔊 Test SFX
              </button>
              <button
                onClick={() => {
                  audioManager.playMusic('lobby', false);
                  setTimeout(() => audioManager.stopMusic(), 3000);
                }}
                className="debug-btn"
              >
                🎵 Test Music
              </button>
              <button
                onClick={() => {
                  audioManager.playMusic('lobby');
                }}
                className="debug-btn"
              >
                🎵 Start Lobby Music
              </button>
              <button
                onClick={() => {
                  audioManager.stopMusic();
                }}
                className="debug-btn"
              >
                🛑 Stop Music
              </button>
              <button
                onClick={() => {
                  audioManager.generateBeep(440, 500);
                }}
                className="debug-btn"
              >
                🎼 Test Beep
              </button>
              <button
                onClick={() => {
                  audioManager.generateBackgroundMusic('lobby', 10000);
                }}
                className="debug-btn"
              >
                🎼 Test Generated Music
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="save-btn">
            Save & Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .audio-settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .audio-settings-modal {
          background: linear-gradient(135deg, #1f2937, #374151);
          border-radius: 20px;
          padding: 0;
          width: 90%;
          max-width: 500px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .settings-header h2 {
          margin: 0;
          color: white;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .settings-content {
          padding: 25px;
        }

        .setting-group {
          margin-bottom: 25px;
        }

        .setting-group h3 {
          margin: 0 0 15px 0;
          color: #a78bfa;
          font-size: 1.1rem;
        }

        .setting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .mute-btn {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mute-btn.muted {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
        }

        .test-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 6px 12px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .test-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .volume-icon {
          font-size: 1.2rem;
          width: 30px;
          text-align: center;
        }

        .volume-slider {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          accent-color: #8b5cf6;
        }

        .volume-slider:disabled {
          opacity: 0.5;
        }

        .volume-value {
          color: white;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        .preset-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          padding: 12px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .preset-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .settings-footer {
          padding: 20px 25px;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          text-align: right;
        }

        .save-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .debug-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .debug-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 6px 12px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .debug-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .audio-settings-modal {
            width: 95%;
            margin: 20px;
          }
          
          .preset-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 