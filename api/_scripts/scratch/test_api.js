const fetch = require('node-fetch');

async function testApi() {
  try {
    const res = await fetch('http://localhost:3005/api/quizzes/zone/movie-zone');
    const data = await res.json();
    console.log('API Response for movie-zone:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('API Error:', err.message);
  }
}

testApi();
