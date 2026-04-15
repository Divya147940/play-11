require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const quizRoutes = require('./src/routes/quiz.routes');
const matchRoutes = require('./src/routes/match.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDB().then(() => {
  console.log('Database initialization complete.');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/quizzes', quizRoutes);
app.use('/matches', matchRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Play11 API is running' });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
