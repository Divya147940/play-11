import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
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

// Mock Auth Context (Simplified for build)
const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/home-choice" element={<HomeChoicePage />} />
          <Route path="/study-home" element={<StudyHomePage />} />
          <Route path="/study-category/:id" element={<StudyCategoryPage />} />
          <Route path="/study-quiz-detail/:id" element={<StudyQuizDetailPage />} />
          <Route path="/study-quiz-play/:id" element={<StudyQuestionPage />} />
          <Route path="/study-review" element={<StudyReviewPage />} />
          <Route path="/study-result/:id" element={<StudyResultPage />} />
          
          <Route path="/game-home" element={<GameHomePage />} />
          <Route path="/match-list" element={<MatchListPage />} />
          <Route path="/game-quiz-detail/:id" element={<GameQuizDetailPage />} />
          <Route path="/game-quiz-play/:id" element={<GameQuestionPage />} />
          <Route path="/game-review" element={<GameReviewPage />} />
          <Route path="/game-result/:id" element={<GameResultPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
          
          {/* Admin Panels */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
