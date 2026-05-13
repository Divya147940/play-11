const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzRlN2I1Zi05YmM1LTQ4NWYtYTQxOC1jNzU0ZDNjM2Q2ODAiLCJtb2JpbGUiOiI4MDA5Nzk5NTUwIiwiaWF0IjoxNzc4NTA3NTY1LCJleHAiOjE3NzkxMTIzNjV9.K2Ts1xMAv0eeI8yXZsgYGEGNEDYbO2x1Fr318Gb-yK8';

async function testApi() {
  try {
    const res = await axios.get('http://localhost:3005/api/auth/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('API Response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('API Error:', err.response ? err.response.data : err.message);
  }
}

testApi();
