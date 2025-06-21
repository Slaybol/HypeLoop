// Cost-effective prompt generation system
class PromptService {
  constructor() {
    this.promptDatabase = {
      general: [
        "If _______ was a sport, the rules would be",
        "The best way to _______ is to _______",
        "When _______ happens, _______ always follows",
        "_______ is the new _______",
        "If _______ had a theme song, it would be _______",
        "The secret to _______ is _______",
        "_______ is like _______ but with _______",
        "If _______ was a superhero, their power would be",
        "The best thing about _______ is _______",
        "When _______ goes wrong, _______ always saves the day",
        "If _______ was a movie, the plot would be",
        "The worst way to _______ is to _______",
        "_______ is the key to _______",
        "If _______ was a food, it would taste like",
        "The most important rule of _______ is",
        "When _______ meets _______, _______ happens",
        "If _______ was a holiday, we would celebrate by",
        "The best time to _______ is when _______",
        "_______ is better than _______ because",
        "If _______ was a job, the requirements would be"
      ],
      
      streamer: [
        "If _______ was a streamer, their catchphrase would be",
        "The worst thing to _______ on stream is",
        "When _______ happens in chat, _______ always follows",
        "If _______ was a stream title, it would be",
        "The best way to _______ for content is",
        "When _______ goes viral, _______ always happens",
        "If _______ was a streamer's setup, it would include",
        "The most embarrassing thing to _______ on stream is",
        "When _______ raids your stream, _______ always follows",
        "If _______ was a streamer's schedule, it would be",
        "The best time to _______ on stream is when",
        "When _______ becomes a meme, _______ always follows",
        "If _______ was a streamer's brand, it would be",
        "The worst chat message to _______ is",
        "When _______ gets banned, _______ always happens",
        "If _______ was a streamer's merch, it would be",
        "The best way to _______ with viewers is",
        "When _______ trends on Twitter, _______ always follows",
        "If _______ was a streamer's intro, it would be",
        "The most important rule of _______ on stream is",
        "When _______ becomes a copypasta, _______ always follows"
      ],
      
      chaos: [
        "In chaos mode, _______ becomes _______",
        "The chaos rule for _______ is",
        "When chaos strikes, _______ turns into _______",
        "If chaos mode affects _______, it becomes",
        "The most chaotic way to _______ is",
        "When chaos mode activates, _______ always _______",
        "If _______ was affected by chaos, it would",
        "The chaos version of _______ is",
        "When chaos mode hits, _______ becomes _______",
        "If chaos mode changes _______, it becomes",
        "The most unpredictable thing about _______ in chaos mode is",
        "When chaos mode triggers, _______ always _______",
        "If _______ was chaos mode's target, it would",
        "The chaos rule that affects _______ is",
        "When chaos mode strikes, _______ turns into _______",
        "If chaos mode modifies _______, it becomes",
        "The most chaotic aspect of _______ is",
        "When chaos mode activates, _______ always _______",
        "If _______ was chaos mode's victim, it would",
        "The chaos effect on _______ is",
        "When chaos mode hits, _______ becomes _______"
      ],
      
      roast: [
        "The worst thing about _______ is",
        "If _______ was a roast, it would be",
        "The most embarrassing thing about _______ is",
        "When _______ tries to _______, it always fails because",
        "If _______ was a comedy special, the jokes would be about",
        "The best way to roast _______ is to say",
        "When _______ goes wrong, it's always because",
        "If _______ was a meme, it would be about",
        "The most savage thing to say about _______ is",
        "When _______ fails, it's always _______ fault",
        "If _______ was a disaster, it would be",
        "The best roast of _______ would be",
        "When _______ tries to be cool, it always",
        "If _______ was a joke, the punchline would be",
        "The most brutal truth about _______ is",
        "When _______ goes viral, it's always for",
        "If _______ was a comedy sketch, it would be about",
        "The best way to describe _______ is",
        "When _______ happens, everyone laughs because",
        "If _______ was a roast battle, _______ would win because"
      ],
      
      sciFi: [
        "If _______ was a sci-fi technology, it would be",
        "In the year 3000, _______ will be",
        "The most advanced _______ in the galaxy is",
        "If _______ was a space weapon, it would",
        "When _______ meets alien technology, _______ happens",
        "If _______ was a robot, its programming would be",
        "The future of _______ is",
        "If _______ was a spaceship, it would be called",
        "When _______ goes through a wormhole, _______ happens",
        "If _______ was a cybernetic enhancement, it would",
        "The most powerful _______ in the universe is",
        "If _______ was a time machine, it would",
        "When _______ encounters AI, _______ always follows",
        "If _______ was a hologram, it would show",
        "The most advanced civilization uses _______ for",
        "If _______ was a laser weapon, it would",
        "When _______ travels at light speed, _______ happens",
        "If _______ was a space station, it would be",
        "The most dangerous _______ in space is",
        "If _______ was a teleporter, it would",
        "When _______ meets time travel, _______ always follows"
      ]
    };
    
    this.usedPrompts = new Set();
    this.aiUsageCount = 0;
    this.maxAiUsage = 0.1; // Only 10% AI-generated prompts
  }

  // Generate a prompt from the database
  generatePrompt(category = 'general', useAI = false) {
    // Check if we should use AI (limited usage)
    if (useAI && this.aiUsageCount < this.maxAiUsage && Math.random() < 0.2) {
      return this.generateAIPrompt(category);
    }

    // Use pre-built prompts
    const prompts = this.promptDatabase[category] || this.promptDatabase.general;
    
    // Find an unused prompt if possible
    let availablePrompts = prompts.filter(p => !this.usedPrompts.has(p));
    
    // If all prompts have been used, reset and reuse
    if (availablePrompts.length === 0) {
      this.usedPrompts.clear();
      availablePrompts = prompts;
    }
    
    const selectedPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    this.usedPrompts.add(selectedPrompt);
    
    return {
      text: selectedPrompt,
      category: category,
      source: 'database',
      cost: 0
    };
  }

  // Generate AI prompt (expensive, limited usage)
  async generateAIPrompt(category = 'general') {
    this.aiUsageCount++;
    
    // Simple AI prompt templates to reduce token usage
    const aiTemplates = {
      general: "Create a funny single-blank prompt about everyday situations. Format: 'If _______ was a sport, the rules would be'",
      streamer: "Create a funny single-blank prompt about streaming and content creation. Format: 'If _______ was a streamer, their catchphrase would be'",
      chaos: "Create a funny single-blank prompt about chaos and unpredictability. Format: 'In chaos mode, _______ becomes _______'",
      roast: "Create a funny single-blank prompt for roasting. Format: 'The worst thing about _______ is'",
      sciFi: "Create a funny single-blank prompt about sci-fi and future technology. Format: 'If _______ was a sci-fi technology, it would be'"
    };

    try {
      // This would be replaced with actual AI API call
      // For now, return a template-based prompt
      const template = aiTemplates[category] || aiTemplates.general;
      
      // Simulate AI generation with template variation
      const variations = [
        "If _______ was a social media trend, it would be",
        "The most viral way to _______ is to",
        "When _______ becomes a challenge, _______ always follows",
        "If _______ was a filter, it would make you look like",
        "The best way to _______ for likes is"
      ];
      
      const aiPrompt = variations[Math.floor(Math.random() * variations.length)];
      
      return {
        text: aiPrompt,
        category: category,
        source: 'ai',
        cost: 0.01 // Estimated cost per AI prompt
      };
    } catch (error) {
      console.error('AI prompt generation failed, falling back to database:', error);
      return this.generatePrompt(category, false);
    }
  }

  // Get prompt statistics
  getStats() {
    return {
      totalPrompts: Object.values(this.promptDatabase).flat().length,
      usedPrompts: this.usedPrompts.size,
      aiUsageCount: this.aiUsageCount,
      aiUsagePercentage: (this.aiUsageCount / Math.max(this.usedPrompts.size, 1)) * 100,
      estimatedCost: this.aiUsageCount * 0.01 // $0.01 per AI prompt
    };
  }

  // Add custom prompts to database
  addCustomPrompt(category, prompt) {
    if (!this.promptDatabase[category]) {
      this.promptDatabase[category] = [];
    }
    this.promptDatabase[category].push(prompt);
  }

  // Get all categories
  getCategories() {
    return Object.keys(this.promptDatabase);
  }

  // Get prompts by category
  getPromptsByCategory(category) {
    return this.promptDatabase[category] || [];
  }

  // Reset usage tracking
  resetUsage() {
    this.usedPrompts.clear();
    this.aiUsageCount = 0;
  }
}

// Create singleton instance
const promptService = new PromptService();

export default promptService; 