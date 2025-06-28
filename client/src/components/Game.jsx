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

// Import new UI components
import GameLayout from "./ui/GameLayout";
import JoinScreen from "./ui/JoinScreen";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Badge from "./ui/Badge";

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
    audioManager.playSound('notification');
  };

  const updateUserStats = async (gameStats) => {
    if (sessionId) {
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

    socket.on("game-start-error", ({ message }) => {
      console.error(`❌ Game start error: ${message}`);
      alert(`Failed to start game: ${message}`);
      audioManager.playSound('error');
    });

    socket.on("submit-error", ({ message }) => {
      console.error(`❌ Submit error: ${message}`);
      alert(`Failed to submit answer: ${message}`);
      audioManager.playSound('error');
    });

    socket.on("vote-error", ({ message }) => {
      console.error(`❌ Vote error: ${message}`);
      alert(`Failed to submit vote: ${message}`);
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

  const joinRoom = (formData) => {
    const { name: playerName, room: roomCode, theme: gameTheme } = formData;
    
    if (!playerName.trim() || !roomCode.trim()) {
      alert("Please enter both name and room code");
      return;
    }

    // Update state with form data
    setName(playerName);
    setRoom(roomCode);
    setTheme(gameTheme);

    // Animate join button
    if (gameContainerRef.current) {
      animationManager.pulseElement(gameContainerRef.current, 1000);
    }

    socket.emit("join-room", { name: playerName, room: roomCode, theme: gameTheme });
  };

  const startGame = () => {
    console.log(`🎮 Start game clicked! Room: ${room}, Player: ${name}, Socket ID: ${socket.id}`);
    
    // Animate start button
    if (gameContainerRef.current) {
      animationManager.bounce(gameContainerRef.current, 0.2);
    }

    socket.emit("start-game", { room });
    console.log(`📤 Emitted start-game event with room: ${room}`);
  };

  const submitAnswer = () => {
    if (!answerText.trim()) return;

    console.log(`📝 Submitting answer: "${answerText}" for room: ${room}`);
    console.log(`🔌 Socket connected: ${socket.connected}`);
    console.log(`🔌 Socket ID: ${socket.id}`);

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

    // Play answer submit sound and analyze for voice quip
    audioManager.playAnswerSubmit();
    
    // Add a small delay before the voice quip to let the sound play
    setTimeout(() => {
      audioManager.analyzeAnswerAndQuip(answerText);
    }, 500);

    const eventData = { room, answer: answerText };
    console.log(`📤 About to emit submit-answer with data:`, eventData);
    
    socket.emit("submit-answer", eventData);
    console.log(`📤 Emitted submit-answer event with room: ${room}, answer: "${answerText}"`);
    setAnswerText("");
  };

  const submitVote = (votedPlayerId) => {
    console.log(`🗳️ Submitting vote for player: ${votedPlayerId} in room: ${room}`);
    
    // Animate vote
    const voteElement = document.getElementById(`vote-${votedPlayerId}`);
    if (voteElement) {
      animationManager.animateVoteCount(voteElement);
    }

    socket.emit("submit-vote", { room, votedPlayerId });
    console.log(`📤 Emitted submit-vote event with room: ${room}, votedPlayerId: ${votedPlayerId}`);
  };

  const nextRound = () => {
    console.log(`🔄 Starting next round for room: ${room}`);
    
    // Animate next round button
    if (gameContainerRef.current) {
      animationManager.pulseElement(gameContainerRef.current, 1000);
    }

    socket.emit("next-round", { room });
    console.log(`📤 Emitted next-round event with room: ${room}`);
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

  return (
    <GameLayout
      user={user}
      gameState={gameState}
      room={room}
      playerCount={players.length}
      onAuth={() => setShowAuth(true)}
      onProfile={() => setShowProfile(true)}
      onLeave={leaveGame}
    >
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
        className={`game-container ${chaosTriggered ? 'chaos-trigger' : ''}`}
      >
        {/* Chaos Mode Alert */}
        {showChaosAlert && chaosAnnouncement && (
          <Card variant="danger" className="mb-6 animate-pulse-glow">
            <Card.Body>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h3 className="font-bold text-lg">CHAOS MODE ACTIVATED!</h3>
                  <p className="text-sm">{chaosAnnouncement}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Game State Rendering */}
        {gameState === "join" && (
          <GameLayout.Join>
            <JoinScreen
              onJoin={joinRoom}
              onAuth={() => setShowAuth(true)}
              user={user}
              loading={false}
            />
          </GameLayout.Join>
        )}
        
        {gameState === "waiting" && (
          <GameLayout.Waiting>
            {renderWaitingScreen()}
          </GameLayout.Waiting>
        )}
        
        {gameState === "answering" && (
          <GameLayout.Game>
            {renderAnswerScreen()}
          </GameLayout.Game>
        )}
        
        {gameState === "voting" && (
          <GameLayout.Game>
            {renderVotingScreen()}
          </GameLayout.Game>
        )}
        
        {gameState === "results" && (
          <GameLayout.Game>
            {renderResultsScreen()}
          </GameLayout.Game>
        )}
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
    </GameLayout>
  );
}
