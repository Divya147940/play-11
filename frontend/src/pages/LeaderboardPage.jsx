import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react';

const LeaderboardPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const isGlobal = !quizId;

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
        let token = '';
        if (sessionRaw) {
          try {
            const parsed = JSON.parse(sessionRaw);
            token = parsed.token || sessionRaw;
          } catch (e) {
            token = sessionRaw;
          }
        }
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const endpoint = isGlobal
          ? '/api/quizzes/leaderboard'
          : `/api/quizzes/${quizId}/leaderboard`;

        const res = await fetch(endpoint, { headers });
        const text = await res.text();
        if (!text) throw new Error('Server returned an empty response.');
        const data = JSON.parse(text);
        if (!data.success) throw new Error(data.error || 'Failed to load leaderboard.');

        // Use only real data from the API
        const realData = data.leaderboard || [];
        
        // Sort by score
        realData.sort((a, b) => b.total_score - a.total_score);

        const ranked = realData.map((p, i) => {
          const parts = (p.name || 'User').trim().split(/\s+/);
          let avatar = '';
          if (parts.length >= 2) {
            avatar = (parts[0][0] + parts[1][0]).toUpperCase();
          } else {
            const name = p.name || 'User';
            avatar = name.slice(0, 2).toUpperCase();
          }
          return { ...p, rank: i + 1, avatar };
        });

        setLeaderboard(ranked);
        setUserRank(data.userRank || null);

        if (!isGlobal) {
          const qRes = await fetch(`/api/quizzes/${quizId}`);
          const qText = await qRes.text();
          if (qText) {
            const qData = JSON.parse(qText);
            if (qData.success) setQuizTitle(qData.quiz?.title || '');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId, isGlobal]);

  const winners = leaderboard.filter(p => p.rank <= 3);
  const others  = leaderboard.filter(p => p.rank > 3);

  const podiumOrder = [
    winners.find(w => w.rank === 2),
    winners.find(w => w.rank === 1),
    winners.find(w => w.rank === 3),
  ].filter(Boolean);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <Loader2 size={36} className="spin-loader" />
        <style>{`.spin-loader { animation: spin 1s linear infinite; color: #3b82f6; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="lb-page">
      {/* Header */}
      <div className="lb-header-container">
        <div className="lb-header-top">
          <button className="lb-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="lb-title-block">
            <h1 className="lb-title">Leaderboard 🏆</h1>
            <p className="lb-subtitle">{isGlobal ? 'ALL-TIME BEST' : (quizTitle || 'QUIZ CONTEST')}</p>
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="lb-podium-wrap">
        <div className="lb-podium">
          {podiumOrder.map((player) => (
            <div key={player.rank} className={`lb-podium-item spot-${player.rank}`}>
              <div className="lb-avatar-box">
                <div className="lb-avatar-circle">
                  {player.rank === 1 && (
                    <div className="lb-crown">
                      <div className="lb-crown-ring" />
                      <div className="lb-crown-dot" />
                    </div>
                  )}
                  {player.avatar}
                </div>
              </div>
              <div className="lb-p-info">
                <div className="lb-p-name">{player.name}</div>
                <div className="lb-p-score">{player.total_score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="lb-list-wrap">
        <div className="lb-list">
          {others.map((player) => {
            const isYou = userRank && String(player.user_id) === String(userRank.user_id);
            return (
              <div key={player.rank} className={`lb-row ${isYou ? 'lb-me' : ''}`}>
                <div className="lb-rank">{player.rank}</div>
                <div className="lb-avatar-small">
                  {isYou ? 'You' : player.avatar}
                </div>
                <div className="lb-name-small">{isYou ? 'You' : player.name}</div>
                <div className="lb-score-small">{player.total_score}</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&display=swap');

        .lb-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Lexend', sans-serif;
          padding: 80px 0 100px;
        }
        @media (max-width: 768px) {
          .lb-page { padding-top: 75px; }
        }

        .lb-header-container {
          padding: 20px 24px;
          margin-bottom: 20px;
        }

        .lb-header-top {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .lb-back-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0f172a;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .lb-back-btn:hover {
          background: #f1f5f9;
          transform: translateX(-2px);
        }

        .lb-title-block {
          text-align: left;
        }

        .lb-title {
          font-size: 22px; font-weight: 900; color: #0f172a; margin: 0;
          letter-spacing: -0.02em;
        }
        .lb-subtitle {
          font-size: 10px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.1em; margin: 2px 0 0;
        }

        .lb-podium-wrap {
          display: flex; justify-content: center; margin-bottom: 40px;
          padding-top: 30px;
        }
        .lb-podium {
          display: flex; align-items: flex-end; gap: 20px;
        }

        .lb-podium-item {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          width: 70px;
        }
        .spot-1 { width: 90px; transform: translateY(-30px); }

        .lb-avatar-box { position: relative; }
        .lb-avatar-circle {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 15px;
          background: #f1f5f9; border: 1px solid #e2e8f0; color: #0f172a;
          position: relative;
        }

        .spot-1 .lb-avatar-circle {
          width: 72px; height: 72px; font-size: 20px;
          background: #fef9c3; border: 3px solid #facc15; color: #a16207;
        }
        .spot-2 .lb-avatar-circle { background: #f1f5f9; border-color: #cbd5e1; }
        .spot-3 .lb-avatar-circle { background: #fff7ed; border-color: #fdba74; color: #9a3412; }

        .lb-crown {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
        }
        .lb-crown-ring {
          width: 14px; height: 8px; border: 2.2px solid #facc15; border-radius: 50%;
        }
        .lb-crown-dot {
          width: 4px; height: 4px; background: #facc15; border-radius: 50%;
          position: absolute; top: -3px; left: 50%; transform: translateX(-50%);
        }

        .lb-p-name { font-weight: 800; font-size: 11px; color: #0f172a; }
        .lb-p-score { font-weight: 800; font-size: 10px; color: #0ea5e9; margin-top: 2px; }

        .lb-list-wrap {
          padding: 0 20px;
        }
        .lb-list {
          display: flex; flex-direction: column; gap: 12px;
          max-width: 440px; margin: 0 auto;
        }

        .lb-row {
          background: white; padding: 14px 16px; border-radius: 18px;
          display: flex; align-items: center; gap: 14px;
          border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.01);
        }

        .lb-me {
          background: #f0f9ff; border-color: #bae6fd;
        }

        .lb-rank {
          font-weight: 700; color: #94a3b8; width: 22px; text-align: center; font-size: 12px;
        }
        .lb-avatar-small {
          width: 38px; height: 38px; background: #0f172a; border-radius: 50%;
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 12px;
        }
        .lb-me .lb-avatar-small { background: #3b82f6; font-size: 11px; }

        .lb-name-small {
          flex: 1; font-weight: 800; color: #0f172a; font-size: 13px;
        }
        .lb-score-small {
          font-weight: 900; color: #0f172a; font-size: 14px;
        }

        .lb-me .lb-name-small, .lb-me .lb-score-small, .lb-me .lb-rank { color: #0369a1; }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
