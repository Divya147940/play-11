import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, ShieldCheck, Trophy, Users, HelpCircle, CheckCircle2, Clock } from 'lucide-react';

const mockGameQuestions = [
  {
    id: 1,
    text: "Who is known as the \"Father of Indian Constitution\"?",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correctOption: 1,
    points: 50
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOption: 1,
    points: 50
  },
  {
    id: 3,
    text: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    correctOption: 2,
    points: 50
  }
];

const GameQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selections, setSelections] = useState({});
  const [questions, setQuestions] = useState(mockGameQuestions);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(18); // 0:18 as per image
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleOptionSelect = (idx) => {
    setSelections({ ...selections, [currentIdx]: idx });
  };

  const handleSaveAndNext = () => {
    if (selections[currentIdx] === undefined) return;

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  if (isSubmitted) {
    return (
      <div className="quiz-arena" style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldCheck size={32} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Assessment Submitted!</h2>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', lineHeight: '1.5' }}>
            Excellent work! Your answers have been recorded successfully.
          </p>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#1a1b1e' }}>
              Next day result would be showed
            </p>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
              Results will be declared tomorrow at 10:00 AM
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              width: '100%',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Back to Arena Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-arena white-theme">
      <div className="arena-container animate-fade-in">
        
        {/* Top Navigation Bar */}
        <div className="arena-header">
          <div className="category-badge">
            SSC CGL — GK
          </div>
          <div className="timer-display">
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Summary Card */}
        <div className="summary-card">
          <div className="summary-item">
            <span className="label">Prize</span>
            <span className="value">₹500</span>
          </div>
          <div className="summary-item">
            <span className="label">Players</span>
            <span className="value">46</span>
          </div>
          <div className="summary-item">
            <span className="label">Q</span>
            <span className="value">{currentIdx + 1}/{questions.length}</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="question-box">
          <div className="question-number-label">QUESTION {currentIdx + 1}</div>
          <h2 className="question-text">{currentQ.text}</h2>
        </div>

        {/* Options Grid */}
        <div className="options-stack">
          {currentQ.options.map((opt, i) => {
            const isSelected = selections[currentIdx] === i;
            const label = String.fromCharCode(65 + i); // A, B, C, D
            return (
              <button 
                key={i}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(i)}
              >
                <div className="option-indicator">{label}</div>
                <span className="option-content">{opt}</span>
                {isSelected && <CheckCircle2 size={22} className="check-icon" />}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="arena-actions">
          <button 
            className="save-join-btn" 
            onClick={handleSaveAndNext}
            disabled={selections[currentIdx] === undefined}
            style={{ opacity: selections[currentIdx] === undefined ? 0.6 : 1 }}
          >
            {currentIdx === questions.length - 1 ? 'Save and Join' : 'Save and Next'}
          </button>
        </div>

      </div>

      <style>{`
        .quiz-arena.white-theme {
          min-height: 100vh;
          background: #f1f5f9;
          color: #0d121f;
          padding: 24px 16px 80px;
          font-family: 'Outfit', 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .arena-container {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .arena-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .category-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .timer-display {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 18px;
          font-weight: 800;
          color: #64748b;
          font-variant-numeric: tabular-nums;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #404eed;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .summary-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 24px 12px;
          text-align: center;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.03);
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item:not(:last-child) {
          border-right: 1px solid #f1f5f9;
        }

        .summary-item .label {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .summary-item .value {
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }

        .question-box {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 32px 24px;
          border-radius: 28px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .question-number-label {
          font-size: 11px;
          font-weight: 800;
          color: #404eed;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .question-text {
          font-size: 24px;
          font-weight: 850;
          color: #0f172a;
          line-height: 1.35;
          text-align: center;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .option-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          width: 100%;
          color: #0f172a;
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .option-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .option-card.selected {
          background: rgba(16, 185, 129, 0.05);
          border-color: #10b981;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.1);
        }

        .option-indicator {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: #404eed;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .option-card.selected .option-indicator {
          background: #10b981;
          color: white;
        }

        .option-content {
          font-size: 17px;
          font-weight: 700;
          flex: 1;
        }

        .check-icon {
          color: #10b981;
        }

        .arena-actions {
          margin-top: 10px;
        }

        .save-join-btn {
          width: 100%;
          background: #404eed;
          color: white;
          border: none;
          padding: 20px;
          border-radius: 20px;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(64, 78, 237, 0.3);
        }

        .save-join-btn:hover {
          background: #3641c8;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(64, 78, 237, 0.4);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @media (max-width: 480px) {
          .arena-container { gap: 20px; }
          .question-text { font-size: 21px; }
          .summary-item .value { font-size: 20px; }
          .option-card { padding: 16px 20px; }
          .save-join-btn { padding: 18px; font-size: 16px; }
        }
      `}</style>
    </div>
  );
};

export default GameQuestionPage;
