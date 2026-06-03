<?php
date_default_timezone_set('Asia/Kolkata');
putenv("DATABASE_URL=postgresql://postgres:postgres@localhost:5432/play11?sslmode=disable");
$_ENV['DATABASE_URL'] = "postgresql://postgres:postgres@localhost:5432/play11?sslmode=disable";

require_once dirname(__DIR__) . '/api/config/db.php';

function local_guidv4() {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

try {
    $pdo = DB::getPdo();
    
    // Clear existing quizzes, questions, options, correct_answers to start fresh
    echo "Clearing existing quiz data...\n";
    $pdo->exec("TRUNCATE TABLE correct_answers CASCADE");
    $pdo->exec("TRUNCATE TABLE question_options CASCADE");
    $pdo->exec("TRUNCATE TABLE questions CASCADE");
    $pdo->exec("TRUNCATE TABLE quizzes CASCADE");
    
    $now = time();
    $twoHoursAgo = date('Y-m-d H:i:s', $now - 7200);
    $twoHoursLater = date('Y-m-d H:i:s', $now + 7200);
    $oneHourLater = date('Y-m-d H:i:s', $now + 3600);
    $threeHoursLater = date('Y-m-d H:i:s', $now + 10800);
    $oneHourAgo = date('Y-m-d H:i:s', $now - 3600);
    $fiveHoursLater = date('Y-m-d H:i:s', $now + 18000);
    $twoDaysAgo = date('Y-m-d H:i:s', $now - 172800);
    $oneDayAgo = date('Y-m-d H:i:s', $now - 86400);

    $mockQuizzes = [
        [
            'id' => 'q-live-ssc',
            'zone_id' => 'study-zone',
            'category_id' => 'cat-1',
            'title' => 'SSC General Awareness Live Battle',
            'description' => 'Test your knowledge on general awareness and history in this live battle.',
            'total_questions' => 2,
            'timer_minutes' => 5,
            'status' => 'active',
            'reward_text' => '₹100 Prize Pool',
            'prize_amount' => 100,
            'entry_type' => 'free',
            'open_at' => $twoHoursAgo,
            'close_at' => $twoHoursLater,
            'questions' => [
                [
                    'text' => 'Who was the first Prime Minister of India?',
                    'hindi_text' => 'भारत के पहले प्रधानमंत्री कौन थे?',
                    'options' => [
                        ['text' => 'Jawaharlal Nehru', 'hindi' => 'जवाहरलाल नेहरू', 'value' => 'A'],
                        ['text' => 'Mahatma Gandhi', 'hindi' => 'महात्मा गांधी', 'value' => 'B'],
                        ['text' => 'Subhas Chandra Bose', 'hindi' => 'सुभाष चंद्र बोस', 'value' => 'C'],
                        ['text' => 'Sardar Patel', 'hindi' => 'सरदार पटेल', 'value' => 'D'],
                    ],
                    'correct' => 'A'
                ],
                [
                    'text' => 'What is the capital of France?',
                    'hindi_text' => 'फ्रांस की राजधानी क्या है?',
                    'options' => [
                        ['text' => 'London', 'hindi' => 'लंदन', 'value' => 'A'],
                        ['text' => 'Paris', 'hindi' => 'पेरिस', 'value' => 'B'],
                        ['text' => 'Berlin', 'hindi' => 'बर्लिन', 'value' => 'C'],
                        ['text' => 'Rome', 'hindi' => 'रोम', 'value' => 'D'],
                    ],
                    'correct' => 'B'
                ]
            ]
        ],
        [
            'id' => 'q-upcoming-ssc',
            'zone_id' => 'study-zone',
            'category_id' => 'cat-1',
            'title' => 'SSC Quantitative Aptitude Premium Quiz',
            'description' => 'A challenging quantitative aptitude quiz with premium cash rewards.',
            'total_questions' => 2,
            'timer_minutes' => 10,
            'status' => 'active',
            'reward_text' => '₹500 Grand Prize',
            'prize_amount' => 500,
            'entry_type' => 'paid',
            'entry_amount' => 10,
            'open_at' => $oneHourLater,
            'close_at' => $threeHoursLater,
            'questions' => [
                [
                    'text' => 'Solve: 15 * 8 - 40 / 5 = ?',
                    'hindi_text' => 'हल करें: 15 * 8 - 40 / 5 = ?',
                    'options' => [
                        ['text' => '112', 'hindi' => '112', 'value' => 'A'],
                        ['text' => '120', 'hindi' => '120', 'value' => 'B'],
                        ['text' => '110', 'hindi' => '110', 'value' => 'C'],
                        ['text' => '96', 'hindi' => '96', 'value' => 'D'],
                    ],
                    'correct' => 'A'
                ],
                [
                    'text' => 'What is the square root of 625?',
                    'hindi_text' => '625 का वर्गमूल क्या है?',
                    'options' => [
                        ['text' => '15', 'hindi' => '15', 'value' => 'A'],
                        ['text' => '25', 'hindi' => '25', 'value' => 'B'],
                        ['text' => '35', 'hindi' => '35', 'value' => 'C'],
                        ['text' => '45', 'hindi' => '45', 'value' => 'D'],
                    ],
                    'correct' => 'B'
                ]
            ]
        ],
        [
            'id' => 'q-live-ipl',
            'zone_id' => 'sport-zone',
            'category_id' => 'cat-g1',
            'title' => 'IPL 2026 Season T20 Challenge',
            'description' => 'Are you a die-hard cricket fan? Prove it in this IPL T20 quiz battle.',
            'total_questions' => 2,
            'timer_minutes' => 5,
            'status' => 'active',
            'reward_text' => '₹250 Cash Pool',
            'prize_amount' => 250,
            'entry_type' => 'free',
            'open_at' => $oneHourAgo,
            'close_at' => $fiveHoursLater,
            'questions' => [
                [
                    'text' => 'Which team won the IPL in 2024?',
                    'hindi_text' => 'किस टीम ने 2024 में आईपीएल जीता?',
                    'options' => [
                        ['text' => 'KKR', 'hindi' => 'केकेआर', 'value' => 'A'],
                        ['text' => 'SRH', 'hindi' => 'एसआरएच', 'value' => 'B'],
                        ['text' => 'RCB', 'hindi' => 'आरसीबी', 'value' => 'C'],
                        ['text' => 'MI', 'hindi' => 'एमआई', 'value' => 'D'],
                    ],
                    'correct' => 'A'
                ],
                [
                    'text' => 'Who is known as the "Run Machine" in cricket?',
                    'hindi_text' => '"रन मशीन" के रूप में किसे जाना जाता है?',
                    'options' => [
                        ['text' => 'Rohit Sharma', 'hindi' => 'रोहित शर्मा', 'value' => 'A'],
                        ['text' => 'MS Dhoni', 'hindi' => 'एमएस धोनी', 'value' => 'B'],
                        ['text' => 'Virat Kohli', 'hindi' => 'विराट कोहली', 'value' => 'C'],
                        ['text' => 'Sachin Tendulkar', 'hindi' => 'सचिन तेंदुलकर', 'value' => 'D'],
                    ],
                    'correct' => 'C'
                ]
            ]
        ],
        [
            'id' => 'q-comp-gk',
            'zone_id' => 'study-zone',
            'category_id' => 'cat-1',
            'title' => 'GK History Warm-up Quiz (Completed)',
            'description' => 'Review the history questions from yesterday.',
            'total_questions' => 2,
            'timer_minutes' => 5,
            'status' => 'completed',
            'reward_text' => '₹150 Cash Pool',
            'prize_amount' => 150,
            'entry_type' => 'free',
            'open_at' => $twoDaysAgo,
            'close_at' => $oneDayAgo,
            'questions' => [
                [
                    'text' => 'In which year did India get Independence?',
                    'hindi_text' => 'भारत को किस वर्ष स्वतंत्रता मिली?',
                    'options' => [
                        ['text' => '1945', 'hindi' => '1945', 'value' => 'A'],
                        ['text' => '1947', 'hindi' => '1947', 'value' => 'B'],
                        ['text' => '1950', 'hindi' => '1950', 'value' => 'C'],
                        ['text' => '1952', 'hindi' => '1952', 'value' => 'D'],
                    ],
                    'correct' => 'B'
                ],
                [
                    'text' => 'Which planet is known as the Red Planet?',
                    'hindi_text' => 'किस ग्रह को लाल ग्रह के नाम से जाना जाता है?',
                    'options' => [
                        ['text' => 'Earth', 'hindi' => 'पृथ्वी', 'value' => 'A'],
                        ['text' => 'Venus', 'hindi' => 'शुक्र', 'value' => 'B'],
                        ['text' => 'Mars', 'hindi' => 'मंगल', 'value' => 'C'],
                        ['text' => 'Jupiter', 'hindi' => 'बृहस्पति', 'value' => 'D'],
                    ],
                    'correct' => 'C'
                ]
            ]
        ]
    ];

    foreach ($mockQuizzes as $qData) {
        echo "Inserting quiz: " . $qData['title'] . "\n";
        DB::query("
            INSERT INTO quizzes (id, zone_id, category_id, title, description, total_questions, timer_minutes, status, reward_text, prize_amount, entry_type, entry_amount, open_at, close_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ", [
            $qData['id'],
            $qData['zone_id'],
            $qData['category_id'],
            $qData['title'],
            $qData['description'],
            $qData['total_questions'],
            $qData['timer_minutes'],
            $qData['status'],
            $qData['reward_text'],
            $qData['prize_amount'],
            $qData['entry_type'],
            $qData['entry_amount'] ?? 0,
            $qData['open_at'],
            $qData['close_at']
        ]);

        foreach ($qData['questions'] as $idx => $q) {
            $qId = local_guidv4();
            DB::query("
                INSERT INTO questions (id, quiz_id, question_text, hindi_question_text, sort_order)
                VALUES (?, ?, ?, ?, ?)
            ", [
                $qId,
                $qData['id'],
                $q['text'],
                $q['hindi_text'],
                $idx
            ]);

            foreach ($q['options'] as $opt) {
                $optId = local_guidv4();
                DB::query("
                    INSERT INTO question_options (id, question_id, option_text, hindi_option_text, option_value)
                    VALUES (?, ?, ?, ?, ?)
                ", [
                    $optId,
                    $qId,
                    $opt['text'],
                    $opt['hindi'],
                    $opt['value']
                ]);
            }

            $ansId = local_guidv4();
            DB::query("
                INSERT INTO correct_answers (id, question_id, answer_value)
                VALUES (?, ?, ?)
            ", [
                $ansId,
                $qId,
                $q['correct']
            ]);
        }
    }

    echo "Successfully seeded mock quizzes, questions, options, and correct answers!\n";
} catch (Exception $e) {
    echo "Error seeding mock quizzes: " . $e->getMessage() . "\n";
}
