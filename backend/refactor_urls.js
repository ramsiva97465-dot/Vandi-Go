
const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/siva/OneDrive/Dokumen/Vandi Go/frontend/src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5000')) {
    console.log(`Processing ${filePath}...`);
    
    // Add import if not present
    if (!content.includes("from '../config'") && !content.includes("from './config'")) {
      const relativePath = path.relative(path.dirname(filePath), 'c:/Users/siva/OneDrive/Dokumen/Vandi Go/frontend/src/config.js').replace(/\\/g, '/').replace('.js', '');
      content = `import { API_URL } from '${relativePath}';\n` + content;
    }
    
    // Replace URL
    const newContent = content.replace(/http:\/\/localhost:5000/g, '${API_URL}');
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
