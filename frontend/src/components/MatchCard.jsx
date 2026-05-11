import React from 'react';
import { Clock, Users, Trophy, ChevronRight, Zap } from 'lucide-react';

const MatchCard = ({ match, onClick }) => {
  const isLive = match.status === 'Live';

  return (
    <div 
      className="glass-card"
      style={{ 
        padding: '2rem',
        cursor: 'pointer',
        boxShadow: isLive ? '0 15px 35px -10px hsla(var(--primary), 0.2)' : 'var(--glass-shadow)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: isLive ? '1px solid hsla(var(--primary), 0.3)' : undefined
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isLive ? (
              <div className="flex-center" style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', animation: 'pulse 1.5s infinite' }}>
                LIVE NOW
              </div>
            ) : (
              <div style={{ background: 'rgba(0,0,0,0.05)', padding: '5px 12px', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.1em' }}>
                UPCOMING
              </div>
            )}
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))' }}>
            {match.time}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
        {/* VS Background Text */}
        <div className="flex-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', fontWeight: 950, color: 'rgba(0,0,0,0.03)', zIndex: 0, letterSpacing: '0.2em' }}>VS</div>

        <div style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
          <div className="flex-center" style={{ width: '70px', height: '70px', borderRadius: '2rem', background: 'white', margin: '0 auto 1rem', fontSize: '1.75rem', fontWeight: 950, color: 'hsl(var(--primary))', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.8)' }}>
            {match.teamA.charAt(0)}
          </div>
          <p style={{ fontWeight: 900, fontSize: '1rem', color: 'hsl(var(--foreground))' }}>{match.teamA}</p>
        </div>

        <div style={{ padding: '0 0.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ height: '30px', width: '2px', background: 'hsl(var(--muted))', margin: '0 auto', borderRadius: '1rem' }}></div>
        </div>

        <div style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
          <div className="flex-center" style={{ width: '70px', height: '70px', borderRadius: '2rem', background: 'white', margin: '0 auto 1rem', fontSize: '1.75rem', fontWeight: 950, color: 'hsl(var(--secondary))', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.8)' }}>
            {match.teamB.charAt(0)}
          </div>
          <p style={{ fontWeight: 900, fontSize: '1rem', color: 'hsl(var(--foreground))' }}>{match.teamB}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>
          <Users size={18} color="hsl(var(--primary))" /> {match.joined} <span style={{opacity: 0.6}}>Players</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>
          <Trophy size={18} color="#f59e0b" /> <span style={{color: '#f59e0b'}}>{match.reward}</span>
        </div>
      </div>

      <button 
        className="morphism-button" 
        style={{ 
          width: '100%', 
          height: '64px', 
          fontSize: '1rem', 
          background: isLive ? undefined : 'rgba(255,255,255,0.6)', 
          color: isLive ? undefined : 'hsl(var(--muted-foreground))',
          boxShadow: isLive ? undefined : 'none',
          backdropFilter: isLive ? undefined : 'blur(5px)',
          border: isLive ? undefined : '1px solid rgba(255,255,255,0.8)'
        }}
      >
        {isLive ? 'Predict Outcomes' : 'Match Preview'} <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
      </button>
    </div>
  );
};

export default MatchCard;
