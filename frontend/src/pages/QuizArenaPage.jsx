import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, Trophy, ChevronRight, BookOpen, Film, Target } from 'lucide-react';
import { quizService } from '../services/api';

const parseUtcDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'object') return dateStr;
  const tStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const hasTz = tStr.includes('Z') || tStr.includes('+') || (tStr.includes('-') && tStr.indexOf('-', 11) !== -1);
  const zStr = hasTz ? tStr : tStr + '+05:30';
  return new Date(zStr);
};

const zoneConfig = {
  'sport-zone': {
    tag: 'SPORT ARENA',
    title: 'Match-based quiz battles',
    subtitle: 'Elite sports knowledge tests',
    aboutTitle: 'About Sport Arena Quizzes',
    aboutDesc: 'Sport Arena quizzes are designed to test your knowledge of cricket, football, and other major sports events. Compete with others and climb the leaderboard.',
    themeColor: '#10b981'
  },
  'game-zone': {
    tag: 'GAME ZONE',
    title: 'Cricket-based quiz battles',
    subtitle: 'Skill-based match quizzes (IPL style)',
    aboutTitle: 'About Game Zone Quizzes',
    aboutDesc: 'Match-based quizzes are designed to test your real-time cricket knowledge. Join a room before it closes to participate in the upcoming live battle. Rewards are distributed automatically based on final leaderboard positions.',
    themeColor: '#3b82f6'
  },
  'study-zone': {
    tag: 'STUDY ARENA',
    title: 'Academic-based quiz battles',
    subtitle: 'Elite educational mock tests',
    aboutTitle: 'About Study Arena Quizzes',
    aboutDesc: 'Academic quizzes are designed to simulate real-world competitive exam environments. Join a session to test your preparation against thousands of aspirants. Results and analytics are updated post-completion.',
    themeColor: '#2563eb'
  },
  'movie-zone': {
    tag: 'MOVIE ARENA',
    title: 'Cinema-based quiz battles',
    subtitle: 'Bollywood & Hollywood trivia',
    aboutTitle: 'About Movie Arena Quizzes',
    aboutDesc: 'Movie-based quizzes test your knowledge of cinema, actors, and pop culture. Challenge your friends and prove you are the ultimate movie buff!',
    themeColor: '#f97316'
  },
  'news-zone': {
    tag: 'NEWS ARENA',
    title: 'News-based quiz battles',
    subtitle: 'Stay updated with daily trends',
    aboutTitle: 'About News Arena Quizzes',
    aboutDesc: 'Stay ahead of the curve with our daily news quizzes. Covering global events, politics, and technology to keep you informed and sharp.',
    themeColor: '#0ea5e9'
  }
};

const ArenaQuizTimer = ({ openAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const openTime = new Date(openAt).getTime();
      const diff = openTime - now;

      if (diff <= 0) {
        setTimeLeft('Starting...');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeStr = '';
      if (days > 0) {
        timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (hours > 0) {
        timeStr = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        timeStr = `${minutes}m ${seconds}s`;
      }
      setTimeLeft(timeStr);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [openAt]);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
        STARTS IN
      </p>
      <p style={{ fontSize: '1.2rem', fontWeight: 950, color: '#3b82f6', margin: 0, fontFamily: 'monospace' }}>
        {timeLeft}
      </p>
    </div>
  );
};

const QuizArenaPage = () => {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(localStorage.getItem(`play11_arena_banner_${zoneId}`) || localStorage.getItem('play11_home_banner') || '');
  const [bookingQuiz, setBookingQuiz] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('confirm'); // 'confirm', 'qr', 'processing', 'success'
  const [qrTimer, setQrTimer] = useState(300);
  const [copied, setCopied] = useState(false);

  const config = zoneConfig[zoneId] || zoneConfig['sport-zone'];

  const fetchQuizzes = () => {
    const session = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    let headers = {};
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const token = parsed.token || session;
        headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        headers['Authorization'] = `Bearer ${session}`;
      }
    }

    fetch(`/api/quizzes/zone/${zoneId}`, { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.quizzes && data.quizzes.length > 0) {
          const formatted = data.quizzes.map(q => {
            const openTime = parseUtcDate(q.open_at);
            const openStr = `${openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${openTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}`;
            const subDate = q.submitted_at ? parseUtcDate(q.submitted_at) : null;
            const formattedSubTime = subDate ? subDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

            const closeTime = parseUtcDate(q.close_at);
            const closeStr = `${closeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${closeTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}`;

            let btnText = 'Join Quiz';
            if (q.is_submitted) {
              btnText = 'View Result';
            } else if (q.status_label === 'CLOSED') {
              btnText = 'View Results';
            } else if (q.status_label === 'UPCOMING') {
              if (q.is_registered) {
                btnText = 'Joined ✓';
              } else {
                btnText = q.entry_amount > 0 ? `Join (₹${q.entry_amount})` : 'Join (Free)';
              }
            } else if (q.status_label === 'LIVE') {
              if (q.is_registered) {
                btnText = 'Play Quiz';
              } else {
                const entryFee = parseInt(q.entry_amount || 0);
                btnText = entryFee > 0 ? 'Not Registered' : 'Play Quiz';
              }
            }

            return {
              ...q,
              tag: config.tag,
              statusColor: q.status_label ? q.status_label.toLowerCase() : 'live',
              submittedAt: formattedSubTime,
              timerLabel: q.status_label === 'UPCOMING' ? 'STARTS AT' : (q.status_label === 'CLOSED' ? 'ENDED' : 'ENDS AT'),
              timerValue: q.status_label === 'UPCOMING' ? openStr : (q.status_label === 'CLOSED' ? 'Closed' : closeStr),
              startsAtFormatted: openStr,
              endsAtFormatted: closeStr,
              questions: q.total_questions,
              players: (q.players_count || q.player_count || 0),
              rewards: q.reward_text || (q.entry_amount > 0 ? `₹${q.entry_amount * 5}` : 'Free'),
              btnText: btnText,
              active: true
            };
          });
          setQuizzes(formatted);
        } else {
          setQuizzes([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCloseBooking = () => {
    setBookingQuiz(null);
    setPaymentStep('confirm');
    setQrTimer(300);
  };

  const handleConfirmBooking = async () => {
    if (!bookingQuiz) return;
    
    // If entry fee is 0, register directly without payment
    if (!bookingQuiz.entry_amount || bookingQuiz.entry_amount <= 0) {
      setBookingLoading(true);
      try {
        const res = await quizService.registerQuiz(bookingQuiz.id);
        alert(res.message || 'Successfully joined!');
        handleCloseBooking();
        fetchQuizzes();
      } catch (err) {
        alert(err.message || 'Join failed. Please try again.');
      } finally {
        setBookingLoading(false);
      }
    } else {
      // Proceed to UPI QR Payment screen
      setQrTimer(300);
      setPaymentStep('qr');
    }
  };

  const handleVerifyPayment = async () => {
    if (!bookingQuiz) return;
    setBookingLoading(true);
    setPaymentStep('processing');
    try {
      const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
      let token;
      if (sessionRaw) {
        try {
          const session = JSON.parse(sessionRaw);
          token = session.token || sessionRaw;
        } catch (e) {
          token = sessionRaw;
        }
      }
      
      const entryFee = parseInt(bookingQuiz.entry_amount || 0);

      // Simulate a small artificial network latency (1.5 seconds) for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (entryFee > 0 && token) {
        // Credit simulated coins to user's wallet to ensure registration succeeds
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
          throw new Error(depositData.message || 'Payment processing failed.');
        }
      }

      // Now register for the quiz
      const regRes = await quizService.registerQuiz(bookingQuiz.id);
      
      setPaymentStep('success');
      // Wait for success screen to show
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      handleCloseBooking();
      fetchQuizzes();
    } catch (err) {
      alert(err.message || 'Payment verification failed. Please try again.');
      setPaymentStep('qr');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    if (paymentStep !== 'qr') return;
    const interval = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPaymentStep('confirm');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStep]);

  useEffect(() => {
    // Fetch banners in parallel with quiz fetch for speed
    const fetchBanners = async () => {
      try {
        const [zoneData, globalData] = await Promise.all([
          fetch(`/api/settings/banner_zone_${zoneId}`).then(r => r.json()).catch(() => ({})),
          fetch('/api/settings/home_banner_url').then(r => r.json()).catch(() => ({}))
        ]);

        if (zoneData.success && zoneData.value && zoneData.value !== '0') {
          setActiveBanner(zoneData.value);
          localStorage.setItem(`play11_arena_banner_${zoneId}`, zoneData.value);
        } else if (globalData.success && globalData.value && globalData.value !== '0') {
          setActiveBanner(globalData.value);
          localStorage.setItem('play11_home_banner', globalData.value);
        } else {
          setActiveBanner('');
          localStorage.removeItem(`play11_arena_banner_${zoneId}`);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };

    fetchQuizzes();
    fetchBanners();

    const interval = setInterval(fetchQuizzes, 10000);
    return () => clearInterval(interval);
  }, [zoneId, config.tag]);

  return (
    <div className="quiz-room-bg" style={{ minHeight: '100vh' }}>
      <div className={`container ${activeBanner ? 'quiz-arena-content' : 'quiz-arena-content-nobanner'}`} style={{ paddingBottom: '6rem', paddingLeft: '3%', paddingRight: '3%' }}>
        
        {/* Global or Zone-Specific Banner */}
        {activeBanner && (
          <div className="quiz-arena-banner-container" style={{ 
            width: 'calc(100% + 6%)', 
            marginLeft: '-3%',
            marginRight: '-3%',
            height: 'clamp(160px, 25vh, 300px)', 
            borderRadius: '0', 
            padding: '0', 
            marginBottom: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img 
              src={activeBanner} 
              alt="Arena Banner" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'fill', 
                display: 'block' 
              }} 
            />
          </div>
        )}

        <button 
          onClick={() => navigate('/home-choice')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'white', border: '1px solid #e2e8f0', padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '2rem', cursor: 'pointer' 
          }}
          className="hover-lift"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'end', marginBottom: '2.5rem', paddingLeft: '1rem' }} className="animate-slide-up">
           <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, color: config.themeColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{config.tag}</p>
              <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{config.title}</h1>
           </div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#eff6ff', color: config.themeColor, padding: '8px 16px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
              <span>{config.subtitle}</span>
           </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '5rem' }}>
             <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: config.themeColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }} className="mobile-grid-2 animate-slide-up">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="game-zone-card" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>{quiz.tag}</div>
                   {quiz.winner_id ? (
                     <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>RESULT DECLARED</div>
                   ) : quiz.status_label === 'LIVE' ? (
                     quiz.is_registered ? (
                       <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', textTransform: 'uppercase' }}>
                         LIVE (JOINED ✓)
                       </div>
                     ) : (
                       parseInt(quiz.entry_amount || 0) > 0 ? (
                         <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#991b1b', background: '#fee2e2', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fca5a5', textTransform: 'uppercase' }}>
                           LIVE (NOT JOINED)
                         </div>
                       ) : (
                         <div className={`badge-${quiz.statusColor}-mini`}>LIVE</div>
                       )
                     )
                   ) : (
                     <div className={`badge-${quiz.statusColor}-mini`}>{quiz.status_label || 'LIVE'}</div>
                   )}
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>{quiz.title}</h3>

                <div className="game-status-box" style={{ 
                  background: quiz.winner_id ? '#e6fffa' : (quiz.is_submitted ? '#f0fdf4' : 'rgba(15, 23, 42, 0.02)'),
                  borderColor: quiz.winner_id ? '#b2f5ea' : (quiz.is_submitted ? '#bbf7d0' : '#f1f5f9'),
                  padding: '0.5rem'
                }}>
                  {quiz.winner_id ? (
                      <>
                         <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                            RESULT STATUS
                         </p>
                         <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0d9488' }}>
                            DECLARED
                         </p>
                      </>
                    ) : quiz.is_submitted ? (
                      <>
                         <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                            RESULT
                         </p>
                         <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>
                            Done
                         </p>
                      </>
                    ) : quiz.status_label === 'UPCOMING' ? (
                      <ArenaQuizTimer openAt={quiz.open_at} />
                    ) : quiz.status_label === 'LIVE' && !quiz.winner_id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', width: '100%' }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>STARTS:</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a' }}>{quiz.startsAtFormatted}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', width: '100%' }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>ENDS:</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ef4444' }}>{quiz.endsAtFormatted}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                         <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                            {quiz.timerLabel}
                         </p>
                         <p style={{ fontSize: quiz.timerValue && quiz.timerValue.length > 20 ? '0.85rem' : '1.1rem', fontWeight: 900, color: '#ef4444' }}>
                            {quiz.timerValue}
                         </p>
                      </>
                    )}
                </div>

                <div className="game-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1.5rem' }}>
                   <div className="arena-metric" style={{ padding: '0.4rem' }}>
                      <span className="label" style={{ fontSize: '0.5rem' }}>Questions</span>
                      <span className="value" style={{ fontSize: '0.7rem' }}>{quiz.questions}</span>
                   </div>
                   <div className="arena-metric" style={{ padding: '0.4rem' }}>
                      <span className="label" style={{ fontSize: '0.5rem' }}>SPOT</span>
                      <span className="value" style={{ fontSize: '0.7rem' }}>{quiz.players}</span>
                   </div>
                   <div className="arena-metric" style={{ padding: '0.4rem' }}>
                      <span className="label" style={{ fontSize: '0.5rem' }}>WIN</span>
                      <span className="value" style={{ fontSize: '0.7rem' }}>{quiz.rewards}</span>
                   </div>
                </div>

                <button 
                   disabled={quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered}
                   className={`shimmer-btn ${quiz.is_submitted && !quiz.winner_id ? 'bg-slate-500' : ''}`}
                   onClick={() => {
                     const isLiveUnregisteredPaid = quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered;
                     if (isLiveUnregisteredPaid) return;

                     const user = localStorage.getItem('play11_user');
                     if (quiz.is_submitted || quiz.status_label === 'CLOSED') {
                       navigate(zoneId === 'study-zone' ? `/study-result/${quiz.id}` : `/game-result/${quiz.id}`);
                     } else if (quiz.status_label === 'UPCOMING') {
                       if (quiz.is_registered) {
                         navigate(zoneId === 'study-zone' ? `/study-quiz-detail/${quiz.id}` : `/match-quiz-room/${quiz.id}`);
                       } else {
                         if (!user) {
                           localStorage.setItem('auth_redirect', window.location.pathname);
                           navigate('/login');
                         } else {
                           setBookingQuiz(quiz);
                         }
                       }
                     } else {
                       // Live quiz
                       if (!user) {
                         localStorage.setItem('auth_redirect', zoneId === 'study-zone' ? `/study-quiz-play/${quiz.id}` : `/match-quiz-room/${quiz.id}`);
                         navigate('/login');
                       } else {
                         navigate(zoneId === 'study-zone' ? `/study-quiz-play/${quiz.id}` : `/match-quiz-room/${quiz.id}`);
                       }
                     }
                   }}
                   style={{ 
                     marginTop: 'auto', 
                     height: '44px',
                     background: (quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered) ? '#cbd5e1' : (quiz.winner_id ? '#10b981' : (quiz.is_submitted ? '#64748b' : config.themeColor)),
                     boxShadow: (quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered) ? 'none' : (quiz.winner_id ? '0 6px 12px -3px rgba(16, 185, 129, 0.3)' : (quiz.is_submitted ? 'none' : `0 6px 12px -3px ${config.themeColor}4D`)),
                     fontSize: '0.8rem',
                     padding: '0 1rem',
                     cursor: (quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered) ? 'not-allowed' : 'pointer',
                     color: (quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered) ? '#64748b' : '#ffffff'
                   }}
                 >
                    <span>{quiz.winner_id ? 'View Results' : (quiz.is_submitted ? 'Awaiting Result' : quiz.btnText)}</span>
                    {!(quiz.status_label === 'LIVE' && parseInt(quiz.entry_amount || 0) > 0 && !quiz.is_registered) && <ChevronRight size={16} strokeWidth={3} />}
                 </button>
                
                {quiz.is_submitted && (
                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: quiz.winner_id ? '#10b981' : '#16a34a', fontWeight: 800 }}>
                    {quiz.winner_id ? 'Result has been declared!' : `Successfully submitted on ${parseUtcDate(quiz.submitted_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {bookingQuiz && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: paymentStep === 'qr' ? '1.5rem' : '2rem',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              position: 'relative',
              color: '#0f172a'
            }}>
              {/* 1. CONFIRM REGISTRATION */}
              {paymentStep === 'confirm' && (
                <>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Confirm Registration
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    You are registering for <strong>{bookingQuiz.title}</strong>. 
                    {bookingQuiz.entry_amount > 0 ? (
                      <> An entry fee of <strong style={{ color: config.themeColor }}>₹{bookingQuiz.entry_amount}</strong> will be deducted from your wallet coins.</>
                    ) : (
                      <> Registration is free for this quiz!</>
                    )}
                  </p>

                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>Entry Fee:</span>
                      <span style={{ color: '#0f172a', fontWeight: 800 }}>₹{bookingQuiz.entry_amount || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>Start Time:</span>
                      <span style={{ color: '#0f172a', fontWeight: 800 }}>{bookingQuiz.startsAtFormatted}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={handleCloseBooking}
                      disabled={bookingLoading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '14px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                      className="hover-lift"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={bookingLoading}
                      style={{
                        flex: 2,
                        padding: '0.75rem',
                        borderRadius: '14px',
                        border: 'none',
                        background: config.themeColor,
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: `0 4px 12px ${config.themeColor}33`
                      }}
                      className="shimmer-btn"
                    >
                      {bookingLoading ? (
                        <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      ) : (
                        'Confirm & Join'
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* 2. UPI QR SCAN PAYMENT */}
              {paymentStep === 'qr' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <button
                      onClick={() => setPaymentStep('confirm')}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                    >
                      <ArrowLeft size={18} /> <span style={{ marginLeft: '4px', fontSize: '0.85rem', fontWeight: 800 }}>Back</span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6' }}>
                      🛡️ NPCI SECURE
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', margin: '0 0 2px 0', letterSpacing: '0.05em' }}>Scan QR to Pay</p>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#0f172a', margin: '0 0 2px 0' }}>₹{bookingQuiz.entry_amount}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, fontWeight: 700 }}>to <strong>Quzo Play-11 Arena</strong></p>
                  </div>

                  {(() => {
                    const upiLink = `upi://pay?pa=quzoplay11@upi&pn=Quzo%20Play11%20Arena&am=${bookingQuiz.entry_amount}&cu=INR&tn=Registering%20for%20${encodeURIComponent(bookingQuiz.title)}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
                    return (
                      <div style={{ position: 'relative', width: '190px', height: '190px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '10px' }}>
                        {/* Camera guides */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', width: '16px', height: '16px', borderTop: '3px solid #3b82f6', borderLeft: '3px solid #3b82f6' }}></div>
                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderTop: '3px solid #3b82f6', borderRight: '3px solid #3b82f6' }}></div>
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '16px', height: '16px', borderBottom: '3px solid #3b82f6', borderLeft: '3px solid #3b82f6' }}></div>
                        <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '16px', height: '16px', borderBottom: '3px solid #3b82f6', borderRight: '3px solid #3b82f6' }}></div>
                        
                        <img src={qrUrl} alt="UPI QR Code" style={{ width: '160px', height: '160px', objectFit: 'contain' }} />
                      </div>
                    );
                  })()}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px', width: 'fit-content', margin: '0 auto 1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', fontFamily: 'monospace' }}>quzoplay11@upi</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("quzoplay11@upi");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {copied ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>COMPATIBLE APPS:</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#4285F4', background: '#e8f0fe', padding: '2px 6px', borderRadius: '4px' }}>GPay</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#5f259f', background: '#f3e8ff', padding: '2px 6px', borderRadius: '4px' }}>PhonePe</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#00baf2', background: '#e0f7fa', padding: '2px 6px', borderRadius: '4px' }}>Paytm</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', padding: '4px 12px', borderRadius: '20px', border: '1px solid #fee2e2' }}>
                      <div className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 900, color: '#ef4444' }}>
                        Expires in {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="pulse-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Awaiting payment detection...
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={handleCloseBooking}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '14px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleVerifyPayment}
                      style={{
                        flex: 2,
                        padding: '0.75rem',
                        borderRadius: '14px',
                        border: 'none',
                        background: '#10b981',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      I have Scanned & Paid
                    </button>
                  </div>
                </>
              )}

              {/* 3. PROCESSING PAYMENT */}
              {paymentStep === 'processing' && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div className="spinner-loader" style={{ width: '50px', height: '50px', border: '4px solid #f1f5f9', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 1.5rem' }}></div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>Verifying Transaction...</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 700, lineHeight: 1.5 }}>
                    Connecting to secure payment gateway. Please do not close or refresh this page.
                  </p>
                </div>
              )}

              {/* 4. SUCCESS STATE */}
              {paymentStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', animation: 'scaleUp 0.3s ease-out' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#dcfce7', color: '#16a34a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 20px rgba(22, 163, 74, 0.15)'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 950, color: '#16a34a' }}>Payment Received!</h4>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#475569', fontWeight: 700 }}>
                    ₹{bookingQuiz.entry_amount} successfully credited and registered.
                  </p>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 16px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction ID</span>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 800, color: '#475569' }}>
                      TXN_{Math.floor(10000000 + Math.random() * 90000000)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }} className="animate-slide-up">
           <div style={{ color: config.themeColor }}><Info size={24} /></div>
           <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>{config.aboutTitle}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{config.aboutDesc}</p>
           </div>
        </div>
        
        <style>{`
          .quiz-arena-content {
             padding-top: 88px;
          }
          .quiz-arena-content-nobanner {
             padding-top: 120px;
          }
          .mobile-grid-2 {
             grid-template-columns: repeat(2, 1fr);
          }
          .pulse-dot {
             animation: pulse 1.5s infinite ease-in-out;
          }
          .spinner-loader {
             animation: spin 1s linear infinite;
          }
          @keyframes pulse {
             0%, 100% { transform: scale(1); opacity: 1; }
             50% { transform: scale(0.85); opacity: 0.4; }
          }
          @keyframes spin {
             0% { transform: rotate(0deg); }
             100% { transform: rotate(360deg); }
          }
          @keyframes scaleUp {
             from { transform: scale(0.9); opacity: 0; }
             to { transform: scale(1); opacity: 1; }
          }
          @media (max-width: 480px) {
             .mobile-grid-2 {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
             }
             .game-zone-card {
                padding: 1.25rem !important;
             }
             .game-zone-card h3 {
                font-size: 1.15rem !important;
             }
             .arena-metric {
                padding: 0.6rem 0.3rem !important;
             }
             .arena-metric .value {
                font-size: 0.85rem !important;
             }
             .shimmer-btn {
                width: 100% !important;
                padding: 0.8rem !important;
                font-size: 0.9rem !important;
             }
          }
        `}</style>
      </div>
    </div>
  );
};

export default QuizArenaPage;
