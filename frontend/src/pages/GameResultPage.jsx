import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Medal, Trophy, ArrowRight, Share2, User, ArrowLeft, History } from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'Rahul K.', points: 1450, reward: '₹10,000' },
  { rank: 2, name: 'Surbhi S.', points: 1420, reward: '₹5,000' },
  { rank: 3, name: 'Amit M.', points: 1380, reward: '₹2,500' },
  { rank: 4, name: 'You', points: 1250, reward: '₹1,000', isMe: true },
  { rank: 5, name: 'Priya D.', points: 1210, reward: '₹500' }
];

const GameResultPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '5rem' }}>
        
        {/* Website Header Bar */}
        <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
          <button 
            onClick={() => navigate('/home-choice')} 
            className="flex-center glass-card" 
            style={{ width: '60px', height: '60px', borderRadius: '1.75rem', color: 'hsl(var(--foreground))' }}
          >
            <ArrowLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
               <Trophy size={16} color="hsl(var(--secondary))" />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'hsl(var(--secondary))', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Arena Performance</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'hsl(var(--foreground))', fontWeight: 950, letterSpacing: '-0.03em' }}>
              Match <span className="text-gradient">Rewards.</span>
            </h1>
          </div>
          <button className="flex-center glass-card" style={{ width: '60px', height: '60px', borderRadius: '1.75rem', color: 'hsl(var(--foreground))' }}>
            <Share2 size={24} />
          </button>
        </div>

        <div className="bento-grid" style={{ alignItems: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
          
          {/* Result Status - Premium Glass */}
          <div className="glass-card animate-slide-up stagger-1" style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, hsla(var(--primary), 0.05) 0%, white 100%)',
            gridRow: 'span 2'
          }}>
            <div className="flex-center" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2.5rem' }}>
              <div style={{ position: 'absolute', width: '140%', height: '140%', background: 'hsla(var(--secondary), 0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
              <Trophy size={120} color="#fbbf24" fill="currentColor" style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 950, marginBottom: '0.5rem', color: 'hsl(var(--foreground))', fontFamily: 'Lexend', letterSpacing: '-0.04em' }}>1,250</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 600 }}>Elite Score Points Scored</p>
            
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <div style={{ flex: 1, padding: '1.5rem', background: 'white', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Final Rank</p>
                <p style={{ fontWeight: 950, color: 'hsl(var(--foreground))', fontSize: '1.75rem' }}>#4</p>
              </div>
              <div style={{ flex: 1, padding: '1.5rem', background: 'white', borderRadius: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.1)', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.05)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981', marginBottom: '0.5rem' }}>Winnings</p>
                <p style={{ fontWeight: 950, fontSize: '1.75rem', color: '#10b981' }}>₹1,000</p>
              </div>
            </div>
          </div>

          <div className="animate-slide-up stagger-2">
            {/* Leaderboard Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 950, fontFamily: 'Lexend' }}>Global <span className="text-gradient">Leaderboard</span></h3>
               <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, hsla(var(--primary), 0.1), transparent)' }}></div>
            </div>

            {/* Leaderboard Glass List */}
            <div className="glass-container" style={{ padding: '0.5rem', marginBottom: '3rem' }}>
              {leaderboard.map((item, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem', 
                    padding: '1.25rem',
                    borderBottom: i === leaderboard.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.04)',
                    background: item.isMe ? 'hsla(var(--primary), 0.05)' : 'transparent',
                    borderRadius: item.isMe ? '1.25rem' : '0'
                  }}
                >
                  <span style={{ 
                    width: '32px', 
                    fontWeight: 950, 
                    fontSize: '1.1rem',
                    color: i === 0 ? '#fbbf24' : (i === 1 ? '#94a3b8' : (i === 2 ? '#b45309' : 'hsl(var(--muted-foreground))')) 
                  }}>
                    #{item.rank}
                  </span>
                  <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 5px 10px rgba(0,0,0,0.02)' }}>
                    <User size={22} color="hsl(var(--muted-foreground))" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 900, fontSize: '1.1rem', color: 'hsl(var(--foreground))' }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{item.points} pts accumulated</p>
                  </div>
                  <span style={{ fontWeight: 950, color: '#10b981', fontSize: '1.1rem' }}>{item.reward}</span>
                </div>
              ))}
            </div>

            <button 
              className="morphism-button" 
              onClick={() => navigate('/home-choice')} 
              style={{ width: '100%', height: '72px', fontSize: '1.1rem' }}
            >
              Continue Journey <ArrowRight size={22} style={{ marginLeft: '1rem' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultPage;
