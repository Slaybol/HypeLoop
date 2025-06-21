import Sound from 'react-native-sound';
import {Platform} from 'react-native';

// Enable playback in silence mode
Sound.setCategory('Playback');

class AudioService {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.isInitialized = false;
    this.musicVolume = 0.7;
    this.soundVolume = 1.0;
    this.isMuted = false;
  }

  async initialize() {
    try {
      // Preload all sound effects
      await this.preloadSounds();
      await this.preloadMusic();
      this.isInitialized = true;
      console.log('AudioService initialized successfully');
    } catch (error) {
      console.error('AudioService initialization failed:', error);
    }
  }

  async preloadSounds() {
    const soundFiles = [
      'button_click',
      'game_start',
      'round_start',
      'answer_submit',
      'vote_submit',
      'winner',
      'round_end',
      'chaos_trigger',
      'speed_round',
      'time_warning',
      'notification',
      'error',
      'crowd_cheer',
      'crowd_laugh',
      'crowd_gasp',
      'ding',
      'beep',
    ];

    for (const soundName of soundFiles) {
      try {
        const sound = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.warn(`Failed to load sound: ${soundName}`, error);
          }
        });
        this.sounds[soundName] = sound;
      } catch (error) {
        console.warn(`Error creating sound: ${soundName}`, error);
      }
    }
  }

  async preloadMusic() {
    const musicFiles = [
      'lobby',
      'gameplay',
      'voting',
      'results',
      'chaos',
    ];

    for (const musicName of musicFiles) {
      try {
        const music = new Sound(musicName, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.warn(`Failed to load music: ${musicName}`, error);
          }
        });
        this.music[musicName] = music;
      } catch (error) {
        console.warn(`Error creating music: ${musicName}`, error);
      }
    }
  }

  playSound(soundName) {
    if (this.isMuted || !this.isInitialized) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.setVolume(this.soundVolume);
      sound.play((success) => {
        if (!success) {
          console.warn(`Failed to play sound: ${soundName}`);
        }
      });
    } else {
      console.warn(`Sound not found: ${soundName}`);
    }
  }

  playMusic(musicName, loop = true) {
    if (this.isMuted || !this.isInitialized) return;

    // Stop current music
    this.stopMusic();

    const music = this.music[musicName];
    if (music) {
      music.setVolume(this.musicVolume);
      music.setNumberOfLoops(loop ? -1 : 0); // -1 for infinite loop
      music.play((success) => {
        if (!success) {
          console.warn(`Failed to play music: ${musicName}`);
        }
      });
    } else {
      console.warn(`Music not found: ${musicName}`);
    }
  }

  stopMusic() {
    Object.values(this.music).forEach((music) => {
      if (music && music.isPlaying()) {
        music.stop();
      }
    });
  }

  pauseMusic() {
    Object.values(this.music).forEach((music) => {
      if (music && music.isPlaying()) {
        music.pause();
      }
    });
  }

  resumeMusic() {
    if (!this.isMuted) {
      Object.values(this.music).forEach((music) => {
        if (music && !music.isPlaying()) {
          music.play();
        }
      });
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.music).forEach((music) => {
      if (music) {
        music.setVolume(this.musicVolume);
      }
    });
  }

  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  mute() {
    this.isMuted = true;
    this.pauseMusic();
  }

  unmute() {
    this.isMuted = false;
    this.resumeMusic();
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  // Game-specific audio methods
  playButtonClick() {
    this.playSound('button_click');
  }

  playGameStart() {
    this.playSound('game_start');
  }

  playRoundStart() {
    this.playSound('round_start');
  }

  playAnswerSubmit() {
    this.playSound('answer_submit');
  }

  playVoteSubmit() {
    this.playSound('vote_submit');
  }

  playWinner() {
    this.playSound('winner');
  }

  playRoundEnd() {
    this.playSound('round_end');
  }

  playChaosTrigger() {
    this.playSound('chaos_trigger');
  }

  playSpeedRound() {
    this.playSound('speed_round');
  }

  playTimeWarning() {
    this.playSound('time_warning');
  }

  playNotification() {
    this.playSound('notification');
  }

  playError() {
    this.playSound('error');
  }

  playCrowdCheer() {
    this.playSound('crowd_cheer');
  }

  playCrowdLaugh() {
    this.playSound('crowd_laugh');
  }

  playCrowdGasp() {
    this.playSound('crowd_gasp');
  }

  playDing() {
    this.playSound('ding');
  }

  playBeep() {
    this.playSound('beep');
  }

  // Cleanup
  cleanup() {
    Object.values(this.sounds).forEach((sound) => {
      if (sound) {
        sound.release();
      }
    });
    Object.values(this.music).forEach((music) => {
      if (music) {
        music.release();
      }
    });
    this.sounds = {};
    this.music = {};
  }
}

// Create singleton instance
const audioService = new AudioService();

export const initializeAudio = () => audioService.initialize();
export default audioService; 