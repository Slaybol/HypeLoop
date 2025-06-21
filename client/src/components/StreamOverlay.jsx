import React, { useState, useEffect } from "react";
import socket from "../socket";
import VoiceService from "./voice";

export default function StreamOverlay() {
  const [gameState, setGameState] = useState("waiting");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState({});
  const [roundWinner, setRoundWinner] = useState(null);
  const [round, setRound] = useState(0);
  const [players, setPlayers] = useState([]);
  const [chaosMode, setChaosMode] = useState(null);
  const [showChaosAlert, setShowChaosAlert] = useState(false);
  const [chaosAnnouncement, setChaosAnnouncement] = useState("");
  const [voteCounts, setVoteCounts] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSpeedRound, setIsSpeedRound] = useState(false);

  useEffect(() => {
    // Socket event listeners for overlay
    socket.on("game-started", ({ prompt, players, round, chaosMode }) => {
      setGameState("answering");
      setCurrentPrompt(prompt.text);
      setPlayers(players);
      setRound(round);
      setChaosMode(chaosMode);
    });

    socket.on("game-update", ({ players, currentPhase, chaosMode }) => {
      setPlayers(players);
      if (currentPhase) setGameState(currentPhase);
      if (chaosMode) setChaosMode(chaosMode);
    });

    socket.on("answers-update", (answersForVoting) => {
      setGameState("voting");
      setAnswers(answersForVoting);
    });

    socket.on("vote-submitted", ({ voterId, votedPlayerId }) => {
      setVotes(prev => ({ ...prev, [voterId]: votedPlayerId }));
      setVoteCounts(prev => ({
        ...prev,
        [votedPlayerId]: (prev[votedPlayerId] || 0) + 1
      }));
    });

    socket.on("round-results", ({ roundWinner, answers, votes, chaosMode }) => {
      setGameState("results");
      setRoundWinner(roundWinner);
      setAnswers(answers);
      setVotes(votes);
      setChaosMode(chaosMode);
    });

    socket.on("new-round", ({ prompt, players, round, chaosMode, chaosAnnouncement }) => {
      setGameState("answering");
      setCurrentPrompt(prompt.text);
      setPlayers(players);
      setRound(round);
      setAnswers([]);
      setVotes({});
      setVoteCounts({});
      setRoundWinner(null);
      setChaosMode(chaosMode);
      
      if (chaosAnnouncement) {
        setChaosAnnouncement(chaosAnnouncement);
        setShowChaosAlert(true);
        setTimeout(() => setShowChaosAlert(false), 5000);
      }
    });

    return () => socket.removeAllListeners();
  }, []);

  // Speed round timer
  useEffect(() => {
    if (isSpeedRound && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isSpeedRound]);

  const renderWaitingOverlay = () => (
    <div className="stream-overlay waiting">
      <div className="overlay-content">
        <div className="game-title">
          <h1>🎮 HypeLoop</h1>
          <p>Waiting for players...</p>
        </div>
        
        <div className="player-list">
          {players.map((player, index) => (
            <div key={player.id} className="player-card">
              <div className="player-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="player-name">{player.name}</span>
            </div>
          ))}
        </div>
        
        {players.length >= 1 && (
          <div className="start-indicator">
            <div className="pulse-dot"></div>
            <span>Ready to start!</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnsweringOverlay = () => (
    <div className="stream-overlay answering">
      {/* Chaos Mode Alert */}
      {showChaosAlert && chaosAnnouncement && (
        <div className="chaos-alert">
          <div className="chaos-content">
            <span className="chaos-icon">🌀</span>
            <span className="chaos-text">{chaosAnnouncement}</span>
          </div>
        </div>
      )}

      {/* Speed Round Timer */}
      {isSpeedRound && timeLeft !== null && (
        <div className="speed-timer">
          <div className="timer-display">
            <span className="timer-number">{timeLeft}</span>
            <span className="timer-label">SECONDS LEFT!</span>
          </div>
        </div>
      )}

      <div className="overlay-content">
        <div className="prompt-section">
          <div className="round-indicator">Round {round}</div>
          <div className="prompt-text">{currentPrompt}</div>
          
          {chaosMode && (
            <div className="chaos-indicator">
              🌀 {chaosMode.name}
            </div>
          )}
        </div>

        <div className="player-status">
          {players.map((player) => (
            <div key={player.id} className="status-card">
              <div className="status-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="status-info">
                <span className="status-name">{player.name}</span>
                <div className="status-indicator">
                  {answers.find(a => a.playerId === player.id) ? (
                    <span className="answered">✅</span>
                  ) : (
                    <span className="thinking">⏳</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVotingOverlay = () => (
    <div className="stream-overlay voting">
      <div className="overlay-content">
        <div className="voting-header">
          <h2>🗳️ Vote for the Best Answer!</h2>
        </div>

        <div className="answers-grid">
          {answers.map((answer, index) => {
            const voteCount = voteCounts[answer.playerId] || 0;
            const player = players.find(p => p.id === answer.playerId);
            
            return (
              <div key={index} className="answer-card">
                <div className="answer-header">
                  <div className="answer-player">
                    <div className="answer-avatar">
                      {player?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="answer-name">{player?.name || "Unknown"}</span>
                  </div>
                  <div className="vote-count">
                    <span className="vote-number">{voteCount}</span>
                    <span className="vote-label">votes</span>
                  </div>
                </div>
                
                <div className="answer-text">"{answer.answer}"</div>
              </div>
            );
          })}
        </div>

        <div className="voting-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(Object.keys(votes).length / players.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {Object.keys(votes).length} / {players.length} votes
          </span>
        </div>
      </div>
    </div>
  );

  const renderResultsOverlay = () => (
    <div className="stream-overlay results">
      <div className="overlay-content">
        {roundWinner && (
          <div className="winner-section">
            <div className="winner-announcement">
              <span className="winner-icon">🏆</span>
              <span className="winner-text">ROUND WINNER!</span>
            </div>
            <div className="winner-name">{roundWinner.name}</div>
          </div>
        )}

        <div className="results-grid">
          {answers.map((answer, index) => {
            const voteCount = Object.values(votes).filter(v => v === answer.playerId).length;
            const player = players.find(p => p.id === answer.playerId);
            const isWinner = roundWinner?.id === answer.playerId;
            
            return (
              <div key={index} className={`result-card ${isWinner ? 'winner' : ''}`}>
                <div className="result-header">
                  <div className="result-player">
                    <div className="result-avatar">
                      {player?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="result-name">{player?.name || "Unknown"}</span>
                  </div>
                  <div className="result-votes">
                    <span className="result-vote-count">{voteCount}</span>
                    <span className="result-vote-label">votes</span>
                  </div>
                </div>
                
                <div className="result-text">"{answer.answer}"</div>
                
                {isWinner && (
                  <div className="winner-badge">🏆 WINNER!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render based on game state
  switch (gameState) {
    case "waiting":
      return renderWaitingOverlay();
    case "answering":
      return renderAnsweringOverlay();
    case "voting":
      return renderVotingOverlay();
    case "results":
      return renderResultsOverlay();
    default:
      return renderWaitingOverlay();
  }
} 