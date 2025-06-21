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
      // Game Events
      gameStart: "/assets/sounds/game_start.mp3",
      roundStart: "/assets/sounds/round_start.mp3",
      answerSubmit: "/assets/sounds/answer_submit.mp3",
      voteSubmit: "/assets/sounds/vote_submit.mp3",
      winner: "/assets/sounds/winner.mp3",
      roundEnd: "/assets/sounds/round_end.mp3",
      
      // Chaos Mode
      chaosTrigger: "/assets/sounds/chaos_trigger.mp3",
      speedRound: "/assets/sounds/speed_round.mp3",
      timeWarning: "/assets/sounds/time_warning.mp3",
      
      // UI Sounds
      buttonClick: "/assets/sounds/button_click.mp3",
      hover: "/assets/sounds/hover.mp3",
      notification: "/assets/sounds/notification.mp3",
      error: "/assets/sounds/error.mp3",
      
      // Crowd Reactions
      crowdCheer: "/assets/sounds/crowd_cheer.mp3",
      crowdLaugh: "/assets/sounds/crowd_laugh.mp3",
      crowdGasp: "/assets/sounds/crowd_gasp.mp3",
      crowdBoo: "/assets/sounds/crowd_boo.mp3",
      
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
      chaos: "/assets/music/chaos.mp3"
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

  // Game-specific sound methods
  async playGameStart() {
    await this.playSound('gameStart');
    await this.playMusic('gameplay');
  }

  async playRoundStart() {
    await this.playSound('roundStart');
  }

  async playAnswerSubmit() {
    await this.playSound('answerSubmit');
  }

  async playVoteSubmit() {
    await this.playSound('voteSubmit');
  }

  async playWinner() {
    await this.playSound('winner');
    await this.playSound('crowdCheer');
    await this.playMusic('results');
  }

  async playChaosTrigger() {
    await this.playSound('chaosTrigger');
    await this.playMusic('chaos');
  }

  async playSpeedRound() {
    await this.playSound('speedRound');
  }

  async playTimeWarning() {
    await this.playSound('timeWarning');
  }

  async playCrowdReaction(reaction) {
    const reactions = {
      cheer: 'crowdCheer',
      laugh: 'crowdLaugh',
      gasp: 'crowdGasp',
      boo: 'crowdBoo'
    };
    
    if (reactions[reaction]) {
      await this.playSound(reactions[reaction]);
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

  // Create fallback sounds if audio files fail to load
  createFallbackSounds() {
    console.log('🎵 Creating fallback sounds...');
    
    // Create simple beep sounds for different events
    const fallbackSounds = {
      buttonClick: () => this.generateBeep(800, 100),
      notification: () => this.generateBeep(600, 150),
      error: () => this.generateBeep(200, 300),
      ding: () => this.generateBeep(1000, 200),
      beep: () => this.generateBeep(440, 100)
    };
    
    // Add fallback methods to the sounds object
    Object.entries(fallbackSounds).forEach(([name, generator]) => {
      if (!this.sounds[name] || this.sounds[name]._loadError) {
        this.sounds[name] = { 
          play: () => generator(),
          cloneNode: () => ({ play: () => generator() })
        };
        console.log(`✅ Created fallback sound: ${name}`);
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