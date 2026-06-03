import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const parseUtcDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'object') return dateStr;
  const tStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const hasTz = tStr.includes('Z') || tStr.includes('+') || (tStr.includes('-') && tStr.indexOf('-', 11) !== -1);
  const zStr = hasTz ? tStr : tStr + '+05:30';
  return new Date(zStr);
};

const formatDuration = (timeStr) => {
  if (!timeStr) return 'Completed';
  if (typeof timeStr === 'string') {
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return 'Completed';
    }
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return `${minutes} min ${seconds} sec`;
      }
    }
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        if (hours > 2) return 'Completed';
        if (hours === 0) {
          return `${minutes} min ${seconds} sec`;
        }
        return `${hours} hr ${minutes} min ${seconds} sec`;
      }
    }
  }
  return timeStr;
};

const GameResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [resultData, setResultData] = useState(() => {
    const sState = location.state;
    if (sState) {
      return {
        ...sState,
        time: formatDuration(sState.time)
      };
    }
    return { score: 0, total: 0, rank: '-', time: '00:00' };
  });
  const [quizTitle, setQuizTitle] = useState('Game Arena');
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
    document.body.style.backgroundColor = '#0a192f';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

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
                time: formatDuration(data.result.time_taken || data.result.submitted_at)
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
              setQuizTitle(data.quiz.title || 'Game Arena');
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
      padding: '120px 0 0 0',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ width: '100%' }}>

        {/* Header label */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 800, color: '#f97316',
            textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
            MATCH COMPLETED
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
          Your performance metrics for the match prediction arena.
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
          <div style={{
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.5rem',
            color: '#15803d',
            fontWeight: 800,
            fontSize: '1.05rem',
            textAlign: 'center',
            margin: '1rem auto 2rem auto',
            maxWidth: '480px',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <span style={{ fontSize: '1.3rem' }}>✅</span>
            <span>You have successfully submitted the quiz.</span>
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
          <div className="result-actions-container">
            <button
              onClick={() => navigate('/home-choice')}
              className="result-action-btn"
              style={{
                background: 'transparent',
                border: '1px solid #334155',
                color: '#475569'
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
  );
};

export default GameResultPage;
