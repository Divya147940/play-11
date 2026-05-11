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
      background: '#0a192f',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '2rem 0 0 0',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ width: '100%' }}>

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
          fontSize: 'clamp(1.1rem, 5vw, 1.4rem)',
          fontWeight: 800,
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
          marginBottom: '2rem'
        }}>
          Based on your performance in the academic arena.
        </p>

        {/* Result Card */}
        <div style={{
          background: '#ffffff',
          width: '100%',
          padding: '3rem 1.5rem',
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
            background: 'linear-gradient(135deg, #1e3a5f, #1e4d8c)',
            margin: '0 -1.5rem 2.5rem -1.5rem',
            padding: '1.75rem 1.5rem',
            width: 'calc(100% + 3rem)',
            border: 'none',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📢</div>
            <p style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '0.5rem'
            }}>
              Official results will be declared tomorrow
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#93c5fd',
              fontWeight: 600
            }}>
              Expected On: {resultDate}
            </p>
            <p style={{
              fontSize: '0.8rem',
              color: '#7dd3fc',
              marginTop: '0.75rem',
              lineHeight: 1.5
            }}>
              Final rankings and rewards will be calculated based on all participants. Check the leaderboard tomorrow for your definitive position.
            </p>
          </div>

          {/* Return Home button */}
          <button
            onClick={() => navigate('/home-choice')}
            style={{
              background: '#3b82f6',
              border: 'none',
              color: '#ffffff',
              padding: '1rem 3rem',
              borderRadius: '0.75rem',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Return Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudyResultPage;
