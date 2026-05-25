const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\Divyanshi123456\\.gemini\\antigravity\\brain\\1dab43d2-eb9c-490f-856d-d739b07af2cb\\.system_generated\\steps\\395\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

// The JSON is on line 5 (index 4) or we can find it
const lines = content.split('\n');
const jsonLine = lines.find(l => l.trim().startsWith('{'));
if (!jsonLine) {
  console.log("Could not find JSON line in content.md");
  process.exit(1);
}

const data = JSON.parse(jsonLine.trim());
console.log(`Total quizzes returned: ${data.quizzes.length}`);
data.quizzes.forEach((q, idx) => {
  console.log(`${idx + 1}. ID: ${q.id} | Title: "${q.title}" | Status: "${q.status}" | Open At: "${q.open_at}" | Close At: "${q.close_at}" | Status Label: "${q.status_label}"`);
});
