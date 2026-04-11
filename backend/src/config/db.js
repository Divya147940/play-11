const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../play11.db');
const db = new Database(dbPath, { verbose: console.log });

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      mobile TEXT UNIQUE NOT NULL,
      name TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otp_requests (
      id TEXT PRIMARY KEY,
      mobile TEXT NOT NULL,
      otp_reference TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
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
      status TEXT DEFAULT 'active',
      reward_text TEXT
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT,
      type TEXT,
      question_text TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      quiz_id TEXT,
      status TEXT DEFAULT 'pending',
      total_score INTEGER DEFAULT 0,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS submission_answers (
      id TEXT PRIMARY KEY,
      submission_id TEXT,
      question_id TEXT,
      selected_value TEXT,
      is_correct INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      sport_type TEXT,
      team_a TEXT NOT NULL,
      team_b TEXT NOT NULL,
      team_a_logo TEXT,
      team_b_logo TEXT,
      start_time DATETIME,
      venue TEXT,
      status TEXT DEFAULT 'upcoming'
    );
  `);
  
  seedData();
  console.log('Database tables initialized.');
};

const seedData = () => {
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (catCount.count === 0) {
    db.exec(`
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

      INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes) VALUES
      ('quiz-1', 'study-zone', 'cat-1', 'SSC CGL Tier 1 Mock', 'Full syllabus mock test', 10, 10),
      ('quiz-2', 'study-zone', 'cat-1', 'SSC CHSL Mini Test', 'Quick test for English', 5, 5),
      ('quiz-g1', 'game-zone', 'cat-g1', 'CSK vs RCB Mega Contest', 'Predict players and outcomes', 11, 20);

      INSERT INTO questions (id, quiz_id, question_text) VALUES
      ('q-1', 'quiz-1', 'Who is the author of "The God of Small Things"?'),
      ('q-2', 'quiz-1', 'What is the SI unit of electric current?'),
      ('q-3', 'quiz-g1', 'Who will score the most runs?'),
      ('q-4', 'quiz-g1', 'Who will take the most wickets in powerplay?');
    `);
    console.log('Database seeded with initial categories, matches, and quizzes.');
  }
};

module.exports = {
  db,
  initDB
};
