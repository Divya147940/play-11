const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const quizData = {
  id: uuidv4(),
  title: 'Bollywood Blockbuster Trivia',
  hindi_title: 'बॉलीवुड ब्लॉकबस्टर ट्रिविया',
  description: 'Test your knowledge of Indian cinema with this exciting 10-question battle!',
  hindi_description: 'भारतीय सिनेमा के अपने ज्ञान का परीक्षण करें इस रोमांचक 10-प्रश्नों वाली लड़ाई के साथ!',
  zone_id: 'movie-zone',
  category_id: 'movies',
  status: 'active',
  timer_minutes: 8,
  total_questions: 10,
  entry_amount: 10,
  reward_text: '₹500 Pool',
  open_at: new Date(),
  close_at: new Date(Date.now() + 3600000), // 1 hour from now
  marks_per_q: 1,
  negative_marks: 0
};

const questions = [
  {
    q: "Which movie features the character Rancho?",
    hq: "किस फिल्म में “रैंचो” किरदार है?",
    options: [
      { text: "3 Idiots", htext: "3 इडियट्स", val: "A" },
      { text: "PK", htext: "पीके", val: "B" },
      { text: "Dangal", htext: "दंगल", val: "C" },
      { text: "Chhichhore", htext: "छिछोरे", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Who directed “Baahubali: The Beginning”?",
    hq: "“बाहुबली: द बिगिनिंग” के निर्देशक कौन हैं?",
    options: [
      { text: "Karan Johar", htext: "करण जौहर", val: "A" },
      { text: "Rajkumar Hirani", htext: "राजकुमार हिरानी", val: "B" },
      { text: "S. S. Rajamouli", htext: "एस. एस. राजामौली", val: "C" },
      { text: "Rohit Shetty", htext: "रोहित शेट्टी", val: "D" }
    ],
    answer: "C"
  },
  {
    q: "In which movie did Shah Rukh Khan play a hockey coach?",
    hq: "किस फिल्म में शाहरुख खान ने हॉकी कोच का रोल किया?",
    options: [
      { text: "Swades", htext: "स्वदेस", val: "A" },
      { text: "Chak De! India", htext: "चक दे! इंडिया", val: "B" },
      { text: "Raees", htext: "रईस", val: "C" },
      { text: "Fan", htext: "फैन", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Which movie is based on Mahavir Singh Phogat?",
    hq: "कौन सी फिल्म महावीर सिंह फोगाट पर आधारित है?",
    options: [
      { text: "Sultan", htext: "सुल्तान", val: "A" },
      { text: "Dangal", htext: "दंगल", val: "B" },
      { text: "Mary Kom", htext: "मैरी कॉम", val: "C" },
      { text: "Bhaag Milkha Bhaag", htext: "भाग मिल्कहा भाग", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Who played Sanjay Dutt in “Sanju”?",
    hq: "“संजू” में संजय दत्त का किरदार किसने निभाया?",
    options: [
      { text: "Ranveer Singh", htext: "रणवीर सिंह", val: "A" },
      { text: "Ranbir Kapoor", htext: "रणबीर कपूर", val: "B" },
      { text: "Shahid Kapoor", htext: "शाहिद कपूर", val: "C" },
      { text: "Vicky Kaushal", htext: "विक्की कौशल", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "“How’s the josh?” is from which movie?",
    hq: "“हाउज़ द जोश?” किस फिल्म का डायलॉग है?",
    options: [
      { text: "War", htext: "वॉर", val: "A" },
      { text: "URI: The Surgical Strike", htext: "उरी", val: "B" },
      { text: "Shershaah", htext: "शेरशाह", val: "C" },
      { text: "Border", htext: "बॉर्डर", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Who is the lead actress in “Queen”?",
    hq: "“क्वीन” फिल्म की मुख्य अभिनेत्री कौन है?",
    options: [
      { text: "Deepika Padukone", htext: "दीपिका पादुकोण", val: "A" },
      { text: "Alia Bhatt", htext: "आलिया भट्ट", val: "B" },
      { text: "Kangana Ranaut", htext: "कंगना रनौत", val: "C" },
      { text: "Katrina Kaif", htext: "कैटरीना कैफ", val: "D" }
    ],
    answer: "C"
  },
  {
    q: "“Kala Chashma” song is from which movie?",
    hq: "“काला चश्मा” गाना किस फिल्म में है?",
    options: [
      { text: "Baar Baar Dekho", htext: "बार बार देखो", val: "A" },
      { text: "Kapoor & Sons", htext: "कपूर एंड सन्स", val: "B" },
      { text: "Student of the Year", htext: "स्टूडेंट ऑफ द ईयर", val: "C" },
      { text: "Ae Dil Hai Mushkil", htext: "ऐ दिल है मुश्किल", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Who played Kabir Singh?",
    hq: "“कबीर सिंह” का किरदार किसने निभाया?",
    options: [
      { text: "Ranbir Kapoor", htext: "रणबीर कपूर", val: "A" },
      { text: "Shahid Kapoor", htext: "शाहिद कपूर", val: "B" },
      { text: "Ayushmann Khurrana", htext: "आयुष्मान खुराना", val: "C" },
      { text: "Varun Dhawan", htext: "वरुण धवन", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Which was the first Indian movie to win an Oscar (Honorary)?",
    hq: "ऑस्कर (मानद) जीतने वाली पहली भारतीय फिल्म कौन सी थी?",
    options: [
      { text: "Mother India", htext: "मदर इंडिया", val: "A" },
      { text: "Slumdog Millionaire", htext: "स्लमडॉग मिलियनेयर", val: "B" },
      { text: "Gandhi", htext: "गांधी", val: "C" },
      { text: "RRR", htext: "आरआरआर", val: "D" }
    ],
    answer: "C"
  }
];

async function createQuiz() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert Quiz
    const quizQuery = `
      INSERT INTO quizzes (
        id, title, hindi_title, description, hindi_description, 
        zone_id, category_id, status, timer_minutes, total_questions, 
        entry_amount, reward_text, open_at, close_at, marks_per_q, negative_marks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;
    await client.query(quizQuery, [
      quizData.id, quizData.title, quizData.hindi_title, quizData.description, quizData.hindi_description,
      quizData.zone_id, quizData.category_id, quizData.status, quizData.timer_minutes, quizData.total_questions,
      quizData.entry_amount, quizData.reward_text, quizData.open_at, quizData.close_at, quizData.marks_per_q, quizData.negative_marks
    ]);

    for (let qData of questions) {
      const qId = uuidv4();
      
      // Insert Question
      const qQuery = `
        INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, type)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(qQuery, [qId, quizData.id, qData.q, qData.hq, 'mcq']);

      // Insert Options
      for (let opt of qData.options) {
        const oId = uuidv4();
        const oQuery = `
          INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value)
          VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(oQuery, [oId, qId, opt.text, opt.htext, opt.val]);
      }

      // Insert Correct Answer
      const aId = uuidv4();
      const aQuery = `
        INSERT INTO correct_answers (id, question_id, answer_value)
        VALUES ($1, $2, $3)
      `;
      await client.query(aQuery, [aId, qId, qData.answer]);
    }

    await client.query('COMMIT');
    console.log('Quiz created successfully with ID:', quizData.id);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating quiz:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

createQuiz();
