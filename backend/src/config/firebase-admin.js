const admin = require('firebase-admin');

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized with Service Account.');
  } else {
    // Attempt local default initialization if available
    admin.initializeApp();
    console.log('Firebase Admin initialized with defaults.');
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error.message);
}

module.exports = admin;
