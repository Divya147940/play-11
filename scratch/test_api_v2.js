const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzRlN2I1Zi05YmM1LTQ4NWYtYTQxOC1jNzU0ZDNjM2Q2ODAiLCJtb2JpbGUiOiI4MDA5Nzk5NTUwIiwiaWF0IjoxNzc4NTA3NTY1LCJleHAiOjE3NzkxMTIzNjV9.K2Ts1xMAv0eeI8yXZsgYGEGNEDYbO2x1Fr318Gb-yK8';

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/auth/history',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
