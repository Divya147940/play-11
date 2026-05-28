import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import './index.css';
import { Lock, UserPlus, LogIn } from 'lucide-react';

// Dynamic route-based lazy loading of pages to minimize initial bundle size and optimize load times
const SplashPage = lazy(() => import('./pages/SplashPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OtpPage = lazy(() => import('./pages/OtpPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const HomeChoicePage = lazy(() => import('./pages/HomeChoicePage'));
const QuizArenaPage = lazy(() => import('./pages/QuizArenaPage'));
const StudyHomePage = lazy(() => import('./pages/StudyHomePage'));
const StudyCategoryPage = lazy(() => import('./pages/StudyCategoryPage'));
const StudyQuizDetailPage = lazy(() => import('./pages/StudyQuizDetailPage'));
const StudyQuestionPage = lazy(() => import('./pages/StudyQuestionPage'));
const StudyReviewPage = lazy(() => import('./pages/StudyReviewPage'));
const StudyResultPage = lazy(() => import('./pages/StudyResultPage'));
const MatchListPage = lazy(() => import('./pages/MatchListPage'));
const GameQuizDetailPage = lazy(() => import('./pages/GameQuizDetailPage'));
const GameQuestionPage = lazy(() => import('./pages/GameQuestionPage'));
const GameResultPage = lazy(() => import('./pages/GameResultPage'));
const GameReviewPage = lazy(() => import('./pages/GameReviewPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ContestListPage = lazy(() => import('./pages/ContestListPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const MatchQuizRoom = lazy(() => import('./pages/MatchQuizRoom'));
const DummyQuizFlow = lazy(() => import('./pages/DummyQuizFlow'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const BalancePage = lazy(() => import('./pages/BalancePage'));
const VouchersPage = lazy(() => import('./pages/VouchersPage'));
const QuizReviewPage = lazy(() => import('./pages/QuizReviewPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const TransactionPage = lazy(() => import('./pages/TransactionPage'));

const ProtectedAdminRoute = ({ children }) => {
  const isAdminAuth = localStorage.getItem('play11_admin_session');
  return isAdminAuth ? children : <Navigate to="/admin/login" replace />;
};

const ProtectedRoute = ({ children }) => {
  // Authentication disabled per user request - always allow access
  return children;
};

// Strict route protection for actually playing quizzes
const RequireAuthRoute = ({ children }) => {
  const isAuth = localStorage.getItem('play11_user') || localStorage.getItem('play11_session');
  if (isAuth) return children;

  // Stash target path for redirect
  const currentPath = window.location.pathname;
  localStorage.setItem('auth_redirect', currentPath);

  const hasAccount = localStorage.getItem('play11_has_account');
  if (hasAccount === 'true') {
    return <Navigate to="/login" replace />;
  } else {
    return <Navigate to="/register" replace />;
  }
};

const AuthRequiredPlaceholder = () => {
  const navigate = useNavigate();

  const handleAction = (type) => {
    localStorage.setItem('auth_redirect', window.location.pathname);
    if (type === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      fontFamily: "'Lexend', sans-serif"
    }}>
      <div className="bento-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'white',
        border: '1px solid hsl(var(--card-border))',
        borderRadius: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Animated Lock Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.05)',
          color: 'hsl(var(--primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(59, 130, 246, 0.1)'
        }}>
          <Lock size={36} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
            Access Restricted
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, lineHeight: '1.5' }}>
            You are not registered or logged in first. Please register or login to view your profile, leaderboard standings, and quiz activities!
          </p>
        </div>

        {/* Buttons Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
          <button 
            className="btn-elite btn-elite-primary" 
            style={{ width: '100%', height: '56px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => handleAction('register')}
          >
            <UserPlus size={18} /> Register Now (Signup)
          </button>
          
          <button 
            className="btn-elite" 
            style={{ 
              width: '100%', 
              height: '56px', 
              fontSize: '1rem', 
              background: 'white', 
              border: '2px solid #e2e8f0', 
              color: '#0f172a',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              boxShadow: 'none'
            }}
            onClick={() => handleAction('login')}
          >
            <LogIn size={18} /> Login to Account
          </button>
        </div>
      </div>
    </div>
  );
};

const RequireAuthGate = ({ children }) => {
  const isAuth = localStorage.getItem('play11_user') || localStorage.getItem('play11_session');
  if (isAuth) return children;

  return <Layout><AuthRequiredPlaceholder /></Layout>;
};

const App = () => {
  useEffect(() => {
    // Ensure a persistent guest ID exists for anonymous tracking
    if (!localStorage.getItem('play11_guest_id')) {
      const newGuestId = 'guest-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('play11_guest_id', newGuestId);
    }
  }, []);

  return (
    <Router>
      <div className="app-shell" style={{ minHeight: '100vh', position: 'relative' }}>
        <div className="mesh-bg-premium">
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-blob blob-3"></div>
        </div>
        
        {/* Suspense fallback using null (no full-page preloader) */}
        <Suspense fallback={null}>
          <Routes>
            {/* Auth & Splash - No global nav */}
            <Route path="/" element={<Layout hideNav><LandingPage /></Layout>} />
            <Route path="/login" element={<Layout hideNav><LoginPage /></Layout>} />
            <Route path="/otp" element={<Layout hideNav><OtpPage /></Layout>} />
            <Route path="/register" element={<Layout hideNav><RegisterPage /></Layout>} />
            
            {/* Main Website Pages */}
            <Route path="/home-choice" element={<Layout><HomeChoicePage /></Layout>} />
            <Route path="/study-home" element={<Layout><StudyHomePage /></Layout>} />
            
            {/* Unified Quiz Arenas */}
            <Route path="/quiz-arena/:zoneId" element={<Layout><QuizArenaPage /></Layout>} />
            <Route path="/study-arena" element={<Layout><QuizArenaPage /></Layout>} />
            <Route path="/game-home" element={<Navigate to="/quiz-arena/sport-zone" replace />} />
            
            {/* Study Pages */}
            <Route path="/study-category/:id" element={<Layout><StudyCategoryPage /></Layout>} />
            <Route path="/study-quiz-detail/:id" element={<Layout><StudyQuizDetailPage /></Layout>} />
            <Route path="/study-quiz-play/:id" element={<RequireAuthRoute><Layout hideNav><StudyQuestionPage /></Layout></RequireAuthRoute>} />
            <Route path="/study-review/:id" element={<Layout><StudyReviewPage /></Layout>} />
            <Route path="/study-result/:id" element={<Layout><StudyResultPage /></Layout>} />
            
            {/* Game Pages */}
            <Route path="/match-list" element={<Layout><MatchListPage /></Layout>} />
            <Route path="/game-quiz-detail/:id" element={<Layout><GameQuizDetailPage /></Layout>} />
            <Route path="/game-quiz-play/:id" element={<RequireAuthRoute><Layout hideNav><GameQuestionPage /></Layout></RequireAuthRoute>} />
            <Route path="/game-review/:id" element={<Layout><GameReviewPage /></Layout>} />
            <Route path="/game-result/:id" element={<Layout><GameResultPage /></Layout>} />
            <Route path="/match-quiz-room/:id" element={<RequireAuthRoute><Layout><MatchQuizRoom /></Layout></RequireAuthRoute>} />
            <Route path="/dummy-quiz-flow" element={<Layout><DummyQuizFlow /></Layout>} />
            
            <Route path="/contests" element={<Layout><ContestListPage /></Layout>} />
            <Route path="/leaderboard" element={<RequireAuthGate><Layout><LeaderboardPage /></Layout></RequireAuthGate>} />
            <Route path="/leaderboard/:id" element={<RequireAuthGate><Layout><LeaderboardPage /></Layout></RequireAuthGate>} />
            
            <Route path="/profile" element={<RequireAuthGate><Layout><ProfilePage /></Layout></RequireAuthGate>} />
            <Route path="/history" element={<RequireAuthGate><Layout><HistoryPage /></Layout></RequireAuthGate>} />
            <Route path="/balance" element={<RequireAuthGate><Layout><BalancePage /></Layout></RequireAuthGate>} />
            <Route path="/vouchers" element={<RequireAuthGate><Layout><VouchersPage /></Layout></RequireAuthGate>} />
            <Route path="/quiz-review/:id" element={<Layout><QuizReviewPage /></Layout>} />
            <Route path="/transaction/:type" element={<RequireAuthGate><Layout><TransactionPage /></Layout></RequireAuthGate>} />
            
            {/* Admin Panels */}
            <Route path="/admin/login" element={<Layout hideNav><AdminLoginPage /></Layout>} />
            <Route path="/admin" element={<ProtectedAdminRoute><Layout hideNav><AdminDashboard /></Layout></ProtectedAdminRoute>} />
            
            {/* Legal & Static Pages */}
            <Route path="/legal" element={<Layout><LegalPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
            <Route path="/support" element={<Layout><SupportPage /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;

