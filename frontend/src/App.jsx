import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import './index.css';

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

const ProtectedAdminRoute = ({ children }) => {
  const isAdminAuth = localStorage.getItem('play11_admin_session');
  return isAdminAuth ? children : <Navigate to="/admin/login" replace />;
};

const ProtectedRoute = ({ children }) => {
  // Authentication disabled per user request - always allow access
  return children;
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
        
        {/* Suspense fallback using custom premium animated Loader */}
        <Suspense fallback={<Loader fullPage={true} />}>
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
            <Route path="/study-quiz-play/:id" element={<Layout hideNav><StudyQuestionPage /></Layout>} />
            <Route path="/study-review" element={<Layout><StudyReviewPage /></Layout>} />
            <Route path="/study-result/:id" element={<Layout><StudyResultPage /></Layout>} />
            
            {/* Game Pages */}
            <Route path="/match-list" element={<Layout><MatchListPage /></Layout>} />
            <Route path="/game-quiz-detail/:id" element={<Layout><GameQuizDetailPage /></Layout>} />
            <Route path="/game-quiz-play/:id" element={<Layout hideNav><GameQuestionPage /></Layout>} />
            <Route path="/game-review" element={<Layout><GameReviewPage /></Layout>} />
            <Route path="/game-result/:id" element={<Layout><GameResultPage /></Layout>} />
            <Route path="/match-quiz-room/:id" element={<ProtectedRoute><Layout><MatchQuizRoom /></Layout></ProtectedRoute>} />
            <Route path="/dummy-quiz-flow" element={<Layout><DummyQuizFlow /></Layout>} />
            
            <Route path="/contests" element={<Layout><ContestListPage /></Layout>} />
            <Route path="/leaderboard" element={<Layout><LeaderboardPage /></Layout>} />
            <Route path="/leaderboard/:id" element={<Layout><LeaderboardPage /></Layout>} />
            
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
            <Route path="/balance" element={<Layout><BalancePage /></Layout>} />
            <Route path="/vouchers" element={<Layout><VouchersPage /></Layout>} />
            <Route path="/quiz-review/:id" element={<Layout><QuizReviewPage /></Layout>} />
            
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

