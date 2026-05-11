const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.resolve(__dirname, 'play11.db');
const db = new Database(dbPath, { verbose: console.log });

const runSeed = () => {
  console.log('Starting robust database seeding...');

  // 1. Clear existing data (Optional, but good for clean state)
  db.exec('DELETE FROM questions');
  db.exec('DELETE FROM quizzes');
  db.exec('DELETE FROM categories');
  db.exec('DELETE FROM matches');
  db.exec('DELETE FROM submissions');
  db.exec('DELETE FROM submission_answers');

  console.log('Cleared existing data.');

  // 2. Insert Study Categories
  const studyCategories = [
    { id: 'cat-ssc', zone: 'study-zone', name: 'SSC Exams', sort: 1 },
    { id: 'cat-upsc', zone: 'study-zone', name: 'UPSC Civil Services', sort: 2 },
    { id: 'cat-bank', zone: 'study-zone', name: 'Banking & IBPS', sort: 3 },
    { id: 'cat-rail', zone: 'study-zone', name: 'Railway Recruit', sort: 4 },
    { id: 'cat-def', zone: 'study-zone', name: 'Defense (NDA/CDS)', sort: 5 },
    { id: 'cat-teach', zone: 'study-zone', name: 'Teaching Exams', sort: 6 },
    { id: 'cat-bpsc', zone: 'study-zone', name: 'BPSC (Bihar)', sort: 7 },
    { id: 'cat-uppsc', zone: 'study-zone', name: 'UPPSC (Uttar Pradesh)', sort: 8 },
    { id: 'cat-gate', zone: 'study-zone', name: 'GATE/Engineering', sort: 9 },
    { id: 'cat-neet', zone: 'study-zone', name: 'Medical/NEET', sort: 10 }
  ];

  const catStmt = db.prepare('INSERT INTO categories (id, zone_id, name, sort_order) VALUES (?, ?, ?, ?)');
  studyCategories.forEach(c => catStmt.run(c.id, c.zone, c.name, c.sort));

  // 3. Insert Game Categories
  const gameCategories = [
    { id: 'cat-ipl', zone: 'game-zone', name: 'IPL Mega Contest', sort: 1 },
    { id: 'cat-t20', zone: 'game-zone', name: 'International T20', sort: 2 },
    { id: 'cat-tests', zone: 'game-zone', name: 'Test Cricket Mastery', sort: 3 },
    { id: 'cat-player', zone: 'game-zone', name: 'Player of the Match', sort: 4 },
    { id: 'cat-football', zone: 'game-zone', name: 'Football Elite', sort: 5 }
  ];
  gameCategories.forEach(c => catStmt.run(c.id, c.zone, c.name, c.sort));

  // 4. Insert Matches
  const matches = [
    { id: 'm-1', sport: 'Cricket', a: 'MI', b: 'CSK', date: '2026-04-15 19:30:00', venue: 'Wankhede, Mumbai' },
    { id: 'm-2', sport: 'Cricket', a: 'RCB', b: 'KKR', date: '2026-04-16 19:30:00', venue: 'Chinnaswamy, Bengaluru' },
    { id: 'm-3', sport: 'Cricket', a: 'GT', b: 'DC', date: '2026-04-17 19:30:00', venue: 'Narendra Modi Stadium' },
    { id: 'm-4', sport: 'Cricket', a: 'RR', b: 'LSG', date: '2026-04-18 19:30:00', venue: 'Sawai Mansingh Stadium' },
    { id: 'm-5', sport: 'Cricket', a: 'PBKS', b: 'SRH', date: '2026-04-19 19:30:00', venue: 'Chandigarh' },
    { id: 'm-6', sport: 'Cricket', a: 'MI', b: 'RCB', date: '2026-04-20 19:30:00', venue: 'Wankhede, Mumbai' },
    { id: 'm-7', sport: 'Football', a: 'Real Madrid', b: 'Barcelona', date: '2026-04-21 21:00:00', venue: 'Bernabéu' }
  ];
  const matchStmt = db.prepare('INSERT INTO matches (id, sport_type, team_a, team_b, start_time, venue) VALUES (?, ?, ?, ?, ?, ?)');
  matches.forEach(m => matchStmt.run(m.id, m.sport, m.a, m.b, m.date, m.venue));

  // 5. Insert Quizzes & Questions
  const quizStmt = db.prepare('INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const qStmt = db.prepare('INSERT INTO questions (id, quiz_id, question_text, type) VALUES (?, ?, ?, ?)');

  // Data for SSC
  quizStmt.run('quiz-ssc-1', 'study-zone', 'cat-ssc', 'SSC CGL General Awareness', '10 Questions from previous papers', 10, 10);
  const sscQ = [
    'Who was the first Governor-General of Bengal?',
    'The "Quit India Movement" was started in which year?',
    'What is the capital of Kazakhstan?',
    'Which article of Indian Constitution deals with Fundamental Duties?',
    'Who is the current CEO of Microsoft?'
  ];
  sscQ.forEach((text, i) => qStmt.run(`q-ssc-${i}`, 'quiz-ssc-1', text, 'multiple-choice'));

  // Data for BPSC
  quizStmt.run('quiz-bpsc-1', 'study-zone', 'cat-bpsc', 'Bihar History & Geography', 'Focused on 70th BPSC Prelims', 20, 15);
  const bpscQ = [
    'In which year was the state of Bihar created?',
    'Who was the leader of the 1857 revolt in Bihar?',
    'Which river is known as the "Sorrow of Bihar"?',
    'Where was the first Buddhist Council held?',
    'Who founded the city of Patliputra?'
  ];
  bpscQ.forEach((text, i) => qStmt.run(`q-bpsc-${i}`, 'quiz-bpsc-1', text, 'multiple-choice'));

  // Data for IPL Game
  quizStmt.run('quiz-game-1', 'game-zone', 'cat-ipl', 'MI vs CSK Prediction Contest', 'Win exclusive rewards by predicting outcomes', 11, 30);
  const iplQ = [
    'Who will win the toss today?',
    'Which team will hit the most sixes?',
    'Will there be a century in the match?',
    'Who will be the Player of the Match?',
    'Which bowler will take the most wickets in death overs?'
  ];
  iplQ.forEach((text, i) => qStmt.run(`q-game-${i}`, 'quiz-game-1', text, 'prediction'));

  // Data for GATE
  quizStmt.run('quiz-gate-1', 'study-zone', 'cat-gate', 'Engineering Mathematics Prep', 'Essential for all branches', 15, 20);
  const gateQ = [
    'What is the rank of a singular matrix?',
    'Define the Divergence of a vector field.',
    'What is the Laplace transform of sin(at)?',
    'Calculate the Eigenvalues of a 2x2 identity matrix.',
    'Mention the formula for Taylor series expansion.'
  ];
  gateQ.forEach((text, i) => qStmt.run(`q-gate-${i}`, 'quiz-gate-1', text, 'multiple-choice'));

  // 6. Seed Submissions (for History)
  const subStmt = db.prepare('INSERT INTO submissions (id, user_id, quiz_id, status, total_score) VALUES (?, ?, ?, ?, ?)');
  subStmt.run('sub-1', 'test-user', 'quiz-ssc-1', 'completed', 80);
  subStmt.run('sub-2', 'test-user', 'quiz-gate-1', 'completed', 45);
  subStmt.run('sub-3', 'test-user', 'quiz-game-1', 'completed', 0);

  console.log('Database seeding complete successfully!');
  db.close();
};

runSeed();
