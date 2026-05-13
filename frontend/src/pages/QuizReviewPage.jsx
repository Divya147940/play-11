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
    if (!sessionRaw) return navigate('/login');

    let token = '';
    try {
      const parsed = JSON.parse(sessionRaw);
      token = parsed.token || (typeof sessionRaw === 'string' ? sessionRaw : '');
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
        {submission.quiz_winner_id && (
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

        {!submission.quiz_winner_id && (
          <div className="glass-premium" style={{ marginBottom: '3rem', padding: '1.5rem', borderRadius: '1.5rem', background: '#fffbeb', border: '1px solid #fef3c7', textAlign: 'center' }}>
             <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b45309' }}>
               🛡️ Performance details & correct answers will be revealed once the official results are declared by the admin.
             </p>
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

            // High-precision cleanup logic (same as admin)
            const subTitle = submission.title?.trim().toLowerCase();
            const qText = item.question_text?.trim().toLowerCase();
            const isTitleMatch = qText === subTitle || qText === "question" || !item.question_text;
            const opt0HasQMark = item.options?.[0]?.text?.includes('?');
            const isCorrupted = (isTitleMatch || (!item.question_text?.includes('?') && opt0HasQMark)) && item.options?.length > 1;

            const displayQuestion = isCorrupted ? item.options[0].text : item.question_text;
            const optionsToDisplay = [...(isCorrupted ? item.options.slice(1) : (item.options || []))];

            // Adjusted correct index: If corrupted and pointing to the question text, shift by 1
            const correctIdxRaw = normalizeIndex(item.correct_value);
            let correctIdx = correctIdxRaw;
            if (isCorrupted && item.options?.[correctIdxRaw]?.text?.trim() === displayQuestion?.trim()) {
              correctIdx = correctIdxRaw + 1;
            }

            // Data Recovery: If selected or correct index is beyond current options, or if we have < 4, 
            // try to pad to 4 options to maintain the A, B, C, D sequence.
            const selIdx = normalizeIndex(item.selected_value);
            const corIdx = correctIdx; // Now correctly defined
            const targetLen = Math.max(4, selIdx + 1, corIdx + 1);
            
            while (optionsToDisplay.length < targetLen && optionsToDisplay.length < 10) {
              optionsToDisplay.push({ 
                text: 'Option data not available', 
                value: String(optionsToDisplay.length + (isCorrupted ? 1 : 0)) 
              });
            }

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
                    const actualVal = opt.value;
                    const selectedIdx = normalizeIndex(item.selected_value);
                    
                    const isUserSelected = String(selectedIdx) === String(actualVal);
                    const isCorrect = String(correctIdx) === String(actualVal);
                    
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
