import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const StudyResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [resultData, setResultData] = useState(location.state || { score: 0, total: 0, rank: '-', time: '00:00' });
  const [quizTitle, setQuizTitle] = useState('Study Quiz');
  const [loading, setLoading] = useState(!location.state);

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const resultDate = tomorrow.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  useEffect(() => {
    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    let headers = {};
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        headers['Authorization'] = `Bearer ${session.token || sessionRaw}`;
      } catch (e) {
        headers['Authorization'] = `Bearer ${sessionRaw}`;
      }
    }

    if (id && id !== 'daily') {
      // Fetch result if not passed via state
      if (!location.state) {
        fetch(`/api/quizzes/${id}/results`, { headers })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setResultData({
                score: data.result.total_score,
                total: data.quiz.total_questions,
                rank: data.result.rank,
                time: data.result.submitted_at ? new Date(data.result.submitted_at).toLocaleTimeString() : 'Completed'
              });
              setQuizTitle(data.quiz.title);
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        // Just fetch title if we already have stats
        fetch(`/api/quizzes/${id}`, { headers })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.quiz) {
              setQuizTitle(data.quiz.title || 'Study Quiz');
            }
          })
          .catch(() => {});
      }
    }
  }, [id, location.state]);

  return (
    <div style={{
      background: '#f8fafc',
      minHeight: '100vh',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Dark Header Banner overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '280px',
        background: '#0a192f',
        zIndex: 0
      }}></div>

      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'center',
        padding: '120px 1rem 3rem 1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>

        {/* Header label */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8',
            textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
            QUIZ COMPLETED
          </span>
        </div>

        <h1 style={{
          textAlign: 'center',
          fontSize: 'clamp(1.2rem, 5vw, 1.6rem)',
          fontWeight: 900,
          color: '#f8fafc',
          marginBottom: '0.5rem',
          whiteSpace: 'nowrap'
        }}>
          Final Assessment Summary
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#94a3b8',
          marginBottom: '2.5rem'
        }}>
          Based on your performance in the academic arena.
        </p>

        {/* Result Card */}
        <div style={{
          background: '#ffffff',
          width: '100%',
          padding: '2.5rem',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          color: '#0f172a'
        }}>
          {/* Removed Celebration emoji */}

          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            marginBottom: '0.5rem',
            color: '#0f172a'
          }}>
            {quizTitle}
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: '#64748b',
            marginBottom: '2rem'
          }}>
            You have successfully completed the study quiz battle!
          </p>

          {/* Stats row - 4 Columns like in the image */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            marginBottom: '2.5rem'
          }}>
            {[
              { label: 'FINAL SCORE', value: `${resultData.score}/${resultData.total}` },
              { label: 'YOUR RANK', value: `#${resultData.rank}` },
              { label: 'TIME TAKEN', value: resultData.time },
            ].map((stat, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1rem 0.5rem',
                  flex: 1,
                  minWidth: 0
                }}>
                  <div style={{
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: stat.color || '#0f172a'
                  }}>
                    {stat.value}
                  </div>
                </div>
            ))}
          </div>

          {/* Result declared tomorrow banner */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            margin: '0 0 2.5rem 0',
            padding: '1.75rem 1.5rem',
            borderRadius: '1rem',
            border: '1px solid #bbf7d0',
            width: '100%',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.05)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📢</div>
            <p style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#166534',
              marginBottom: '0.5rem'
            }}>
              Official results will be declared tomorrow
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#15803d',
              fontWeight: 700
            }}>
              Expected On: {resultDate}
            </p>
            <p style={{
              fontSize: '0.8rem',
              color: '#16a34a',
              marginTop: '0.75rem',
              lineHeight: 1.5
            }}>
              Final rankings and rewards will be calculated based on all participants. Check the leaderboard tomorrow for your definitive position.
            </p>
          </div>

          <div className="result-actions-container">
            <button
              onClick={() => navigate('/home-choice')}
              className="result-action-btn"
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a'
              }}
            >
              Home
            </button>
            <button
              onClick={() => navigate(`/quiz-review/${id}`)}
              className="result-action-btn"
              style={{
                background: '#3b82f6',
                border: 'none',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              Review Quiz
            </button>
            <button
              onClick={() => navigate('/history')}
              className="result-action-btn"
              style={{
                background: '#f97316',
                border: 'none',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
              }}
            >
              Activity
            </button>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default StudyResultPage;
