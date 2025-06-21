// client/src/components/voice.js
class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Voice input:', transcript);
        if (this.onResult) {
          this.onResult(transcript);
        }
      };
      
      this.recognition.onerror = (event) => {
        console.error('🎤 Voice recognition error:', event.error);
        if (this.onError) {
          this.onError(event.error);
        }
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        console.log('🎤 Voice recognition ended');
      };
    } else {
      console.warn('🎤 Speech recognition not supported');
    }
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      console.error('🎤 Speech recognition not available');
      return false;
    }
    
    this.onResult = onResult;
    this.onError = onError;
    
    try {
      this.recognition.start();
      this.isListening = true;
      console.log('🎤 Started listening...');
      return true;
    } catch (error) {
      console.error('🎤 Failed to start listening:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('🎤 Stopped listening');
    }
  }

  speak(text, options = {}) {
    if (!this.synthesis) {
      console.warn('🔊 Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Default options
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 0.8;
    utterance.lang = options.lang || 'en-US';
    
    // Try to use a fun voice if available
    const voices = this.synthesis.getVoices();
    const funVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Alex')
    );
    if (funVoice) {
      utterance.voice = funVoice;
    }

    utterance.onstart = () => {
      console.log('🔊 Speaking:', text);
    };

    utterance.onend = () => {
      console.log('🔊 Finished speaking');
    };

    utterance.onerror = (event) => {
      console.error('🔊 Speech synthesis error:', event.error);
    };

    this.synthesis.speak(utterance);
  }

  // Voice commands for game control
  speakPrompt(prompt) {
    // Clean up the prompt for better speech synthesis - remove underscores entirely
    const cleanPrompt = prompt
      .replace(/_{3,}/g, '') // Remove multiple underscores
      .replace(/_______/g, '') // Remove specific underscore pattern
      .replace(/_{2,}/g, '') // Remove any remaining multiple underscores
      .replace(/_/g, ''); // Remove single underscores
    
    this.speak(`Your prompt is: ${cleanPrompt}`, { rate: 0.9 });
  }

  speakWinner(winnerName) {
    this.speak(`Congratulations! The winner is ${winnerName}!`, { 
      rate: 0.8, 
      pitch: 1.2 
    });
  }

  speakGameStart() {
    this.speak("Game starting! Get ready to answer some hilarious prompts!", {
      rate: 0.9,
      pitch: 1.1
    });
  }

  speakVotingTime() {
    this.speak("Time to vote for the best answer!", { rate: 0.9 });
  }

  speakNextRound() {
    this.speak("Starting the next round!", { rate: 0.9 });
  }

  // Stop all speech
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if voice features are supported
  isSupported() {
    return !!(this.recognition && this.synthesis);
  }

  // Get available voices
  getVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }
}

export default VoiceService;