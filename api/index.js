require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, db } = require('./_src/config/db');
const authRoutes = require('./_src/routes/auth.routes');
const categoryRoutes = require('./_src/routes/category.routes');
const quizRoutes = require('./_src/routes/quiz.routes');
const matchRoutes = require('./_src/routes/match.routes');
const adminRoutes = require('./_src/routes/admin.routes');
const settingsRoutes = require('./_src/routes/settings.routes');

const app = express();
app.set('trust proxy', true); // Trust Vercel proxy to get correct client IP
const PORT = process.env.PORT || 3005;

// Basic Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Initialize Database
initDB().then(() => {
  console.log('✅ Database initialization process triggered.');
}).catch(err => {
  console.error('❌ Database initialization failed:', err);
});

// API Routes
const apiRouter = express.Router();

apiRouter.get('/ping', (req, res) => res.json({ 
  status: 'online', 
  message: 'Pong! API is reachable', 
  timestamp: new Date().toISOString() 
}));

apiRouter.get('/db-test', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT NOW()');
    res.json({ success: true, time: rows[0].now, message: 'Database connection successful!' });
  } catch (err) {
    console.error('DB Test Failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mount modular routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/quizzes', quizRoutes);
apiRouter.use('/matches', matchRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/settings', settingsRoutes);

// Mount API Router on both /api and / to handle different Vercel routing scenarios
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Base Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'active', platform: 'Play11' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// Local Start (only if not in production/Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
