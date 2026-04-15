const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon
  }
});

const db = {
  query: (text, params) => pool.query(text, params),
};

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        mobile TEXT UNIQUE NOT NULL,
        name TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        status TEXT DEFAULT 'active'
      );

      CREATE TABLE IF NOT EXISTS otp_requests (
        id TEXT PRIMARY KEY,
        mobile TEXT NOT NULL,
        otp_reference TEXT NOT NULL,
        otp_code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        zone_id TEXT,
        name TEXT NOT NULL,
        icon TEXT,
        status TEXT DEFAULT 'active',
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id TEXT PRIMARY KEY,
        zone_id TEXT,
        category_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        total_questions INTEGER DEFAULT 0,
        timer_minutes INTEGER DEFAULT 5,
        open_at TIMESTAMP,
        close_at TIMESTAMP,
        result_at TIMESTAMP,
        status TEXT DEFAULT 'active',
        reward_text TEXT,
        entry_type TEXT DEFAULT 'free'
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        quiz_id TEXT,
        type TEXT DEFAULT 'mcq',
        question_text TEXT NOT NULL,
        selection_limit INTEGER DEFAULT 1,
        marks INTEGER DEFAULT 1,
        negative_marks INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS question_options (
        id TEXT PRIMARY KEY,
        question_id TEXT,
        option_text TEXT NOT NULL,
        option_value TEXT NOT NULL,
        image_url TEXT
      );

      CREATE TABLE IF NOT EXISTS correct_answers (
        id TEXT PRIMARY KEY,
        question_id TEXT UNIQUE,
        answer_value TEXT NOT NULL,
        published_by TEXT,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        quiz_id TEXT,
        status TEXT DEFAULT 'pending',
        total_score INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        wrong_count INTEGER DEFAULT 0,
        rank INTEGER,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submission_answers (
        id TEXT PRIMARY KEY,
        submission_id TEXT,
        question_id TEXT,
        selected_value TEXT,
        is_correct INTEGER DEFAULT 0,
        score_awarded INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        sport_type TEXT,
        team_a TEXT NOT NULL,
        team_b TEXT NOT NULL,
        team_a_logo TEXT,
        team_b_logo TEXT,
        start_time TIMESTAMP,
        venue TEXT,
        status TEXT DEFAULT 'upcoming'
      );

      CREATE TABLE IF NOT EXISTS rewards (
        id TEXT PRIMARY KEY,
        quiz_id TEXT,
        rank_position INTEGER,
        reward_amount INTEGER,
        reward_text TEXT
      );

      -- Ensure columns exist for existing tables
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS open_at TIMESTAMP;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS close_at TIMESTAMP;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS result_at TIMESTAMP;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS marks_per_q INTEGER DEFAULT 2;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'free';

      ALTER TABLE questions ADD COLUMN IF NOT EXISTS selection_limit INTEGER DEFAULT 1;
      ALTER TABLE questions ADD COLUMN IF NOT EXISTS marks INTEGER DEFAULT 1;
      ALTER TABLE questions ADD COLUMN IF NOT EXISTS negative_marks INTEGER DEFAULT 0;

      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0;
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS wrong_count INTEGER DEFAULT 0;
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS rank INTEGER;
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

      ALTER TABLE submission_answers ADD COLUMN IF NOT EXISTS score_awarded INTEGER DEFAULT 0;
    `);
    
    await seedData();
    console.log('PostgreSQL (Neon) tables initialized.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

const seedData = async () => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM categories');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO categories (id, zone_id, name, sort_order) VALUES 
        ('cat-1', 'study-zone', 'SSC', 1),
        ('cat-2', 'study-zone', 'UPSC', 2),
        ('cat-3', 'study-zone', 'Banking', 3),
        ('cat-4', 'study-zone', 'Railway', 4),
        ('cat-g1', 'game-zone', 'IPL Quiz', 1),
        ('cat-g2', 'game-zone', 'Today Match Quiz', 2),
        ('cat-g3', 'game-zone', 'Player Knowledge', 3);

        INSERT INTO matches (id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, status) VALUES
        ('match-1', 'Cricket', 'CSK', 'RCB', 'CSK', 'RCB', '2026-05-15 19:30:00', 'Chennai', 'upcoming'),
        ('match-2', 'Cricket', 'MI', 'DC', 'MI', 'DC', '2026-05-16 19:30:00', 'Mumbai', 'upcoming');

        INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes, status, marks_per_q, entry_type) VALUES
        ('quiz-1', 'study-zone', 'cat-1', 'SSC CGL Tier 1 Mock', 'Full syllabus mock test', 10, 10, 'active', 2, 'free'),
        ('quiz-2', 'study-zone', 'cat-1', 'SSC CHSL Mini Test', 'Quick test for English', 5, 5, 'active', 2, 'free'),
        ('quiz-g1', 'game-zone', 'cat-g1', 'CSK vs RCB Mega Contest', 'Predict players and outcomes', 11, 20, 'active', 10, 'free');

        INSERT INTO questions (id, quiz_id, question_text, marks) VALUES
        ('q-1', 'quiz-1', 'Who is the author of "The God of Small Things"?', 2),
        ('q-2', 'quiz-1', 'What is the SI unit of electric current?', 2),
        ('q-g1', 'quiz-g1', 'Who will score the most runs?', 10);

        INSERT INTO question_options (id, question_id, option_text, option_value) VALUES
        ('opt-1', 'q-1', 'Arundhati Roy', '0'),
        ('opt-2', 'q-1', 'Chetan Bhagat', '1'),
        ('opt-3', 'q-2', 'Ampere', '0'),
        ('opt-4', 'q-2', 'Volt', '1'),
        ('opt-g1', 'q-g1', 'Virat Kohli', '0'),
        ('opt-g2', 'q-g1', 'MS Dhoni', '1');

        INSERT INTO correct_answers (id, question_id, answer_value) VALUES
        ('ans-1', 'q-1', '0'),
        ('ans-2', 'q-2', '0'),
        ('ans-g1', 'q-g1', '0');
      `);
      console.log('Database seeded with initial categories, matches, and quizzes.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = {
  db,
  initDB,
  pool
};
