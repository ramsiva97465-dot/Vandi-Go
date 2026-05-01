
const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/siva/OneDrive/Dokumen/Vandi Go/frontend/src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("'${API_URL}") || content.includes("\"${API_URL}")) {
    console.log(`Fixing quotes in ${filePath}...`);
    // Replace '${API_URL}...' with `${API_URL}...`
    let newContent = content.replace(/'\$\{API_URL\}(.*?)'/g, '`${API_URL}$1`');
    newContent = newContent.replace(/"\$\{API_URL\}(.*?)"/g, '`${API_URL}$1`');
    fs.writeFileSync(filePath, newContent);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  });
}

walk(directory);
