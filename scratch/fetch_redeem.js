const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-only-ultra-secret-key-123';

// Generate a valid admin token
const token = jwt.sign(
  { userId: 'admin-1', role: 'admin' }, 
  ADMIN_JWT_SECRET, 
  { expiresIn: '24h' }
);

async function testFetch() {
  const code = 'WUYYU';
  console.log(`Sending real POST request to http://localhost:3005/api/vouchers/redeem for code "${code}"...`);
  
  try {
    const res = await fetch('http://localhost:3005/api/vouchers/redeem', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    
    console.log(`Response Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log("Response Body:", text);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testFetch();
