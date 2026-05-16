const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin securely.
 * This is designed to be resilient in serverless environments like Vercel.
 */
const initializeFirebase = () => {
  try {
    if (admin.apps.length > 0) return admin;

    let serviceAccount = null;
    const saEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (saEnv) {
      try {
        // If it starts with '{', it's likely a JSON string
        if (saEnv.trim().startsWith('{')) {
          serviceAccount = JSON.parse(saEnv);
        } else {
          // It might be a base64 encoded string or a file path (less likely on Vercel)
          console.warn('FIREBASE_SERVICE_ACCOUNT is provided but does not look like raw JSON.');
        }
      } catch (parseError) {
        console.error('CRITICAL: Firebase SA JSON Parse Error:', parseError.message);
      }
    }

    if (serviceAccount && serviceAccount.private_key) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully via Service Account.');
    } else {
      console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT is missing or invalid.');
      
      if (process.env.NODE_ENV !== 'production') {
        // Local fallback: try default ADC if not in production
        try {
          admin.initializeApp();
          console.log('ℹ️ Firebase Admin initialized with local defaults.');
        } catch (defaultInitError) {
          console.warn('❌ Default Firebase initialization failed:', defaultInitError.message);
        }
      } else {
        console.error('❌ CRITICAL: Firebase Admin NOT initialized in production! All auth requests will fail.');
      }
    }
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error.message);
  }
  return admin;
};

// Initialize immediately
initializeFirebase();

module.exports = admin;
