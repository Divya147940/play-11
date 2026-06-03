import React from 'react';
import { useNavigate } from 'react-router-dom';

const parseUtcDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'object') return dateStr;
  const tStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const hasTz = tStr.includes('Z') || tStr.includes('+') || (tStr.includes('-') && tStr.indexOf('-', 11) !== -1);
  const zStr = hasTz ? tStr : tStr + '+05:30';
  return new Date(zStr);
};

const QuizTimer = ({ openAt, closeAt }) => {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const openTime = parseUtcDate(openAt).getTime();
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
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', width: '100%' }}>
      <div className="upcoming-timer-bubble">
        <div className="upcoming-timer-dot" />
        <span className="upcoming-timer-text">
          Starts in: {timeLeft}
        </span>
      </div>
    </div>
  );
};

const UpcomingQuizzes = ({ quizzes = [], title = "Multiple quizzes scheduled by time", subtitle = "SCHEDULED QUIZ SECTION" }) => {
  const navigate = useNavigate();

  if (quizzes.length === 0) {
    return (
      <div className="flex-center" style={{ padding: '4rem', flexDirection: 'column', gap: '1rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
         <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>No real-time quizzes currently active in this section</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{subtitle}</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 0 }}>{title}</h2>
          </div>
       </div>

       <div style={{ 
         display: 'grid', 
         gridTemplateColumns: 'repeat(2, 1fr)', 
         gap: '8px' 
       }} className="mobile-grid-2">
          {quizzes.map((quiz) => {
             const openTime = parseUtcDate(quiz.open_at);
             const openStr = `${openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${openTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}`;
             const isLive = quiz.status_label === 'LIVE';
             
             const btnColor = 
               quiz.zone_id === 'movie-zone' ? 'orange' : 
               quiz.zone_id === 'sport-zone' ? 'secondary' : 
               quiz.zone_id === 'news-zone' ? 'blue' : 'primary';

             let btnText = 'Details';
             if (quiz.is_submitted) {
               btnText = 'Awaiting Result';
             } else if (quiz.status_label === 'CLOSED') {
               btnText = 'Results';
             } else if (quiz.status_label === 'UPCOMING') {
               if (quiz.is_registered) {
                 btnText = 'Joined ✓';
               } else {
                 btnText = quiz.entry_amount > 0 ? `Join (₹${quiz.entry_amount})` : 'Join (Free)';
               }
             } else if (quiz.status_label === 'LIVE') {
                btnText = 'Join Now';
             }

             return (
             <div key={quiz.id} className="game-zone-card animate-slide-up">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <p style={{ fontSize: 'clamp(0.55rem, 2vw, 0.65rem)', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {quiz.zone_id?.replace('-', ' ') || 'GENERAL ARENA'}
                    </p>
                    <div className={`${isLive ? 'badge-live-mini pulse-live' : (quiz.status_label === 'UPCOMING' ? 'badge-upcoming-mini' : 'badge-practice-mini')}`}>
                      {quiz.status_label || 'CLOSED'}
                    </div>
                 </div>


                 <h3 style={{ fontSize: 'clamp(0.85rem, 3vw, 1rem)', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>{quiz.title}</h3>

                  <div className="game-status-box" style={{ 
                    margin: '0.5rem 0',
                    background: quiz.is_submitted ? '#f0fdf4' : (isLive ? 'rgba(239, 68, 68, 0.03)' : 'rgba(15, 23, 42, 0.02)'),
                    borderColor: quiz.is_submitted ? '#bbf7d0' : (isLive ? 'rgba(239, 68, 68, 0.1)' : '#f1f5f9')
                  }}>
                     {quiz.is_submitted ? (
                       <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '4px' }}>SUBMITTED AT</p>
                           <div style={{ color: '#16a34a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                             {quiz.submitted_at ? (
                               <>
                                 <span style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.1 }}>
                                   {parseUtcDate(quiz.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d' }}>
                                   {parseUtcDate(quiz.submitted_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                                 </span>
                               </>
                             ) : (
                               <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>Completed</span>
                             )}
                           </div>
                       </div>
                     ) : isLive ? (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                          <p className="pulse-text" style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ef4444', letterSpacing: '0.05em', marginBottom: '2px' }}>LIVE NOW</p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap', fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                            <span>STARTS:</span>
                            <span style={{ color: '#0f172a' }}>{openStr}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap', fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                            <span>ENDS:</span>
                            <span style={{ color: '#ef4444' }}>{parseUtcDate(quiz.close_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {parseUtcDate(quiz.close_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                     ) : quiz.status_label === 'UPCOMING' ? (
                        <QuizTimer openAt={quiz.open_at} closeAt={quiz.close_at} />
                     ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', textAlign: 'center' }}>
                           <div>
                              <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{quiz.status_label === 'CLOSED' ? 'ENDED' : 'STARTS AT'}</p>
                              <p style={{ fontSize: quiz.status_label === 'CLOSED' ? '1.1rem' : '0.85rem', fontWeight: 900, color: quiz.status_label === 'CLOSED' ? '#ef4444' : '#0f172a' }}>
                                {quiz.status_label === 'CLOSED' ? 'Closed' : openStr}
                              </p>
                           </div>
                        </div>
                     )}
                  </div>

                 <div style={{ display: 'flex', gap: '4px', marginTop: '0.5rem' }}>
                    <div className="quiz-metric-pill" style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.15rem' }}>
                       <p style={{ opacity: 0.7, fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>Questions</p>
                       <strong style={{ fontSize: '0.65rem' }}>{quiz.total_questions || quiz.questions || 10}</strong>
                    </div>
                    <div className="quiz-metric-pill" style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.15rem' }}>
                        <p style={{ opacity: 0.7, fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>SPOT</p>
                        <strong style={{ fontSize: '0.65rem' }}>{quiz.players_count ?? 0}</strong>
                    </div>
                    <div className="quiz-metric-pill" style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.15rem' }}>
                       <p style={{ opacity: 0.7, fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>WIN</p>
                       <strong style={{ fontSize: '0.65rem' }}>{quiz.reward_text || (quiz.entry_amount > 0 ? `₹${quiz.entry_amount * 5}` : 'Free')}</strong>
                    </div>
                 </div>

                  <button 
                    className={`quiz-join-btn ${quiz.is_submitted ? 'outline' : btnColor}`} 
                    onClick={() => {
                       if (quiz.is_submitted) navigate(`/game-result/${quiz.id}`);
                       else navigate(`/match-quiz-room/${quiz.id}`);
                    }}
                  >
                    {btnText}
                  </button>
              </div>
              );
           })}
        </div>

         <style>{`
             .upcoming-timer-bubble {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: #eff6ff;
                padding: 6px 14px;
                border-radius: 20px;
                border: 1px solid #dbeafe;
                max-width: 100%;
                box-sizing: border-box;
             }
             .upcoming-timer-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #3b82f6;
                animation: pulse 1.5s infinite ease-in-out;
                flex-shrink: 0;
             }
             .upcoming-timer-text {
                font-size: 0.75rem;
                font-family: monospace;
                font-weight: 950;
                color: #3b82f6;
                white-space: nowrap;
             }
             .mobile-grid-2 {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
             }
             @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(0.85); opacity: 0.5; }
             }
             @media (max-width: 640px) {
                .upcoming-timer-bubble {
                   padding: 4px 8px;
                   gap: 4px;
                }
                .upcoming-timer-text {
                   font-size: 0.62rem;
                }
                .upcoming-timer-dot {
                   width: 6px;
                   height: 6px;
                }
                .mobile-grid-2 {
                   grid-template-columns: 1fr 1fr !important;
                   gap: 8px !important;
                   padding: 0 8px !important;
                   width: 100% !important;
                   box-sizing: border-box !important;
                }
                .game-zone-card {
                   padding: 0.75rem 0.6rem !important;
                   min-width: 0 !important;
                }
                .game-zone-card h3 {
                   font-size: 0.95rem !important;
                }
                .game-status-box {
                   padding: 0.75rem 0.4rem !important;
                }
                .quiz-metric-pill {
                   padding: 0.35rem 0.1rem !important;
                }
             }
             @media (max-width: 480px) {
                .upcoming-timer-text {
                   font-size: 0.6rem;
                }
                .upcoming-timer-bubble {
                   padding: 4px 8px;
                   gap: 4px;
                }
                .upcoming-timer-dot {
                   width: 6px;
                   height: 6px;
                }
                .mobile-grid-2 {
                   grid-template-columns: repeat(2, 1fr) !important;
                   gap: 8px !important;
                   padding: 0 4px !important;
                }
                .game-zone-card {
                   padding: 0.75rem 0.6rem !important;
                }
                .game-zone-card h3 {
                   font-size: 0.95rem !important;
                }
                .game-status-box {
                   padding: 0.5rem 0.3rem !important;
                }
                .quiz-metric-pill {
                   padding: 0.35rem 0.1rem !important;
                }
                .quiz-metric-pill strong {
                   font-size: 0.65rem !important;
                }
                .quiz-join-btn {
                   width: 100% !important;
                   padding: 0.5rem !important;
                   font-size: 0.75rem !important;
                   border-radius: 8px !important;
                }
             }
             @media (max-width: 360px) {
                .upcoming-timer-text {
                   font-size: 0.52rem;
                }
             }
          `}</style>
    </div>
  );
};

export default UpcomingQuizzes;
