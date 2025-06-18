const fs = require("fs");
const clientPath = "./client";
const serverPath = "./server/index.js";

if (!fs.existsSync(clientPath)) {
  console.error("❌ Missing: ./client directory");
  process.exit(1);
}
if (!fs.existsSync(serverPath)) {
  console.error("❌ Missing: ./server/index.js");
  process.exit(1);
}

console.log("✅ All dev paths verified");
