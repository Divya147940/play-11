const fetch = require('node-fetch');

async function testGuestSubmission() {
  const guestId = 'guest-test-123';
  const quizId = '92929fdb-5edf-481f-80cf-385d296b9d4d';
  const url = `http://localhost:3005/api/quizzes/${quizId}/submit`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestId
      },
      body: JSON.stringify({
        answers: {},
        time_taken: '00:05'
      })
    });

    const data = await res.json();
    console.log('Submission Response:', data);

    if (data.success) {
      console.log('Fetching history for guest...');
      const historyRes = await fetch(`http://localhost:3005/api/auth/history`, {
        headers: { 'x-guest-id': guestId }
      });
      const historyData = await historyRes.json();
      console.log('History Response:', JSON.stringify(historyData, null, 2));
    }
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

testGuestSubmission();
