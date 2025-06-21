// server/promptService.js
const { generatePrompt } = require("./openaiService");

// Clean, funny single-blank prompts for HypeLoop
const promptDecks = {
  "general": {
    name: "General Chaos",
    description: "Universal prompts that work for any group",
    prompts: [
      "The worst thing to say during a job interview: _______",
      "If _______ was a superhero, their power would be",
      "The most embarrassing thing to happen at a wedding: _______",
      "A terrible name for a new restaurant: _______",
      "The worst thing to find in your food: _______",
      "If _______ was a movie genre, it would be called",
      "The most awkward thing to say to your crush: _______",
      "A rejected slogan for a presidential campaign: _______",
      "The worst thing to yell in a library: _______",
      "If _______ was a dating app, it would be called",
      "The most surprising thing to find in your sock drawer: _______",
      "A terrible theme for a children's birthday party: _______",
      "The worst thing to say to your boss: _______",
      "If _______ was a sport, the rules would be",
      "The most embarrassing thing to happen on live TV: _______",
      "A rejected name for a new iPhone: _______",
      "The worst thing to say on a first date: _______",
      "If _______ was a conspiracy theory, it would claim",
      "The most awkward thing to happen at a funeral: _______",
      "A terrible name for a new superhero: _______",
      "The worst thing to find in your coffee: _______",
      "If _______ was a holiday, it would celebrate",
      "The most embarrassing thing to happen at a gym: _______",
      "A terrible name for a new band: _______",
      "The worst thing to say to a police officer: _______",
      "If _______ was a disease, the symptoms would be",
      "The most awkward thing to happen at a job interview: _______",
      "A terrible name for a new car: _______"
    ]
  },
  "roast": {
    name: "Roast Mode",
    description: "Savage prompts for groups that can take a joke",
    prompts: [
      "The worst thing about _______ is that it's",
      "If _______ was a person, they would be the type to",
      "The most embarrassing thing _______ has ever done: _______",
      "A terrible personality trait that _______ has: _______",
      "The worst thing to say to _______ would be",
      "If _______ was a food, it would taste like",
      "The most annoying thing about _______ is",
      "A terrible habit that _______ has: _______",
      "The worst thing _______ could do right now: _______",
      "If _______ was a movie character, they would be",
      "The most embarrassing thing _______ owns: _______",
      "A terrible decision _______ made: _______",
      "The worst thing about _______'s style: _______",
      "If _______ was a song, it would be called",
      "The most awkward thing _______ has said: _______",
      "The worst thing _______ could wear to a wedding: _______",
      "If _______ was a pet, they would be a",
      "The most embarrassing thing _______ has in their room: _______",
      "A terrible skill that _______ thinks they have: _______",
      "The worst thing _______ could cook: _______"
    ]
  },
  "streamer": {
    name: "Streamer Mode",
    description: "Prompts perfect for streaming and audience interaction",
    prompts: [
      "The worst thing to say in chat: _______",
      "If _______ was a Twitch emote, it would be",
      "The most embarrassing thing to happen on stream: _______",
      "A terrible name for a new game: _______",
      "The worst thing to say to your viewers: _______",
      "If _______ was a streamer, their content would be",
      "The most awkward donation message: _______",
      "A terrible stream title: _______",
      "The worst thing to do during a raid: _______",
      "If _______ was a gaming chair, it would be",
      "The most embarrassing thing in your streaming setup: _______",
      "A terrible subscriber perk: _______",
      "The worst thing to say to a mod: _______",
      "If _______ was a stream schedule, it would be",
      "The most awkward thing to happen during a collab: _______",
      "The worst thing to find in your gaming setup: _______",
      "If _______ was a streaming platform, it would be called",
      "The most embarrassing thing to happen during a tournament: _______",
      "A terrible name for a new gaming headset: _______",
      "The worst thing to say to your chat: _______"
    ]
  }
};

async function getPrompt(themeName = "general") {
  // Try AI first (when enabled)
  const aiPrompt = await generatePrompt(themeName);
  if (aiPrompt) return aiPrompt;

  // Use fallback prompt list
  const deck = promptDecks[themeName] || promptDecks["general"];
  const promptTemplate = deck.prompts[Math.floor(Math.random() * deck.prompts.length)];
  
  return {
    text: promptTemplate,
    template: promptTemplate,
    type: "single-blank",
    theme: themeName
  };
}

module.exports = { getPrompt };