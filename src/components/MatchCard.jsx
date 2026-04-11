import React from 'react';
import { Clock, Users, Trophy, ChevronRight } from 'lucide-react';

const MatchCard = ({ match, onClick }) => {
  const isLive = match.status === 'Live';

  return (
    <div 
      className="bento-card animate-elite"
      style={{ 
        padding: '1.75rem',
        cursor: 'pointer',
        background: isLive ? 'linear-gradient(135deg, hsl(var(--primary) / 0.05), white)' : 'white',
        border: isLive ? '1px solid hsl(var(--primary) / 0.2)' : '1px solid hsl(var(--card-border))'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLive ? '#ef4444' : '#94a3b8', animation: isLive ? 'pulse 1.5s infinite' : 'none' }}></div>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: isLive ? '#ef4444' : 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {isLive ? 'LIVE ARENA' : 'UPCOMING MATCH'}
            </span>
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))' }}>
            {match.time}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(var(--muted))', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--card-border))' }}>
            {match.teamA.charAt(0)}
          </div>
          <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'hsl(var(--foreground))' }}>{match.teamA}</p>
        </div>

        <div style={{ textAlign: 'center', padding: '0 1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--card-border))', marginBottom: '0.25rem' }}>VS</div>
            <div style={{ height: '20px', width: '1px', background: 'hsl(var(--card-border))', margin: '0 auto' }}></div>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'hsl(var(--muted))', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--card-border))' }}>
            {match.teamB.charAt(0)}
          </div>
          <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'hsl(var(--foreground))' }}>{match.teamB}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
          <Users size={16} color="hsl(var(--primary))" /> {match.joined} Joined
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
          <Trophy size={16} color="#fbbf24" /> {match.reward}
        </div>
      </div>

      <button 
        className={`btn-elite ${isLive ? 'btn-elite-primary' : ''}`} 
        style={{ width: '100%', height: '56px', borderRadius: '1rem', fontSize: '0.9rem', background: isLive ? undefined : 'hsl(var(--muted))', color: isLive ? undefined : 'hsl(var(--muted-foreground))', border: isLive ? undefined : '1px solid hsl(var(--card-border))' }}
      >
        {isLive ? 'Enter Prediction Arena' : 'Set Reminder'} <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
      </button>
    </div>
  );
};

export default MatchCard;
