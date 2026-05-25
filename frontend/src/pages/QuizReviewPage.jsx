import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, Info, HelpCircle, Trophy, Target } from 'lucide-react';

const QuizReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    const guestId = localStorage.getItem('play11_guest_id');
    
    if (!sessionRaw && !guestId) return navigate('/login');

    let token = '';
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        token = parsed.token || (typeof sessionRaw === 'string' ? sessionRaw : '');
      } catch (e) {
        token = sessionRaw;
      }
    }

    const loadReview = async (submissionId) => {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (guestId) {
        headers['x-guest-id'] = guestId;
      }
      const res = await fetch(`/api/auth/submission/${submissionId}/review`, { headers });
      if (!res.ok) throw new Error('Submission review data not found');
      return res.json();
    };

    loadReview(id)
      .then(resData => {
        if (resData.success) {
          setData(resData);
          setLoading(false);
        } else {
          throw new Error('Not successful');
        }
      })
      .catch(async (err) => {
        console.log('Direct submission review load failed. Retrying by matching quiz ID in user history...', err);
        try {
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          } else if (guestId) {
            headers['x-guest-id'] = guestId;
          }
          const historyRes = await fetch('/api/auth/history', { headers });
          const historyData = await historyRes.json();
          if (historyData.success && historyData.history) {
            // Find the user's submission for this quiz ID
            const matchedSubmission = historyData.history.find(h => String(h.quiz_id) === String(id) || String(h.quizId) === String(id));
            if (matchedSubmission) {
              console.log('Matched submission ID from history:', matchedSubmission.id);
              const retryData = await loadReview(matchedSubmission.id);
              if (retryData.success) {
                setData(retryData);
                return;
              }
            }
          }
          setData(null);
        } catch (retryErr) {
          console.error('Failed to resolve review by quiz ID:', retryErr);
          setData(null);
        } finally {
          setLoading(false);
        }
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Info size={48} color="#94a3b8" />
        <p style={{ fontWeight: 800, color: '#64748b' }}>Submission not found</p>
        <button onClick={() => navigate('/history')} className="primary-btn">Back to History</button>
      </div>
    );
  }

  const { submission, review } = data;
  const isWinner = submission.quiz_winner_id === submission.user_id;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '6.5rem', maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
          <button 
            onClick={() => navigate('/history')} 
            className="flex-center" 
            style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{submission.title}</h1>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>DETAILED PERFORMANCE REVIEW</p>
          </div>
        </div>

        {/* Leaderboard Winner Banner & stats */}
        {submission.quiz_winner_id ? (
          <>
            {/* Stunning Alert Banner */}
            <div className="glass-premium animate-fade-in" style={{ 
              background: isWinner ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '2rem',
              borderRadius: '2rem',
              marginBottom: '2.5rem',
              boxShadow: isWinner ? '0 20px 40px -10px rgba(16,185,129,0.3)' : '0 20px 40px -10px rgba(59,130,246,0.3)',
              textAlign: 'center',
              border: 'none'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{isWinner ? "🎉🏆👑" : "🏆📊"}</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {isWinner ? "CONGRATULATIONS, YOU WON!" : "TOURNAMENT RESULTS DECLARED"}
              </h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.95, fontWeight: 500, marginBottom: '1.5rem', color: '#f8fafc' }}>
                {isWinner 
                  ? `Incredible! You secured Rank #1 in this battle and won a prize of ₹${submission.prize_amount || '0'}!` 
                  : `The results are officially declared. You completed the quiz with an excellent effort!`}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => navigate(`/leaderboard/${submission.quiz_id}`)}
                  style={{
                    background: 'white',
                    color: isWinner ? '#059669' : '#1d4ed8',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                  }}
                >
                  View Full Leaderboard
                </button>
              </div>
            </div>

            {/* Stats Summary Bar */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '1rem', 
              marginBottom: '3rem',
              background: 'white',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>YOUR RANK</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#f59e0b' }}>#{submission.rank || '-'}</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>SCORE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#3b82f6' }}>{submission.total_score}</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>ACCURACY</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#10b981' }}>{Math.round((submission.correct_count / (submission.correct_count + submission.wrong_count || 1)) * 100)}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CORRECT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 950, color: '#0f172a' }}>{submission.correct_count}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-premium" style={{ 
            marginBottom: '3rem', 
            padding: '1.5rem 2rem', 
            borderRadius: '1.5rem', 
            background: '#fffbeb', 
            border: '1px solid #fef3c7', 
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
             <div style={{ fontSize: '2.5rem' }}>⏳</div>
             <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', margin: '0 0 4px 0' }}>Official Results Awaiting Declaration</h4>
                <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#d97706', margin: 0, lineHeight: 1.4 }}>
                  Your detailed correct/incorrect results and final leaderboard rank will be officially revealed once the admin declares the tournament results.
                </p>
             </div>
          </div>
        )}

        {/* Question Navigator */}
        <div style={{ 
          background: 'white', padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '2rem', 
          border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Question Navigator</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {review.map((item, i) => (
              <a 
                key={i} 
                href={`#question-${i + 1}`}
                style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  background: item.selected_value === item.correct_value ? '#f0fdf4' : (item.selected_value ? '#fef2f2' : '#f8fafc'),
                  border: `1px solid ${item.selected_value === item.correct_value ? '#10b981' : (item.selected_value ? '#ef4444' : '#e2e8f0')}`,
                  color: item.selected_value === item.correct_value ? '#166534' : (item.selected_value ? '#991b1b' : '#64748b'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none'
                }}
              >
                {i + 1}
              </a>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {review.map((item, idx) => {
            // Normalize correct answer value (could be A,B,C,D or 0,1,2,3)
            const normalizeIndex = (val) => {
              if (val === null || val === undefined) return -1;
              const v = String(val).toUpperCase();
              const mapping = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, '0': 0, '1': 1, '2': 2, '3': 3 };
              return mapping[v] ?? -1;
            };

            const isResultDeclared = !!submission.quiz_winner_id;

            const correctIdx = normalizeIndex(item.correct_value);
            const selectedIdx = normalizeIndex(item.selected_value);
            const optionsToDisplay = item.options || [];
            const displayQuestion = item.question_text;

            return (
              <div key={idx} id={`question-${idx + 1}`} style={{ 
                background: 'white', 
                padding: '2.5rem', 
                borderRadius: '2rem', 
                border: '1px solid #f1f5f9',
                boxShadow: '0 8px 30px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: '#64748b', flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                     <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.1em' }}>QUESTION {idx + 1}</p>
                     <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.4, margin: 0 }}>
                       {displayQuestion}
                     </h3>
                     {item.hindi_question_text && <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '1rem', fontWeight: 600, margin: 0, paddingLeft: '1.25rem', borderLeft: '4px solid #e2e8f0' }}>{item.hindi_question_text}</p>}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {optionsToDisplay.map((opt, oIdx) => {
                    const selectedIdx = normalizeIndex(item.selected_value);
                    
                    const isUserSelected = selectedIdx === oIdx;
                    const isCorrect = correctIdx === oIdx;
                    
                    let bgColor = '#f8fafc';
                    let borderColor = '#e2e8f0';
                    let icon = null;
                    let label = null;

                    if (isResultDeclared) {
                      if (isCorrect) {
                        bgColor = '#f0fdf4';
                        borderColor = '#10b981';
                        icon = <CheckCircle2 size={20} color="#10b981" />;
                        label = isUserSelected ? "CORRECTLY ANSWERED" : "CORRECT ANSWER";
                      } else if (isUserSelected && !isCorrect) {
                        bgColor = '#fef2f2';
                        borderColor = '#ef4444';
                        icon = <XCircle size={20} color="#ef4444" />;
                        label = "WRONG SELECTION";
                      }
                    } else if (isUserSelected) {
                      bgColor = '#eff6ff';
                      borderColor = '#3b82f6';
                      label = "SELECTED BY YOU";
                    }

                    return (
                      <div key={oIdx} style={{ 
                        padding: '1.25rem 1.75rem', 
                        borderRadius: '1.5rem', 
                        background: bgColor, 
                        border: `2px solid ${borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                           <div style={{ 
                             width: '28px', height: '28px', borderRadius: '50%', 
                             background: isResultDeclared ? (isCorrect ? '#10b981' : (isUserSelected ? '#ef4444' : '#1e293b')) : (isUserSelected ? '#3b82f6' : '#1e293b'),
                             color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                             fontSize: '0.75rem', fontWeight: 900
                           }}>
                             {String.fromCharCode(65 + oIdx)}
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ 
                                fontSize: '1rem', 
                                fontWeight: 700, 
                                color: isResultDeclared ? (isCorrect ? '#065f46' : (isUserSelected ? '#991b1b' : '#334155')) : (isUserSelected ? '#1e40af' : '#334155') 
                              }}>
                                {opt.text}
                              </span>
                              {label && <span style={{ 
                                fontSize: '0.6rem', 
                                fontWeight: 950, 
                                color: isResultDeclared ? (isCorrect ? '#059669' : '#ef4444') : '#3b82f6', 
                                textTransform: 'uppercase', 
                                marginTop: '4px',
                                letterSpacing: '0.05em'
                              }}>{label}</span>}
                           </div>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {isResultDeclared && !optionsToDisplay.some(opt => String(correctIdx) === String(opt.value)) && (
                  <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f0fdf4', borderRadius: '1.5rem', border: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={20} color="#10b981" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>
                       CORRECT ANSWER: {item.options?.find(o => normalizeIndex(o.value) === correctIdx)?.text || 'N/A'}
                    </span>
                  </div>
                )}

                {!item.selected_value && (
                  <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#fffbeb', borderRadius: '1.25rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Info size={16} color="#d97706" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b45309' }}>QUESTION WAS SKIPPED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/history')}
            style={{ 
              background: '#0f172a', color: 'white', padding: '1.25rem 3rem', borderRadius: '1.5rem', 
              border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)', transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Return to Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;
