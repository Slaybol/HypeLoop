import React, { useState, useEffect, useRef } from "react";

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.volume = {
      sfx: 0.7,
      music: 0.4,
      voice: 0.8
    };
    this.isMuted = false;
    this.currentMusic = null;
    this.audioContext = null;
    this.isInitialized = false;
    
    // Voice quip system
    this.voiceQuips = {
      answerSubmitted: [
        "Interesting choice!",
        "That's one way to look at it!",
        "Creative thinking!",
        "I like where your head's at!",
        "That's definitely unique!",
        "Well, that's unexpected!",
        "You're thinking outside the box!",
        "That's... creative!",
        "I see what you did there!",
        "That's a bold strategy!"
      ],
      answerQuality: {
        short: [
          "Short and sweet!",
          "Concise!",
          "To the point!",
          "Brief but effective!"
        ],
        long: [
          "Quite the explanation!",
          "You really thought this through!",
          "That's a detailed response!",
          "You went all out on that one!"
        ],
        funny: [
          "That's hilarious!",
          "I'm dying over here!",
          "Pure comedy gold!",
          "You're killing me!",
          "That's the funniest thing I've heard!"
        ],
        clever: [
          "That's clever!",
          "Smart thinking!",
          "Very witty!",
          "You're sharp!",
          "That's brilliant!"
        ],
        random: [
          "Interesting!",
          "That's something!",
          "Well, okay then!",
          "Sure, why not!",
          "That's definitely a choice!"
        ]
      },
      voting: [
        "Time to vote!",
        "Choose wisely!",
        "Pick your favorite!",
        "Who's got your vote?",
        "The power is in your hands!"
      ],
      chaosMode: [
        "Chaos mode activated!",
        "All bets are off!",
        "Things just got interesting!",
        "The rules have changed!",
        "Welcome to chaos!"
      ],
      winner: [
        "We have a winner!",
        "Congratulations!",
        "The champion emerges!",
        "Victory is yours!",
        "You did it!"
      ]
    };
    
    this.init();
  }

  async init() {
    try {
      // Create audio context for better control
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Load all sound effects
      await this.loadSounds();
      
      // Load background music
      await this.loadMusic();
      
      this.isInitialized = true;
      console.log("🎵 Audio Manager initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  // Resume audio context after user interaction
  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log("🎵 Audio context resumed");
      } catch (error) {
        console.error("Failed to resume audio context:", error);
      }
    }
  }

  async loadSounds() {
    const soundFiles = {
      // Game Events (Enhanced)
      gameStart: "/assets/sounds/game_start.mp3",
      roundStart: "/assets/sounds/round_start.mp3",
      answerSubmit: "/assets/sounds/answer_submit.mp3",
      voteSubmit: "/assets/sounds/vote_submit.mp3",
      winner: "/assets/sounds/winner.mp3",
      roundEnd: "/assets/sounds/round_end.mp3",
      
      // Chaos Mode (Enhanced)
      chaosTrigger: "/assets/sounds/chaos_trigger.mp3",
      speedRound: "/assets/sounds/speed_round.mp3",
      timeWarning: "/assets/sounds/time_warning.mp3",
      
      // UI Sounds (Enhanced)
      buttonClick: "/assets/sounds/button_click.mp3",
      hover: "/assets/sounds/hover.mp3",
      notification: "/assets/sounds/notification.mp3",
      error: "/assets/sounds/error.mp3",
      
      // Crowd Reactions (Enhanced)
      crowdCheer: "/assets/sounds/crowd_cheer.mp3",
      crowdLaugh: "/assets/sounds/crowd_laugh.mp3",
      crowdGasp: "/assets/sounds/crowd_gasp.mp3",
      crowdBoo: "/assets/sounds/crowd_boo.mp3",
      
      // New Enhanced Sounds
      powerUp: "/assets/sounds/power_up.mp3",
      achievement: "/assets/sounds/achievement.mp3",
      coinCollect: "/assets/sounds/coin_collect.mp3",
      levelUp: "/assets/sounds/level_up.mp3",
      suspense: "/assets/sounds/suspense.mp3",
      drumroll: "/assets/sounds/drumroll.mp3",
      fanfare: "/assets/sounds/fanfare.mp3",
      tick: "/assets/sounds/tick.mp3",
      tock: "/assets/sounds/tock.mp3",
      
      // Ambient
      airhorn: "/assets/sounds/airhorn.mp3",
      ding: "/assets/sounds/ding.mp3",
      beep: "/assets/sounds/beep.mp3"
    };

    let loadedCount = 0;
    const totalSounds = Object.keys(soundFiles).length;

    for (const [name, path] of Object.entries(soundFiles)) {
      try {
        const audio = new Audio(path);
        audio.preload = "auto";
        
        // Add error handling for audio loading
        audio.addEventListener('error', (e) => {
          console.warn(`Failed to load sound: ${name}`, e);
          audio._loadError = true; // Use custom property to track errors
        });
        
        audio.addEventListener('canplaythrough', () => {
          console.log(`✅ Sound loaded: ${name}`);
          loadedCount++;
          if (loadedCount === totalSounds) {
            console.log(`🎵 All sounds loaded (${loadedCount}/${totalSounds})`);
            this.createFallbackSounds();
          }
        });
        
        this.sounds[name] = audio;
      } catch (error) {
        console.warn(`Failed to create sound: ${name}`, error);
        loadedCount++;
      }
    }
    
    // Create fallback sounds after a timeout in case files don't load
    setTimeout(() => {
      this.createFallbackSounds();
    }, 3000);
  }

  async loadMusic() {
    const musicFiles = {
      lobby: "/assets/music/lobby.mp3",
      gameplay: "/assets/music/gameplay.mp3",
      voting: "/assets/music/voting.mp3",
      results: "/assets/music/results.mp3",
      chaos: "/assets/music/chaos.mp3",
      
      // New Enhanced Music
      suspense: "/assets/music/suspense.mp3",
      celebration: "/assets/music/celebration.mp3",
      powerUp: "/assets/music/power_up.mp3",
      tournament: "/assets/music/tournament.mp3",
      streamer: "/assets/music/streamer.mp3"
    };

    let loadedCount = 0;
    const totalMusic = Object.keys(musicFiles).length;

    for (const [name, path] of Object.entries(musicFiles)) {
      try {
        const audio = new Audio(path);
        audio.loop = true;
        audio.preload = "auto";
        
        // Add error handling for music loading
        audio.addEventListener('error', (e) => {
          console.warn(`Failed to load music: ${name}`, e);
          audio._loadError = true; // Use custom property to track errors
        });
        
        audio.addEventListener('canplaythrough', () => {
          console.log(`✅ Music loaded: ${name}`);
          loadedCount++;
          if (loadedCount === totalMusic) {
            console.log(`🎵 All music loaded (${loadedCount}/${totalMusic})`);
            this.createFallbackMusic();
          }
        });
        
        this.music[name] = audio;
      } catch (error) {
        console.warn(`Failed to create music: ${name}`, error);
        loadedCount++;
      }
    }
    
    // Create fallback music after a timeout in case files don't load
    setTimeout(() => {
      this.createFallbackMusic();
    }, 3000);
  }

  async playSound(soundName, options = {}) {
    if (this.isMuted || !this.sounds[soundName]) {
      console.log(`🔇 Sound not played: ${soundName} (muted: ${this.isMuted}, exists: ${!!this.sounds[soundName]})`);
      return;
    }

    try {
      await this.resumeAudioContext();
      
      const sound = this.sounds[soundName].cloneNode();
      sound.volume = (options.volume || 1) * this.volume.sfx;
      
      console.log(`🔊 Playing sound: ${soundName} (volume: ${sound.volume})`);
      
      await sound.play();
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }

  async playMusic(musicName, fadeIn = true) {
    if (this.isMuted || !this.music[musicName]) {
      console.log(`🔇 Music not played: ${musicName} (muted: ${this.isMuted}, exists: ${!!this.music[musicName]})`);
      return;
    }

    try {
      await this.resumeAudioContext();
      
      // Stop current music with fade out
      if (this.currentMusic) {
        this.fadeOutMusic(this.currentMusic, () => {
          this.currentMusic.pause();
          this.currentMusic.currentTime = 0;
        });
      }

      // Start new music
      this.currentMusic = this.music[musicName];
      this.currentMusic.volume = fadeIn ? 0 : this.volume.music;
      this.currentMusic.currentTime = 0;
      
      console.log(`🎵 Playing music: ${musicName} (volume: ${this.currentMusic.volume})`);
      
      await this.currentMusic.play();

      // Fade in if requested
      if (fadeIn) {
        this.fadeInMusic(this.currentMusic);
      }
    } catch (error) {
      console.warn(`Failed to play music: ${musicName}`, error);
    }
  }

  fadeInMusic(audio, duration = 2000) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = this.volume.music / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, this.volume.music);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepDuration);
  }

  fadeOutMusic(audio, callback, duration = 1000) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = audio.volume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(audio.volume - volumeStep, 0);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        if (callback) callback();
      }
    }, stepDuration);
  }

  stopMusic() {
    if (this.currentMusic) {
      console.log("🛑 Stopping music");
      this.fadeOutMusic(this.currentMusic, () => {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
        this.currentMusic = null;
      });
    }
  }

  setVolume(type, value) {
    this.volume[type] = Math.max(0, Math.min(1, value));
    console.log(`🔊 Volume set: ${type} = ${this.volume[type]}`);
    
    // Update current music volume
    if (this.currentMusic && type === 'music') {
      this.currentMusic.volume = this.volume.music;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    console.log(`🔇 Mute toggled: ${this.isMuted}`);
    
    if (this.isMuted) {
      this.stopMusic();
    }
    
    return this.isMuted;
  }

  // Voice quip system
  speakQuip(quipType, options = {}) {
    if (this.isMuted || !window.speechSynthesis) return;
    
    const quips = this.voiceQuips[quipType];
    if (!quips) return;
    
    let selectedQuip;
    
    if (Array.isArray(quips)) {
      selectedQuip = quips[Math.floor(Math.random() * quips.length)];
    } else if (options.subType && quips[options.subType]) {
      const subQuips = quips[options.subType];
      selectedQuip = subQuips[Math.floor(Math.random() * subQuips.length)];
    } else {
      // Fallback to random subType
      const subTypes = Object.keys(quips);
      const randomSubType = subTypes[Math.floor(Math.random() * subTypes.length)];
      const subQuips = quips[randomSubType];
      selectedQuip = subQuips[Math.floor(Math.random() * subQuips.length)];
    }
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(selectedQuip);
    utterance.volume = this.volume.voice;
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.1;
    
    // Try to use a fun voice
    const voices = window.speechSynthesis.getVoices();
    const funVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Alex') ||
      voice.name.includes('Daniel')
    );
    if (funVoice) {
      utterance.voice = funVoice;
    }
    
    window.speechSynthesis.speak(utterance);
    console.log(`🎤 Voice quip: ${selectedQuip}`);
  }

  // Analyze answer and provide appropriate quip
  analyzeAnswerAndQuip(answerText) {
    if (!answerText || answerText.length < 3) return;
    
    const length = answerText.length;
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(answerText);
    const hasPunctuation = /[!?]/.test(answerText);
    const isAllCaps = answerText === answerText.toUpperCase() && answerText.length > 3;
    
    let subType = 'random';
    
    if (length < 10) {
      subType = 'short';
    } else if (length > 50) {
      subType = 'long';
    } else if (hasEmojis || hasPunctuation || isAllCaps) {
      subType = 'funny';
    } else if (length > 20 && length < 40) {
      subType = 'clever';
    }
    
    // Add some randomness to avoid predictability
    if (Math.random() < 0.3) {
      subType = 'random';
    }
    
    this.speakQuip('answerQuality', { subType });
  }

  // Enhanced game-specific sound methods
  async playGameStart() {
    await this.playSound('gameStart');
    await this.playMusic('gameplay');
    this.speakQuip('gameStart');
  }

  async playRoundStart() {
    await this.playSound('roundStart');
    this.speakQuip('roundStart');
  }

  async playAnswerSubmit() {
    await this.playSound('answerSubmit');
    // Don't quip here - will be called separately with answer analysis
  }

  async playVoteSubmit() {
    await this.playSound('voteSubmit');
    this.speakQuip('voting');
  }

  async playWinner() {
    await this.playSound('winner');
    await this.playSound('crowdCheer');
    await this.playMusic('results');
    this.speakQuip('winner');
  }

  async playChaosTrigger() {
    await this.playSound('chaosTrigger');
    await this.playMusic('chaos');
    this.speakQuip('chaosMode');
  }

  // New enhanced methods
  async playPowerUp() {
    await this.playSound('powerUp');
    await this.playMusic('powerUp', false);
    setTimeout(() => this.stopMusic(), 3000);
  }

  async playAchievement() {
    await this.playSound('achievement');
    await this.playSound('fanfare');
  }

  async playCoinCollect() {
    await this.playSound('coinCollect');
  }

  async playLevelUp() {
    await this.playSound('levelUp');
    await this.playSound('fanfare');
  }

  async playSuspense() {
    await this.playSound('suspense');
    await this.playMusic('suspense', false);
    setTimeout(() => this.stopMusic(), 5000);
  }

  async playDrumroll() {
    await this.playSound('drumroll');
  }

  // Enhanced crowd reactions
  async playCrowdReaction(reaction, intensity = 'medium') {
    const reactions = {
      cheer: 'crowdCheer',
      laugh: 'crowdLaugh',
      gasp: 'crowdGasp',
      boo: 'crowdBoo'
    };
    
    if (reactions[reaction]) {
      await this.playSound(reactions[reaction]);
      
      // Add intensity-based variations
      if (intensity === 'high') {
        await this.playSound('airhorn');
      } else if (intensity === 'low') {
        await this.playSound('ding');
      }
    }
  }

  // UI sound methods
  async playButtonClick() {
    await this.playSound('buttonClick');
  }

  async playHover() {
    await this.playSound('hover');
  }

  async playNotification() {
    await this.playSound('notification');
  }

  async playError() {
    await this.playSound('error');
  }

  // Utility methods
  preloadAll() {
    // Preload all audio files
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
    
    Object.values(this.music).forEach(music => {
      music.load();
    });
  }

  cleanup() {
    this.stopMusic();
    this.sounds = {};
    this.music = {};
  }

  // Debug method
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isMuted: this.isMuted,
      currentMusic: this.currentMusic ? 'playing' : 'none',
      audioContextState: this.audioContext ? this.audioContext.state : 'none',
      volumes: this.volume,
      soundsLoaded: Object.keys(this.sounds).length,
      musicLoaded: Object.keys(this.music).length
    };
  }

  // Generate a simple beep sound using Web Audio API
  generateBeep(frequency = 440, duration = 200) {
    if (!this.audioContext) return null;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
      
      return oscillator;
    } catch (error) {
      console.warn('Failed to generate beep:', error);
      return null;
    }
  }

  // Enhanced fallback sounds with better variety
  createFallbackSounds() {
    console.log('🎵 Creating enhanced fallback sounds...');
    
    const fallbackSounds = {
      buttonClick: () => this.generateBeep(800, 100),
      notification: () => this.generateBeep(600, 150),
      error: () => this.generateBeep(200, 300),
      ding: () => this.generateBeep(1000, 200),
      beep: () => this.generateBeep(440, 100),
      powerUp: () => this.generateBeep(1200, 300),
      achievement: () => this.generateBeep(800, 500),
      coinCollect: () => this.generateBeep(600, 150),
      levelUp: () => this.generateBeep(1000, 400),
      suspense: () => this.generateBeep(300, 1000),
      drumroll: () => this.generateBeep(400, 2000),
      fanfare: () => this.generateBeep(800, 1000),
      tick: () => this.generateBeep(500, 50),
      tock: () => this.generateBeep(400, 50)
    };
    
    // Add fallback methods to the sounds object
    Object.entries(fallbackSounds).forEach(([name, generator]) => {
      if (!this.sounds[name] || this.sounds[name]._loadError) {
        this.sounds[name] = { 
          play: () => generator(),
          cloneNode: () => ({ play: () => generator() })
        };
        console.log(`✅ Created enhanced fallback sound: ${name}`);
      }
    });
  }

  // Generate background music using Web Audio API
  generateBackgroundMusic(type = 'lobby', duration = 30000) {
    if (!this.audioContext) return null;
    
    try {
      console.log(`🎵 Generating background music: ${type}`);
      
      // Create different music patterns based on type
      let frequencies = [];
      let pattern = [];
      
      switch (type) {
        case 'lobby':
          frequencies = [220, 277, 330, 440]; // A major scale
          pattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1];
          break;
        case 'gameplay':
          frequencies = [330, 440, 554, 659]; // E major scale
          pattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1];
          break;
        case 'voting':
          frequencies = [440, 554, 659, 880]; // A major scale (higher)
          pattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1];
          break;
        case 'results':
          frequencies = [523, 659, 784, 1047]; // C major scale (higher)
          pattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1];
          break;
        case 'chaos':
          frequencies = [220, 330, 440, 660]; // More dissonant
          pattern = [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3];
          break;
        default:
          frequencies = [220, 277, 330, 440];
          pattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1];
      }
      
      const startTime = this.audioContext.currentTime;
      const noteDuration = 0.5; // 500ms per note
      
      // Create a sequence of notes
      pattern.forEach((noteIndex, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequencies[noteIndex];
        oscillator.type = 'sine';
        
        const noteStart = startTime + (index * noteDuration);
        const noteEnd = noteStart + noteDuration;
        
        gainNode.gain.setValueAtTime(0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.05, noteStart + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, noteEnd);
        
        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
      });
      
      // Schedule the next sequence
      if (duration > 0) {
        setTimeout(() => {
          this.generateBackgroundMusic(type, duration - 6000);
        }, 6000);
      }
      
      return true;
    } catch (error) {
      console.warn('Failed to generate background music:', error);
      return null;
    }
  }

  // Create fallback music if audio files fail to load
  createFallbackMusic() {
    console.log('🎵 Creating fallback music...');
    
    const musicTypes = ['lobby', 'gameplay', 'voting', 'results', 'chaos'];
    
    musicTypes.forEach(type => {
      if (!this.music[type] || this.music[type]._loadError) {
        this.music[type] = {
          play: (fadeIn = true) => {
            console.log(`🎵 Playing fallback music: ${type}`);
            this.generateBackgroundMusic(type, 30000);
            return Promise.resolve();
          },
          pause: () => {
            console.log(`🛑 Stopping fallback music: ${type}`);
          },
          currentTime: 0,
          volume: this.volume.music,
          loop: true
        };
        console.log(`✅ Created fallback music: ${type}`);
      }
    });
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager; 