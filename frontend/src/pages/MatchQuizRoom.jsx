import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { quizService } from '../services/api';
import { ArrowLeft, Clock, ShieldCheck, Ticket, Users, Trophy, AlertCircle } from 'lucide-react';

const MatchQuizRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // quizId
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = localStorage.getItem(`match_idx_${id}`);
    return saved ? parseInt(saved) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`match_answers_${id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [language, setLanguage] = useState('English'); // 'English' or 'Hindi'
  const [submissionResult, setSubmissionResult] = useState(null);
  const [globalBanner, setGlobalBanner] = useState(localStorage.getItem('play11_quiz_room_banner') || localStorage.getItem('play11_home_banner') || '');
  const [lobbyTimeLeft, setLobbyTimeLeft] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Payment gateway states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select'); // select, upi, qr, card, banking, wallet, processing, success
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [qrTimer, setQrTimer] = useState(300); // 5 mins countdown

  const fetchQuestions = async () => {
    try {
      const qRes = await quizService.getQuestions(id);
      setQuestions(qRes);
    } catch (err) {
      console.error('Questions fetch error:', err);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const quizObj = await quizService.getQuizById(id);

      if (quizObj.is_submitted) {
        navigate(`/game-result/${id}`);
        return;
      }
      setQuiz(quizObj);
      setQuiz(quizObj);

      if (quizObj.effective_banner_url) {
        setGlobalBanner(quizObj.effective_banner_url);
        localStorage.setItem('play11_quiz_room_banner', quizObj.effective_banner_url);
      } else {
        localStorage.removeItem('play11_quiz_room_banner');
      }

      const entryFee = parseInt(quizObj.entry_amount || 0);
      const userCanPlay = entryFee === 0 || quizObj.is_registered;

      if (userCanPlay && quizObj.status_label === 'LIVE') {
         await fetchQuestions();
         const durationSec = (quizObj.timer_minutes || 10) * 60;
         const savedEndTime = localStorage.getItem(`match_end_${id}`);
         if (savedEndTime) {
           const remaining = Math.max(0, Math.floor((parseInt(savedEndTime) - Date.now()) / 1000));
           setTimeLeft(remaining);
         } else {
           localStorage.setItem(`match_end_${id}`, Date.now() + durationSec * 1000);
           setTimeLeft(durationSec);
         }
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to load quiz');
      navigate('/quiz-arena/sport-zone');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!showPaymentModal || paymentStep !== 'qr') return;
    
    const interval = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPaymentStep('select');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [showPaymentModal, paymentStep]);

  useEffect(() => {
    if (!quiz || quiz.status_label !== 'UPCOMING') return;
    
    const updateLobbyTimer = () => {
      const openTime = new Date(quiz.open_at).getTime();
      const diff = Math.max(0, Math.floor((openTime - Date.now()) / 1000));
      setLobbyTimeLeft(diff);
      
      if (diff <= 0) {
        // Quiz is live, refresh data to fetch questions
        fetchData();
      }
    };
    
    updateLobbyTimer();
    const interval = setInterval(updateLobbyTimer, 1000);
    return () => clearInterval(interval);
  }, [quiz, fetchData]);

  const handleConfirmBooking = async () => {
    if (!quiz) return;
    setBookingLoading(true);
    try {
      const res = await quizService.registerQuiz(quiz.id);
      alert(res.message || 'Successfully joined!');
      fetchData(); // Refresh to update registration status
    } catch (err) {
      alert(err.message || 'Join failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setPaymentStep('processing');
    try {
      const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
      let token;
      try {
        const session = JSON.parse(sessionRaw);
        token = session.token || sessionRaw;
      } catch (e) {
        token = sessionRaw;
      }
      
      const entryFee = parseInt(quiz?.entry_amount || 0);

      // Call our creditCoins endpoint to add simulated coins to user's wallet
      const depositRes = await fetch('/api/wallet/credit-coins', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: entryFee })
      });
      
      const depositData = await depositRes.json();
      if (!depositData.success) {
        throw new Error(depositData.message || 'Deposit failed');
      }

      // Now register for the quiz
      const regRes = await quizService.registerQuiz(quiz.id);
      
      setPaymentStep('success');
      setTimeout(() => {
        setShowPaymentModal(false);
        fetchData(); // Refresh page to reflect registration
      }, 2000);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
      setPaymentStep('select');
    }
  };

  const handleSubmit = useCallback(async () => {
    if (isFinished) return;
    setLoading(true);
    try {
      const formattedAnswers = {};
      Object.keys(answers).forEach(idx => {
        const q = questions[parseInt(idx)];
        const optIdx = answers[idx];
        if (q && q.options && q.options[optIdx]) {
          formattedAnswers[q.id] = q.options[optIdx].value;
        }
      });

      const result = await quizService.submitQuiz(id, formattedAnswers);
      setSubmissionResult(result);
      setIsFinished(true);
      localStorage.removeItem(`match_end_${id}`);
      localStorage.removeItem(`match_answers_${id}`);
      localStorage.removeItem(`match_idx_${id}`);
    } catch (err) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  }, [answers, id, isFinished, questions]);

  useEffect(() => {
    // Only run timer if they are authorized to play
    const entryFee = parseInt(quiz?.entry_amount || 0);
    const userCanPlay = entryFee === 0 || quiz?.is_registered;

    if (isFinished || loading || !quiz || !userCanPlay || quiz.status_label !== 'LIVE') return;
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

  useEffect(() => {
    if (!loading && !isFinished) {
      localStorage.setItem(`match_idx_${id}`, currentIdx);
    }
  }, [currentIdx, id, loading, isFinished]);

  const handleOptionClick = (idx) => {
    if (isFinished) return;
    const newAnswers = { ...answers, [currentIdx]: idx };
    setAnswers(newAnswers);
    localStorage.setItem(`match_answers_${id}`, JSON.stringify(newAnswers));
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
      navigate('/quiz-arena/sport-zone');
    }
  };

  if (loading && !quiz) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', background: '#f8fafc' }}>Loading Quiz...</div>;
  }

  const currentQ = questions[currentIdx];
  const progressPercent = questions.length ? ((currentIdx + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  const score = submissionResult?.submission?.total_score || submissionResult?.result?.score || 0;
  const rank = submissionResult?.submission?.rank || submissionResult?.result?.rank || '-';
  const correct = submissionResult?.submission?.correct_count || submissionResult?.result?.correct || 0;
  const wrong = submissionResult?.submission?.wrong_count || submissionResult?.result?.wrong || 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      fontFamily: 'Inter, sans-serif', 
      color: '#f8fafc',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div className="match-quiz-room" style={{ minHeight: '100vh', background: '#0f172a', paddingBottom: '3rem' }}>
      <Header />
      {/* Global Admin Banner */}
      {globalBanner && (
        <div style={{ 
          width: '100%', 
          height: '150px', 
          backgroundColor: '#0d1f3c', 
          borderBottom: 'none',
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
      
      <div className="container" style={{ padding: '2rem 1rem', paddingTop: globalBanner ? '230px' : '85px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '2rem', gap: '1rem', textAlign: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/home-choice')}>
              <ArrowLeft size={24} color="#ffffff" />
              <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 900, margin: '0', color: '#ffffff', textAlign: 'left' }}>
                {isFinished ? (language === 'Hindi' ? "मैच क्विज पूरा हुआ" : "Match Quiz Completed") : (language === 'Hindi' ? (quiz?.hindi_title || quiz?.title) : quiz?.title)}
              </h1>
            </div>
          </div>

          {!isFinished && quiz?.status_label !== 'UPCOMING' && (
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', background: '#1e293b', padding: '1rem', borderRadius: '1rem', border: '1px solid #334155' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>ZONE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>MATCH</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: timeLeft < 60 ? '#ef4444' : '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>TIME LEFT</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: timeLeft < 60 ? '#ef4444' : '#38bdf8' }}>{formatTime(timeLeft)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>PROGRESS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>{answeredCount}/{questions.length}</div>
              </div>
            </div>
          )}
        </div>

        {!isFinished ? (
          (() => {
            const entryFee = parseInt(quiz?.entry_amount || 0);
            const needsRegistration = entryFee > 0 && !quiz?.is_registered;

            if (needsRegistration) {
              if (quiz?.status_label === 'LIVE' || quiz?.status_label === 'CLOSED') {
                return (
                  <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444' }}>
                      <AlertCircle size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>Registration Closed</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>
                      You cannot join this quiz because you did not register/join it while it was upcoming.
                    </p>
                    <button 
                      onClick={() => navigate('/home-choice')}
                      style={{ background: '#0f172a', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', width: '100%', transition: 'all 0.2s ease', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}
                    >
                      Back to Arena
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#3b82f6' }}>
                    <Ticket size={40} />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>Join Registration</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>Secure your spot in this quiz by paying the entry fee now.</p>
                  
                  <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569' }}>Entry Fee</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>₹{entryFee}</span>
                  </div>

                  <button 
                    onClick={() => { setShowPaymentModal(true); setPaymentStep('select'); setQrTimer(300); }}
                    disabled={bookingLoading}
                    style={{
                      width: '100%', padding: '1.25rem', borderRadius: '1rem', border: 'none', background: '#3b82f6', color: '#ffffff', fontSize: '1.1rem', fontWeight: 800, cursor: bookingLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    Confirm & Register (₹{entryFee})
                  </button>
                </div>
              );
            }

            if (quiz?.status_label === 'UPCOMING') {
              return (
                <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                    <Clock size={40} />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' }}>Waiting Room</h2>
                  {entryFee > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                      <ShieldCheck size={16} /> Successfully Registered
                    </div>
                  )}
                  <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>The quiz will start automatically when the timer reaches zero.</p>
                  
                  <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Starts In</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace', letterSpacing: '-0.05em' }}>
                      {formatTime(lobbyTimeLeft)}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              /* Main Content Area */
              <div className="main-content-flex" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            
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
                      padding: '1.25rem 1.5rem', borderRadius: '1rem',
                      border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      background: isSelected ? '#3b82f6' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 8px 20px -4px rgba(59, 130, 246, 0.3)' : 'none'
                    }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isSelected ? '#ffffff' : '#f1f5f9',
                        color: isSelected ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800, border: isSelected ? 'none' : '1px solid #e2e8f0'
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', fontWeight: 800, wordBreak: 'break-word' }}>
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
                  onClick={() => {
                    if (currentIdx < questions.length - 1) {
                      setCurrentIdx(currentIdx + 1);
                    }
                  }}
                  disabled={currentIdx === questions.length - 1 || loading}
                  style={{
                    background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    opacity: currentIdx === questions.length - 1 ? 0.3 : 1
                  }}
                >
                  {language === 'Hindi' ? "छोड़ें" : "Skip"}
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


          </div>
            );
          })()
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
                  onClick={() => navigate('/home-choice')}
                  style={{
                    background: '#0f172a', border: 'none', color: '#ffffff',
                    padding: '1rem 3rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                  }}
                >
                  Return to Quiz Arena
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
          .main-content-flex {
            flex-direction: column-reverse !important;
          }
          .navigator-bar {
            padding: 0.75rem 1rem !important;
            border-radius: 0.75rem !important;
            margin-bottom: 0.75rem !important;
          }
          .navigator-bar h3 {
            font-size: 0.55rem !important;
            margin-bottom: 0.5rem !important;
          }
          .navigator-grid {
            display: grid !important;
            grid-template-columns: repeat(10, 1fr) !important;
            gap: 4px !important;
          }
          .navigator-grid > div {
            width: 100% !important;
            height: 28px !important;
            font-size: 0.7rem !important;
            border-radius: 4px !important;
          }
          .quiz-main-card {
            border-radius: 1rem !important;
            padding: 1rem !important;
          }
          .bottom-widgets-area {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .bottom-widgets-area > div {
            flex: 1 1 100% !important;
            padding: 0.75rem !important;
          }
        }
        @media (max-width: 480px) {
          button {
            padding: 0.6rem 1rem !important;
            font-size: 0.8rem !important;
            flex: 1;
            min-width: 100px;
          }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .pay-option:hover {
          border-color: #3b82f6 !important;
          background: #3b82f605 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
        }
      `}</style>
      
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
          boxSizing: 'border-box'
        }}>
          {/* Modal Container */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            color: '#1e293b',
            fontFamily: "'Outfit', sans-serif",
            animation: 'fadeIn 0.3s ease-out',
            border: '1px solid #e2e8f0'
          }}>
            {/* Header */}
            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {paymentStep !== 'select' && paymentStep !== 'processing' && paymentStep !== 'success' && (
                  <button 
                    onClick={() => setPaymentStep('select')}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                )}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Quzo Quiz Arena</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Secure Checkout</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', marginRight: '2.5rem' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, display: 'block' }}>AMOUNT</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>₹{quiz?.entry_amount || 0}</span>
              </div>

              {paymentStep !== 'processing' && paymentStep !== 'success' && (
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* 1. SELECT PAYMENT METHOD */}
              {paymentStep === 'select' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px 0', letterSpacing: '0.05em' }}>PAYMENT OPTIONS</p>
                  
                  {/* UPI Option */}
                  <div 
                    onClick={() => { setPaymentStep('upi'); setUpiApp(''); setUpiId(''); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                    className="pay-option"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: '#4f46e5' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>UPI / Mobile Apps</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Google Pay, PhonePe, Paytm, BHIM</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>→</span>
                  </div>

                  {/* QR Scan Option */}
                  <div 
                    onClick={() => { setPaymentStep('qr'); setQrTimer(300); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                    className="pay-option"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: '#059669' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Scan QR Code</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Scan with any UPI app to pay</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>→</span>
                  </div>

                  {/* Cards Option */}
                  <div 
                    onClick={() => setPaymentStep('card')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                    className="pay-option"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: '#ea580c' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Cards (Credit/Debit)</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visa, Mastercard, RuPay, Maestro</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>→</span>
                  </div>

                  {/* Net Banking Option */}
                  <div 
                    onClick={() => { setPaymentStep('banking'); setSelectedBank(''); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                    className="pay-option"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: '#0284c7' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="21" x2="21" y2="21"></line><line x1="3" y1="10" x2="21" y2="10"></line><polygon points="12 2 2 10 22 10"></polygon><line x1="6" y1="21" x2="6" y2="10"></line><line x1="14" y1="21" x2="14" y2="10"></line></svg>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Net Banking</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>SBI, HDFC, ICICI, Axis & others</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>→</span>
                  </div>

                  {/* Wallets Option */}
                  <div 
                    onClick={() => { setPaymentStep('wallet'); setSelectedWallet(''); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '16px', border: '1.5px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                    className="pay-option"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: '#db2777' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 0-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4Z"></path></svg>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Wallets</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Paytm, PhonePe Wallet, Mobikwik</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>→</span>
                  </div>
                </div>
              )}

              {/* 2. UPI SCREEN */}
              {paymentStep === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>PAY USING UPI APP</p>
                  
                  {/* UPI Apps Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'phonepe', name: 'PhonePe', color: '#5f259f' },
                      { id: 'gpay', name: 'GPay', color: '#4285F4' },
                      { id: 'paytm', name: 'Paytm', color: '#00baf2' },
                      { id: 'bhim', name: 'BHIM', color: '#f05a28' }
                    ].map(app => (
                      <div 
                        key={app.id}
                        onClick={() => { setUpiApp(app.id); setUpiId(app.id === 'bhim' ? 'test@upi' : `test@${app.id}`); }}
                        style={{
                          border: `2px solid ${upiApp === app.id ? app.color : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '10px 4px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: upiApp === app.id ? `${app.color}08` : 'white',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: app.color, color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 6px', fontSize: '0.9rem', fontWeight: 900
                        }}>
                          {app.name[0]}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{app.name}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ position: 'relative', margin: '8px 0' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#cbd5e1', zIndex: 0 }}></div>
                    <span style={{ position: 'relative', background: '#ffffff', padding: '0 12px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'table', margin: '0 auto', zIndex: 1 }}>OR ENTER UPI ID</span>
                  </div>

                  {/* UPI ID Input */}
                  <div>
                    <input 
                      type="text"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        border: '2px solid #cbd5e1', fontSize: '1rem', fontWeight: 600,
                        outline: 'none', background: '#f8fafc', color: '#1e293b'
                      }}
                    />
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!upiId}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                      background: '#0f172a', color: 'white', fontSize: '1rem', fontWeight: 800,
                      cursor: !upiId ? 'not-allowed' : 'pointer', opacity: !upiId ? 0.5 : 1,
                      marginTop: '8px', transition: 'all 0.2s'
                    }}
                  >
                    Pay ₹{quiz?.entry_amount}
                  </button>
                </div>
              )}

              {/* 3. QR CODE SCAN SCREEN */}
              {paymentStep === 'qr' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>SCAN TO PAY</p>
                  
                  {/* Custom Simulated QR Code */}
                  <div style={{
                    padding: '12px', background: 'white', borderRadius: '16px',
                    border: '1.5px solid #e2e8f0', boxShadow: '0 8px 16px rgba(0,0,0,0.02)'
                  }}>
                    <svg width="150" height="150" viewBox="0 0 29 29" fill="none">
                      <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm1 1h3v3H2V2zm6-2h1v1H8V0zm2 0h1v2h-1V0zm2 0h1v1h-1V0zm1 1h1v1h-1V1zm-2 1h1v1h-1V2zm3 0h1v1h-1V2zm-3 1h1v2h-1V3zm2 0h1v1h-1V3zm2 0h1v1h-1V3zm-2 2h1v1h-1V5zm2 0h1v2h-1V5zm-2 1h1v1h-1V6zm-8 2h7v7H0V8zm1 1v5h5V9H1zm1 1h3v3H2V10zm6-2h1v1H8V8zm2 0h1v1h-1V8zm2 0h1v1h-1V8zm3 0h1v1h-1V8zm-3 1h1v1h-1V9zm2 0h1v2h-1V9zm2 0h1v1h-1V9zm-2 2h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 1h1v1h-1v-1zm1 1h1v1h-1v-1zm3 0h1v1h-1v-1zm-3 1h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-8 2h1v1H8v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm1 1h1v1h-1v-1zm-2 1h1v1h-1v-1zm3 0h1v1h-1v-1zm-3 1h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zM22 0h7v7h-7V0zm1 1v5h5V1h-5zm1 1h3v3h-3V2zm-15 6h1v1h-1V8zm4 0h1v1h-1V8zm1 0h1v1h-1V8zm2 0h1v1h-1V8zm-8 1h1v1H9V9zm2 0h1v1h-1V9zm6 0h1v1h-1V9zm-8 2h1v1H8v-1zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zM22 8h1v1h-1V8zm2 0h2v1h-2V8zm3 0h1v1h-1V8zm-5 1h1v1h-1V9zm3 0h1v1h-1V9zm2 0h1v2h-1V9zm-5 2h2v1h-2v-1zm3 0h1v1h-1v-1zm-5 2h1v1h-1v-1zm2 0h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-7 1h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-7 1h1v1h-1v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1z" fill="#0f172a"/>
                    </svg>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
                    Scan this QR using any UPI app (GPay, PhonePe, Paytm, etc.)
                  </p>

                  <div style={{ background: '#f8fafc', padding: '6px 16px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: '#3b82f6' }}>
                      QR expires in {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                      background: '#10b981', color: 'white', fontSize: '1rem', fontWeight: 800,
                      cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    Simulate Payment Success
                  </button>
                </div>
              )}

              {/* 4. CARDS SCREEN */}
              {paymentStep === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>ENTER CARD DETAILS</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CARD NUMBER</label>
                      <input 
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardData.number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
                          setCardData(prev => ({ ...prev, number: val }));
                        }}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, outline: 'none', background: '#f8fafc', color: '#1e293b' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>EXPIRY</label>
                        <input 
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})/, '$1/').replace(/\/$/, '');
                            setCardData(prev => ({ ...prev, expiry: val }));
                          }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, outline: 'none', background: '#f8fafc', color: '#1e293b', textAlign: 'center' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CVV</label>
                        <input 
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          value={cardData.cvv}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setCardData(prev => ({ ...prev, cvv: val }));
                          }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, outline: 'none', background: '#f8fafc', color: '#1e293b', textAlign: 'center' }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CARDHOLDER NAME</label>
                      <input 
                        type="text"
                        placeholder="John Doe"
                        value={cardData.name}
                        onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, outline: 'none', background: '#f8fafc', color: '#1e293b' }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={cardData.number.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3 || !cardData.name}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                      background: '#0f172a', color: 'white', fontSize: '1rem', fontWeight: 800,
                      cursor: (cardData.number.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3 || !cardData.name) ? 'not-allowed' : 'pointer',
                      opacity: (cardData.number.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3 || !cardData.name) ? 0.5 : 1,
                      marginTop: '8px', transition: 'all 0.2s'
                    }}
                  >
                    Pay ₹{quiz?.entry_amount}
                  </button>
                </div>
              )}

              {/* 5. NET BANKING SCREEN */}
              {paymentStep === 'banking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>SELECT POPULAR BANK</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'sbi', name: 'State Bank of India', color: '#00a3e0' },
                      { id: 'hdfc', name: 'HDFC Bank', color: '#1c3f94' },
                      { id: 'icici', name: 'ICICI Bank', color: '#f58220' },
                      { id: 'axis', name: 'Axis Bank', color: '#97144d' }
                    ].map(bank => (
                      <div 
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        style={{
                          border: `2px solid ${selectedBank === bank.id ? bank.color : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '12px 10px',
                          cursor: 'pointer',
                          background: selectedBank === bank.id ? `${bank.color}08` : 'white',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          background: bank.color, color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 900
                        }}>
                          {bank.name[0]}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{bank.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedBank}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                      background: '#0f172a', color: 'white', fontSize: '1rem', fontWeight: 800,
                      cursor: !selectedBank ? 'not-allowed' : 'pointer', opacity: !selectedBank ? 0.5 : 1,
                      marginTop: '8px', transition: 'all 0.2s'
                    }}
                  >
                    Pay ₹{quiz?.entry_amount}
                  </button>
                </div>
              )}

              {/* 6. WALLETS SCREEN */}
              {paymentStep === 'wallet' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>SELECT WALLET</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'paytm_w', name: 'Paytm Wallet', color: '#00baf2' },
                      { id: 'phonepe_w', name: 'PhonePe Wallet', color: '#5f259f' },
                      { id: 'amazon', name: 'Amazon Pay', color: '#ff9900' }
                    ].map(w => (
                      <div 
                        key={w.id}
                        onClick={() => setSelectedWallet(w.id)}
                        style={{
                          border: `2px solid ${selectedWallet === w.id ? w.color : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          background: selectedWallet === w.id ? `${w.color}08` : 'white',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            background: w.color, color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 900
                          }}>
                            {w.name[0]}
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{w.name}</span>
                        </div>
                        <input 
                          type="radio" 
                          checked={selectedWallet === w.id} 
                          onChange={() => setSelectedWallet(w.id)}
                          style={{ accentColor: w.color }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedWallet}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: '14px', border: 'none',
                      background: '#0f172a', color: 'white', fontSize: '1rem', fontWeight: 800,
                      cursor: !selectedWallet ? 'not-allowed' : 'pointer', opacity: !selectedWallet ? 0.5 : 1,
                      marginTop: '8px', transition: 'all 0.2s'
                    }}
                  >
                    Pay ₹{quiz?.entry_amount}
                  </button>
                </div>
              )}

              {/* 7. PROCESSING PAYMENT SCREEN */}
              {paymentStep === 'processing' && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    border: '4px solid #f1f5f9', borderTopColor: '#4f46e5',
                    animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem'
                  }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Verifying Transaction...</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    Connecting to secure payment systems. Do not close this window.
                  </p>
                </div>
              )}

              {/* 8. SUCCESS SCREEN */}
              {paymentStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'scaleUp 0.3s ease-out' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: '#dcfce7', color: '#15803d',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: 900, color: '#15803d' }}>Payment Successful!</h4>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                    ₹{quiz?.entry_amount} has been securely paid.
                  </p>
                  <span style={{ fontSize: '0.75rem', padding: '4px 12px', background: '#f1f5f9', borderRadius: '999px', fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>
                    TXN_{Math.floor(10000000 + Math.random() * 90000000)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MatchQuizRoom;
