// scripts/test-game.js
const { getPrompt } = require("../server/promptService");

async function testGame() {
  console.log("🎮 Testing HypeLoop Game Logic...\n");

  // Test different themes
  const themes = ["1990s", "sci-fi", "adult"];
  
  for (const theme of themes) {
    console.log(`\n🎯 Testing ${theme.toUpperCase()} theme:`);
    
    try {
      const prompt = await getPrompt(theme);
      
      console.log(`📝 Prompt: ${prompt.text}`);
      console.log(`🎴 Type: ${prompt.type}`);
      
      if (prompt.playerCards && prompt.playerCards.length > 0) {
        console.log(`🃏 Player Cards (${prompt.playerCards.length}):`);
        prompt.playerCards.forEach((card, index) => {
          console.log(`   ${index + 1}. ${card}`);
        });
      }
      
      console.log(`📦 Deck: ${prompt.deck}`);
      
    } catch (error) {
      console.error(`❌ Error testing ${theme}:`, error.message);
    }
  }

  console.log("\n✅ Game logic test completed!");
  console.log("\n🚀 Ready to play HypeLoop!");
  console.log("   Start the server: cd server && node index.js");
  console.log("   Start the client: cd client && npm run dev");
}

testGame().catch(console.error); 