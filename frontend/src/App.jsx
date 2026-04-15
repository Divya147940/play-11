import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import RegisterPage from './pages/RegisterPage';
import HomeChoicePage from './pages/HomeChoicePage';
import StudyHomePage from './pages/StudyHomePage';
import StudyCategoryPage from './pages/StudyCategoryPage';
import StudyQuizDetailPage from './pages/StudyQuizDetailPage';
import StudyQuestionPage from './pages/StudyQuestionPage';
import StudyReviewPage from './pages/StudyReviewPage';
import StudyResultPage from './pages/StudyResultPage';
import GameHomePage from './pages/GameHomePage';
import MatchListPage from './pages/MatchListPage';
import GameQuizDetailPage from './pages/GameQuizDetailPage';
import GameQuestionPage from './pages/GameQuestionPage';
import GameResultPage from './pages/GameResultPage';
import GameReviewPage from './pages/GameReviewPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <div className="mesh-bg-premium">
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-blob blob-3"></div>
        </div>
        
        <Routes>
          {/* Auth & Splash - No global nav */}
          <Route path="/" element={<Layout hideNav><SplashPage /></Layout>} />
          <Route path="/login" element={<Layout hideNav><LoginPage /></Layout>} />
          <Route path="/otp" element={<Layout hideNav><OtpPage /></Layout>} />
          <Route path="/register" element={<Layout hideNav><RegisterPage /></Layout>} />
          
          {/* Main Website Pages */}
          <Route path="/home-choice" element={<Layout><HomeChoicePage /></Layout>} />
          <Route path="/study-home" element={<Layout><StudyHomePage /></Layout>} />
          <Route path="/study-category/:id" element={<Layout><StudyCategoryPage /></Layout>} />
          <Route path="/study-quiz-detail/:id" element={<Layout><StudyQuizDetailPage /></Layout>} />
          <Route path="/study-quiz-play/:id" element={<Layout><StudyQuestionPage /></Layout>} />
          <Route path="/study-review" element={<Layout><StudyReviewPage /></Layout>} />
          <Route path="/study-result/:id" element={<Layout><StudyResultPage /></Layout>} />
          
          <Route path="/game-home" element={<Layout><GameHomePage /></Layout>} />
          <Route path="/match-list" element={<Layout><MatchListPage /></Layout>} />
          <Route path="/game-quiz-detail/:id" element={<Layout><GameQuizDetailPage /></Layout>} />
          <Route path="/game-quiz-play/:id" element={<Layout><GameQuestionPage /></Layout>} />
          <Route path="/game-review" element={<Layout><GameReviewPage /></Layout>} />
          <Route path="/game-result/:id" element={<Layout><GameResultPage /></Layout>} />
          
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
          
          {/* Admin Panels */}
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
