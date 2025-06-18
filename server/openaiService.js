// server/openaiService.js
const OpenAI = require('openai');

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generatePrompt(theme) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `You are a creative game master for a party game. Generate a single, funny, and engaging prompt related to the theme "${theme}". The prompt should be a question or a short statement that encourages humorous answers from players.` },
        { role: "user", content: `Generate a prompt for a game round with the theme "${theme}".` },
      ],
      model: "gpt-3.5-turbo", // Or "gpt-4" for higher quality
      max_tokens: 50,
      temperature: 0.8,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate prompt from AI.");
  }
}

// You might also add functions for commentary, answer evaluation, etc.
// async function generateCommentary(context) { ... }

module.exports = { generatePrompt };