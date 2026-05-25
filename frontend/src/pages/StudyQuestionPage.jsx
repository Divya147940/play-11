import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Send, Trophy, Info } from 'lucide-react';

const StudyQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // Default 10m
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

    // Parallel fetching for 2x faster loading
    Promise.all([
      fetch(`/api/quizzes/${id}`, { headers }).then(res => res.json()),
      fetch(`/api/quizzes/${id}/questions`, { headers }).then(res => res.json())
    ])
      .then(([quizData, questionsData]) => {
        // Handle Quiz Details
        if (quizData.success) {
          if (quizData.quiz.is_submitted) {
            navigate(`/study-result/${id}`);
            return;
          }
          setQuizDetails(quizData.quiz);
          if (quizData.quiz.timer_minutes) {
            setTimeLeft(quizData.quiz.timer_minutes * 60);
            setInitialTime(quizData.quiz.timer_minutes * 60);
          }
        }

        // Handle Questions
        if (questionsData.success && questionsData.questions.length > 0) {
          setQuestions(questionsData.questions);
        } else {
          setQuestions([{ id: 'mock', question_text: 'No questions available.', options: [] }]);
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
      rank: '-',  // Will be filled by server after submission
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
            // Format answers correctly for the backend
            answers: Object.keys(answers).reduce((acc, idx) => {
              const q = questions[parseInt(idx)];
              const optIdx = answers[idx];
              if (q && q.options && q.options[optIdx]) {
                acc[q.id] = String(q.options[optIdx].value);
              }
              return acc;
            }, {}),
            time_taken: stats.time 
          })
        });
        
        const data = await res.json();
        if (data.success && data.submission) {
           stats.score = parseFloat(data.submission.total_score || stats.score);
           stats.rank = data.submission.rank || stats.rank;
           stats.correct = data.submission.correct_count || 0;
           stats.wrong = data.submission.wrong_count || 0;
        } else {
           alert("Error submitting quiz: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Submission failed:", err);
        alert("Network error: Could not submit quiz. Please check your connection.");
      }
    }

    setSubmittedSuccessfully(true);

    // Remove the 2s artificial delay for instant loading
    setTimeout(() => {
      setIsFinished(true);
      setIsSubmitting(false);
      navigate(`/study-result/${id}`, { state: stats });
    }, 100);
    
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
    // Use currentIdx as the key for 100% reliability in UI highlighting
    setAnswers({ ...answers, [currentIdx]: optionIdx });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a192f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #1e293b', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ fontWeight: 800, color: '#94a3b8' }}>Entering Study Arena...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="study-question-page" style={{ minHeight: '100vh', background: '#0f172a', paddingBottom: '3rem' }}>
      <Header />
      
      <div className="container" style={{ padding: '0 1rem 2rem 1rem', paddingTop: '60px', maxWidth: '100%' }}>
        {/* Quiz Banner - Moved to top for edge-to-edge look */}
        {quizDetails?.effective_banner_url && (
          <div style={{ 
            width: 'calc(100% + 2rem)', 
            marginLeft: '-1rem',
            marginRight: '-1rem',
            height: 'clamp(160px, 25vh, 300px)', 
            borderRadius: '0', 
            backgroundColor: '#0d1f3c', 
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src={quizDetails.effective_banner_url} 
              alt="Quiz Banner" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'fill', 
                display: 'block' 
              }} 
            />
          </div>
        )}

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '1rem', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/home-choice')}>
              <ChevronLeft size={24} color="#ffffff" />
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0', color: '#ffffff' }}>
                {quizDetails?.title || 'Movies'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.1rem' }}>ZONE</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>STUDY</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: timeLeft < 60 ? '#ef4444' : '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.1rem' }}>TIME LEFT</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: timeLeft < 60 ? '#ef4444' : '#ffffff' }}>{formatTime(timeLeft)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.1rem' }}>ANSWERED</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>{answeredCount}/{questions.length}</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content-flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
          
          {/* Question Card */}
          <div className="question-card" style={{ width: '100%', background: '#ffffff', borderRadius: '1.5rem', padding: '1.5rem', color: '#0f172a' }}>

            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.4, color: '#334155' }}>
              Q{currentIdx + 1}. {currentQ?.question_text}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '3rem' }}>
              {currentQ?.options?.map((opt, idx) => {
                // Simplest possible check to avoid any equality issues
                const isSelected = answers[currentIdx] == idx;
                const activeBg = '#3b82f6';
                const activeText = '#ffffff';
                
                return (
                  <div key={idx} className={`option-item ${isSelected ? 'selected' : ''}`} onClick={() => handleOptionSelect(idx)} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1.25rem 1.5rem', borderRadius: '1rem',
                    border: isSelected ? `2px solid ${activeBg}` : '1px solid #e2e8f0',
                    background: isSelected ? activeBg : '#ffffff',
                    color: isSelected ? activeText : '#0f172a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 8px 20px -4px rgba(59, 130, 246, 0.3)' : 'none'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: isSelected ? '#ffffff' : '#1e293b',
                      color: isSelected ? '#3b82f6' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 800
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{opt.text}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
              <button 
                onClick={() => {
                  if (currentIdx > 0) { setCurrentIdx(currentIdx - 1); }
                  else { navigate('/home-choice'); }
                }}
                style={{
                  flex: 1, background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569',
                  padding: '0.75rem 0', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Previous
              </button>
              <button 
                onClick={() => { if (currentIdx < questions.length - 1) { setCurrentIdx(currentIdx + 1); } }}
                disabled={currentIdx === questions.length - 1 || isSubmitting}
                style={{
                  flex: 1, background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569',
                  padding: '0.75rem 0', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  opacity: currentIdx === questions.length - 1 ? 0.3 : 1
                }}
              >
                Skip
              </button>
              <button 
                onClick={() => {
                  if (currentIdx === questions.length - 1) { handleSubmit(); }
                  else { setCurrentIdx(currentIdx + 1); }
                }}
                disabled={answers[currentIdx] === undefined || isSubmitting}
                style={{
                  flex: 1.5, background: (answers[currentIdx] === undefined || isSubmitting) ? '#94a3b8' : '#0052cc', border: 'none', color: '#ffffff',
                  padding: '0.75rem 0', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem',
                  cursor: (answers[currentIdx] === undefined || isSubmitting) ? 'not-allowed' : 'pointer',
                  boxShadow: (answers[currentIdx] === undefined || isSubmitting) ? 'none' : '0 4px 10px rgba(0, 82, 204, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? 'Submitting...' : (currentIdx === questions.length - 1 ? 'Submit Battle' : 'Save & Next')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Widgets (Moved out of sidebar for mobile) */}
        <div className="bottom-widgets-area" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ flex: '1 1 300px', background: '#1e293b', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              LIVE RANK PREVIEW
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', background: '#334155', borderRadius: '0.75rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>Progress</div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Questions Attempted</div>
                </div>
                <div style={{ background: '#475569', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                  {answeredCount}/{questions.length}
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div style={{ flex: '1 1 300px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '0.75rem', color: '#38bdf8' }}>
                <Info size={20} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>PRO TIP</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>Quick answers grant bonus points in the final calculation.</p>
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
              padding: 0.5rem 0.75rem !important;
              font-size: 0.7rem !important;
              min-width: 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default StudyQuestionPage;

