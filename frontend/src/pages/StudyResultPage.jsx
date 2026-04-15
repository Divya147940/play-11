import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, RotateCcw, Share2, Medal, ArrowRight, Sparkles } from 'lucide-react';

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
               <Medal size={16} color="hsl(var(--primary))" />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'hsl(var(--primary))', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Performance Summary</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'hsl(var(--foreground))', fontWeight: 950, letterSpacing: '-0.03em' }}>
              Results <span className="text-gradient">Arena.</span>
            </h1>
          </div>
          <button className="flex-center glass-card" style={{ width: '60px', height: '60px', borderRadius: '1.75rem', color: 'hsl(var(--foreground))' }}>
            <Share2 size={24} />
          </button>
        </div>

        <div className="bento-grid" style={{ alignItems: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
          
          {/* Main Score Card - Premium Glass */}
          <div className="glass-card animate-slide-up stagger-1" style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            background: 'linear-gradient(180deg, hsla(var(--primary), 0.05) 0%, white 100%)',
            gridRow: 'span 2'
          }}>
            <div className="flex-center" style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%', 
              border: '12px solid rgba(0,0,0,0.03)',
              borderTopColor: 'hsl(var(--primary))',
              margin: '0 auto 2.5rem',
              position: 'relative',
              background: 'white',
              boxShadow: '0 25px 50px -12px hsla(var(--primary), 0.15)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '4.5rem', fontWeight: 950, color: 'hsl(var(--foreground))', lineHeight: '1', fontFamily: 'Lexend' }}>{results.totalScore}</p>
                <p style={{ fontSize: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800 }}>of {results.totalPossible}</p>
              </div>
              <div style={{ position: 'absolute', bottom: '-15px', background: 'hsl(var(--secondary))', padding: '10px 24px', borderRadius: '1.25rem', fontSize: '0.9rem', fontWeight: 950, color: 'white', boxShadow: '0 12px 25px hsla(var(--secondary), 0.4)', letterSpacing: '0.1em' }}>
                ELITE SCORE!
              </div>
            </div>
            
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 950, color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>Top 10% Performance</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem', fontWeight: 600 }}>Ranked #{results.rank} among {results.totalParticipants} global participants.</p>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="animate-slide-up stagger-2">
            {[
              { label: 'Correct', value: results.correct, icon: <Trophy size={20} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
              { label: 'Mistakes', value: results.wrong, icon: <RotateCcw size={20} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
              { label: 'Accuracy', value: `${results.accuracy}%`, icon: <Medal size={20} />, color: 'hsl(var(--primary))', bg: 'hsla(var(--primary),0.08)' },
              { label: 'Points', value: '+420 XP', icon: <Sparkles size={20} />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' }
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '1.5rem', background: stat.bg, color: stat.color }} className="flex-center">
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 950, letterSpacing: '-0.02em' }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Website Action Footer */}
          <div className="animate-slide-up stagger-3" style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
            <button 
              className="morphism-button" 
              style={{ flex: 1, gap: '0.75rem', background: 'white', color: 'hsl(var(--foreground))', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)', height: '72px' }}
              onClick={() => navigate('/study-home')}
            >
              <RotateCcw size={22} /> Solve Another
            </button>
            <button 
              className="morphism-button" 
              style={{ flex: 1.5, height: '72px', background: 'linear-gradient(135deg, hsl(var(--primary)), #2563eb)' }}
              onClick={() => navigate('/home-choice')}
            >
              Back to Dashboard <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyResultPage;
