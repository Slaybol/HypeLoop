// client/src/voice.js

/**
 * Initiates voice input using the Web Speech API.
 * @param {function(string): void} setText - Callback function to set the recognized text.
 * @returns {SpeechRecognition | null} The SpeechRecognition instance, or null if not supported.
 */
export function startVoiceInput(setText) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Web Speech API is not supported in this browser.');
    alert('Voice input is not supported in your browser. Please use text input.'); // Basic user feedback
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false; // Only final results
  recognition.maxAlternatives = 1;    // Get the most probable transcript

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setText(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Voice error:', event.error);
    if (event.error === 'not-allowed') {
      alert('Microphone access denied. Please allow microphone access in your browser settings.');
    } else if (event.error === 'no-speech') {
      // User spoke too softly, or microphone was off - often doesn't need an alert
      // console.log('No speech detected. Please try again.');
    } else if (event.error === 'network') {
      console.error('Network error during voice recognition.');
    }
    recognition.stop(); // Stop recognition on error to prevent continuous errors
  };

  recognition.onend = () => {
    // This event fires when recognition stops naturally (e.g., after one utterance if not continuous)
    // or when recognition.stop() is called.
    // console.log('Voice recognition ended.');
  };

  try {
    recognition.start();
    // console.log('Voice recognition started.');
  } catch (e) {
    console.error('Error starting voice recognition:', e);
    alert('Could not start voice input. Please check your microphone.');
    return null;
  }

  return recognition; // Return the instance so it can be stopped externally
}

/**
 * Stops the active voice recognition session.
 * @param {SpeechRecognition | null} recognitionInstance - The SpeechRecognition instance to stop.
 */
export function stopVoiceInput(recognitionInstance) {
  if (recognitionInstance && typeof recognitionInstance.stop === 'function') {
    recognitionInstance.stop();
    // console.log('Voice recognition stopped.');
  }
}