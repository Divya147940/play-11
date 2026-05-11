import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, BookOpen, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { quizService } from '../services/api';

const StudyListPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizService.getQuizzesByZone('study-zone')
      .then(data => {
        const formatted = data.map(q => ({
          id: q.id,
          tag: 'STUDY ARENA',
          status: q.status_label || 'LIVE',
          statusColor: (q.status_label || 'LIVE').toLowerCase(),
          title: q.title,
          timerLabel: q.status_label === 'CLOSED' ? 'CLOSED AT' : 'CLOSES IN',
          timer: q.status_label === 'CLOSED' ? new Date(q.close_at).toLocaleDateString() : q.timer_minutes + 'm',
          questions: q.total_questions + ' Questions',
          players: '100+ joined',
          rewards: q.reward_text || 'Knowledge Points',
          btnText: q.is_submitted ? 'View Result' : 'Join Live Quiz',
          is_submitted: q.is_submitted,
          submitted_at: q.submitted_at,
          active: true
        }));
        setQuizzes(formatted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  }, []);

  return (
    <div className="quiz-room-bg" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', paddingLeft: '3%', paddingRight: '3%' }}>
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/home-choice')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '0.75rem', 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            color: '#64748b',
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-lift"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }} className="animate-slide-up">
           <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>STUDY ARENA</p>
              <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.75rem)', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Academic-based quiz battles</h1>
           </div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#eff6ff', color: '#1d4ed8', padding: '8px 16px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
              <span>Elite educational mock tests</span>
           </div>
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="flex-center" style={{ padding: '5rem' }}>
             <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="animate-slide-up stagger-1">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="game-zone-card" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>{quiz.tag}</div>
                   <div className={`badge-${quiz.statusColor}-mini`}>{quiz.status}</div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>{quiz.title}</h3>

                <div className="game-status-box">
                   <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>{quiz.timerLabel}</p>
                   <p style={{ fontSize: '1.5rem', fontWeight: 950, color: quiz.status === 'LIVE' ? '#ef4444' : '#3b82f6' }}>{quiz.timer}</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '1rem' }}>
                   <div className="game-metric-row">
                      <div className="game-metric-label">QUESTIONS</div>
                      <div className="game-metric-value">{quiz.questions}</div>
                   </div>
                   <div className="game-metric-row">
                      <div className="game-metric-label">PLAYERS</div>
                      <div className="game-metric-value">{quiz.players}</div>
                   </div>
                   <div className="game-metric-row">
                      <div className="game-metric-label">REWARDS</div>
                      <div className="game-metric-value">{quiz.rewards}</div>
                   </div>
                </div>

                  {quiz.is_submitted ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={12} /> Submitted: {new Date(quiz.submitted_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <button 
                        className="quiz-join-btn" 
                        style={{ background: '#10b981', color: 'white' }}
                        onClick={() => navigate(`/study-result/${quiz.id}`)}
                      >
                        View Result <CheckCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="quiz-join-btn blue" 
                      onClick={() => navigate(`/study-quiz-detail/${quiz.id}`)}
                    >
                      Join Arena <ChevronRight size={16} />
                    </button>
                  )}
              </div>
            ))}

            {/* Practice Card if no quizzes or as an addition */}
            <div className="game-zone-card" style={{ padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>PRACTICE</div>
                 <div className="badge-practice-mini" style={{ fontSize: '0.5rem', padding: '2px 4px' }}>FREE</div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>Daily General Knowledge</h3>

              <div className="game-status-box">
                 <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>MODE</p>
                 <p style={{ fontSize: '1.5rem', fontWeight: 950, color: '#3b82f6' }}>Practice Quiz</p>
              </div>

              <div style={{ background: '#fff', borderRadius: '1rem' }}>
                 <div className="game-metric-row">
                    <div className="game-metric-label">QUESTIONS</div>
                    <div className="game-metric-value">10 Questions</div>
                 </div>
                 <div className="game-metric-row">
                    <div className="game-metric-label">PLAYERS</div>
                    <div className="game-metric-value">500+ attempted</div>
                 </div>
                 <div className="game-metric-row">
                    <div className="game-metric-label">TYPE</div>
                    <div className="game-metric-value">Mixed Subjects</div>
                 </div>
              </div>

              <button 
                className="quiz-join-btn blue" 
                onClick={() => navigate('/study-home')}
              >
                Explore <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }} className="animate-slide-up stagger-2">
           <div style={{ color: '#3b82f6' }}><Info size={24} /></div>
           <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>About Study Arena Quizzes</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>Academic quizzes are designed to simulate real-world competitive exam environments. Join a session to test your preparation against thousands of aspirants. Results and analytics are updated post-completion.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyListPage;
