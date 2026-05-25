const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Divyanshi123456\\.gemini\\antigravity\\brain';

function searchDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== '.tempmediaStorage' && file !== 'browser') {
        searchDir(fullPath);
      }
    } else if (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lower = content.toLowerCase();
      if (lower.includes('hostinger') || lower.includes('ftp') || lower.includes('hpanel') || lower.includes('u759861691')) {
        console.log(`--- Match in ${fullPath} ---`);
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const lineLower = lines[i].toLowerCase();
          if (lineLower.includes('hostinger') || lineLower.includes('ftp') || lineLower.includes('hpanel') || lineLower.includes('u759861691')) {
            console.log(`Line ${i + 1}: ${lines[i].substring(0, 500)}`);
          }
        }
      }
    }
  }
}

searchDir(brainDir);
