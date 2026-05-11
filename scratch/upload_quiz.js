
const { db } = require('../api/_src/config/db');
// We'll use crypto.randomUUID() if uuid is not available or just use crypto
const crypto = require('crypto');
const v4 = () => crypto.randomUUID();

async function uploadQuiz() {
    try {
        console.log('Starting quiz upload...');
        
        // 1. Create a Match for Today
        const matchId = v4();
        const startTime = new Date().toISOString();
        await db.query(
            "INSERT INTO matches (id, sport_type, team_a, team_b, team_a_logo, team_b_logo, start_time, venue, hindi_team_a, hindi_team_b, hindi_venue, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            [matchId, 'Cricket', 'GT', 'PBKS', 'GT', 'PBKS', startTime, 'Ahmedabad', 'गुजरात टाइटन्स', 'पंजाब किंग्स', 'अहमदाबाद', 'live']
        );
        console.log('Match created:', matchId);

        // 2. Create the Quiz
        const quizId = v4();
        const openAt = new Date().toISOString();
        const closeAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours later
        
        await db.query(
            "INSERT INTO quizzes (id, zone_id, category_id, match_id, title, hindi_title, description, hindi_description, total_questions, timer_minutes, entry_amount, open_at, close_at, status, marks_per_q) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
            [quizId, 'sport-zone', 'cat-g2', matchId, 'GT vs PBKS Match Quiz', 'GT बनाम PBKS मैच क्विज', 'Predict and answer about the live match', 'लाइव मैच के बारे में भविष्यवाणी करें और उत्तर दें', 11, 10, 0, openAt, closeAt, 'active', 2]
        );
        console.log('Quiz created:', quizId);

        const questions = [
            {
                en: "Which team won the match?",
                hi: "मैच किस टीम ने जीता?",
                options: [
                    { en: "GT", hi: "GT" },
                    { en: "PBKS", hi: "PBKS" },
                    { en: "Match Tied", hi: "मैच टाई" },
                    { en: "No Result", hi: "कोई परिणाम नहीं" }
                ]
            },
            {
                en: "Which team scored more runs in the powerplay overs?",
                hi: "पावरप्ले में किस टीम ने ज्यादा रन बनाए?",
                options: [
                    { en: "GT", hi: "GT" },
                    { en: "PBKS", hi: "PBKS" },
                    { en: "Both Equal", hi: "दोनों बराबर" },
                    { en: "None", hi: "कोई नहीं" }
                ]
            },
            {
                en: "Who was the highest run scorer in match?",
                hi: "मैच में सबसे ज्यादा रन किसने बनाए?",
                options: [
                    { en: "Shubman Gill", hi: "शुभमन गिल" },
                    { en: "Shikhar Dhawan", hi: "शिखर धवन" },
                    { en: "Sai Sudharsan", hi: "साई सुदर्शन" },
                    { en: "Liam Livingstone", hi: "लियाम लिविंगस्टोन" }
                ]
            },
            {
                en: "Who was the second highest run scorer in match?",
                hi: "मैच में दूसरे सबसे ज्यादा रन किसने बनाए?",
                options: [
                    { en: "Shubman Gill", hi: "शुभमन गिल" },
                    { en: "Shikhar Dhawan", hi: "शिखर धवन" },
                    { en: "Sai Sudharsan", hi: "साई सुदर्शन" },
                    { en: "Liam Livingstone", hi: "लियाम लिविंगस्टोन" }
                ]
            },
            {
                en: "Which player took the most wickets in match?",
                hi: "मैच में सबसे ज्यादा विकेट किसने लिए?",
                options: [
                    { en: "Rashid Khan", hi: "राशिद खान" },
                    { en: "Kagiso Rabada", hi: "कगीसो रबाडा" },
                    { en: "Mohit Sharma", hi: "मोहित शर्मा" },
                    { en: "Arshdeep Singh", hi: "अर्शदीप सिंह" }
                ]
            },
            {
                en: "Who was awarded Man of the Match?",
                hi: "मैन ऑफ द मैच किसे मिला?",
                options: [
                    { en: "Shubman Gill", hi: "शुभमन गिल" },
                    { en: "Rashid Khan", hi: "राशिद खान" },
                    { en: "Sam Curran", hi: "सैम करन" },
                    { en: "Shikhar Dhawan", hi: "शिखर धवन" }
                ]
            },
            {
                en: "Which player hit the most sixes in match?",
                hi: "मैच में सबसे ज्यादा छक्के किसने लगाए?",
                options: [
                    { en: "David Miller", hi: "डेविड मिलर" },
                    { en: "Liam Livingstone", hi: "लियाम लिविंगस्टोन" },
                    { en: "Shubman Gill", hi: "शुभमन गिल" },
                    { en: "Sam Curran", hi: "सैम करन" }
                ]
            },
            {
                en: "Which player hit the most fours in match?",
                hi: "मैच में सबसे ज्यादा चौके किसने लगाए?",
                options: [
                    { en: "Shikhar Dhawan", hi: "शिखर धवन" },
                    { en: "Shubman Gill", hi: "शुभमन गिल" },
                    { en: "Sai Sudharsan", hi: "साई सुदर्शन" },
                    { en: "Prabhsimran Singh", hi: "प्रभसिमरन सिंह" }
                ]
            },
            {
                en: "Which player got out after facing the fewest balls?",
                hi: "सबसे कम गेंद खेलकर कौन सा खिलाड़ी आउट हुआ?",
                options: [
                    { en: "Vijay Shankar", hi: "विजय शंकर" },
                    { en: "Jitesh Sharma", hi: "जितेश शर्मा" },
                    { en: "Rahul Tewatia", hi: "राहुल तेवतिया" },
                    { en: "Sikandar Raza", hi: "सिकंदर रजा" }
                ]
            },
            {
                en: "Which player scored 50 or more runs in match?",
                hi: "मैच में किस खिलाड़ी ने 50 या उससे ज्यादा रन बनाए?",
                options: [
                    { en: "Shubman Gill", hi: "शुभमन गिल" },
                    { en: "Shikhar Dhawan", hi: "शिखर धवन" },
                    { en: "Both", hi: "दोनों" },
                    { en: "None", hi: "कोई नहीं" }
                ]
            },
            {
                en: "Which player had the highest strike rate in match?",
                hi: "मैच में सबसे अच्छा स्ट्राइक रेट किस खिलाड़ी का रहा?",
                options: [
                    { en: "Rahul Tewatia", hi: "राहुल तेवतिया" },
                    { en: "Liam Livingstone", hi: "लियाम लिविंगस्टोन" },
                    { en: "David Miller", hi: "डेविड मिलर" },
                    { en: "Rashid Khan", hi: "राशिद खान" }
                ]
            }
        ];

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const qId = v4();
            
            // Insert Question
            await db.query(
                "INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, marks, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
                [qId, quizId, q.en, q.hi, 2, i]
            );

            // Insert Options
            for (let j = 0; j < q.options.length; j++) {
                const opt = q.options[j];
                const optId = v4();
                await db.query(
                    "INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value) VALUES ($1, $2, $3, $4, $5)",
                    [optId, qId, opt.en, opt.hi, j.toString()]
                );
            }

            // Insert Random Correct Answer
            const correctIndex = Math.floor(Math.random() * 4);
            const ansId = v4();
            await db.query(
                "INSERT INTO correct_answers (id, question_id, answer_value) VALUES ($1, $2, $3)",
                [ansId, qId, correctIndex.toString()]
            );
        }

        console.log('All 11 questions uploaded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error uploading quiz:', error);
        process.exit(1);
    }
}

uploadQuiz();
