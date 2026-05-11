import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Trophy, ChevronRight } from 'lucide-react';

const GameHomePage = () => {
  const navigate = useNavigate();
  const [games, setGames] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/quizzes/zone/game-zone')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.quizzes.map(q => ({
            id: q.id,
            tag: q.category_id === 'cat-g1' ? 'IPL QUIZ' : 'GAME ZONE',
            status: q.status_label || 'LIVE',
            statusColor: q.status_label === 'UPCOMING' ? 'upcoming' : 'live',
            title: q.title,
            timerLabel: q.status_label === 'UPCOMING' ? 'STARTS AT' : 'CLOSES IN',
            timer: q.status_label === 'UPCOMING' ? '7:30 PM' : q.timer_minutes + 'm',
            questions: q.total_questions + ' Questions',
            players: '100+ joined',
            rewards: q.reward_text || 'Top 3 rewarded',
            btnText: q.status_label === 'UPCOMING' ? 'View Quiz' : 'Join Live Quiz',
            active: true
          }));
          setGames(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="quiz-room-bg" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', paddingLeft: '3%', paddingRight: '3%' }}>
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/home-choice')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '0.75rem', 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            color: '#64748b',
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-lift"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }} className="animate-slide-up">
           <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>GAME ZONE</p>
              <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.75rem)', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Cricket-based quiz battles</h1>
           </div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#eff6ff', color: '#1d4ed8', padding: '8px 16px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
              <span>Skill-based match quizzes (IPL style)</span>
           </div>
        </div>

        {/* Games Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="animate-slide-up stagger-1">
          {games.map((game) => (
            <div key={game.id} className="game-zone-card" style={{ padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>{game.tag}</div>
                 <div className={`badge-${game.statusColor}-mini`}>{game.status}</div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>{game.title}</h3>

              <div className="game-status-box">
                 <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>{game.timerLabel}</p>
                 <p style={{ fontSize: '1.5rem', fontWeight: 950, color: game.status === 'LIVE' ? '#ef4444' : '#3b82f6' }}>{game.timer}</p>
              </div>

              <div style={{ background: '#fff', borderRadius: '1rem' }}>
                 <div className="game-metric-row">
                    <div className="game-metric-label">QUESTIONS</div>
                    <div className="game-metric-value">{game.questions}</div>
                 </div>
                 <div className="game-metric-row">
                    <div className="game-metric-label">PLAYERS</div>
                    <div className="game-metric-value">{game.players}</div>
                 </div>
                 <div className="game-metric-row">
                    <div className="game-metric-label">REWARDS</div>
                    <div className="game-metric-value">{game.rewards}</div>
                 </div>
              </div>

              <button 
                className="quiz-join-btn blue" 
                onClick={() => {
                  navigate(`/match-quiz-room/${game.id}`);
                }}
              >
                {game.btnText}
              </button>
            </div>
          ))}

          {/* Practice Card - Matches Screenshot */}
          <div className="game-zone-card" style={{ padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>PRACTICE</div>
               <div className="badge-practice-mini" style={{ fontSize: '0.5rem', padding: '2px 4px' }}>FREE</div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>Cricket Knowledge Practice</h3>

            <div className="game-status-box">
               <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>MODE</p>
               <p style={{ fontSize: '1.5rem', fontWeight: 950, color: '#3b82f6' }}>Practice Quiz</p>
            </div>

            <div style={{ background: '#fff', borderRadius: '1rem' }}>
               <div className="game-metric-row">
                  <div className="game-metric-label">QUESTIONS</div>
                  <div className="game-metric-value">10 Questions</div>
               </div>
               <div className="game-metric-row">
                  <div className="game-metric-label">PLAYERS</div>
                  <div className="game-metric-value">300+ attempted</div>
               </div>
               <div className="game-metric-row">
                  <div className="game-metric-label">TYPE</div>
                  <div className="game-metric-value">Past match based</div>
               </div>
               <div className="game-metric-row">
                  <div className="game-metric-label">PLAYERS</div>
                  <div className="game-metric-value">300+ attempted</div>
               </div>
            </div>

            <button 
              className="quiz-join-btn blue" 
              onClick={() => navigate('/dummy-quiz-flow')}
            >
              Practice Now
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }} className="animate-slide-up stagger-2">
           <div style={{ color: '#3b82f6' }}><Info size={24} /></div>
           <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>About Game Zone Quizzes</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>Match-based quizzes are designed to test your real-time cricket knowledge. Join a room before it closes to participate in the upcoming live battle. Rewards are distributed automatically based on final leaderboard positions.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GameHomePage;
