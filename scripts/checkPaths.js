const fs = require("fs");

function checkPath(path, description) {
  if (!fs.existsSync(path)) {
    console.error(`❌ Missing: ${path} (${description})`);
    process.exit(1);
  }
}

console.log("🔎 Checking project structure...");

checkPath("./client", "Vite frontend folder");
checkPath("./client/index.html", "Vite entry HTML");
checkPath("./client/src/main.jsx", "React root file");
checkPath("./server/index.js", "Server entry point");

console.log("✅ All required paths found.");
