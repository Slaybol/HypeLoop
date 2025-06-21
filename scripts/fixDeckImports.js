// scripts/fixDeckImports.js
const fs = require("fs");
const path = require("path");

const directory = path.resolve(__dirname, "../client/src");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) walk(fullPath, callback);
    else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) callback(fullPath);
  });
}

walk(directory, (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(/(['"])\.\.\/Decks\//g, '$1../decks/');
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("✅ Updated:", filePath);
  }
});
