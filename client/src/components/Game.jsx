console.log("✅ Game component mounted");

// client/src/components/Game.jsx
import React, { useState, useEffect, useRef } from "react";
import socket from "../socket"; // 👈 adjust if path is different
import VoiceService from "./voice";
import "../App.css"; // 👈 adjust if needed

export default function Game() {
  const [gameState, setGameState] = useState("join"); // join, waiting, answering, voting, results
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState({});
  const [roundWinner, setRoundWinner] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [round, setRound] = useState(0);
  const [theme, setTheme] = useState("general");
  const [hypeCoins, setHypeCoins] = useState({});
  const [voteCounts, setVoteCounts] = useState({});
  
  // Voice features
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const voiceService = useRef(null);
  
  // Chaos mode features
  const [chaosMode, setChaosMode] = useState(null);
  const [chaosAnnouncement, setChaosAnnouncement] = useState(null);
  const [showChaosAlert, setShowChaosAlert] = useState(false);

  useEffect(() => {
    // Initialize voice service
    voiceService.current = new VoiceService();
    setVoiceSupported(voiceService.current.isSupported());
    
    // Socket event listeners
    socket.on("join-success", ({ room, name, roomState }) => {
      setGameState("waiting");
      setPlayers(Object.values(roomState.players || {}));
      setHypeCoins(roomState.hypeCoins || {});
    });

    socket.on("join-error", ({ message }) => {
      alert(`Join error: ${message}`);
    });

    socket.on("room-updated", ({ players, hypeCoins, chaosMode }) => {
      setPlayers(Object.values(players || {}));
      if (hypeCoins) setHypeCoins(hypeCoins);
      if (chaosMode) setChaosMode(chaosMode);
    });

    socket.on("game-started", ({ prompt, players, round, phase, hypeCoins, chaosMode }) => {
      setGameState("answering");
      setCurrentPrompt(prompt);
      setPlayers(players);
      setRound(round);
      setHypeCoins(hypeCoins || {});
      setChaosMode(chaosMode);
      
      // Voice announcement - only speak the prompt, not the game start
      if (voiceEnabled && voiceService.current) {
        // Wait a moment for the UI to settle, then speak the prompt
        setTimeout(() => {
          voiceService.current.speakPrompt(prompt.text);
        }, 1000);
      }
    });

    socket.on("game-update", ({ players, currentPhase, answersCount, hypeCoins, chaosMode }) => {
      setPlayers(players);
      if (currentPhase) setGameState(currentPhase);
      if (hypeCoins) setHypeCoins(hypeCoins);
      if (chaosMode) setChaosMode(chaosMode);
    });

    socket.on("answers-update", (answersForVoting) => {
      setGameState("voting");
      setAnswers(answersForVoting);
      
      // Voice announcement
      if (voiceEnabled && voiceService.current) {
        voiceService.current.speakVotingTime();
      }
    });

    socket.on("vote-submitted", ({ voterId, votedPlayerId, voterName, votedPlayerName }) => {
      setVotes(prev => ({ ...prev, [voterId]: votedPlayerId }));
      setVoteCounts(prev => ({
        ...prev,
        [votedPlayerId]: (prev[votedPlayerId] || 0) + 1
      }));
    });

    socket.on("round-results", ({ roundWinner, leaderboard, playerScoresThisRound, answers, votes, hypeCoins, chaosMode }) => {
      setGameState("results");
      setRoundWinner(roundWinner);
      setLeaderboard(leaderboard);
      setAnswers(answers);
      setVotes(votes);
      setHypeCoins(hypeCoins || {});
      setChaosMode(chaosMode);
      
      // Voice announcement
      if (voiceEnabled && voiceService.current && roundWinner) {
        voiceService.current.speakWinner(roundWinner.name);
      }
    });

    socket.on("new-round", ({ prompt, players, round, phase, hypeCoins, chaosMode, chaosAnnouncement }) => {
      setGameState("answering");
      setCurrentPrompt(prompt);
      setPlayers(players);
      setRound(round);
      setAnswerText("");
      setAnswers([]);
      setVotes({});
      setVoteCounts({});
      setRoundWinner(null);
      setHypeCoins(hypeCoins || {});
      setChaosMode(chaosMode);
      
      // Show chaos announcement
      if (chaosAnnouncement) {
        setChaosAnnouncement(chaosAnnouncement);
        setShowChaosAlert(true);
        setTimeout(() => setShowChaosAlert(false), 5000); // Hide after 5 seconds
      }
      
      // Voice announcement
      if (voiceEnabled && voiceService.current) {
        voiceService.current.speakNextRound();
        setTimeout(() => {
          voiceService.current.speakPrompt(prompt.text);
        }, 1500);
      }
    });

    return () => {
      socket.removeAllListeners();
      if (voiceService.current) {
        voiceService.current.stopListening();
        voiceService.current.stopSpeaking();
      }
    };
  }, [voiceEnabled]);

  const joinRoom = () => {
    if (!name || !room) {
      alert("Please enter your name and room code!");
      return;
    }
    socket.emit("join-room", { name, room, theme: { name: theme } });
  };

  const startGame = () => {
    socket.emit("start-game", { room });
  };

  const submitAnswer = () => {
    if (!answerText.trim()) {
      alert("Please enter an answer!");
      return;
    }
    socket.emit("submit-answer", { room, answer: answerText.trim() });
  };

  const submitVote = (votedPlayerId) => {
    socket.emit("submit-vote", { room, votedPlayerId });
  };

  const nextRound = () => {
    socket.emit("next-round", { room });
  };

  // Voice input functions
  const startVoiceInput = () => {
    if (!voiceService.current || !voiceEnabled) return;
    
    const success = voiceService.current.startListening(
      (transcript) => {
        setAnswerText(transcript);
        setIsListening(false);
      },
      (error) => {
        console.error('Voice input error:', error);
        setIsListening(false);
        if (error === 'not-allowed') {
          alert('Please allow microphone access to use voice input.');
        }
      }
    );
    
    if (success) {
      setIsListening(true);
    }
  };

  const stopVoiceInput = () => {
    if (voiceService.current) {
      voiceService.current.stopListening();
      setIsListening(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const renderJoinScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          🎮 HypeLoop
        </h1>
        <p className="text-center text-purple-300 mb-6">
          The AI-Fueled Party Game
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
          />
          
          <input
            type="text"
            placeholder="Room Code"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full p-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
          />
          
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 bg-white/10 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            <option value="general">🎭 General Chaos</option>
            <option value="roast">🔥 Roast Mode</option>
            <option value="streamer">📺 Streamer Mode</option>
          </select>
          
          {voiceSupported && (
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
              <span className="text-white">🎤 Voice Features</span>
              <button
                onClick={toggleVoice}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  voiceEnabled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {voiceEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          )}
          
          <button
            onClick={joinRoom}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );

  const renderWaitingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full border border-purple-500/30">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Waiting for Players
        </h2>
        
        <div className="mb-6">
          <h3 className="text-xl text-white mb-4">Players in Room:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {players.map((player) => (
              <div key={player.id} className="bg-white/10 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-white font-semibold">{player.name}</p>
                <p className="text-purple-300 text-sm">💰 {hypeCoins[player.id] || 0}</p>
              </div>
            ))}
          </div>
        </div>
        
        {players.length >= 1 && (
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Start Game ({players.length} players)
          </button>
        )}
      </div>
    </div>
  );

  const renderAnswerScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Chaos Mode Announcement */}
        {showChaosAlert && chaosAnnouncement && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl border-2 border-yellow-400 animate-pulse shadow-2xl">
              <div className="text-center">
                <div className="text-2xl mb-2">🌀</div>
                <div className="text-lg">{chaosAnnouncement}</div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Round {round}</h2>
          <p className="text-purple-300">Enter your answer!</p>
          
          {/* Chaos Mode Indicator */}
          {chaosMode && (
            <div className="mt-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold py-2 px-6 rounded-lg inline-block">
              🌀 {chaosMode.name}
            </div>
          )}
        </div>

        {/* Prompt */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            {currentPrompt?.text || "Loading prompt..."}
          </h3>
          
          {/* Chaos Mode Instructions */}
          {chaosMode && (
            <div className="mt-4 p-4 bg-red-500/20 rounded-lg border border-red-500/50">
              <p className="text-red-300 text-center font-semibold">
                {chaosMode.description}
              </p>
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/30">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder={
              chaosMode?.name === "Emoji Only" 
                ? "Use only emojis! 😀🎉🚀" 
                : chaosMode?.name === "Backwards Round"
                ? "Type normally, it will be reversed!"
                : chaosMode?.name === "Rhyme Time"
                ? "Make sure your answer rhymes!"
                : chaosMode?.name === "Impersonation"
                ? `Answer as ${chaosMode.impersonationTarget || "a famous person"}!`
                : "Type your hilarious answer here..."
            }
            className="w-full p-4 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
            rows={4}
            maxLength={200}
            disabled={chaosMode?.name === "Silent Round" && voiceEnabled}
          />
          
          {/* Chaos Mode Answer Preview */}
          {chaosMode?.name === "Backwards Round" && answerText && (
            <div className="mt-2 p-2 bg-yellow-500/20 rounded border border-yellow-500/50">
              <p className="text-yellow-300 text-sm">
                <strong>Will be displayed as:</strong> {answerText.split('').reverse().join('')}
              </p>
            </div>
          )}
          
          {/* Voice Input Controls */}
          {voiceEnabled && chaosMode?.name !== "Silent Round" && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">🎤 Voice Input</span>
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
              </div>
              
              <div className="flex gap-2">
                {!isListening ? (
                  <button
                    onClick={startVoiceInput}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    🎤 Start Voice Input
                  </button>
                ) : (
                  <button
                    onClick={stopVoiceInput}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    ⏹️ Stop Voice Input
                  </button>
                )}
                
                <button
                  onClick={() => setAnswerText("")}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-200"
                >
                  🗑️ Clear
                </button>
              </div>
              
              {isListening && (
                <p className="text-yellow-400 text-sm mt-2 text-center animate-pulse">
                  🎤 Listening... Speak now!
                </p>
              )}
            </div>
          )}
          
          {/* Silent Round Notice */}
          {chaosMode?.name === "Silent Round" && voiceEnabled && (
            <div className="mt-4 p-4 bg-red-500/20 rounded-lg border border-red-500/50">
              <p className="text-red-300 text-center font-semibold">
                🚫 Voice input disabled for this round!
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-purple-300 text-sm">
              {answerText.length}/200 characters
            </span>
            <button
              onClick={submitAnswer}
              disabled={!answerText.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Submit Answer
            </button>
          </div>
        </div>

        {/* Players Status */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-xl text-white mb-4">Players:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((player) => (
              <div key={player.id} className="bg-white/10 rounded-lg p-3 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-white font-semibold text-sm">{player.name}</p>
                <p className="text-purple-300 text-xs">💰 {hypeCoins[player.id] || 0} HypeCoins</p>
                <div className="mt-2">
                  {answers.find(a => a.playerId === player.id) ? (
                    <span className="text-green-400 text-xs">✅ Answered</span>
                  ) : (
                    <span className="text-yellow-400 text-xs">⏳ Thinking...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVotingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">🗳️ Vote for the Best Answer!</h2>
        
        <div className="grid gap-6">
          {answers.map((answer, index) => {
            const voteCount = voteCounts[answer.playerId] || 0;
            const hasVoted = Object.keys(votes).length > 0;
            const isVotedFor = Object.values(votes).includes(answer.playerId);
            const player = players.find(p => p.id === answer.playerId);
            
            return (
              <div key={index} className={`bg-black/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-200 ${
                isVotedFor ? 'border-green-500/50 bg-green-500/10' : 'border-purple-500/30'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                      {player?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{player?.name || "Unknown"}</p>
                      <p className="text-purple-300 text-sm">💰 {hypeCoins[answer.playerId] || 0} HypeCoins</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{voteCount}</div>
                    <div className="text-purple-300 text-sm">votes</div>
                  </div>
                </div>
                
                <p className="text-xl text-white mb-4 italic">"{answer.answer}"</p>
                
                <button
                  onClick={() => submitVote(answer.playerId)}
                  disabled={hasVoted}
                  className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 transform ${
                    hasVoted
                      ? isVotedFor
                        ? "bg-gradient-to-r from-green-600 to-blue-600 text-white cursor-not-allowed"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105"
                  }`}
                >
                  {hasVoted 
                    ? isVotedFor 
                      ? "✅ Voted for this answer!" 
                      : "Vote submitted"
                    : "🗳️ Vote for this answer"
                  }
                </button>
              </div>
            );
          })}
        </div>
        
        {Object.keys(votes).length > 0 && (
          <div className="text-center mt-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <p className="text-purple-300 text-lg mb-2">Waiting for other players to vote...</p>
              <div className="flex justify-center space-x-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-2 flex items-center justify-center text-white font-bold text-xs">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm ${votes[player.id] ? 'text-green-400' : 'text-yellow-400'}`}>
                      {votes[player.id] ? '✅' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderResultsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Winner */}
        {roundWinner && (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">🏆 Round Winner! 🏆</h2>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 inline-block transform animate-pulse">
              <p className="text-2xl font-bold text-black">{roundWinner.name}</p>
              <p className="text-black text-sm">+{Object.values(votes).filter(v => v === roundWinner.id).length * 10} HypeCoins!</p>
            </div>
          </div>
        )}

        {/* All Answers with Vote Counts */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-6">📝 All Answers:</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => {
              const voteCount = Object.values(votes).filter(v => v === answer.playerId).length;
              const player = players.find(p => p.id === answer.playerId);
              const isWinner = roundWinner?.id === answer.playerId;
              
              return (
                <div key={index} className={`bg-white/10 rounded-lg p-4 transition-all duration-200 ${
                  isWinner ? 'border-2 border-yellow-400 bg-yellow-400/10' : ''
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm">
                        {player?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="text-white font-semibold">{player?.name || "Unknown"}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-yellow-400">{voteCount}</div>
                      <div className="text-purple-300 text-xs">votes</div>
                    </div>
                  </div>
                  <p className="text-white text-lg italic">"{answer.answer}"</p>
                  {isWinner && (
                    <div className="mt-2 text-yellow-400 text-sm font-semibold">
                      🏆 Winner! +{voteCount * 10} HypeCoins earned
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard with HypeCoins */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-6">🏅 Leaderboard:</h3>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div key={player.id} className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
                  </span>
                  <div>
                    <span className="text-white font-semibold">{player.name}</span>
                    <div className="text-purple-300 text-sm">💰 {hypeCoins[player.id] || 0} HypeCoins</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yellow-400 font-bold text-xl">{player.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Round Button */}
        <div className="text-center">
          <button
            onClick={nextRound}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105"
          >
            🎮 Next Round
          </button>
        </div>
      </div>
    </div>
  );

  // Render based on game state
  switch (gameState) {
    case "join":
      return renderJoinScreen();
    case "waiting":
      return renderWaitingScreen();
    case "answering":
      return renderAnswerScreen();
    case "voting":
      return renderVotingScreen();
    case "results":
      return renderResultsScreen();
    default:
      return renderJoinScreen();
  }
}
