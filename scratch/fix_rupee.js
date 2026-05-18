const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all garbled currency symbols with clean rupee symbol (₹)
// In some environments, it is written as â‚¹ or double encoded.
const originalLength = content.length;
content = content.replace(/â‚¹/g, '₹');

if (content.length !== originalLength) {
  console.log(`Successfully replaced garbled rupee characters in AdminDashboard.jsx!`);
} else {
  console.log(`No exact 'â‚¹' string matched. Let's try replacing raw double-encoded sequence.`);
  // Try binary matching or broad matching of typical corrupted patterns
  content = content.replace(/\u00e2\u201a\u00b9/g, '₹');
  fs.writeFileSync(filePath, content, 'utf8');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating AdminDashboard.jsx');
