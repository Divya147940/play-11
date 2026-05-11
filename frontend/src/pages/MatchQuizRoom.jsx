import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { quizService } from '../services/api';

const MatchQuizRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // quizId
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [language, setLanguage] = useState('English'); // 'English' or 'Hindi'
  const [submissionResult, setSubmissionResult] = useState(null);
  const [globalBanner, setGlobalBanner] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizObj = await quizService.getQuizById(id);
        if (quizObj.is_submitted) {
          navigate(`/game-result/${id}`);
          return;
        }
        setQuiz(quizObj);
        setTimeLeft((quizObj.timer_minutes || 10) * 60);

        const qRes = await quizService.getQuestions(id);
        setQuestions(qRes);

        // Fetch global banner
        const { settingsService } = await import('../services/api');
        const bannerData = await settingsService.getSetting('quiz_room_banner_url');
        if (bannerData.success) {
          setGlobalBanner(bannerData.value);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to load quiz');
        navigate('/game-home');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = useCallback(async () => {
    if (isFinished) return;
    setLoading(true);
    try {
      // Convert {0: 1, 1: 3} to [{question_id: '...', selected_value: '...'}]
      const formattedAnswers = Object.keys(answers).map(idx => {
        const q = questions[parseInt(idx)];
        const optIdx = answers[idx];
        return {
          question_id: q.id,
          selected_value: q.options[optIdx].value
        };
      });

      const result = await quizService.submitQuiz(id, formattedAnswers);
      setSubmissionResult(result);
      setIsFinished(true);
    } catch (err) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  }, [answers, id, isFinished, questions]);

  useEffect(() => {
    if (isFinished || loading || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, loading, quiz, handleSubmit]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (idx) => {
    if (isFinished) return;
    setAnswers({ ...answers, [currentIdx]: idx });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      navigate('/game-home');
    }
  };

  if (loading && !quiz) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', background: '#f8fafc' }}>Loading Quiz...</div>;
  }

  const currentQ = questions[currentIdx];
  const progressPercent = questions.length ? ((currentIdx + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  const score = submissionResult?.result?.total_score || 0;
  const rank = submissionResult?.result?.rank || '-';
  const correct = submissionResult?.result?.correct_count || 0;
  const wrong = submissionResult?.result?.wrong_count || 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: 'Inter, sans-serif', 
      color: '#0f172a',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div className="match-quiz-room" style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
      <Header />
      {/* Global Admin Banner */}
      {globalBanner && (
        <div style={{ 
          width: '100%', 
          height: '150px', 
          backgroundColor: '#0d1f3c', 
          borderBottom: '1px solid #e2e8f0',
          position: 'fixed',
          top: '70px',
          zIndex: 99,
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          {/* Blurred Background Layer */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `url("${globalBanner}") center/100% 100% no-repeat`,
            filter: 'blur(15px) brightness(0.6)',
            transform: 'scale(1.2)',
            zIndex: 0
          }}></div>
          
          {/* Clear Contain Layer */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            background: `url("${globalBanner}") center/100% 100% no-repeat`,
          }}></div>
        </div>
      )}
      
      <div className="container" style={{ padding: '2rem 1rem', paddingTop: globalBanner ? '230px' : '90px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            {/* Dynamic Banner Section */}
            <div className="quiz-banner-card" style={{ 
              width: '100%', 
              borderRadius: '0', 
              padding: '0', 
              marginBottom: '2rem',
              minHeight: '180px',
              display: 'flex',
              alignItems: 'center',
              background: quiz?.banner_url ? `url("${quiz.banner_url}") center/100% 100% no-repeat` : (globalBanner ? `url("${globalBanner}") center/100% 100% no-repeat` : 'radial-gradient(circle at top right, #1e3a8a, #0d1f3c)'),
              backgroundColor: '#0d1f3c', // Fallback color
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!quiz?.banner_url && <div className="quiz-banner-overlay" style={{ opacity: 0.1 }}></div>}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '999px', marginBottom: '0.75rem', backdropFilter: 'blur(5px)' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7dd3fc' }}>QUIZ LIVE FORMAT</span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#ffffff', lineHeight: 1.1 }}>
                  {isFinished ? (language === 'Hindi' ? "मैच क्विज पूरा हुआ" : "Match Quiz Completed") : (language === 'Hindi' ? (quiz?.hindi_title || quiz?.title) : quiz?.title)}
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500, maxWidth: '600px' }}>
                  {language === 'Hindi' ? (quiz?.hindi_description || quiz?.description) : quiz?.description}
                </p>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                <div className="quiz-stat-box" style={{ padding: '0.5rem 1rem', minWidth: '80px', borderRadius: '1rem' }}>
                  <p style={{ fontSize: '0.55rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.2rem', textTransform: 'uppercase' }}>QUESTIONS</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>{questions.length}</p>
                </div>
                <div className="quiz-stat-box" style={{ padding: '0.5rem 1rem', minWidth: '80px', borderRadius: '1rem', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                  <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#7dd3fc', marginBottom: '0.2rem', textTransform: 'uppercase' }}>DURATION</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>{quiz?.timer_minutes} Min</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Language Selection Toggle */}
            <div style={{ 
              display: 'flex', 
              background: '#f1f5f9', 
              padding: '0.3rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #e2e8f0',
              marginRight: '0.5rem'
            }}>
              <button 
                onClick={() => setLanguage('English')}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  borderRadius: '0.5rem', 
                  background: language === 'English' ? '#3b82f6' : 'transparent',
                  color: language === 'English' ? 'white' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('Hindi')}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  borderRadius: '0.5rem', 
                  background: language === 'Hindi' ? '#3b82f6' : 'transparent',
                  color: language === 'Hindi' ? 'white' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                HI
              </button>
            </div>

            {/* Removed 3 header points (Zone, Time, Progress) */}
          </div>
        </div>

        {!isFinished ? (
          /* Main Content Area */
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            
            {/* Left Column (Question Card) */}
            <div className="quiz-main-card" style={{ flex: '1 1 650px', background: '#ffffff', borderRadius: '1.5rem', padding: 'clamp(1rem, 5vw, 2rem)', color: '#0f172a', minWidth: '0', boxSizing: 'border-box', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  QUESTION {currentIdx + 1} OF {questions.length}
                </span>
                <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', border: '1px solid #dbeafe' }}>
                  {language === 'Hindi' ? `${quiz?.timer_minutes} मिनट की क्विज` : `${quiz?.timer_minutes} MINUTES QUIZ`}
                </span>
              </div>

              <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', marginBottom: '2rem' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: '#3b82f6', borderRadius: '999px', transition: 'width 0.3s ease' }}></div>
              </div>

              <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.4, color: '#0f172a' }}>
                {language === 'Hindi' ? (currentQ?.hindi_question_text || currentQ?.question_text) : currentQ?.question_text}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {currentQ?.options?.map((opt, idx) => {
                  const isSelected = answers[currentIdx] === idx;
                  return (
                    <div key={idx} onClick={() => handleOptionClick(idx)} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', borderRadius: '0.75rem',
                      border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: isSelected ? '#0f172a' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 800, border: isSelected ? 'none' : '1px solid #e2e8f0'
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', fontWeight: 700, color: '#0f172a', wordBreak: 'break-word' }}>
                        {language === 'Hindi' ? (opt.hindiText || opt.text) : opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handlePrev}
                  style={{
                    background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                  }}
                >
                  {currentIdx === 0 ? (language === 'Hindi' ? "वापस" : "Back") : (language === 'Hindi' ? "पिछला" : "Previous")}
                </button>
                <button 
                  onClick={handleNext}
                  disabled={answers[currentIdx] === undefined || loading}
                  style={{
                    background: answers[currentIdx] === undefined ? '#cbd5e1' : '#3b82f6', border: 'none', color: '#ffffff',
                    padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: (answers[currentIdx] === undefined || loading) ? 'not-allowed' : 'pointer',
                    boxShadow: answers[currentIdx] === undefined ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? '...' : (currentIdx === questions.length - 1 
                    ? (language === 'Hindi' ? 'सबमिट' : 'Submit') 
                    : (language === 'Hindi' ? 'सेव और नेक्स्ट' : 'Save & Next'))}
                </button>
              </div>
            </div>

            {/* Right Column (Sidebars) */}
            <div className="quiz-sidebar" style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '0', boxSizing: 'border-box' }}>
              
              {/* Question Navigator */}
              <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                  {language === 'Hindi' ? 'प्रश्न नेविगेटर' : 'QUESTION NAVIGATOR'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))', gap: '0.6rem' }}>
                  {questions.map((_, i) => {
                    let bg = '#f1f5f9';
                    let color = '#94a3b8';
                    let border = '1px solid #e2e8f0';
                    
                    if (i === currentIdx) {
                      bg = '#10b981'; // Green for current
                      color = '#ffffff';
                      border = 'none';
                    } else if (answers[i] !== undefined) {
                      bg = '#eff6ff'; // Light blue for answered
                      color = '#3b82f6';
                      border = '1px solid #dbeafe';
                    }

                    return (
                      <div key={i} onClick={() => setCurrentIdx(i)} style={{
                        aspectRatio: '1', borderRadius: '0.5rem', background: bg, color: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                        transition: 'all 0.2s ease', border: border
                      }}>
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quiz Summary Sidebar */}
              <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                  {language === 'Hindi' ? 'क्विज सारांश' : 'QUIZ SUMMARY'}
                </h3>
                
                <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Answered</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{answeredCount} saved</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', border: '1px solid #e2e8f0' }}>
                    {answeredCount}/{questions.length}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Points/Q</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>+{quiz?.marks_per_q} | -{quiz?.negative_marks}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', border: '1px solid #e2e8f0' }}>
                    {quiz?.marks_per_q}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Result Screen */
          <div>
            <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '3rem', color: '#0f172a', textAlign: 'center', marginBottom: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{language === 'Hindi' ? "क्विज पूरा हुआ!" : "Quiz Completed!"}</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>{language === 'Hindi' ? "आपने सफलतापूर्वक क्विज पूरा कर लिया है।" : `You have successfully completed the ${quiz?.title}.`}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>FINAL SCORE</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{score.toFixed(1)}</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>YOUR RANK</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>#{rank}</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ACCURACY</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{correct}/{questions.length}</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>WRONG</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{wrong}</div>
                </div>
              </div>

              <div style={{ marginTop: '3rem' }}>
                <button 
                  onClick={() => navigate('/game-home')}
                  style={{
                    background: '#0f172a', border: 'none', color: '#ffffff',
                    padding: '1rem 3rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                  }}
                >
                  Return to Game Zone
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .quiz-main-card, .quiz-sidebar {
            flex: 1 1 100% !important;
          }
        }
        @media (max-width: 768px) {
          .quiz-main-card {
            border-radius: 1.25rem !important;
          }
        }
        @media (max-width: 480px) {
          .quiz-main-card {
            padding: 1rem !important;
          }
          button {
            padding: 0.6rem 1rem !important;
            font-size: 0.8rem !important;
            flex: 1;
            min-width: 100px;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default MatchQuizRoom;
