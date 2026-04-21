import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const contestsData = [
  {
    id: 1,
    tag: "SSC CGL",
    status: "Live",
    title: "General Awareness Battle",
    prize: "₹500",
    entry: "₹11",
    players: "48",
  },
  {
    id: 2,
    tag: "UP SC",
    status: "Upcoming",
    title: "Indian Polity Quiz",
    prize: "₹1,000",
    entry: "₹1",
    players: "102",
  },
  {
    id: 3,
    tag: "NEET",
    status: "Live",
    title: "Biology MCQ Battle",
    prize: "₹250",
    entry: "₹1",
    players: "28",
  },
];

export default function ContestListPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("play11_user");
    if (!user) {
      navigate("/register");
    }
  }, [navigate]);

  return (
    <div className="contest-list-container" style={{ paddingTop: '100px' }}>
      <div className="contest-cards-stack">
        {contestsData.map((contest) => (
          <div key={contest.id} className="contest-card-white">
            <div className="contest-card-row-top">
              <div className="tag-pill-light">{contest.tag}</div>
              {contest.status === "Live" ? (
                <div className="status-badge-live">Live</div>
              ) : (
                <div className="status-badge-upcoming">Upcoming</div>
              )}
            </div>

            <div className="contest-card-title">{contest.title}</div>

            <div className="contest-card-metrics">
              <div className="metric-item">
                Prize <strong>{contest.prize}</strong>
              </div>
              <div className="metric-item">
                Entry <strong>{contest.entry}</strong>
              </div>
              <div className="metric-item">
                Players <strong>{contest.players}</strong>
              </div>
            </div>

            <div className="contest-card-actions" style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-join-outline"
                style={{ flex: 1 }}
                onClick={() => navigate(`/game-quiz-play/${contest.id}`)}
              >
                Join Contest
              </button>
              <button
                className="btn-leaderboard-secondary"
                style={{ 
                  flex: 1,
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/leaderboard/${contest.id}`)}
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
