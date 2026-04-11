import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import MatchCard from '../components/MatchCard';

const MatchListPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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
            joined: '1.2k', // mock
            reward: '₹50,000', // mock
            status: m.status
          }));
          setMatches(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button onClick={() => navigate('/game-home')} className="flex-center" style={{ color: 'hsl(var(--foreground))', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--card-border))', width: '48px', height: '48px', borderRadius: '1rem' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'hsl(var(--foreground))', fontWeight: 900, fontFamily: 'Lexend' }}>Upcoming Matches</h1>
        </div>

        {/* Tabs (Today / Upcoming) */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
          <button className="flex-center" style={{ flex: 1, padding: '1rem', borderRadius: '1.25rem', background: 'hsl(var(--primary))', fontWeight: 700, color: 'white', border: 'none', boxShadow: '0 10px 20px -5px hsl(var(--primary) / 0.3)' }}>Today</button>
          <button className="flex-center" style={{ flex: 1, padding: '1rem', borderRadius: '1.25rem', background: 'white', fontWeight: 700, color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--card-border))' }}>Upcoming</button>
        </div>

        {/* Match Cards - Responsive Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Match Schedules...</div>
        ) : (
          <div className="laptop-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
            {matches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onClick={() => navigate(`/game-quiz-detail/${match.id}`)} 
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MatchListPage;
