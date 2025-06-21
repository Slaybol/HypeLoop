// server/openaiService.js
let openai = null;

// Only initialize OpenAI if API key is provided
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require("openai");
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function generatePrompt(themeName) {
  if (!openai) {
    console.warn("⚠️ OpenAI is disabled. Using fallback prompt.");
    return null; // This will make promptService.js use the fallback array
  }
  
  // OpenAI logic would go here when enabled
  console.log("🤖 OpenAI prompt generation would happen here...");
  return null;
}

module.exports = { generatePrompt };