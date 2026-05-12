const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // How long to wait for a connection before timing out
  ssl: {
    rejectUnauthorized: false // Required for Neon
  }
});

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  console.error('❌ CRITICAL: DATABASE_URL environment variable is missing in production!');
} else if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is missing! Database operations will fail.');
}

const db = {
  query: (text, params) => pool.query(text, params),
};

const initDB = async () => {
  // Use a flag to prevent multiple initializations in the same session
  if (global.dbInitialized) return;
  
  try {
    // 1. Quick check to see if database is already initialized
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (checkTable.rows[0].exists) {
      console.log('✅ Database already initialized, skipping heavy schema checks.');
      global.dbInitialized = true;
      return;
    }

    console.log('🔄 Initializing database schema (First time setup)...');
    
    // Run essential table creations in a single batch
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        mobile TEXT UNIQUE NOT NULL,
        name TEXT,
        coins NUMERIC DEFAULT 0,
        points INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otp_requests (
        id TEXT PRIMARY KEY,
        mobile TEXT NOT NULL,
        otp_reference TEXT NOT NULL,
        otp_code TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        verified INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        zone_id TEXT,
        name TEXT NOT NULL,
        hindi_name TEXT,
        icon TEXT,
        status TEXT DEFAULT 'active',
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id TEXT PRIMARY KEY,
        zone_id TEXT,
        category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
        match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        total_questions INTEGER DEFAULT 0,
        timer_minutes INTEGER DEFAULT 5,
        status TEXT DEFAULT 'active',
        reward_text TEXT,
        prize_amount INTEGER DEFAULT 0,
        entry_type TEXT DEFAULT 'free',
        open_at TIMESTAMPTZ,
        close_at TIMESTAMPTZ,
        result_at TIMESTAMPTZ,
        marks_per_q INTEGER DEFAULT 2,
        negative_marks NUMERIC DEFAULT 0.5
      );

      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        sport_type TEXT,
        team_a TEXT,
        team_b TEXT,
        team_a_logo TEXT,
        team_b_logo TEXT,
        start_time TIMESTAMPTZ,
        venue TEXT,
        score_a INTEGER DEFAULT 0,
        score_b INTEGER DEFAULT 0,
        hindi_team_a TEXT,
        hindi_team_b TEXT,
        hindi_venue TEXT,
        status TEXT DEFAULT 'upcoming'
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        hindi_question_text TEXT,
        marks INTEGER DEFAULT 2,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS question_options (
        id TEXT PRIMARY KEY,
        question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        option_value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS correct_answers (
        id TEXT PRIMARY KEY,
        question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
        answer_value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'completed',
        total_score NUMERIC DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        wrong_count INTEGER DEFAULT 0,
        total_marks INTEGER DEFAULT 0,
        time_taken TEXT,
        submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS visitors (
        id BIGSERIAL PRIMARY KEY,
        ip TEXT,
        user_agent TEXT,
        path TEXT,
        method TEXT,
        visited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submission_answers (
        id TEXT PRIMARY KEY,
        submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        selected_value TEXT,
        is_correct INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- Performance Indexes
      CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category_id);
      CREATE INDEX IF NOT EXISTS idx_quizzes_zone ON quizzes(zone_id);
      CREATE INDEX IF NOT EXISTS idx_quizzes_match ON quizzes(match_id);
      CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_quiz ON submissions(quiz_id);
      CREATE INDEX IF NOT EXISTS idx_otp_requests_mobile ON otp_requests(mobile);
      CREATE INDEX IF NOT EXISTS idx_sub_answers_sub ON submission_answers(submission_id);
    `);
    
    // Asynchronously handle migrations and seeding without blocking
    seedAndMigrate().catch(err => console.error('Background DB Error:', err));
    
    global.dbInitialized = true;
    console.log('✅ PostgreSQL (Neon) schema initialized.');
  } catch (error) {
    console.error('❌ CRITICAL: Error initializing essential database tables:', error);
  }
};

const seedAndMigrate = async () => {
  try {
    // Migrations for existing tables
    await pool.query(`
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS marks_per_q INTEGER DEFAULT 2;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'free';
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS entry_amount INTEGER DEFAULT 0;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS winner_id TEXT;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS hindi_title TEXT;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS hindi_description TEXT;
        ALTER TABLE questions ADD COLUMN IF NOT EXISTS hindi_question_text TEXT;
        ALTER TABLE question_options ADD COLUMN IF NOT EXISTS hindi_option_text TEXT;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS match_id TEXT;
        ALTER TABLE categories ADD COLUMN IF NOT EXISTS hindi_name TEXT;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS negative_marks NUMERIC DEFAULT 0.5;
        ALTER TABLE questions ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
        ALTER TABLE matches ADD COLUMN IF NOT EXISTS hindi_team_a TEXT;
        ALTER TABLE matches ADD COLUMN IF NOT EXISTS hindi_team_b TEXT;
        ALTER TABLE matches ADD COLUMN IF NOT EXISTS hindi_venue TEXT;
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS total_score NUMERIC DEFAULT 0;
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0;
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS wrong_count INTEGER DEFAULT 0;
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS time_taken TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS coins NUMERIC DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS prize_amount INTEGER DEFAULT 0;
        ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS banner_url TEXT;
    `);

    // Clean up old visitor logs (keep only last 30 days)
    await pool.query("DELETE FROM visitors WHERE visited_at < CURRENT_TIMESTAMP - INTERVAL '30 days'");
    await pool.query("DELETE FROM otp_requests WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '1 day'");
    console.log('Cleaned up old logs (visitors 30d, OTPs 24h).');

    const { rows } = await pool.query('SELECT COUNT(*) as count FROM categories');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO categories (id, zone_id, name, hindi_name, sort_order) VALUES 
        ('cat-1', 'study-zone', 'SSC', 'एसएससी', 1),
        ('cat-2', 'study-zone', 'UPSC', 'यूपीएससी', 2),
        ('cat-g1', 'sport-zone', 'IPL Quiz', 'आईपीएल क्विज', 1);
      `);
      console.log('Database seeded with initial data.');
    }

    const { rows: adminRows } = await pool.query('SELECT COUNT(*) as count FROM admins');
    if (parseInt(adminRows[0].count) === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123', 10);
      await pool.query(`
        INSERT INTO admins (id, username, password) VALUES 
        ('admin-1', 'admin', $1);
      `, [hashedPassword]);
      console.log('Default admin created (admin/123).');
    }
  } catch (err) {
    console.warn('Seed/Migrate warning (non-fatal):', err.message);
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
        ('cat-g1', 'sport-zone', 'IPL Quiz', 1),
        ('cat-g2', 'sport-zone', 'Today Match Quiz', 2),
        ('cat-g3', 'sport-zone', 'Player Knowledge', 3);

        INSERT INTO matches (id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, status) VALUES
        ('match-1', 'Cricket', 'CSK', 'RCB', 'CSK', 'RCB', '2026-05-15 19:30:00', 'Chennai', 'upcoming'),
        ('match-2', 'Cricket', 'MI', 'DC', 'MI', 'DC', '2026-05-16 19:30:00', 'Mumbai', 'upcoming');

        INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes, status, marks_per_q, entry_type) VALUES
        ('quiz-1', 'study-zone', 'cat-1', 'SSC CGL Tier 1 Mock', 'Full syllabus mock test', 10, 10, 'active', 2, 'free'),
        ('quiz-2', 'study-zone', 'cat-1', 'SSC CHSL Mini Test', 'Quick test for English', 5, 5, 'active', 2, 'free'),
        ('quiz-g1', 'sport-zone', 'cat-g1', 'CSK vs RCB Mega Contest', 'Predict players and outcomes', 11, 20, 'active', 10, 'free');

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
