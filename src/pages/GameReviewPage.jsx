import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const GameReviewPage = () => {
  const navigate = useNavigate();
  // Mock performance data for Prediction Arena
  const picksDone = 7;
  const totalPicks = 11;

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div className="container" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} className="flex-center" style={{ color: 'hsl(var(--foreground))', background: 'none', border: 'none' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>Final Prediction Review</h1>
        </div>

        {/* Prediction Summary Card */}
        <div className="bento-card animate-elite" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'white', border: '1px solid hsl(var(--card-border))' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, padding: '1.25rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <CheckCircle2 color="#10b981" size={28} style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 900, fontSize: '1.5rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{picksDone}</p>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Locked Picks</p>
            </div>
            <div style={{ flex: 1, padding: '1.25rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '1.25rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle color="#ef4444" size={28} style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 900, fontSize: '1.5rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{totalPicks - picksDone}</p>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pending</p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>Squad Distribution</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: totalPicks }).map((_, i) => (
              <div 
                key={i}
                className="flex-center"
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: (i + 1) <= picksDone 
                    ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' 
                    : 'hsl(var(--muted))',
                  borderRadius: '1rem',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: (i + 1) <= picksDone ? 'white' : 'hsl(var(--card-border))',
                  border: (i + 1) <= picksDone ? 'none' : '1px solid hsl(var(--card-border))',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => navigate(-1)}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Action Area */}
        <div style={{ marginTop: 'auto', paddingBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid hsl(var(--primary) / 0.2)', background: 'hsl(var(--primary) / 0.03)' }}>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600, lineHeight: '1.6' }}>
              Once submitted, your predictions will be locked and used for leaderboard ranking after the game concludes.
            </p>
          </div>
          
          <button 
            className="btn-elite btn-elite-primary" 
            style={{ width: '100%', height: '72px', fontSize: '1.25rem' }}
            onClick={() => navigate('/game-result/mock')}
            disabled={picksDone < totalPicks}
          >
            {picksDone < totalPicks ? 'Complete Your Squad' : 'Final Selection'} <Send size={24} style={{ marginLeft: '0.8rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameReviewPage;
