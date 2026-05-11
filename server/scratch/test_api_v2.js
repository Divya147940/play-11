const http = require('http');

http.get('http://localhost:3005/api/quizzes/zone/movie-zone', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('API Response:', JSON.parse(data));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
