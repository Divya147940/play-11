import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Medal, Trophy, ArrowRight, Share2, User } from 'lucide-react';
import BottomNav from '../components/BottomNav';

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
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'hsl(var(--foreground))', fontWeight: 900, fontFamily: 'Lexend', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Match Result</h2>
          <button className="flex-center" style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))', color: 'hsl(var(--foreground))' }}>
            <Share2 size={20} />
          </button>
        </div>

        <div className="laptop-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Result Status */}
          <div className="bento-card animate-elite" style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, white 100%)',
            border: '1px solid hsl(var(--primary) / 0.1)'
          }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
              <Trophy size={100} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.3))' }} />
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '0.5rem', color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>1,250</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1rem', marginBottom: '2rem', fontWeight: 600 }}>Points Scored</p>
            
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
              <div style={{ flex: 1, padding: '1rem', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700, textTransform: 'uppercase' }}>Rank</p>
                <p style={{ fontWeight: 900, color: 'hsl(var(--foreground))', fontSize: '1.25rem' }}>#4</p>
              </div>
              <div style={{ flex: 1, padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Winnings</p>
                <p style={{ fontWeight: 900, fontSize: '1.25rem' }}>₹1,000</p>
              </div>
            </div>
          </div>

          <div>
            {/* Leaderboard */}
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--foreground))', fontFamily: 'Lexend', fontWeight: 800 }}>
              <Medal size={22} color="#fbbf24" /> Top Winners
            </h3>
            <div className="bento-card" style={{ padding: '0.5rem', marginBottom: '2.5rem', background: 'white', border: '1px solid hsl(var(--card-border))' }}>
              {leaderboard.map((item, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.25rem', 
                    padding: '1.25rem',
                    borderBottom: i === leaderboard.length - 1 ? 'none' : '1px solid hsl(var(--card-border))',
                    background: item.isMe ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                    borderRadius: item.isMe ? '1rem' : '0'
                  }}
                >
                  <span style={{ 
                    width: '32px', 
                    fontWeight: 900, 
                    fontSize: '1rem',
                    color: i === 0 ? '#fbbf24' : (i === 1 ? '#94a3b8' : (i === 2 ? '#92400e' : 'hsl(var(--muted-foreground))')) 
                  }}>
                    #{item.rank}
                  </span>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--card-border))' }} className="flex-center">
                    <User size={20} color="hsl(var(--muted-foreground))" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: 'hsl(var(--foreground))' }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{item.points} pts</p>
                  </div>
                  <span style={{ fontWeight: 900, color: '#10b981', fontSize: '1rem' }}>{item.reward}</span>
                </div>
              ))}
            </div>

            <button className="btn-elite btn-elite-primary" onClick={() => navigate('/home-choice')} style={{ width: '100%', height: '64px' }}>
              Back to Home <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default GameResultPage;
