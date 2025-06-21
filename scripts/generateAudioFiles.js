const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const createDirectories = () => {
  const dirs = [
    'client/public/assets/sounds',
    'client/public/assets/music'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Generate a simple audio file (silent MP3 for testing)
const generateSilentMP3 = (filePath) => {
  // This is a minimal valid MP3 file (silent, 1 second)
  const silentMP3 = Buffer.from([
    0xFF, 0xFB, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  
  fs.writeFileSync(filePath, silentMP3);
  console.log(`Generated: ${filePath}`);
};

// Generate all required audio files
const generateAudioFiles = () => {
  console.log('🎵 Generating audio files...');
  
  createDirectories();
  
  // Sound effects
  const soundFiles = [
    'game_start.mp3',
    'round_start.mp3',
    'answer_submit.mp3',
    'vote_submit.mp3',
    'winner.mp3',
    'round_end.mp3',
    'chaos_trigger.mp3',
    'speed_round.mp3',
    'time_warning.mp3',
    'button_click.mp3',
    'hover.mp3',
    'notification.mp3',
    'error.mp3',
    'crowd_cheer.mp3',
    'crowd_laugh.mp3',
    'crowd_gasp.mp3',
    'crowd_boo.mp3',
    'airhorn.mp3',
    'ding.mp3',
    'beep.mp3'
  ];
  
  // Background music
  const musicFiles = [
    'lobby.mp3',
    'gameplay.mp3',
    'voting.mp3',
    'results.mp3',
    'chaos.mp3'
  ];
  
  // Generate sound files
  soundFiles.forEach(file => {
    const filePath = path.join('client/public/assets/sounds', file);
    generateSilentMP3(filePath);
  });
  
  // Generate music files
  musicFiles.forEach(file => {
    const filePath = path.join('client/public/assets/music', file);
    generateSilentMP3(filePath);
  });
  
  console.log('✅ All audio files generated successfully!');
  console.log('📝 Note: These are placeholder files. Replace with real audio for production.');
};

// Run the script
if (require.main === module) {
  generateAudioFiles();
}

module.exports = { generateAudioFiles }; 