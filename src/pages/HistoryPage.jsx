import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const mockHistory = [
  { id: 1, title: 'IPL Today Match', type: 'Game', date: '09 Apr, 2024', score: '1250', rank: '4', won: '₹1,000' },
  { id: 2, title: 'SSC CGL Mock 1', type: 'Study', date: '08 Apr, 2024', score: '42/50', rank: '124', won: '-' },
  { id: 3, title: 'Player Knowledge', type: 'Game', date: '07 Apr, 2024', score: '850', rank: '15', won: '₹200' },
  { id: 4, title: 'Banking Awareness', type: 'Study', date: '06 Apr, 2024', score: '15/20', rank: '45', won: '-' }
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredHistory = filter === 'All' ? mockHistory : mockHistory.filter(h => h.type === filter);

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 4rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header area */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
            <button onClick={() => navigate('/home-choice')} className="flex-center" style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '1rem', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--card-border))' }}>
              <ChevronLeft size={20} />
            </button>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>My Activity</h1>
          </div>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '0.9rem' }}>Track your performance across zones</p>
        </div>

        {/* Zone Filters - Elite Style */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', maxWidth: '600px' }}>
          {['All', 'Study', 'Game'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{ 
                flex: 1,
                padding: '1rem', 
                borderRadius: '1.25rem', 
                background: filter === f 
                  ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' 
                  : 'white',
                color: filter === f ? 'white' : 'hsl(var(--muted-foreground))',
                border: filter === f ? 'none' : '1px solid hsl(var(--card-border))',
                fontSize: '0.9rem',
                fontWeight: 800,
                fontFamily: 'Lexend',
                transition: 'all 0.3s ease',
                boxShadow: filter === f ? '0 10px 20px -5px hsl(var(--primary) / 0.3)' : 'none',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* History List - Responsive Grid */}
        <div className="laptop-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredHistory.map(item => (
            <div key={item.id} className="bento-card animate-elite" style={{ padding: '1.75rem', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '5px 12px', 
                      borderRadius: '6px', 
                      background: item.type === 'Study' ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--secondary) / 0.05)',
                      color: item.type === 'Study' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: `1px solid ${item.type === 'Study' ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--secondary) / 0.1)'}`
                    }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{item.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{item.title}</h3>
                </div>
                {item.won !== '-' && (
                   <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                     <div style={{ 
                       display: 'inline-flex', 
                       alignItems: 'center', 
                       gap: '0.5rem', 
                       background: 'rgba(16, 185, 129, 0.05)', 
                       color: '#10b981', 
                       padding: '8px 14px', 
                       borderRadius: '1rem', 
                       fontSize: '0.9rem', 
                       fontWeight: 900,
                       border: '1px solid rgba(16, 185, 129, 0.1)'
                      }}>
                       <Trophy size={16} /> {item.won}
                     </div>
                   </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: 'hsl(var(--muted))', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid hsl(var(--card-border))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', border: '1px solid hsl(var(--card-border))' }} className="flex-center">
                    <Clock size={16} color="hsl(var(--muted-foreground))" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 900, color: 'hsl(var(--foreground))' }}>{item.score}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', border: '1px solid hsl(var(--card-border))' }} className="flex-center">
                    <CheckCircle2 size={16} color="#fbbf24" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rank</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 900, color: 'hsl(var(--foreground))' }}>#{item.rank}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default HistoryPage;
