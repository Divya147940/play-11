import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizService } from "../services/api";
import { CheckCircle, Clock } from "lucide-react";

export default function ContestListPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("play11_session");
    if (!user) {
      navigate("/register");
      return;
    }

    quizService.getQuizzesByZone('sport-zone')
      .then(data => {
        setQuizzes(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', paddingTop: '100px' }}>Loading Contests...</div>;

  return (
    <div className="contest-list-container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="contest-cards-stack">
        {quizzes.length === 0 && <p style={{ textAlign: 'center', color: '#64748b' }}>No live contests at the moment.</p>}
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="contest-card-white">
            <div className="contest-card-row-top">
              <div className="tag-pill-light">STUDY ZONE</div>
              <div className={`status-badge-${(quiz.status_label || 'LIVE').toLowerCase()}`}>
                {quiz.status_label || 'LIVE'}
              </div>
            </div>

            <div className="contest-card-title">{quiz.title}</div>

            <div className="contest-card-metrics">
              <div className="metric-item">
                Prize <strong>₹{quiz.total_questions * 50}</strong>
              </div>
              <div className="metric-item">
                Entry <strong>₹{quiz.entry_amount || 0}</strong>
              </div>
              <div className="metric-item">
                Questions <strong>{quiz.total_questions}</strong>
              </div>
            </div>

            <div className="contest-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quiz.is_submitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} /> Submitted: {new Date(quiz.submitted_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                  <button
                    className="btn-join-outline"
                    style={{ width: '100%', background: '#10b981', color: 'white', border: 'none' }}
                    onClick={() => navigate(`/game-result/${quiz.id}`)}
                  >
                    View Result <CheckCircle size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn-join-outline"
                  style={{ width: '100%' }}
                  onClick={() => navigate(`/game-quiz-detail/${quiz.id}`)}
                  disabled={quiz.status_label === 'CLOSED'}
                >
                  {quiz.status_label === 'CLOSED' ? 'Contest Closed' : 'Join Contest'}
                </button>
              )}
              
              <button
                className="btn-leaderboard-secondary"
                style={{ 
                  width: '100%',
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/leaderboard/${quiz.id}`)}
              >
                Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
