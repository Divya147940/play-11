<?php
require_once __DIR__ . '/dotenv.php';

// Load environment variables from the parent or current directory
loadDotenv(dirname(__DIR__, 2) . '/.env');
loadDotenv(dirname(__DIR__) . '/.env');

$dbUrl = getenv('DATABASE_URL') ?: getenv('POSTGRES_URL');
$pdo = null;

if ($dbUrl && (strpos($dbUrl, 'postgres://') === 0 || strpos($dbUrl, 'postgresql://') === 0)) {
    // Parse PostgreSQL connection string
    $dbParts = parse_url($dbUrl);
    $host = $dbParts['host'];
    $port = isset($dbParts['port']) ? $dbParts['port'] : 5432;
    $user = $dbParts['user'];
    $pass = isset($dbParts['pass']) ? $dbParts['pass'] : '';
    $dbname = ltrim($dbParts['path'], '/');
    
    // Check if query parameter has sslmode or add it
    $sslmode = 'require';
    $optionsParam = '';
    if (isset($dbParts['query'])) {
        parse_str($dbParts['query'], $queryParts);
        if (isset($queryParts['sslmode'])) {
            $sslmode = $queryParts['sslmode'];
        }
        if (isset($queryParts['options'])) {
            $optionsParam = ";options='" . addslashes($queryParts['options']) . "'";
        }
    }

    // Automatically detect neon.tech and add options endpoint parameter if not already set
    if (empty($optionsParam) && strpos($host, 'neon.tech') !== false) {
        $hostParts = explode('.', $host);
        $endpointId = $hostParts[0];
        $optionsParam = ";options='endpoint=$endpointId'";
    }

    try {
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=$sslmode" . $optionsParam;
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => true, // Must be true for Postgres to avoid masking real errors with 25P02
        ]);
    } catch (PDOException $e) {
        error_log("PostgreSQL connection failed: " . $e->getMessage());
        http_response_code(500);
        die(json_encode(["error" => "Database connection failed", "message" => $e->getMessage()]));
    }
} elseif ($dbUrl && (strpos($dbUrl, 'mysql://') === 0 || strpos($dbUrl, 'mysqli://') === 0)) {
    // Parse MySQL connection string
    $dbParts = parse_url($dbUrl);
    $host = $dbParts['host'];
    $port = isset($dbParts['port']) ? $dbParts['port'] : 3306;
    $user = $dbParts['user'];
    $pass = isset($dbParts['pass']) ? $dbParts['pass'] : '';
    $dbname = ltrim($dbParts['path'], '/');
    
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        error_log("MySQL connection failed: " . $e->getMessage());
        http_response_code(500);
        die(json_encode(["error" => "Database connection failed", "message" => $e->getMessage()]));
    }
} else {
    // Fallback to SQLite (like in local development)
    $dbPath = __DIR__ . '/../play11.db';
    try {
        $pdo = new PDO("sqlite:$dbPath", null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        // Enable foreign keys in SQLite
        $pdo->exec("PRAGMA foreign_keys = ON;");
    } catch (PDOException $e) {
        error_log("SQLite connection failed: " . $e->getMessage());
        http_response_code(500);
        die(json_encode(["error" => "Database connection failed", "message" => $e->getMessage()]));
    }
}

// Global DB helper class matching standard patterns
class DB {
    private static $connection = null;

    public static function init($pdoInstance) {
        self::$connection = $pdoInstance;
    }

    public static function query($sql, $params = []) {
        $stmt = self::$connection->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function getPdo() {
        return self::$connection;
    }
}

DB::init($pdo);

function getAlterations() {
    return [
        "ALTER TABLE users ADD COLUMN bonus NUMERIC DEFAULT 0",
        "ALTER TABLE transactions ADD COLUMN upi_id TEXT",
        "ALTER TABLE transactions ADD COLUMN qr_code TEXT",
        "ALTER TABLE vouchers ADD COLUMN amount NUMERIC DEFAULT 0",
        "ALTER TABLE user_vouchers ADD COLUMN redeemed_at TIMESTAMP",
        "ALTER TABLE quizzes ADD COLUMN marks_per_q INTEGER DEFAULT 2",
        "ALTER TABLE quizzes ADD COLUMN entry_type TEXT DEFAULT 'free'",
        "ALTER TABLE quizzes ADD COLUMN entry_amount INTEGER DEFAULT 0",
        "ALTER TABLE quizzes ADD COLUMN winner_id TEXT",
        "ALTER TABLE quizzes ADD COLUMN hindi_title TEXT",
        "ALTER TABLE quizzes ADD COLUMN hindi_description TEXT",
        "ALTER TABLE questions ADD COLUMN hindi_question_text TEXT",
        "ALTER TABLE question_options ADD COLUMN hindi_option_text TEXT",
        "ALTER TABLE quizzes ADD COLUMN match_id TEXT",
        "ALTER TABLE categories ADD COLUMN hindi_name TEXT",
        "ALTER TABLE quizzes ADD COLUMN negative_marks NUMERIC DEFAULT 0.5",
        "ALTER TABLE questions ADD COLUMN sort_order INTEGER DEFAULT 0",
        "ALTER TABLE matches ADD COLUMN hindi_team_a TEXT",
        "ALTER TABLE matches ADD COLUMN hindi_team_b TEXT",
        "ALTER TABLE matches ADD COLUMN hindi_venue TEXT",
        "ALTER TABLE submissions ADD COLUMN status TEXT DEFAULT 'completed'",
        "ALTER TABLE submissions ADD COLUMN total_score NUMERIC DEFAULT 0",
        "ALTER TABLE submissions ADD COLUMN correct_count INTEGER DEFAULT 0",
        "ALTER TABLE submissions ADD COLUMN wrong_count INTEGER DEFAULT 0",
        "ALTER TABLE submissions ADD COLUMN time_taken TEXT",
        "ALTER TABLE submissions ADD COLUMN won_amount NUMERIC DEFAULT 0",
        "ALTER TABLE submissions ADD COLUMN rank INTEGER",
        "ALTER TABLE submissions ADD COLUMN started_at TIMESTAMP",
        "ALTER TABLE users ADD COLUMN coins NUMERIC DEFAULT 0",
        "ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0",
        "ALTER TABLE quizzes ADD COLUMN prize_amount INTEGER DEFAULT 0",
        "ALTER TABLE quizzes ADD COLUMN banner_url TEXT",
        "ALTER TABLE vouchers ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE vouchers ADD COLUMN expires_at TIMESTAMP",
        "CREATE INDEX idx_quizzes_category ON quizzes(category_id)",
        "CREATE INDEX idx_quizzes_zone ON quizzes(zone_id)",
        "CREATE INDEX idx_quizzes_match ON quizzes(match_id)",
        "CREATE INDEX idx_questions_quiz ON questions(quiz_id)",
        "CREATE INDEX idx_submissions_user ON submissions(user_id)",
        "CREATE INDEX idx_submissions_quiz ON submissions(quiz_id)",
        "CREATE INDEX idx_otp_requests_mobile ON otp_requests(mobile)",
        "CREATE INDEX idx_sub_answers_sub ON submission_answers(submission_id)",
        "CREATE INDEX idx_transactions_user ON transactions(user_id)",
        "CREATE INDEX idx_user_vouchers_user ON user_vouchers(user_id)",
        "CREATE INDEX idx_vouchers_code ON vouchers(code)",
        "CREATE INDEX idx_question_options_q ON question_options(question_id)",
        "ALTER TABLE quizzes ADD COLUMN winner_2_id TEXT",
        "ALTER TABLE quizzes ADD COLUMN winner_3_id TEXT",
        "ALTER TABLE vouchers ADD COLUMN user_id VARCHAR(255) DEFAULT NULL",
        "ALTER TABLE vouchers ADD COLUMN external_code TEXT DEFAULT NULL",
        "DROP TABLE IF EXISTS admin_users",
        "CREATE TABLE IF NOT EXISTS quiz_registrations (id VARCHAR(255) PRIMARY KEY, user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE, quiz_id VARCHAR(255) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        "CREATE INDEX idx_quiz_reg_user ON quiz_registrations(user_id)",
        "CREATE INDEX idx_quiz_reg_quiz ON quiz_registrations(quiz_id)"
    ];
}

// Initialize DB schema & seed if not initialized
function initDB() {
    $pdo = DB::getPdo();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

    // Fast check: Skip if database version matches the alterations count
    $alterations = getAlterations();
    $expectedVersion = count($alterations);
    try {
        $stmt = $pdo->query("SELECT value FROM settings WHERE key = 'db_version' LIMIT 1");
        $currentVersion = $stmt->fetchColumn();
        if ($currentVersion !== false && (int)$currentVersion === $expectedVersion) {
            return;
        }
    } catch (Exception $e) {
        // Table or key doesn't exist, we will proceed to create and run migrations
    }

    // Helper to check table existence
    $tableExists = false;
    if ($driver === 'pgsql') {
        $stmt = $pdo->prepare("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')");
        $stmt->execute();
        $tableExists = $stmt->fetchColumn();
    } elseif ($driver === 'mysql') {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'");
        $stmt->execute();
        $tableExists = $stmt->fetchColumn() > 0;
    } else {
        $stmt = $pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
        $stmt->execute();
        $tableExists = (bool)$stmt->fetch();
    }

    if ($tableExists) {
        // Table exists, run migrations
        runMigrations($pdo, $driver);
        
        // Save the updated version
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings WHERE key = 'db_version'");
            $stmt->execute();
            $hasVersionSetting = $stmt->fetchColumn() > 0;
            if ($hasVersionSetting) {
                $stmt = $pdo->prepare("UPDATE settings SET value = :val WHERE key = 'db_version'");
                $stmt->execute(['val' => (string)$expectedVersion]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO settings (key, value, description) VALUES ('db_version', :val, 'Database migration version')");
                $stmt->execute(['val' => (string)$expectedVersion]);
            }
        } catch (Exception $versionEx) {
            // Ignore if setting table is somehow not ready
        }
        return;
    }

    error_log("🔄 Initializing database schema...");

    // Text type with primary key differs slightly in postgres/sqlite auto-increment but the schema matches text IDs (uuidv4)
    $sql = "
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        mobile VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        coins NUMERIC DEFAULT 0,
        points INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otp_requests (
        id VARCHAR(255) PRIMARY KEY,
        mobile VARCHAR(255) NOT NULL,
        otp_reference VARCHAR(255) NOT NULL,
        otp_code VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        zone_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        hindi_name VARCHAR(255),
        icon VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(255) PRIMARY KEY,
        sport_type VARCHAR(100),
        team_a VARCHAR(255),
        team_b VARCHAR(255),
        team_a_logo VARCHAR(255),
        team_b_logo VARCHAR(255),
        start_time TIMESTAMP NULL,
        venue VARCHAR(255),
        score_a INTEGER DEFAULT 0,
        score_b INTEGER DEFAULT 0,
        hindi_team_a VARCHAR(255),
        hindi_team_b VARCHAR(255),
        hindi_venue VARCHAR(255),
        status VARCHAR(50) DEFAULT 'upcoming'
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(255) PRIMARY KEY,
        zone_id VARCHAR(255),
        category_id VARCHAR(255) REFERENCES categories(id) ON DELETE CASCADE,
        match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        total_questions INTEGER DEFAULT 0,
        timer_minutes INTEGER DEFAULT 5,
        status VARCHAR(50) DEFAULT 'active',
        reward_text VARCHAR(255),
        prize_amount INTEGER DEFAULT 0,
        entry_type VARCHAR(50) DEFAULT 'free',
        open_at TIMESTAMP NULL,
        close_at TIMESTAMP NULL,
        result_at TIMESTAMP NULL,
        marks_per_q INTEGER DEFAULT 2,
        negative_marks NUMERIC DEFAULT 0.5,
        winner_id TEXT,
        winner_2_id TEXT,
        winner_3_id TEXT
      );

      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(255) PRIMARY KEY,
        quiz_id VARCHAR(255) REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        hindi_question_text TEXT,
        marks INTEGER DEFAULT 2,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS question_options (
        id VARCHAR(255) PRIMARY KEY,
        question_id VARCHAR(255) REFERENCES questions(id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        option_value VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS correct_answers (
        id VARCHAR(255) PRIMARY KEY,
        question_id VARCHAR(255) REFERENCES questions(id) ON DELETE CASCADE,
        answer_value VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        quiz_id VARCHAR(255) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'completed',
        total_score NUMERIC DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        wrong_count INTEGER DEFAULT 0,
        total_marks INTEGER DEFAULT 0,
        time_taken VARCHAR(100),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    ";

    if ($driver === 'pgsql') {
        $sql .= "
          CREATE TABLE IF NOT EXISTS visitors (
            id BIGSERIAL PRIMARY KEY,
            ip VARCHAR(255),
            user_agent TEXT,
            path TEXT,
            method VARCHAR(50),
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        ";
    } elseif ($driver === 'mysql') {
        $sql .= "
          CREATE TABLE IF NOT EXISTS visitors (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            ip VARCHAR(255),
            user_agent TEXT,
            path TEXT,
            method VARCHAR(50),
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        ";
    } else {
        $sql .= "
          CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT,
            user_agent TEXT,
            path TEXT,
            method TEXT,
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        ";
    }

    $sql .= "
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submission_answers (
        id VARCHAR(255) PRIMARY KEY,
        submission_id VARCHAR(255) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        question_id VARCHAR(255) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        selected_value VARCHAR(255),
        is_correct INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'success',
        upi_id VARCHAR(255),
        qr_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vouchers (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        code VARCHAR(255) UNIQUE NOT NULL,
        discount_text VARCHAR(255) NOT NULL,
        amount NUMERIC DEFAULT 0,
        type VARCHAR(50) NOT NULL,
        color VARCHAR(50) DEFAULT '#7c3aed',
        expiry_days INTEGER DEFAULT 30,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL
      );

      CREATE TABLE IF NOT EXISTS user_vouchers (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        voucher_id VARCHAR(255) NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'active',
        expires_at TIMESTAMP NOT NULL,
        redeemed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        `key` VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    ";

    if ($driver !== 'mysql') {
        $sql = str_replace('`key`', 'key', $sql);
    }

    $pdo->exec($sql);

    // Create indexes one by one to avoid IF NOT EXISTS limitations in MySQL
    $indexes = [
        "CREATE INDEX idx_quizzes_category ON quizzes(category_id)",
        "CREATE INDEX idx_quizzes_zone ON quizzes(zone_id)",
        "CREATE INDEX idx_quizzes_match ON quizzes(match_id)",
        "CREATE INDEX idx_questions_quiz ON questions(quiz_id)",
        "CREATE INDEX idx_submissions_user ON submissions(user_id)",
        "CREATE INDEX idx_submissions_quiz ON submissions(quiz_id)",
        "CREATE INDEX idx_otp_requests_mobile ON otp_requests(mobile)",
        "CREATE INDEX idx_sub_answers_sub ON submission_answers(submission_id)",
        "CREATE INDEX idx_transactions_user ON transactions(user_id)",
        "CREATE INDEX idx_user_vouchers_user ON user_vouchers(user_id)",
        "CREATE INDEX idx_vouchers_code ON vouchers(code)"
    ];

    foreach ($indexes as $indexSql) {
        try {
            $execSql = $indexSql;
            if ($driver !== 'mysql') {
                $execSql = str_replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ", $indexSql);
            }
            $pdo->exec($execSql);
        } catch (PDOException $e) {
            // Ignore if index already exists
        }
    }

    runMigrations($pdo, $driver);
    seedData($pdo);
}

function runMigrations($pdo, $driver) {
    try {
        // Essential column additions to handle changes over time
        $alterations = getAlterations();

        foreach ($alterations as $alteration) {
            try {
                // For PostgreSQL: use IF NOT EXISTS to prevent transaction abort errors
                // when columns already exist. This is the fix for SQLSTATE[25P02].
                if ($driver === 'pgsql') {
                    $alteration = str_replace('ADD COLUMN ', 'ADD COLUMN IF NOT EXISTS ', $alteration);
                    if (strpos($alteration, 'CREATE INDEX') === 0) {
                        $alteration = str_replace('CREATE INDEX ', 'CREATE INDEX IF NOT EXISTS ', $alteration);
                    }
                }
                $pdo->exec($alteration);
            } catch (PDOException $e) {
                // For non-pgsql drivers, still catch and ignore duplicate column errors
                // Also reset any aborted transaction state in PostgreSQL
                if ($driver === 'pgsql') {
                    try { $pdo->exec('ROLLBACK'); } catch (\Exception $re) {}
                }
            }
        }

        // Clean old visitors logs (last 30 days) and OTP requests (last 24 hours)
        if ($driver === 'pgsql') {
            $pdo->exec("DELETE FROM visitors WHERE visited_at < CURRENT_TIMESTAMP - INTERVAL '30 days'");
            $pdo->exec("DELETE FROM otp_requests WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '1 day'");
        } elseif ($driver === 'mysql') {
            $pdo->exec("DELETE FROM visitors WHERE visited_at < NOW() - INTERVAL 30 DAY");
            $pdo->exec("DELETE FROM otp_requests WHERE expires_at < NOW() - INTERVAL 1 DAY");
        } else {
            $pdo->exec("DELETE FROM visitors WHERE visited_at < datetime('now', '-30 days')");
            $pdo->exec("DELETE FROM otp_requests WHERE expires_at < datetime('now', '-1 day')");
        }
    } catch (PDOException $e) {
        error_log("Migration warning: " . $e->getMessage());
    }
}

function seedData($pdo) {
    try {
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        // Seed Categories
        $count = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        if ($count == 0) {
            $pdo->exec("
                INSERT INTO categories (id, zone_id, name, hindi_name, sort_order) VALUES 
                ('cat-1', 'study-zone', 'SSC', 'एसएससी', 1),
                ('cat-2', 'study-zone', 'UPSC', 'यूपीएससी', 2),
                ('cat-g1', 'sport-zone', 'IPL Quiz', 'आईपीएल क्विज', 1);
            ");
        }

        // Seed Vouchers
        if ($driver === 'mysql') {
            $pdo->exec("
                INSERT IGNORE INTO vouchers (id, title, code, discount_text, amount, type, color) VALUES 
                ('v-1', 'Welcome Bonus', 'WELCOME100', '₹100 Bonus', 100, 'bonus', '#7c3aed'),
                ('v-2', 'Cash Reward', 'FREE100', '₹100 Real Cash', 100, 'cash', '#10b981'),
                ('v-3', 'Bonus Pack', 'BONUS200', '₹200 Bonus Cash', 200, 'bonus', '#f59e0b'),
                ('v-4', 'Match Pass', 'IPL2024', '₹50 Discount', 50, 'cash', '#0ea5e9')
            ");
        } else {
            $pdo->exec("
                INSERT INTO vouchers (id, title, code, discount_text, amount, type, color) VALUES 
                ('v-1', 'Welcome Bonus', 'WELCOME100', '₹100 Bonus', 100, 'bonus', '#7c3aed'),
                ('v-2', 'Cash Reward', 'FREE100', '₹100 Real Cash', 100, 'cash', '#10b981'),
                ('v-3', 'Bonus Pack', 'BONUS200', '₹200 Bonus Cash', 200, 'bonus', '#f59e0b'),
                ('v-4', 'Match Pass', 'IPL2024', '₹50 Discount', 50, 'cash', '#0ea5e9')
                ON CONFLICT (code) DO NOTHING;
            ");
        }

        // Seed Default Settings
        $settingsCount = $pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($settingsCount == 0) {
            $pdo->exec("
                INSERT INTO settings (key, value, description) VALUES 
                ('global_quiz_banner', 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop', 'Default banner for quizzes without a specific banner'),
                ('welcome_bonus', '100', 'Sign up bonus amount'),
                ('daily_login_bonus', '10', 'Daily check-in reward')
            ");
        }

        // Ensure db_version setting is set
        $alterations = getAlterations();
        $expectedVersion = count($alterations);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings WHERE key = 'db_version'");
        $stmt->execute();
        $hasVersionSetting = $stmt->fetchColumn() > 0;
        if ($hasVersionSetting) {
            $stmt = $pdo->prepare("UPDATE settings SET value = :val WHERE key = 'db_version'");
            $stmt->execute(['val' => (string)$expectedVersion]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO settings (key, value, description) VALUES ('db_version', :val, 'Database migration version')");
            $stmt->execute(['val' => (string)$expectedVersion]);
        }

        // Seed Admin Account
        $adminCount = $pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
        if ($adminCount == 0) {
            $hashedPass = password_hash('123', PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO admins (id, username, password) VALUES (:id, :username, :password)");
            $stmt->execute([
                'id' => 'admin-1',
                'username' => 'admin',
                'password' => $hashedPass
            ]);
        }
    } catch (PDOException $e) {
        error_log("Seeding warning: " . $e->getMessage());
    }
}
