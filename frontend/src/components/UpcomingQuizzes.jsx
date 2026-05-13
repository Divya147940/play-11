import React from 'react';
import { useNavigate } from 'react-router-dom';

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
             const openTime = new Date(quiz.open_at);
             const timeStr = openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
             const isLive = quiz.status_label === 'LIVE';
             
             const btnColor = 
               quiz.zone_id === 'movie-zone' ? 'orange' : 
               quiz.zone_id === 'sport-zone' ? 'secondary' : 
               quiz.zone_id === 'news-zone' ? 'blue' : 'primary';

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
                          <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>
                            {quiz.submitted_at ? new Date(quiz.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Completed'}
                          </p>
                       </div>
                     ) : isLive ? (
                       <div style={{ textAlign: 'center' }}>
                         <p className="pulse-text" style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ef4444', letterSpacing: '0.05em', marginBottom: '4px' }}>LIVE NOW</p>
                         <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>ENDS AT {new Date(quiz.close_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                     ) : (
                       <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                          <div>
                             <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{quiz.status_label === 'CLOSED' ? 'ENDED' : 'STARTS AT'}</p>
                             <p style={{ fontSize: '1.1rem', fontWeight: 900, color: quiz.status_label === 'CLOSED' ? '#ef4444' : '#0f172a' }}>
                               {quiz.status_label === 'CLOSED' ? 'Closed' : timeStr}
                             </p>
                          </div>
                       </div>
                     )}
                  </div>

                 <div style={{ display: 'flex', gap: '4px', marginTop: '0.5rem' }}>
                    <div className="quiz-metric-pill" style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.15rem' }}>
                       <p style={{ opacity: 0.7, fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>Qs</p>
                       <strong style={{ fontSize: '0.65rem' }}>{quiz.total_questions || quiz.questions || 10}</strong>
                    </div>
                    <div className="quiz-metric-pill" style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.15rem' }}>
                       <p style={{ opacity: 0.7, fontSize: '0.45rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>PLAYERS</p>
                       <strong style={{ fontSize: '0.65rem' }}>{quiz.players_count || 'Joined'}</strong>
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
                       else if (isLive) navigate(`/game-quiz-play/${quiz.id}`);
                       else navigate(`/match-quiz-room/${quiz.id}`);
                    }}
                  >
                    {quiz.is_submitted ? 'Result' : (isLive ? 'Join Now' : (quiz.status_label === 'CLOSED' ? 'Results' : 'Details'))}
                  </button>
              </div>
              );
           })}
        </div>

        <style>{`
           @media (max-width: 640px) {
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
        `}</style>
    </div>
  );
};

export default UpcomingQuizzes;
