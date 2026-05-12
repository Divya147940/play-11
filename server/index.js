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
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

// Logger Middleware
app.use((req, res, next) => {
  const logMsg = `${new Date().toISOString()} | ${req.method} ${req.url} | ${JSON.stringify(req.headers['authorization'] || 'No Auth')}\n`;
  fs.appendFileSync(path.join(__dirname, 'server_requests.log'), logMsg);
  next();
});

// Basic Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Database
initDB().then(() => {
  console.log('✅ Database initialization/migration complete.');
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

apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/quizzes', quizRoutes);
apiRouter.use('/matches', matchRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/settings', settingsRoutes);

// Mount API Router
app.use('/api', apiRouter);

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

// Local Start
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
