import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const GameReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Real data passed from GameQuestionPage via navigate state
  const { answers = {}, questions = [], currentIdx = 0, quizId } = location.state || {};
  
  const realQuizId = id || quizId;
  const total = questions.length || 0;
  const answered = Object.keys(answers).length;
  const unanswered = total - answered;

  const handleFinalSubmit = () => {
    // Navigate back to GameQuestionPage with a signal to submit
    navigate(`/game-quiz-play/${realQuizId}`, { 
      state: { triggerSubmit: true, answers, questions }
    });
  };

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a192f' }}>
      <div className="container" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} style={{ color: '#ffffff', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Final Prediction Review</h1>
        </div>

        {/* Summary Card */}
        <div style={{ background: '#1e293b', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '2rem', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <CheckCircle2 color="#10b981" size={28} style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 900, fontSize: '1.5rem', color: '#f8fafc' }}>{answered}</p>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Answered</p>
            </div>
            <div style={{ flex: 1, padding: '1.25rem', background: unanswered > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', borderRadius: '1.25rem', textAlign: 'center', border: unanswered > 0 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)' }}>
              <AlertCircle color={unanswered > 0 ? '#ef4444' : '#10b981'} size={28} style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 900, fontSize: '1.5rem', color: '#f8fafc' }}>{unanswered}</p>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pending</p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#f8fafc' }}>Question Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.75rem' }}>
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === currentIdx;
              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isAnswered 
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : isCurrent 
                        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                        : '#334155',
                    borderRadius: '0.75rem',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    color: '#f8fafc',
                    border: isCurrent ? '2px solid #60a5fa' : '1px solid #475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => navigate(-1)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#10b981' }} />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#334155', border: '1px solid #475569' }} />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Skipped</span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div style={{ marginTop: 'auto', paddingBottom: '2.5rem' }}>
          <div style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.05)', borderRadius: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, lineHeight: '1.6' }}>
              {unanswered > 0 
                ? `⚠️ You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. You can still go back and answer them.`
                : '✅ All questions answered! Ready to submit.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ flex: 1, background: '#334155', border: '1px solid #475569', color: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              ← Go Back
            </button>
            <button
              onClick={handleFinalSubmit}
              style={{ flex: 2, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: '#ffffff', padding: '1rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(59,130,246,0.4)' }}
            >
              Final Submit <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReviewPage;
