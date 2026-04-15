import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarClock, Trophy, ArrowLeft } from 'lucide-react';
import MatchCard from '../components/MatchCard';

const MatchListPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.matches.map(m => ({
            id: m.id,
            teamA: m.team_a,
            teamB: m.team_b,
            time: m.start_time,
            joined: '1.2k',
            reward: '₹50,000',
            status: m.status
          }));
          setMatches(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '5rem' }}>
        
        {/* Website Header Bar */}
        <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
          <button 
            onClick={() => navigate('/game-home')} 
            className="flex-center glass-card" 
            style={{ color: 'hsl(var(--foreground))', width: '60px', height: '60px', borderRadius: '1.75rem', flexShrink: 0 }}
          >
            <ArrowLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
               <CalendarClock size={16} color="hsl(var(--secondary))" />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'hsl(var(--secondary))', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live Schedule</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'hsl(var(--foreground))', fontWeight: 950, letterSpacing: '-0.03em' }}>
              Prediction <span className="text-gradient">Arena Hub.</span>
            </h1>
          </div>
        </div>

        {/* Website Tabs */}
        <div className="glass-container animate-slide-up stagger-1" style={{ display: 'flex', gap: '0.5rem', marginBottom: '4rem', padding: '0.6rem', borderRadius: '1.75rem', maxWidth: '440px', background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
          {['Today', 'Upcoming'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-center" 
              style={{ 
                flex: 1, 
                padding: '1rem', 
                borderRadius: '1.25rem', 
                background: activeTab === tab ? 'hsl(var(--primary))' : 'transparent', 
                fontWeight: 900, 
                fontSize: '0.9rem',
                color: activeTab === tab ? 'white' : 'hsl(var(--muted-foreground))', 
                border: 'none', 
                boxShadow: activeTab === tab ? '0 10px 25px -5px hsla(var(--primary), 0.4)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Match Records Grid */}
        {loading ? (
          <div className="flex-center" style={{ padding: '5rem' }}>
             <div style={{ width: '44px', height: '44px', border: '5px solid hsl(var(--muted))', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div className="bento-grid">
            {matches
              .filter(match => {
                const matchDate = new Date(match.time).toDateString();
                const todayDate = new Date().toDateString();
                if (activeTab === 'Today') return matchDate === todayDate;
                if (activeTab === 'Upcoming') return new Date(match.time) > new Date();
                return true;
              })
              .map((match, idx) => (
                <div key={match.id} className={`animate-slide-up stagger-${(idx % 3) + 1}`}>
                  <MatchCard 
                    match={match} 
                    onClick={() => navigate(`/game-quiz-detail/${match.id}`)} 
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchListPage;
