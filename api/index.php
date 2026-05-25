<?php
// PHP Front Controller Router for Play 11 API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Guest-Id");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 86400");
header("Connection: close");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set JSON content type for API responses
header("Content-Type: application/json; charset=utf-8");

// Load Config & Helpers
require_once __DIR__ . '/config/dotenv.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/middleware/auth.middleware.php';

// Controllers
require_once __DIR__ . '/controllers/auth.controller.php';
require_once __DIR__ . '/controllers/category.controller.php';
require_once __DIR__ . '/controllers/quiz.controller.php';
require_once __DIR__ . '/controllers/match.controller.php';
require_once __DIR__ . '/controllers/admin.controller.php';
require_once __DIR__ . '/controllers/wallet.controller.php';
require_once __DIR__ . '/controllers/voucher.controller.php';
require_once __DIR__ . '/controllers/settings.controller.php';

// Initialize Database schema and migrations (run once or if forced)
$lockFile = __DIR__ . '/config/db_initialized.lock';
$forceInit = isset($_GET['force_init']) || (isset($_SERVER['REQUEST_URI']) && parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) === '/api/db-test');

if (!file_exists($lockFile) || $forceInit) {
    try {
        initDB();
        @file_put_contents($lockFile, date('c'));
    } catch (Exception $dbInitEx) {
        error_log("DB Init Error: " . $dbInitEx->getMessage());
    }
}

// Helper to match Express-like routes
function matchRoute($routePattern, $requestPath, &$params = []) {
    // Strip leading/trailing slashes
    $routePattern = trim($routePattern, '/');
    $requestPath = trim($requestPath, '/');

    // Convert :param to capture groups
    $regex = preg_replace('/:([a-zA-Z0-9_]+)/', '([^/]+)', $routePattern);
    $regex = '/^' . str_replace('/', '\/', $regex) . '$/';

    if (preg_match($regex, $requestPath, $matches)) {
        // Extract param keys
        preg_match_all('/:([a-zA-Z0-9_]+)/', $routePattern, $paramKeys);
        if (isset($paramKeys[1])) {
            foreach ($paramKeys[1] as $idx => $key) {
                if (isset($matches[$idx + 1])) {
                    $params[$key] = urldecode($matches[$idx + 1]);
                }
            }
        }
        return true;
    }
    return false;
}

// Parse request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Strip `/api` prefix if present
if (strpos($uri, '/api') === 0) {
    $uri = substr($uri, 4);
}
$uri = trim($uri, '/');

$method = $_SERVER['REQUEST_METHOD'];

// Load raw json input body
$inputBody = json_decode(file_get_contents('php://input'), true) ?: [];

$params = [];

// Logger
// error_log("[API PHP] $method /$uri");

// --- Health / Healthcheck Routes ---
if ($uri === 'ping' && $method === 'GET') {
    echo json_encode([
        'status' => 'online',
        'message' => 'Pong! API is reachable',
        'timestamp' => date('c')
    ]);
    exit;
}

if ($uri === 'health' && $method === 'GET') {
    echo json_encode(['status' => 'active', 'platform' => 'Play11']);
    exit;
}

if ($uri === 'db-test' && $method === 'GET') {
    try {
        $driver = DB::getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME);
        if ($driver === 'pgsql' || $driver === 'mysql') {
            $time = DB::query('SELECT NOW()')->fetchColumn();
        } else {
            $time = DB::query("SELECT datetime('now')")->fetchColumn();
        }
        echo json_encode(['success' => true, 'time' => $time, 'driver' => $driver]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}


// --- Auth Routes ---
if ($uri === 'auth/send-otp' && $method === 'POST') {
    AuthController::sendOtp($inputBody);
    exit;
}
if ($uri === 'auth/verify-otp' && $method === 'POST') {
    AuthController::verifyOtp($inputBody);
    exit;
}
if ($uri === 'auth/update-profile' && $method === 'POST') {
    $user = verifyToken();
    AuthController::updateProfile($inputBody, $user);
    exit;
}
if ($uri === 'auth/history' && $method === 'GET') {
    $user = verifyToken();
    AuthController::getUserHistory($user, $_GET);
    exit;
}
if ($uri === 'auth/balance' && $method === 'GET') {
    $user = verifyToken();
    AuthController::getBalance($user);
    exit;
}
if (matchRoute('auth/submission/:id/review', $uri, $params) && $method === 'GET') {
    $user = verifyToken();
    AuthController::getSubmissionReview($params['id'], $user);
    exit;
}
if ($uri === 'auth/logout' && $method === 'POST') {
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}
if ($uri === 'auth/me' && $method === 'GET') {
    echo json_encode(['success' => true, 'user' => ['mobile' => '0000000000']]);
    exit;
}

// --- Wallet Routes ---
if ($uri === 'wallet/balance' && $method === 'GET') {
    $user = verifyToken();
    WalletController::getBalance($user);
    exit;
}
if ($uri === 'wallet/transactions' && $method === 'GET') {
    $user = verifyToken();
    WalletController::getTransactions($user);
    exit;
}
if ($uri === 'wallet/deposit' && $method === 'POST') {
    $user = verifyToken();
    WalletController::addMoney($inputBody, $user);
    exit;
}
if ($uri === 'wallet/withdraw' && $method === 'POST') {
    $user = verifyToken();
    WalletController::withdrawMoney($inputBody, $user);
    exit;
}

// --- Vouchers Routes ---
if ($uri === 'vouchers' && $method === 'GET') {
    $user = verifyToken();
    VoucherController::getVouchers($user);
    exit;
}
if ($uri === 'vouchers/redeem' && $method === 'POST') {
    $user = verifyToken();
    VoucherController::redeemVoucher($inputBody, $user);
    exit;
}

// --- Categories Routes ---
if (($uri === 'categories' || $uri === 'categories/all') && $method === 'GET') {
    CategoryController::getAllCategories();
    exit;
}
if ($uri === 'categories/study' && $method === 'GET') {
    CategoryController::getStudyCategories();
    exit;
}
if ($uri === 'categories/game' && $method === 'GET') {
    CategoryController::getGameCategories();
    exit;
}

// --- Quizzes Routes ---
if ($uri === 'quizzes' && $method === 'GET') {
    $user = verifyToken();
    QuizController::getAllQuizzes($user);
    exit;
}
if ($uri === 'quizzes/joined' && $method === 'GET') {
    $user = verifyToken();
    QuizController::getJoinedQuizzes($user);
    exit;
}
if (matchRoute('quizzes/category/:categoryId', $uri, $params) && $method === 'GET') {
    QuizController::getQuizzesByCategory($params['categoryId']);
    exit;
}
if (matchRoute('quizzes/zone/:zoneId', $uri, $params) && $method === 'GET') {
    $user = optionalToken();
    QuizController::getQuizzesByZone($params['zoneId'], $user);
    exit;
}
if (matchRoute('quizzes/:id/questions', $uri, $params) && $method === 'GET') {
    $user = verifyToken();
    QuizController::getQuizQuestions($params['id']);
    exit;
}
if (matchRoute('quizzes/:id/submit', $uri, $params) && $method === 'POST') {
    $user = verifyToken();
    QuizController::submitQuiz($params['id'], $inputBody, $user);
    exit;
}
if (matchRoute('quizzes/:id/results', $uri, $params) && $method === 'GET') {
    $user = optionalToken();
    QuizController::getResults($params['id'], $user);
    exit;
}
if (matchRoute('quizzes/:id/leaderboard', $uri, $params) && $method === 'GET') {
    $user = optionalToken();
    QuizController::getLeaderboard($params['id'], $user);
    exit;
}
if ($uri === 'quizzes/leaderboard/global' && $method === 'GET') {
    $user = optionalToken();
    QuizController::getGlobalLeaderboard($user);
    exit;
}
if (matchRoute('quizzes/:id', $uri, $params) && $method === 'GET') {
    $user = optionalToken();
    QuizController::getQuizById($params['id'], $user);
    exit;
}

// --- Matches Routes ---
if ($uri === 'matches' && $method === 'GET') {
    MatchController::getAllMatches();
    exit;
}
if (matchRoute('matches/:id/quizzes', $uri, $params) && $method === 'GET') {
    MatchController::getMatchQuizzes($params['id']);
    exit;
}
if (matchRoute('matches/:id', $uri, $params) && $method === 'GET') {
    MatchController::getMatchById($params['id']);
    exit;
}

// --- Settings Routes ---
if ($uri === 'settings/batch' && $method === 'GET') {
    SettingsController::getBatchSettings($_GET);
    exit;
}
if (matchRoute('settings/:key', $uri, $params) && $method === 'GET') {
    SettingsController::getSetting($params['key']);
    exit;
}
if ($uri === 'settings/update' && $method === 'POST') {
    verifyAdmin(); // Must be admin
    SettingsController::updateSetting($inputBody);
    exit;
}

// --- Admin Routes ---
if ($uri === 'admin/login' && $method === 'POST') {
    AdminController::login($inputBody);
    exit;
}
if ($uri === 'admin/dashboard' && $method === 'GET') {
    verifyAdmin();
    AdminController::getDashboardStats();
    exit;
}
if ($uri === 'admin/users' && $method === 'GET') {
    verifyAdmin();
    AdminController::getUsers($_GET);
    exit;
}
if (matchRoute('admin/users/:id/toggle', $uri, $params) && $method === 'POST') {
    verifyAdmin();
    AdminController::toggleUserStatus($params['id'], $inputBody);
    exit;
}
if (($uri === 'admin/quizzes/create' || $uri === 'admin/quizzes/upload' || $uri === 'admin/quizzes') && $method === 'POST') {
    verifyAdmin();
    AdminController::createQuiz($inputBody);
    exit;
}
if (($uri === 'admin/quizzes' || $uri === 'admin/quizzes/stats') && $method === 'GET') {
    verifyAdmin();
    AdminController::getQuizzesWithStats();
    exit;
}
if (matchRoute('admin/quizzes/:id/participants', $uri, $params) && $method === 'GET') {
    verifyAdmin();
    AdminController::getQuizParticipants($params['id']);
    exit;
}
if (matchRoute('admin/quizzes/:id/winner', $uri, $params) && $method === 'POST') {
    verifyAdmin();
    AdminController::declareWinner($params['id'], $inputBody);
    exit;
}
if (matchRoute('admin/quizzes/:id/questions', $uri, $params) && $method === 'GET') {
    verifyAdmin();
    AdminController::getAdminQuizQuestions($params['id']);
    exit;
}
if (matchRoute('admin/quizzes/:id', $uri, $params) && $method === 'PUT') {
    verifyAdmin();
    AdminController::updateQuiz($params['id'], $inputBody);
    exit;
}
if (matchRoute('admin/quizzes/:id', $uri, $params) && $method === 'DELETE') {
    verifyAdmin();
    AdminController::deleteQuiz($params['id']);
    exit;
}
if ($uri === 'admin/matches/add' && $method === 'POST') {
    verifyAdmin();
    AdminController::addMatch($inputBody);
    exit;
}
if (matchRoute('admin/matches/:id', $uri, $params) && $method === 'PUT') {
    verifyAdmin();
    AdminController::updateMatch($params['id'], $inputBody);
    exit;
}
if (matchRoute('admin/matches/:id', $uri, $params) && $method === 'DELETE') {
    verifyAdmin();
    AdminController::deleteMatch($params['id']);
    exit;
}
if (matchRoute('admin/submissions/:id/review', $uri, $params) && $method === 'GET') {
    verifyAdmin();
    AdminController::getSubmissionReviewAdmin($params['id']);
    exit;
}
if ($uri === 'admin/transactions/pending' && $method === 'GET') {
    verifyAdmin();
    AdminController::getPendingTransactions();
    exit;
}
if (matchRoute('admin/transactions/:id/approve', $uri, $params) && $method === 'POST') {
    verifyAdmin();
    AdminController::approveTransaction($params['id']);
    exit;
}
if (matchRoute('admin/transactions/:id/reject', $uri, $params) && $method === 'POST') {
    verifyAdmin();
    AdminController::rejectTransaction($params['id']);
    exit;
}
if ($uri === 'admin/vouchers' && $method === 'GET') {
    verifyAdmin();
    AdminController::getVouchersAdmin();
    exit;
}
if ($uri === 'admin/vouchers/create' && $method === 'POST') {
    verifyAdmin();
    AdminController::createVoucherAdmin($inputBody);
    exit;
}
if (matchRoute('admin/vouchers/:id/toggle', $uri, $params) && $method === 'POST') {
    verifyAdmin();
    AdminController::toggleVoucherStatusAdmin($params['id'], $inputBody);
    exit;
}
if (matchRoute('admin/vouchers/:id', $uri, $params) && $method === 'DELETE') {
    verifyAdmin();
    AdminController::deleteVoucherAdmin($params['id']);
    exit;
}

// Route not found
http_response_code(404);
echo json_encode(['error' => 'Route not found', 'path' => $uri]);
