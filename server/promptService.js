// server/promptService.js
const fallbackPrompts = {
  "1990s": [
    "Invent a wild new Nickelodeon game show.",
    "What's in your Y2K bug-out bag?",
    "Describe your dream 90s toy mashup."
  ],
  "sci-fi": [
    "Describe a malfunctioning AI assistant.",
    "Name a new alien species and their favorite food.",
    "Pitch a bad sci-fi sequel."
  ],
  "adult": [
    "Write a terrible Tinder bio.",
    "Invent a new adult party game.",
    "Describe an awkward Zoom call."
  ],
  "general": [
    "Invent a new holiday tradition.",
    "Describe a bizarre new animal.",
    "What's the worst superpower to have?"
  ]
};

const { generatePrompt } = require("./openaiService");

async function getPrompt(themeName = "general") {
  const fallback = fallbackPrompts[themeName] || fallbackPrompts["general"];
  const selectedFallback = fallback[Math.floor(Math.random() * fallback.length)];

  try {
    const prompt = await generatePrompt(themeName);
    return prompt || selectedFallback;
  } catch (err) {
    console.warn("Using fallback prompt due to OpenAI error.");
    return selectedFallback;
  }
}

module.exports = { getPrompt };
