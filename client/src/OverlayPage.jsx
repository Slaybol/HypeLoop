import React, { useState, useEffect } from "react";
import StreamOverlay from "./components/StreamOverlay";
import "./components/StreamOverlay.css";

export default function OverlayPage() {
  const [roomCode, setRoomCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");

  useEffect(() => {
    // Check if room code is in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    if (room) {
      setRoomCode(room);
      connectToRoom(room);
    }
  }, []);

  const connectToRoom = (room) => {
    if (!room) return;
    
    setConnectionStatus("Connecting...");
    
    // Simulate connection to room (in real implementation, this would connect to the game)
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus("Connected to room: " + room);
    }, 1000);
  };

  const handleConnect = () => {
    connectToRoom(roomCode);
  };

  if (!isConnected) {
    return (
      <div className="overlay-setup">
        <div className="setup-content">
          <h1>🎥 HypeLoop Stream Overlay</h1>
          <p>Enter a room code to connect to the game:</p>
          
          <div className="input-group">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code..."
              className="room-input"
            />
            <button onClick={handleConnect} className="connect-btn">
              Connect
            </button>
          </div>
          
          {connectionStatus && (
            <p className="status">{connectionStatus}</p>
          )}
          
          <div className="instructions">
            <h3>How to use in OBS/Streamlabs:</h3>
            <ol>
              <li>Enter a room code and click Connect</li>
              <li>Add a "Browser Source" in OBS</li>
              <li>Set the URL to this page with ?room=YOUR_ROOM_CODE</li>
              <li>Set width to 1920 and height to 1080</li>
              <li>Check "Shutdown source when not visible"</li>
            </ol>
          </div>
        </div>
        
        <style jsx>{`
          .overlay-setup {
            min-height: 100vh;
            background: linear-gradient(135deg, #1f2937, #374151);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            color: white;
          }
          
          .setup-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            border: 2px solid rgba(255, 255, 255, 0.2);
          }
          
          .setup-content h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .input-group {
            display: flex;
            gap: 10px;
            margin: 20px 0;
          }
          
          .room-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
          }
          
          .room-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          .connect-btn {
            padding: 12px 24px;
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .connect-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          }
          
          .status {
            margin: 20px 0;
            padding: 10px;
            background: rgba(16, 185, 129, 0.2);
            border-radius: 8px;
            border: 1px solid rgba(16, 185, 129, 0.4);
          }
          
          .instructions {
            text-align: left;
            margin-top: 30px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
          }
          
          .instructions h3 {
            margin-bottom: 15px;
            color: #a78bfa;
          }
          
          .instructions ol {
            padding-left: 20px;
          }
          
          .instructions li {
            margin-bottom: 8px;
            line-height: 1.4;
          }
        `}</style>
      </div>
    );
  }

  return <StreamOverlay />;
} 