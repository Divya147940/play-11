const https = require('https');
const crypto = require('crypto');

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateAdminJwt() {
  const secret = 'admin-only-ultra-secret-key-123';
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId: 'admin-1',
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 86400
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(tokenInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${tokenInput}.${signature}`;
}

const token = generateAdminJwt();

function fetchUrlWithAuth(url, token) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const req = https.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          time: Date.now() - start,
          data: data
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
  });
}

async function testLiveStats() {
  try {
    const res = await fetchUrlWithAuth('https://www.quzo.in/api/admin/quizzes/stats', token);
    console.log(`Status: ${res.status}`);
    console.log(`Time: ${res.time} ms`);
    console.log(`Response length: ${res.data.length}`);
    console.log(`Response: ${res.data}`);
  } catch (e) {
    console.error("Request failed:", e.message);
  }
}

testLiveStats();
