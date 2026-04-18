const admin = require('firebase-admin');

try {
  if (!admin.apps.length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with Service Account.');
    } else {
      // On Vercel, if service account is missing, we shouldn't attempt default init
      // unless we are in a GCP environment. Adding a check or just logging warning.
      if (process.env.NODE_ENV === 'production') {
        console.warn('FIREBASE_SERVICE_ACCOUNT missing in production!');
      } else {
        admin.initializeApp();
        console.log('Firebase Admin initialized with defaults.');
      }
    }
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error.message);
}

module.exports = admin;
