import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, Info, HelpCircle, Trophy, Target } from 'lucide-react';

const QuizReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('play11_session');
    if (!sessionRaw) return navigate('/login');

    let token = sessionRaw;
    try {
      const parsed = JSON.parse(sessionRaw);
      token = parsed.token || sessionRaw;
    } catch (e) {
      token = sessionRaw;
    }

    fetch(`/api/auth/submission/${id}/review`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Submission review data not found');
        return res.json();
      })
      .then(resData => {
        console.log('Review data loaded:', resData);
        if (resData.success) {
          setData(resData);
        } else {
          setData(null);
        }
      })
      .catch(err => {
        console.error('Review Fetch Error:', err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <Info size={48} color="#94a3b8" />
        <p style={{ fontWeight: 800, color: '#64748b' }}>Submission not found</p>
        <button onClick={() => navigate('/history')} className="primary-btn">Back to History</button>
      </div>
    );
  }

  const { submission, review } = data;

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

        {/* Stats Summary Bar - ONLY SHOW IF RESULT DECLARED */}
        {submission.winner_id && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem', 
            marginBottom: '3rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ textAlign: 'center' }}>
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
        )}

        {!submission.winner_id && (
          <div className="glass-premium" style={{ marginBottom: '3rem', padding: '1.5rem', borderRadius: '1.5rem', background: '#fffbeb', border: '1px solid #fef3c7', textAlign: 'center' }}>
             <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b45309' }}>
               🛡️ Performance details & correct answers will be revealed once the official results are declared by the admin.
             </p>
          </div>
        )}

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {review.map((item, idx) => (
            <div key={idx} style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '1.5rem', 
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, color: '#64748b', flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.4 }}>
                  {item.question_text}
                  {item.hindi_question_text && <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>{item.hindi_question_text}</span>}
                </h3>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {item.options.map((opt, oIdx) => {
                  const isUserSelected = String(item.selected_value) === String(opt.value);
                  const isCorrect = String(item.correct_value) === String(opt.value);
                  const isResultDeclared = !!submission.winner_id;
                  
                  let bgColor = '#f8fafc';
                  let borderColor = '#e2e8f0';
                  let icon = null;
                  let label = null;

                  if (isResultDeclared) {
                    // Show full feedback after result declared
                    if (isCorrect) {
                      bgColor = '#f0fdf4';
                      borderColor = '#10b981';
                      icon = <CheckCircle2 size={18} color="#10b981" />;
                      if (isUserSelected) label = "CORRECT ANSWER";
                      else label = "CORRECT OPTION";
                    } else if (isUserSelected && !isCorrect) {
                      bgColor = '#fef2f2';
                      borderColor = '#ef4444';
                      icon = <XCircle size={18} color="#ef4444" />;
                      label = "YOUR WRONG SELECTION";
                    }
                  } else {
                    // Hide correct answer, only show user's choice
                    if (isUserSelected) {
                      bgColor = '#eff6ff';
                      borderColor = '#3b82f6';
                      label = "YOUR SELECTION";
                    }
                  }

                  return (
                    <div key={oIdx} style={{ 
                      padding: '1.25rem 1.5rem', 
                      borderRadius: '1.25rem', 
                      background: bgColor, 
                      border: `2px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      boxShadow: (isResultDeclared && (isUserSelected || isCorrect)) || (!isResultDeclared && isUserSelected) ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ 
                           width: '24px', height: '24px', borderRadius: '50%', 
                           background: isResultDeclared ? (isCorrect ? '#10b981' : (isUserSelected ? '#ef4444' : '#1e293b')) : (isUserSelected ? '#3b82f6' : '#1e293b'),
                           color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '0.7rem', fontWeight: 900
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
                              fontWeight: 900, 
                              color: isResultDeclared ? (isCorrect ? '#059669' : '#ef4444') : '#3b82f6', 
                              textTransform: 'uppercase', 
                              marginTop: '2px' 
                            }}>{label}</span>}
                         </div>
                      </div>
                      {icon}
                    </div>
                  );
                })}
              </div>

              {!item.selected_value && (
                <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#fffbeb', borderRadius: '0.75rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={14} color="#d97706" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>QUESTION WAS SKIPPED</span>
                </div>
              )}
            </div>
          ))}
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
