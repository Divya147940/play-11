import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, User } from 'lucide-react';

const mockLeaderboard = [
  { id: 1, name: 'Priya', score: 980, rank: 1, avatar: 'P' },
  { id: 2, name: 'Rahul', score: 890, rank: 2, avatar: 'R' },
  { id: 3, name: 'Amit', score: 820, rank: 3, avatar: 'A' },
  { id: 4, name: 'Suresh K.', score: 800, rank: 4, avatar: 'S' },
  { id: 5, name: 'Meera V.', score: 780, rank: 5, avatar: 'M' },
  { id: 6, name: 'You', score: 760, rank: 6, avatar: 'Y', isCurrentUser: true },
  { id: 7, name: 'Nitin K.', score: 740, rank: 7, avatar: 'N' },
];

const LeaderboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const winners = mockLeaderboard.filter(p => p.rank <= 3);
  const others = mockLeaderboard.filter(p => p.rank > 3);

  // Position winners for podium: [2nd, 1st, 3rd]
  const podiumOrder = [
    winners.find(w => w.rank === 2),
    winners.find(w => w.rank === 1),
    winners.find(w => w.rank === 3)
  ];

  return (
    <div className="leaderboard-wrapper">
      {/* Top Section - Podium */}
      <div className="podium-section">
        <div className="podium-header">
          <button className="back-circle-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-text">
            <h1>Leaderboard 🏆</h1>
            <p>SSC CGL — General Awareness</p>
          </div>
          <div style={{ width: 40 }}></div> {/* Spacer */}
        </div>

        <div className="podium-display">
          {podiumOrder.map((player, idx) => (
            <div key={player.id} className={`podium-spot spot-${player.rank}`}>
              <div className="avatar-wrapper">
                <div className="podium-avatar">
                  {player.rank === 1 && <Trophy size={20} className="trophy-crown" />}
                  <span>{player.avatar}S</span>
                </div>
              </div>
              <div className="player-info">
                <span className="p-name">{player.name}</span>
                <span className="p-score">{player.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - List */}
      <div className="list-section">
        <div className="rankings-list">
          {others.map((player) => (
            <div 
              key={player.id} 
              className={`ranking-card ${player.isCurrentUser ? 'current-user-card' : ''}`}
            >
              <span className="rank-num">{player.rank}</span>
              <div className="list-avatar">
                {player.isCurrentUser ? 'You' : player.avatar + 'K'}
              </div>
              <span className="list-name">{player.name}</span>
              <span className="list-score">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .leaderboard-wrapper {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Lexend', sans-serif;
        }

        .podium-section {
          background: #ffffff;
          padding: 60px 20px 40px;
          color: #0f172a;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
        }

        .podium-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }

        .back-circle-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #0d1f3c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .header-text h1 {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 4px;
          color: #0f172a;
        }

        .header-text p {
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
        }

        .podium-display {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 20px;
          padding-bottom: 20px;
        }

        .podium-spot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 80px;
        }

        .spot-1 { width: 100px; transform: translateY(-20px); }
        
        .avatar-wrapper {
          position: relative;
        }

        .podium-avatar {
          width: 60px;
          height: 60px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          border: 1px solid #e2e8f0;
          color: #0d1f3c;
        }

        .spot-1 .podium-avatar {
          width: 84px;
          height: 84px;
          background: #fef9c3; /* Soft Gold Tint */
          border: 3px solid #facc15;
          font-size: 24px;
          color: #a16207;
        }

        .spot-2 .podium-avatar { background: #f1f5f9; border-color: #cbd5e1; }
        .spot-3 .podium-avatar { background: #fff7ed; border-color: #fdba74; color: #9a3412; }

        .trophy-crown {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          color: #facc15;
          filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.5));
        }

        .player-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .p-name { font-weight: 700; font-size: 14px; }
        .p-score { font-weight: 800; font-size: 12px; color: #38bdf8; }

        .list-section {
          padding: 30px 20px 100px;
        }

        .rankings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .ranking-card {
          background: white;
          padding: 16px 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.01);
        }

        .current-user-card {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.1);
        }

        .rank-num {
          font-weight: 800;
          color: #94a3b8;
          width: 24px;
        }

        .current-user-card .rank-num { color: #0369a1; }

        .list-avatar {
          width: 44px;
          height: 44px;
          background: #1e293b;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
        }

        .current-user-card .list-avatar {
          background: #3b82f6;
          font-size: 12px;
        }

        .list-name {
          flex: 1;
          font-weight: 700;
          color: #1e293b;
        }

        .current-user-card .list-name { color: #0369a1; }

        .list-score {
          font-weight: 900;
          color: #1e293b;
        }

        .current-user-card .list-score { color: #0369a1; }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
