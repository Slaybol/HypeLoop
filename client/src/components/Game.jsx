console.log("✅ Game component mounted");

// client/src/components/Game.jsx
import React, { useState, useEffect, useRef } from "react";
import socket from "../socket"; // 👈 adjust if path is different
import VoiceService from "./voice";
import audioManager from "./AudioManager";
import AudioSettings from "./AudioSettings";
import mobileOptimizer from "./MobileOptimizer";
import MobileNav from "./MobileNav";
import StreamerDashboard from "./StreamerDashboard";
import ChatIntegration from "./ChatIntegration";
import AutoClipGenerator from "./AutoClipGenerator";
import AdvancedStreamerTools from "./AdvancedStreamerTools";
import MobilePrototype from "./MobilePrototype";
import PowerUpShop from "./PowerUpShop";
import Achievements from "./Achievements";
import Leaderboard from "./Leaderboard";
import Tournament from "./Tournament";
import Friends from "./Friends";
import Groups from "./Groups";
import ActivityFeed from "./ActivityFeed";
import Auth from "./Auth";
import UserProfile from "./UserProfile";
import powerUpService from "../services/PowerUpService";
import socialService from "../services/SocialService";
import "../App.css"; // 👈 adjust if needed
import animationManager, { 
  AnimatedButton, 
  AnimatedCard, 
  LoadingSpinner,
  ParticleEffect,
  ConfettiEffect,
  useAnimations 
} from './AnimationManager';

export default function Game() {
  // User authentication state
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Audio settings
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Streamer tools
  const [streamerTools, setStreamerTools] = useState({
    dashboard: false,
    chatIntegration: false,
    autoClips: false,
    advancedTools: false
  });

  // Animation states
  const [showParticles, setShowParticles] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chaosTriggered, setChaosTriggered] = useState(false);

  // Power-up and Achievement system
  const [showPowerUpShop, setShowPowerUpShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTournament, setShowTournament] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [playerId, setPlayerId] = useState(null);

  // Social Features
  const [showFriends, setShowFriends] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [socialNotifications, setSocialNotifications] = useState([]);

  // Platform Expansion
  const [showMobilePrototype, setShowMobilePrototype] = useState(false);

  const gameContainerRef = useRef(null);
  const promptRef = useRef(null);
  const timerRef = useRef(null);
  const { elementRef: answerInputRef, animate: animateAnswerInput } = useAnimations();
  const { elementRef: voteContainerRef, animate: animateVoteContainer } = useAnimations();

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    if (sessionId) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${sessionId}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
          // Set name from user profile if available
          if (data.user.profile?.displayName) {
            setName(data.user.profile.displayName);
          }
        } else {
          // Invalid session, clear it
          localStorage.removeItem('sessionId');
          setSessionId(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('sessionId');
        setSessionId(null);
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = (data) => {
    setUser(data.user);
    setSessionId(data.sessionId);
    localStorage.setItem('sessionId', data.sessionId);
    setIsAuthenticated(true);
    setShowAuth(false);
    
    // Set name from user profile
    if (data.user.profile?.displayName) {
      setName(data.user.profile.displayName);
    }
    
    // Audio feedback
    audioManager.playSound('notification');
  };

  const handleRegister = (data) => {
    setUser(data.user);
    setSessionId(data.sessionId);
    localStorage.setItem('sessionId', data.sessionId);
    setIsAuthenticated(true);
    setShowAuth(false);
    
    // Set name from user profile
    if (data.user.profile?.displayName) {
      setName(data.user.profile.displayName);
    }
    
    // Audio feedback
    audioManager.playSound('notification');
  };

  const handleLogout = async () => {
    try {
      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('sessionId');
    setIsAuthenticated(false);
    setShowProfile(false);
    
    // Audio feedback
    audioManager.playSound('notification');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.profile?.displayName) {
      setName(updatedUser.profile.displayName);
    }
  };

  const updateUserStats = async (gameStats) => {
    if (!sessionId) return;
    
    try {
      await fetch('/api/stats/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify(gameStats)
      });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  useEffect(() => {
    // Initialize mobile optimization
    mobileOptimizer.optimizeForMobile();
    
    // Initialize voice service
    voiceService.current = new VoiceService();
    setVoiceSupported(voiceService.current.isSupported());
    
    // Don't start music here - wait for user interaction
    // audioManager.playMusic('lobby');
    
    // Socket event listeners
    socket.on("join-success", ({ room, name, roomState }) => {
      setGameState("waiting");
      setPlayers(Object.values(roomState.players || {}));
      setHypeCoins(roomState.hypeCoins || {});
      
      // Initialize power-up system for this player
      const newPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setPlayerId(newPlayerId);
      powerUpService.initializePlayer(newPlayerId);
      
      // Audio feedback
      audioManager.playSound('notification');
      
      // Start lobby music after successful join
      audioManager.playMusic('lobby');
    });

    socket.on("join-error", ({ message }) => {
      alert(`Join error: ${message}`);
      audioManager.playSound('error');
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
      
      // Update player stats for game start
      if (playerId) {
        powerUpService.updatePlayerStats(playerId, {
          answersSubmitted: 0,
          votesCast: 0,
          votesReceived: 0
        });
      }
      
      // Audio feedback
      audioManager.playGameStart();
      
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
      
      // Audio feedback
      audioManager.playMusic('voting');
      
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
      
      // Update voting stats
      if (playerId && voterId === playerId) {
        powerUpService.updatePlayerStats(playerId, {
          votesCast: (powerUpService.getPlayerStats(playerId).votesCast || 0) + 1
        });
      }
      
      // Audio feedback
      audioManager.playVoteSubmit();
    });

    socket.on("round-results", ({ roundWinner, leaderboard, playerScoresThisRound, answers, votes, hypeCoins, chaosMode }) => {
      setGameState("results");
      setRoundWinner(roundWinner);
      setLeaderboard(leaderboard);
      setAnswers(answers);
      setVotes(votes);
      setHypeCoins(hypeCoins || {});
      setChaosMode(chaosMode);
      
      // Update player stats for round results
      if (playerId) {
        const stats = powerUpService.getPlayerStats(playerId);
        const updates = {};
        
        // Check if player won
        if (roundWinner && roundWinner.id === playerId) {
          updates.roundsWon = (stats.roundsWon || 0) + 1;
          updates.currentWinStreak = (stats.currentWinStreak || 0) + 1;
          updates.maxWinStreak = Math.max(stats.maxWinStreak || 0, (stats.currentWinStreak || 0) + 1);
          
          // Check for chaos win
          if (chaosMode) {
            updates.chaosWins = (stats.chaosWins || 0) + 1;
          }
          
          // Check for perfect round (all votes)
          const playerVotes = Object.values(votes).filter(vote => vote === playerId).length;
          if (playerVotes === Object.keys(votes).length) {
            updates.perfectRounds = (stats.perfectRounds || 0) + 1;
          }
        } else {
          updates.currentWinStreak = 0;
        }
        
        // Update votes received
        const votesReceived = Object.values(votes).filter(vote => vote === playerId).length;
        updates.votesReceived = (stats.votesReceived || 0) + votesReceived;
        
        // Award coins for participation
        updates.coins = (stats.coins || 0) + 10; // Base participation reward
        
        powerUpService.updatePlayerStats(playerId, updates);
        
        // Check for new achievements
        const newAchievements = powerUpService.checkAchievements(playerId);
        if (newAchievements.length > 0) {
          setNewAchievements(newAchievements);
          setTimeout(() => setNewAchievements([]), 5000); // Clear after 5 seconds
          
          // Audio feedback for achievements
          audioManager.playSound('ding');
        }
      }
      
      // Update user account stats if authenticated
      if (isAuthenticated && user) {
        const gameStats = {
          gamesPlayed: 1,
          gamesWon: roundWinner && roundWinner.name === name ? 1 : 0,
          points: playerScoresThisRound?.[name] || 0,
          playTime: 60, // Approximate round time
          chaosModes: chaosMode ? 1 : 0,
          powerUps: 0 // Will be updated separately
        };
        
        updateUserStats(gameStats);
      }
      
      // End round for power-up system
      powerUpService.endRound({ players });
      
      // Audio feedback
      audioManager.playWinner();
      
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
      
      // Audio feedback
      audioManager.playRoundStart();
      
      // Show chaos announcement
      if (chaosAnnouncement) {
        setChaosAnnouncement(chaosAnnouncement);
        setShowChaosAlert(true);
        setTimeout(() => setShowChaosAlert(false), 5000); // Hide after 5 seconds
        
        // Chaos audio
        audioManager.playChaosTrigger();
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
      audioManager.cleanup();
    };
  }, [voiceEnabled]);

  useEffect(() => {
    // Cleanup animations on unmount
    return () => {
      animationManager.cleanup();
    };
  }, []);

  // Animation effects for game events
  useEffect(() => {
    if (gameState === 'answering' && currentPrompt) {
      // Animate prompt appearance
      if (promptRef.current) {
        animationManager.fadeIn(promptRef.current);
      }
      
      // Animate answer input
      if (answerInputRef.current) {
        animationManager.slideIn(answerInputRef.current, 'up');
      }
    }
  }, [gameState, currentPrompt]);

  useEffect(() => {
    if (gameState === 'voting' && answers.length > 0) {
      // Animate voting options
      if (voteContainerRef.current) {
        animationManager.fadeIn(voteContainerRef.current);
      }
    }
  }, [gameState, answers]);

  useEffect(() => {
    if (roundWinner) {
      // Celebrate winner
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      if (gameContainerRef.current) {
        animationManager.celebrateWinner(gameContainerRef.current);
      }
    }
  }, [roundWinner]);

  useEffect(() => {
    if (chaosMode && chaosAnnouncement) {
      // Chaos mode animations
      setChaosTriggered(true);
      animationManager.triggerChaosShake();
      
      if (gameContainerRef.current) {
        animationManager.triggerChaosGlow(gameContainerRef.current);
      }
      
      setTimeout(() => setChaosTriggered(false), 2000);
    }
  }, [chaosMode, chaosAnnouncement]);

  const joinRoom = () => {
    if (!name.trim() || !room.trim()) {
      alert("Please enter both name and room code");
      return;
    }

    // Animate join button
    if (gameContainerRef.current) {
      animationManager.pulseElement(gameContainerRef.current, 1000);
    }

    socket.emit("join-room", { name, room });
  };

  const startGame = () => {
    // Animate start button
    if (gameContainerRef.current) {
      animationManager.bounce(gameContainerRef.current, 0.2);
    }

    socket.emit("start-game");
  };

  const submitAnswer = () => {
    if (!answerText.trim()) return;

    // Animate submission
    if (answerInputRef.current) {
      animationManager.bounce(answerInputRef.current, 0.1);
    }

    // Update player stats for answer submission
    if (playerId) {
      powerUpService.updatePlayerStats(playerId, {
        answersSubmitted: (powerUpService.getPlayerStats(playerId).answersSubmitted || 0) + 1
      });
    }

    socket.emit("submit-answer", { answer: answerText });
    setAnswerText("");
  };

  const submitVote = (votedPlayerId) => {
    // Animate vote
    const voteElement = document.getElementById(`vote-${votedPlayerId}`);
    if (voteElement) {
      animationManager.animateVoteCount(voteElement);
    }

    socket.emit("submit-vote", { votedPlayerId });
  };

  const nextRound = () => {
    // Animate next round button
    if (gameContainerRef.current) {
      animationManager.pulseElement(gameContainerRef.current, 1000);
    }

    socket.emit("next-round");
  };

  // Voice input functions
  const startVoiceInput = () => {
    if (!voiceService.current || !voiceEnabled) return;
    
    const success = voiceService.current.startListening(
      (transcript) => {
        setAnswerText(transcript);
        setIsListening(false);
        audioManager.playSound('ding');
      },
      (error) => {
        console.error('Voice input error:', error);
        setIsListening(false);
        audioManager.playSound('error');
        if (error === 'not-allowed') {
          alert('Please allow microphone access to use voice input.');
        }
      }
    );
    
    if (success) {
      setIsListening(true);
      audioManager.playSound('beep');
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
    audioManager.playButtonClick();
  };

  // Audio settings
  const openAudioSettings = () => {
    setShowAudioSettings(true);
    audioManager.playButtonClick();
  };

  const closeAudioSettings = () => {
    setShowAudioSettings(false);
    audioManager.playButtonClick();
  };

  const leaveGame = () => {
    socket.emit("leave-room");
    audioManager.stopMusic();
    voiceService.current?.stopSpeaking();
    // Navigate back to join screen
    setGameState("join");
  };

  // Streamer tool handlers
  const toggleStreamerTool = (tool) => {
    setStreamerTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };

  const handleChatCommand = (command, data) => {
    console.log('Chat command received:', command, data);
    
    switch (command) {
      case 'join':
        // Add chat user as a player
        const chatPlayer = {
          id: `chat_${Date.now()}`,
          name: data.username,
          isChatUser: true,
          score: 0,
          isActive: true
        };
        setPlayers(prev => [...prev, chatPlayer]);
        break;
        
      case 'vote':
        // Handle chat vote
        if (data.playerName && gameState === 'voting') {
          const targetPlayer = players.find(p => 
            p.name.toLowerCase().includes(data.playerName.toLowerCase())
          );
          if (targetPlayer) {
            submitVote(targetPlayer.id);
          }
        }
        break;
        
      case 'chaos':
        // Request chaos mode
        if (gameState === 'answering' || gameState === 'voting') {
          // This would trigger chaos mode on the server
          console.log('Chat requested chaos mode');
        }
        break;
        
      case 'stats':
        // Show stats to chat
        const stats = {
          players: players.length,
          round: round,
          gameState: gameState,
          chaosMode: chaosMode
        };
        console.log('Game stats:', stats);
        break;
        
      case 'help':
        // Show help to chat
        console.log('Available commands: !join, !vote [player], !chaos, !stats, !help');
        break;
        
      default:
        break;
    }
  };

  // Advanced Streamer Tools functions
  const openAdvancedStreamerTools = () => {
    setStreamerTools(prev => ({ ...prev, advancedTools: true }));
    audioManager.playButtonClick();
  };

  const closeAdvancedStreamerTools = () => {
    setStreamerTools(prev => ({ ...prev, advancedTools: false }));
    audioManager.playButtonClick();
  };

  // Power-up and Achievement system functions
  const openPowerUpShop = () => {
    setShowPowerUpShop(true);
    audioManager.playButtonClick();
  };

  const closePowerUpShop = () => {
    setShowPowerUpShop(false);
    audioManager.playButtonClick();
  };

  const handlePowerUpPurchase = (result) => {
    const { powerUp, effect, remainingCoins } = result;
    
    // Show power-up effect
    if (effect.message) {
      // You could show a toast notification here
      console.log('Power-up activated:', effect.message);
    }
    
    // Handle special power-up actions
    if (effect.action) {
      switch (effect.action) {
        case 'voteSteal':
          // Enable vote stealing UI
          console.log('Vote steal power-up activated');
          break;
        case 'answerReveal':
          // Enable answer peeking UI
          console.log('Answer reveal power-up activated');
          break;
        case 'skipRound':
          // Skip the current round
          console.log('Skip round power-up activated');
          break;
        case 'triggerChaos':
          // Trigger chaos mode
          console.log('Chaos trigger power-up activated');
          break;
        default:
          break;
      }
    }
    
    // Update coins display
    setHypeCoins(prev => ({
      ...prev,
      [playerId]: remainingCoins
    }));
    
    // Audio feedback
    audioManager.playSound('ding');
    
    closePowerUpShop();
  };

  const openAchievements = () => {
    setShowAchievements(true);
    audioManager.playButtonClick();
  };

  const closeAchievements = () => {
    setShowAchievements(false);
    audioManager.playButtonClick();
  };

  const openLeaderboard = () => {
    setShowLeaderboard(true);
    audioManager.playButtonClick();
  };

  const closeLeaderboard = () => {
    setShowLeaderboard(false);
    audioManager.playButtonClick();
  };

  const getPlayerStats = () => {
    if (!playerId) return null;
    return powerUpService.getPlayerStats(playerId);
  };

  const getAvailablePowerUps = () => {
    if (!playerId) return [];
    return powerUpService.getAvailablePowerUps(playerId);
  };

  // Tournament functions
  const openTournament = () => {
    setShowTournament(true);
    audioManager.playButtonClick();
  };

  const closeTournament = () => {
    setShowTournament(false);
    audioManager.playButtonClick();
  };

  const handleJoinTournament = (tournament) => {
    console.log('Joining tournament:', tournament);
    // Here you would implement the actual tournament joining logic
    // For now, just show a notification
    alert(`Joined ${tournament.name}! Tournament starts in ${tournament.startTime}`);
  };

  // Social Features functions
  const openFriends = () => {
    setShowFriends(true);
    audioManager.playButtonClick();
  };

  const closeFriends = () => {
    setShowFriends(false);
    audioManager.playButtonClick();
  };

  const openGroups = () => {
    setShowGroups(true);
    audioManager.playButtonClick();
  };

  const closeGroups = () => {
    setShowGroups(false);
    audioManager.playButtonClick();
  };

  const openActivityFeed = () => {
    setShowActivityFeed(true);
    audioManager.playButtonClick();
  };

  const closeActivityFeed = () => {
    setShowActivityFeed(false);
    audioManager.playButtonClick();
  };

  const addSocialNotification = (notification) => {
    setSocialNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setSocialNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Platform Expansion functions
  const openMobilePrototype = () => {
    setShowMobilePrototype(true);
    audioManager.playButtonClick();
  };

  const closeMobilePrototype = () => {
    setShowMobilePrototype(false);
    audioManager.playButtonClick();
  };

  const renderJoinScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedCard className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-600">
          HypeLoop
        </h1>
        
        {/* User Authentication Section */}
        {isAuthenticated ? (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={user?.profile?.avatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-green-300"
                />
                <div>
                  <div className="font-semibold text-green-700">{user?.profile?.displayName || user?.username}</div>
                  <div className="text-sm text-gray-600">Level {user?.profile?.level || 1}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                🪙 {user?.profile?.coins || 0}
              </div>
            </div>
            
            <div className="flex gap-2">
              <AnimatedButton 
                onClick={() => setShowProfile(true)}
                className="flex-1 text-sm"
              >
                Profile
              </AnimatedButton>
              <AnimatedButton 
                onClick={handleLogout}
                className="flex-1 text-sm bg-red-500 hover:bg-red-600"
              >
                Logout
              </AnimatedButton>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="text-center mb-3">
              <div className="text-lg font-semibold text-blue-700">Welcome to HypeLoop!</div>
              <div className="text-sm text-gray-600">Sign in to save your progress</div>
            </div>
            <AnimatedButton 
              onClick={() => setShowAuth(true)}
              className="w-full"
            >
              Sign In / Register
            </AnimatedButton>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAuthenticated ? user?.profile?.displayName || user?.username : "Enter your name"}
              className="input-field w-full"
              maxLength={20}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className="input-field w-full"
              maxLength={6}
            />
          </div>
          
          <AnimatedButton 
            onClick={joinRoom}
            className="w-full"
            disabled={!name.trim() || !room.trim()}
          >
            Join Room
          </AnimatedButton>
        </div>
      </AnimatedCard>
    </div>
  );

  const renderWaitingScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedCard className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Waiting Room</h2>
        <p className="text-center text-gray-600 mb-6">Room: {room}</p>
        
        {/* Player Stats and Power-ups */}
        {playerId && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-purple-700">Your Stats</h3>
              <div className="text-2xl font-bold text-yellow-600">
                🪙 {getPlayerStats()?.coins || 0}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="text-center">
                <div className="font-bold text-blue-600">{getPlayerStats()?.roundsWon || 0}</div>
                <div className="text-gray-600">Wins</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{getPlayerStats()?.achievements?.size || 0}</div>
                <div className="text-gray-600">Achievements</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={openPowerUpShop}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
              >
                ⚡ Power-ups
              </button>
              <button
                onClick={openAchievements}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm"
              >
                🏆 Achievements
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Players ({players.length})</h3>
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{player.name}</span>
                {player.isHost && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Debug info - remove this later */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-700">
          <div>Debug: Current name: "{name}"</div>
          <div>Debug: Players: {JSON.stringify(players.map(p => ({ name: p.name, isHost: p.isHost })))}</div>
          <div>Debug: Host player: {players.find(p => p.isHost)?.name || 'None'}</div>
          <div>Debug: Is current player host? {players.find(p => p.isHost)?.name === name ? 'Yes' : 'No'}</div>
        </div>
        
        {/* Fallback: If no host, first player can become host */}
        {!players.find(p => p.isHost) && players.length > 0 && players[0].name === name && (
          <AnimatedButton 
            onClick={() => {
              // Emit a request to become host
              socket.emit("request-host", { room });
            }}
            className="w-full mb-2 bg-orange-500 hover:bg-orange-600"
          >
            Become Host
          </AnimatedButton>
        )}
        
        {players.find(p => p.isHost)?.name === name && (
          <AnimatedButton 
            onClick={startGame}
            className="w-full"
            disabled={players.length < 2}
          >
            Start Game
          </AnimatedButton>
        )}
        
        {players.find(p => p.isHost)?.name !== name && players.find(p => p.isHost) && (
          <p className="text-center text-gray-600">
            Waiting for host to start the game...
          </p>
        )}
        
        {/* If no host at all */}
        {!players.find(p => p.isHost) && (
          <p className="text-center text-gray-600">
            No host assigned. First player should become host.
          </p>
        )}
        
        {/* Leaderboard Button */}
        <button
          onClick={openLeaderboard}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
        >
          📊 View Leaderboard
        </button>
        
        {/* Tournament Button */}
        <button
          onClick={openTournament}
          className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200"
        >
          🏆 Join Tournaments
        </button>

        {/* Social Features Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={openFriends}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm"
          >
            👥 Friends
          </button>
          <button
            onClick={openGroups}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
          >
            👥 Groups
          </button>
          <button
            onClick={openActivityFeed}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm"
          >
            📱 Feed
          </button>
        </div>

        {/* Streamer Tools Button */}
        <button
          onClick={openAdvancedStreamerTools}
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
        >
          🎮 Advanced Streamer Tools
        </button>

        {/* Platform Expansion Button */}
        <button
          onClick={openMobilePrototype}
          className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200"
        >
          🚀 Platform Expansion
        </button>
      </AnimatedCard>
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
          
          {/* Power-up Status */}
          {playerId && (
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                <div className="text-yellow-400 font-bold text-lg">
                  🪙 {getPlayerStats()?.coins || 0}
                </div>
                <div className="text-purple-300 text-xs">Coins</div>
              </div>
              
              <button
                onClick={openPowerUpShop}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                ⚡ Power-ups
              </button>
              
              {/* Active Power-ups */}
              {activePowerUps.length > 0 && (
                <div className="flex space-x-2">
                  {activePowerUps.map((powerUp, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full animate-pulse"
                      title={`${powerUp.name} - ${powerUp.roundsLeft} rounds left`}
                    >
                      {powerUp.icon} {powerUp.name}
                    </div>
                  ))}
                </div>
              )}
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
            ref={answerInputRef}
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
        {/* Achievement Notifications */}
        {newAchievements.length > 0 && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-2xl border-2 border-yellow-600 shadow-2xl animate-bounce">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-lg font-bold">Achievement Unlocked!</div>
                {newAchievements.map((achievement, index) => (
                  <div key={index} className="text-sm">
                    {achievement.icon} {achievement.name} (+{achievement.points} coins)
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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

        {/* Power-up and Achievement Buttons */}
        {playerId && (
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={openPowerUpShop}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              ⚡ Power-up Shop
            </button>
            <button
              onClick={openAchievements}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              🏆 Achievements
            </button>
            <button
              onClick={openLeaderboard}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              📊 Leaderboard
            </button>
          </div>
        )}

        {/* Social Features Buttons */}
        {playerId && (
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={openFriends}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              👥 Friends
            </button>
            <button
              onClick={openGroups}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              👥 Groups
            </button>
            <button
              onClick={openActivityFeed}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              📱 Activity Feed
            </button>
          </div>
        )}

        {/* Streamer Tools Button */}
        <div className="text-center mb-8">
          <button
            onClick={openAdvancedStreamerTools}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
          >
            🎮 Advanced Streamer Tools
          </button>
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

  return (
    <div className="min-h-screen p-4">
      {/* Mobile Navigation */}
      {mobileOptimizer.isMobile && (
        <MobileNav 
          gameState={gameState}
          round={round}
          chaosMode={chaosMode}
          audioSettings={audioSettings}
          onVoiceToggle={toggleVoice}
          isListening={isListening}
        />
      )}

      {/* Audio Settings */}
      {showAudioSettings && (
        <AudioSettings 
          onClose={closeAudioSettings}
          audioSettings={audioSettings}
        />
      )}

      {/* Main Game Container */}
      <div 
        ref={gameContainerRef}
        className={`game-container max-w-4xl mx-auto ${chaosTriggered ? 'chaos-trigger' : ''}`}
      >
        {/* Chaos Mode Alert */}
        {showChaosAlert && chaosAnnouncement && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg chaos-glow">
            <h3 className="font-bold text-lg mb-2">🔥 CHAOS MODE ACTIVATED! 🔥</h3>
            <p>{chaosAnnouncement}</p>
          </div>
        )}

        {/* Game State Rendering */}
        {gameState === "join" && renderJoinScreen()}
        {gameState === "waiting" && renderWaitingScreen()}
        {gameState === "answering" && renderAnswerScreen()}
        {gameState === "voting" && renderVotingScreen()}
        {gameState === "results" && renderResultsScreen()}
      </div>

      {/* Particle Effects */}
      <ParticleEffect 
        trigger={showParticles}
        x={window.innerWidth / 2}
        y={window.innerHeight / 2}
        count={30}
        color="#667eea"
      />

      {/* Confetti Effect */}
      <ConfettiEffect 
        trigger={showConfetti}
        x={window.innerWidth / 2}
        y={0}
        count={100}
      />

      {/* Streamer Tools */}
      <StreamerDashboard
        gameState={gameState}
        players={players}
        currentPrompt={currentPrompt}
        chaosMode={chaosMode}
        onChatCommand={handleChatCommand}
      />

      <ChatIntegration
        enabled={streamerTools.chatIntegration}
        onChatCommand={handleChatCommand}
        gameState={gameState}
        players={players}
        currentPrompt={currentPrompt}
        chaosMode={chaosMode}
        onToggle={() => toggleStreamerTool('chatIntegration')}
      />

      <AutoClipGenerator
        enabled={streamerTools.autoClips}
        gameState={gameState}
        players={players}
        currentPrompt={currentPrompt}
        chaosMode={chaosMode}
        roundWinner={roundWinner}
        onToggle={() => toggleStreamerTool('autoClips')}
      />

      {/* Advanced Streamer Tools */}
      {streamerTools.advancedTools && (
        <AdvancedStreamerTools
          onClose={closeAdvancedStreamerTools}
        />
      )}

      {/* Power-up Shop */}
      {showPowerUpShop && (
        <PowerUpShop
          playerId={playerId}
          onPurchase={handlePowerUpPurchase}
          onClose={closePowerUpShop}
        />
      )}

      {/* Achievements */}
      {showAchievements && (
        <Achievements
          playerId={playerId}
          onClose={closeAchievements}
        />
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <Leaderboard
          onClose={closeLeaderboard}
        />
      )}

      {/* Tournament */}
      {showTournament && (
        <Tournament
          onClose={closeTournament}
          onJoinTournament={handleJoinTournament}
        />
      )}

      {/* Friends */}
      {showFriends && (
        <Friends
          playerId={playerId}
          onClose={closeFriends}
        />
      )}

      {/* Groups */}
      {showGroups && (
        <Groups
          playerId={playerId}
          onClose={closeGroups}
        />
      )}

      {/* Activity Feed */}
      {showActivityFeed && (
        <ActivityFeed
          playerId={playerId}
          onClose={closeActivityFeed}
        />
      )}

      {/* Platform Expansion Prototype */}
      {showMobilePrototype && (
        <MobilePrototype
          onClose={closeMobilePrototype}
        />
      )}

      {/* User Authentication */}
      {showAuth && (
        <Auth
          onLogin={handleLogin}
          onRegister={handleRegister}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* User Profile */}
      {showProfile && user && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
