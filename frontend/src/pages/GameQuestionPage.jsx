import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Send, Trophy, Info } from 'lucide-react';

const GameQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1200); // Default 20m for games
  const [questions, setQuestions] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialTime, setInitialTime] = useState(600);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    let headers = {};
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        headers['Authorization'] = `Bearer ${session.token || sessionRaw}`;
      } catch (e) {
        headers['Authorization'] = `Bearer ${sessionRaw}`;
      }
    }

    // 1. Fetch Quiz Details
    fetch(`/api/quizzes/${id}`, { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.quiz.is_submitted) {
            navigate(`/game-result/${id}`);
            return;
          }
          setQuizDetails(data.quiz);
          if (data.quiz.timer_minutes) {
            setTimeLeft(data.quiz.timer_minutes * 60);
            setInitialTime(data.quiz.timer_minutes * 60);
          }
        }
      })
      .catch(console.error);

    // 2. Fetch Questions
    fetch(`/api/quizzes/${id}/questions`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions([
            { id: 'mock', question_text: 'Questions coming soon!', options: [] }
          ]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (isFinished || isSubmitting) return;

    setIsSubmitting(true);

    // Calculate score locally first
    let localScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        localScore += 1;
      }
    });

    const timeSpent = (initialTime || (5 * 60)) - timeLeft;
    const formatTimeLocal = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const stats = {
      score: localScore,
      total: questions.length,
      rank: Math.floor(Math.random() * 50) + 1, 
      time: formatTimeLocal(timeSpent)
    };

    // Check login for actual submission (User or Admin)
    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    
    if (sessionRaw) {
      let token;
      try {
        const session = JSON.parse(sessionRaw);
        token = session.token || sessionRaw;
      } catch (e) {
        token = sessionRaw;
      }

      try {
        const res = await fetch(`/api/quizzes/${id}/submit`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            answers,
            time_taken: stats.time 
          })
        });
        
        const data = await res.json();
        if (data.success && data.submission) {
           // If server returned official stats, use them
           stats.score = parseFloat(data.submission.total_score || stats.score);
           stats.rank = data.submission.rank || stats.rank;
           stats.correct = data.submission.correct_count || 0;
           stats.wrong = data.submission.wrong_count || 0;
        } else {
           alert("Error submitting game quiz: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Submission failed:", err);
        alert("Network error: Could not submit game quiz. Please check your connection.");
      }
    }

    setSubmittedSuccessfully(true);
    
    // Add a small delay so user can see the "Submitted Successfully" green line
    setTimeout(() => {
      setIsFinished(true);
      setIsSubmitting(false);
      navigate(`/game-result/${id}`, { state: stats });
    }, 2000);
    
  }, [answers, id, navigate, isFinished, isSubmitting, questions, timeLeft, initialTime]);

  useEffect(() => {
    if (loading || isFinished) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit, loading, isFinished]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIdx) => {
    if (isFinished) return;
    const q = questions[currentIdx];
    if (q && q.id && q.options && q.options[optionIdx]) {
      setAnswers({ ...answers, [q.id]: String(q.options[optionIdx].value) });
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a192f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #1e293b', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ fontWeight: 800, color: '#94a3b8' }}>Entering Game Arena...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="game-question-page" style={{ minHeight: '100vh', background: '#0f172a', paddingBottom: '3rem' }}>
      <Header />
      
      <div className="container" style={{ padding: '2rem 1rem', paddingTop: '6rem' }}>
        
        {/* Success Notification Bar */}
        {submittedSuccessfully && (
          <div style={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: '#10b981', 
            color: 'white', 
            padding: '1rem 3rem', 
            borderRadius: '1rem', 
            fontWeight: 900, 
            fontSize: '1.1rem', 
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', 
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✓
            </div>
            SUBMITTED SUCCESSFULLY
          </div>
        )}
        
        {/* Top Header */}
        <div className="top-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
          <button 
            className="mobile-back-btn"
            onClick={() => navigate('/home-choice')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#f8fafc',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              zIndex: 10
            }}
          >
            <ChevronLeft size={18} /> <span className="back-text">Back</span>
          </button>

          <div className="title-container">
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
              {quizDetails?.title || 'Check how quiz will feel after joining'}
            </h1>
          </div>

          <div className="stats-container" style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ background: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>ZONE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>GAME</div>
            </div>
            <div style={{ background: timeLeft < 60 ? '#450a0a' : '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid ' + (timeLeft < 60 ? '#ef4444' : '#334155') }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: timeLeft < 60 ? '#ef4444' : '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>TIME LEFT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: timeLeft < 60 ? '#ef4444' : '#f8fafc' }}>{formatTime(timeLeft)}</div>
            </div>
            <div style={{ background: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>ANSWERED</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>{answeredCount}/{questions.length}</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content-flex" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          
          {/* Left Column (Question Card) */}
          <div className="question-card" style={{ flex: '0 1 550px', background: '#ffffff', borderRadius: '1.5rem', padding: '1.5rem', color: '#0f172a' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
              <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px' }}>
                MATCH PREDICTION
              </span>
            </div>

            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', marginBottom: '2rem' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#3b82f6', borderRadius: '999px', transition: 'width 0.3s ease' }}></div>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.4, color: '#0f172a' }}>
              {currentQ?.question_text}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {currentQ?.options?.map((opt, idx) => {
                const isSelected = String(answers[currentQ.id]) === String(opt.value);
                return (
                  <div key={idx} className="option-item" onClick={() => handleOptionSelect(idx)} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', borderRadius: '0.75rem',
                    border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isSelected ? '#1e293b' : '#0f172a',
                      color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 800
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{opt.text}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx(currentIdx - 1);
                  } else {
                    navigate('/home-choice');
                  }
                }}
                style={{
                  background: 'transparent', border: '1px solid #cbd5e1', color: '#0f172a',
                  padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  if (currentIdx < questions.length - 1) {
                    setCurrentIdx(currentIdx + 1);
                  }
                }}
                disabled={currentIdx === questions.length - 1 || isSubmitting}
                style={{
                  background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b',
                  padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  opacity: currentIdx === questions.length - 1 ? 0.3 : 1
                }}
              >
                Skip
              </button>
              <button 
                onClick={() => {
                  if (currentIdx === questions.length - 1) {
                    handleSubmit();
                  } else {
                    setCurrentIdx(currentIdx + 1);
                  }
                }}
                disabled={answers[currentQ?.id] === undefined || isSubmitting}
                style={{
                  background: (answers[currentQ?.id] === undefined || isSubmitting) ? '#94a3b8' : '#3b82f6', border: 'none', color: '#ffffff',
                  padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: (answers[currentQ?.id] === undefined || isSubmitting) ? 'not-allowed' : 'pointer',
                  boxShadow: (answers[currentQ?.id] === undefined || isSubmitting) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease',
                  minWidth: '160px'
                }}
              >
                {isSubmitting ? 'Submitting...' : (currentIdx === questions.length - 1 ? 'Submit Battle' : 'Save & Next')}
              </button>
            </div>
          </div>

          {/* Right Column (Navigator only) */}
          <div className="sidebar-column" style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Question Navigator */}
            <div style={{ background: '#1e293b', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                MATCH NAVIGATOR
              </h3>
              <div className="navigator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                {questions.map((q, i) => {
                  let bg = '#334155';
                  let color = '#94a3b8';
                  
                  if (i === currentIdx) {
                    bg = '#3b82f6'; // Blue for current
                    color = '#ffffff';
                  } else if (answers[q.id] !== undefined) {
                    bg = '#10b981'; // Green for answered (solved)
                    color = '#ffffff';
                  }

                  return (
                    <div key={i} onClick={() => setCurrentIdx(i)} style={{
                      aspectRatio: '1', borderRadius: '0.5rem', background: bg, color: color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Widgets (Moved out of sidebar for mobile) */}
        <div className="bottom-widgets-area" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {/* Live Rank Preview */}
          <div style={{ flex: '1 1 300px', background: '#1e293b', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              ARENA LEADERBOARD
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', background: '#334155', borderRadius: '0.75rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>Estimated Rank</div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Real-time Stats</div>
                </div>
                <div style={{ background: '#475569', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                  #{Math.floor(Math.random() * 100) + 50}
                </div>
              </div>

              {/* Removed Answered from here as it is now in the top header */}
            </div>
          </div>

          {/* Help Note */}
          <div style={{ flex: '1 1 300px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '0.75rem', color: '#3b82f6' }}>
                <Trophy size={20} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>WINNER INFO</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>Top 3 players will receive cash rewards directly to their wallet.</p>
                </div>
             </div>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
          }
          @media (max-width: 768px) {
            .top-header-container {
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              padding-top: 1rem;
            }
            .mobile-back-btn {
              position: absolute;
              left: 0;
              top: 0.5rem;
            }
            .back-text {
              display: none;
            }
            .title-container {
              text-align: center !important;
              width: 100% !important;
              margin-bottom: 0.5rem;
            }
            .stats-container {
              justify-content: center !important;
              width: 100% !important;
            }
            .question-page-container {
              padding: 3.5rem 0.1rem 1rem 0.1rem !important;
            }
            .main-content-flex {
              flex-direction: row !important;
              flex-wrap: nowrap !important;
              gap: 2px !important;
            }
            .question-card {
              padding: 0.35rem !important;
              border-radius: 0.4rem !important;
              flex: 1 1 72% !important;
              min-width: 0 !important;
              overflow: hidden !important;
            }
            .sidebar-column {
              display: flex !important;
              flex: 0 0 26% !important;
              min-width: 0 !important;
              gap: 2px !important;
            }
            .sidebar-column > div {
              padding: 0.4rem !important;
              border-radius: 0.4rem !important;
            }
            .sidebar-column h3 {
              font-size: 0.45rem !important;
              margin-bottom: 0.2rem !important;
            }
            .sidebar-column .navigator-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 2px !important;
            }
            .sidebar-column .navigator-grid > div {
              height: 20px !important;
              font-size: 0.6rem !important;
            }
            .bottom-widgets-area {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            .bottom-widgets-area > div {
              flex: 1 1 100% !important;
              padding: 0.75rem !important;
            }
            .question-card h2 {
              font-size: 1rem !important;
              margin-bottom: 0.75rem !important;
            }
            .question-card .option-item {
              padding: 0.5rem !important;
              gap: 0.25rem !important;
              border-radius: 0.5rem !important;
            }
            .question-card .option-item span {
              font-size: 0.75rem !important;
            }
            .question-card .option-item div {
              width: 18px !important;
              height: 18px !important;
              font-size: 0.6rem !important;
            }
            .question-card button {
              padding: 0.8rem 1rem !important;
              font-size: 0.85rem !important;
              font-weight: 900 !important;
              flex: 1 !important;
              border-radius: 0.75rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GameQuestionPage;

