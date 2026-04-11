import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, RotateCcw, Share2, Medal } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const StudyResultPage = () => {
  const navigate = useNavigate();
  
  // Mock results
  const results = {
    totalScore: 42,
    totalPossible: 50,
    correct: 21,
    wrong: 4,
    unanswered: 0,
    accuracy: 84,
    rank: 124,
    totalParticipants: 1540
  };

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button onClick={() => navigate('/home-choice')} className="flex-center" style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))', color: 'hsl(var(--foreground))' }}>
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'hsl(var(--foreground))', fontFamily: 'Lexend', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Result Arena</span>
          <button className="flex-center" style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))', color: 'hsl(var(--foreground))' }}>
            <Share2 size={20} />
          </button>
        </div>

        <div className="laptop-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Main Score Card */}
          <div className="bento-card animate-elite" style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            background: 'linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, white 100%)',
            border: '1px solid hsl(var(--primary) / 0.1)'
          }}>
            <div style={{ 
              width: 'clamp(140px, 15vw, 180px)', 
              height: 'clamp(140px, 15vw, 180px)', 
              borderRadius: '50%', 
              border: '10px solid hsl(var(--muted))',
              borderTopColor: 'hsl(var(--primary))',
              margin: '0 auto 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'white',
              boxShadow: '0 20px 40px -10px hsl(var(--primary) / 0.1)'
            }}>
              <span style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>{results.totalScore}</span>
              <span style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>out of {results.totalPossible}</span>
              <div style={{ position: 'absolute', bottom: '-15px', background: 'hsl(var(--secondary))', padding: '6px 18px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 900, color: 'white', boxShadow: '0 10px 20px hsl(var(--secondary) / 0.3)', letterSpacing: '0.1em' }}>
                GREAT JOB!
              </div>
            </div>
            
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.75rem', fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>You're in top 10%!</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1rem', fontWeight: 600 }}>Rank #{results.rank} among {results.totalParticipants} players</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="bento-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'white' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.1)' }} className="flex-center">
                  <Trophy size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Correct</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>{results.correct}</p>
                </div>
              </div>
              <div className="bento-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'white' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)' }} className="flex-center">
                  <RotateCcw size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wrong</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>{results.wrong}</p>
                </div>
              </div>
              <div className="bento-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'white' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'hsl(var(--primary) / 0.05)', color: 'hsl(var(--primary))', border: '1px solid hsl(var(--primary) / 0.1)' }} className="flex-center">
                  <Medal size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accuracy</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>{results.accuracy}%</p>
                </div>
              </div>
              <div className="bento-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'white' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(168, 85, 247, 0.05)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.1)' }} className="flex-center">
                  <Trophy size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Points</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>+420</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <button 
                className="btn-elite" 
                style={{ 
                  flex: 1, 
                  gap: '0.75rem', 
                  background: 'hsl(var(--muted))',
                  color: 'hsl(var(--foreground))', 
                  border: '1px solid hsl(var(--card-border))',
                  fontWeight: 800,
                  height: '64px'
                }}
                onClick={() => navigate('/study-home')}
              >
                <RotateCcw size={20} /> Try Another
              </button>
              <button 
                className="btn-elite btn-elite-primary" 
                style={{ flex: 1.5, height: '64px' }}
                onClick={() => navigate('/home-choice')}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StudyResultPage;
