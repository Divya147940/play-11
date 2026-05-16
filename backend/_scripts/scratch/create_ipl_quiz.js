const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const quizData = {
  id: uuidv4(),
  title: 'IPL Match Quiz',
  hindi_title: 'आईपीएल मैच क्विज़',
  description: 'Answer questions based on the latest IPL match and win exciting rewards!',
  hindi_description: 'नवीनतम आईपीएल मैच पर आधारित प्रश्नों का उत्तर दें और रोमांचक पुरस्कार जीतें!',
  zone_id: 'sport-zone',
  category_id: 'sports',
  status: 'active',
  timer_minutes: 8,
  total_questions: 11,
  entry_amount: 10,
  reward_text: '₹500 Pool',
  open_at: new Date(Date.now() - 10 * 60000),          // opened 10 min ago
  close_at: new Date(Date.now() + 10 * 3600000),        // closes in 10 hours
  marks_per_q: 1,
  negative_marks: 0
};

const questions = [
  {
    q: "Which team won the match?",
    hq: "मैच किस टीम ने जीता?",
    options: [
      { text: "Mumbai Indians", htext: "मुंबई इंडियंस", val: "A" },
      { text: "Chennai Super Kings", htext: "चेन्नई सुपर किंग्स", val: "B" },
      { text: "Royal Challengers Bangalore", htext: "रॉयल चैलेंजर्स बैंगलोर", val: "C" },
      { text: "Kolkata Knight Riders", htext: "कोलकाता नाइट राइडर्स", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Which team scored more runs in the powerplay overs?",
    hq: "पावरप्ले में किस टीम ने ज्यादा रन बनाए?",
    options: [
      { text: "Mumbai Indians", htext: "मुंबई इंडियंस", val: "A" },
      { text: "Chennai Super Kings", htext: "चेन्नई सुपर किंग्स", val: "B" },
      { text: "Royal Challengers Bangalore", htext: "रॉयल चैलेंजर्स बैंगलोर", val: "C" },
      { text: "Kolkata Knight Riders", htext: "कोलकाता नाइट राइडर्स", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Who was the highest run scorer in match?",
    hq: "मैच में सबसे ज्यादा रन किसने बनाए?",
    options: [
      { text: "Virat Kohli", htext: "विराट कोहली", val: "A" },
      { text: "Rohit Sharma", htext: "रोहित शर्मा", val: "B" },
      { text: "Ruturaj Gaikwad", htext: "रुतुराज गायकवाड़", val: "C" },
      { text: "Shubman Gill", htext: "शुबमन गिल", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Who was the second highest run scorer in match?",
    hq: "मैच में दूसरे सबसे ज्यादा रन किसने बनाए?",
    options: [
      { text: "Rohit Sharma", htext: "रोहित शर्मा", val: "A" },
      { text: "KL Rahul", htext: "केएल राहुल", val: "B" },
      { text: "Suryakumar Yadav", htext: "सूर्यकुमार यादव", val: "C" },
      { text: "Faf du Plessis", htext: "फाफ डु प्लेसिस", val: "D" }
    ],
    answer: "C"
  },
  {
    q: "Which player took the most wickets in match?",
    hq: "मैच में सबसे ज्यादा विकेट किसने लिए?",
    options: [
      { text: "Jasprit Bumrah", htext: "जसप्रीत बुमराह", val: "A" },
      { text: "Ravindra Jadeja", htext: "रवींद्र जडेजा", val: "B" },
      { text: "Mohammed Siraj", htext: "मोहम्मद सिराज", val: "C" },
      { text: "Yuzvendra Chahal", htext: "युजवेंद्र चहल", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Who was awarded Man of the Match?",
    hq: "मैन ऑफ द मैच किसे मिला?",
    options: [
      { text: "Virat Kohli", htext: "विराट कोहली", val: "A" },
      { text: "Jasprit Bumrah", htext: "जसप्रीत बुमराह", val: "B" },
      { text: "MS Dhoni", htext: "एमएस धोनी", val: "C" },
      { text: "Rohit Sharma", htext: "रोहित शर्मा", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Which player hit the most sixes in match?",
    hq: "मैच में सबसे ज्यादा छक्के किसने लगाए?",
    options: [
      { text: "Hardik Pandya", htext: "हार्दिक पांड्या", val: "A" },
      { text: "MS Dhoni", htext: "एमएस धोनी", val: "B" },
      { text: "Suryakumar Yadav", htext: "सूर्यकुमार यादव", val: "C" },
      { text: "Andre Russell", htext: "आंद्रे रसेल", val: "D" }
    ],
    answer: "D"
  },
  {
    q: "Which player hit the most fours in match?",
    hq: "मैच में सबसे ज्यादा चौके किसने लगाए?",
    options: [
      { text: "Virat Kohli", htext: "विराट कोहली", val: "A" },
      { text: "Shubman Gill", htext: "शुबमन गिल", val: "B" },
      { text: "Ruturaj Gaikwad", htext: "रुतुराज गायकवाड़", val: "C" },
      { text: "David Warner", htext: "डेविड वॉर्नर", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Which player got out after facing the fewest balls?",
    hq: "सबसे कम गेंद खेलकर कौन सा खिलाड़ी आउट हुआ?",
    options: [
      { text: "Tim David", htext: "टिम डेविड", val: "A" },
      { text: "Kieron Pollard", htext: "कीरोन पोलार्ड", val: "B" },
      { text: "Rashid Khan", htext: "राशिद खान", val: "C" },
      { text: "Rinku Singh", htext: "रिंकू सिंह", val: "D" }
    ],
    answer: "B"
  },
  {
    q: "Which player scored 50 or more runs in match?",
    hq: "मैच में किस खिलाड़ी ने 50 या उससे ज्यादा रन बनाए?",
    options: [
      { text: "Virat Kohli", htext: "विराट कोहली", val: "A" },
      { text: "Rohit Sharma", htext: "रोहित शर्मा", val: "B" },
      { text: "Both A and B", htext: "A और B दोनों", val: "C" },
      { text: "None of them", htext: "इनमें से कोई नहीं", val: "D" }
    ],
    answer: "A"
  },
  {
    q: "Which player had the highest strike rate in match?",
    hq: "मैच में सबसे अच्छा स्ट्राइक रेट किस खिलाड़ी का रहा?",
    options: [
      { text: "Suryakumar Yadav", htext: "सूर्यकुमार यादव", val: "A" },
      { text: "Andre Russell", htext: "आंद्रे रसेल", val: "B" },
      { text: "Hardik Pandya", htext: "हार्दिक पांड्या", val: "C" },
      { text: "MS Dhoni", htext: "एमएस धोनी", val: "D" }
    ],
    answer: "A"
  }
];

async function createQuiz() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const quizQuery = `
      INSERT INTO quizzes (
        id, title, hindi_title, description, hindi_description,
        zone_id, category_id, status, timer_minutes, total_questions,
        entry_amount, reward_text, open_at, close_at, marks_per_q, negative_marks
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    `;
    await client.query(quizQuery, [
      quizData.id, quizData.title, quizData.hindi_title,
      quizData.description, quizData.hindi_description,
      quizData.zone_id, quizData.category_id, quizData.status,
      quizData.timer_minutes, quizData.total_questions,
      quizData.entry_amount, quizData.reward_text,
      quizData.open_at, quizData.close_at,
      quizData.marks_per_q, quizData.negative_marks
    ]);

    for (let i = 0; i < questions.length; i++) {
      const qData = questions[i];
      const qId = uuidv4();

      await client.query(
        `INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, type, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [qId, quizData.id, qData.q, qData.hq, 'mcq', i + 1]
      );

      for (let opt of qData.options) {
        await client.query(
          `INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value)
           VALUES ($1,$2,$3,$4,$5)`,
          [uuidv4(), qId, opt.text, opt.htext, opt.val]
        );
      }

      await client.query(
        `INSERT INTO correct_answers (id, question_id, answer_value)
         VALUES ($1,$2,$3)`,
        [uuidv4(), qId, qData.answer]
      );
    }

    await client.query('COMMIT');
    console.log('✅ IPL Match Quiz created successfully!');
    console.log('Quiz ID:', quizData.id);
    console.log('Zone: sport-zone | Status: LIVE | Questions:', questions.length);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating quiz:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createQuiz();
