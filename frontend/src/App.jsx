import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SplashPage from './pages/SplashPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import RegisterPage from './pages/RegisterPage';
import HomeChoicePage from './pages/HomeChoicePage';
import QuizArenaPage from './pages/QuizArenaPage';
import StudyHomePage from './pages/StudyHomePage';
import StudyCategoryPage from './pages/StudyCategoryPage';
import StudyQuizDetailPage from './pages/StudyQuizDetailPage';
import StudyQuestionPage from './pages/StudyQuestionPage';
import StudyReviewPage from './pages/StudyReviewPage';
import StudyResultPage from './pages/StudyResultPage';
import MatchListPage from './pages/MatchListPage';
import GameQuizDetailPage from './pages/GameQuizDetailPage';
import GameQuestionPage from './pages/GameQuestionPage';
import GameResultPage from './pages/GameResultPage';
import GameReviewPage from './pages/GameReviewPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import ContestListPage from './pages/ContestListPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import MatchQuizRoom from './pages/MatchQuizRoom';
import DummyQuizFlow from './pages/DummyQuizFlow';
import LegalPage from './pages/LegalPage';
import HowItWorksPage from './pages/HowItWorksPage';
import BalancePage from './pages/BalancePage';
import VouchersPage from './pages/VouchersPage';
import QuizReviewPage from './pages/QuizReviewPage';
import AboutUsPage from './pages/AboutUsPage';
import SupportPage from './pages/SupportPage';
import './index.css';

const ProtectedAdminRoute = ({ children }) => {
  const isAdminAuth = localStorage.getItem('play11_admin_session');
  return isAdminAuth ? children : <Navigate to="/admin/login" replace />;
};

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('play11_session');
  const isAdminAuth = localStorage.getItem('play11_admin_session');
  return (isAuth || isAdminAuth) ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="app-shell" style={{ minHeight: '100vh', position: 'relative' }}>
        <div className="mesh-bg-premium">
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-blob blob-3"></div>
        </div>
        
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
      </div>
    </Router>
  );
};

export default App;
