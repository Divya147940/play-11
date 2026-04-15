import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, ChevronRight, Zap, Target, Star, ArrowRight } from 'lucide-react';

const HomeChoicePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || '';
  const mobileNumber = localStorage.getItem('user_mobile') || 'User';
  const displayName = userName || `+91 ${mobileNumber}`;

  const zones = [
    {
      id: 'study',
      title: 'Study Zone',
      subtitle: 'Competitive Exam Mastery',
      desc: 'Crack SSC, UPSC, Banking & Railway with elite mocks.',
      icon: <BookOpen size={42} />,
      color: 'hsl(var(--primary))',
      path: '/study-home',
      tag: 'Academic'
    },
    {
      id: 'game',
      title: 'Game Zone',
      subtitle: 'Sports Prediction Arena',
      desc: 'IPL Special & Match prediction challenges.',
      icon: <Trophy size={42} />,
      color: 'hsl(var(--secondary))',
      path: '/game-home',
      tag: 'Sports'
    }
  ];

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <div className="container">
        
        {/* Simplified Website Header Section (Local) */}
        <section className="animate-slide-up" style={{ marginTop: '6.5rem', marginBottom: '4rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'hsl(var(--primary))', borderRadius: '50%', boxShadow: '0 0 15px hsla(var(--primary), 0.6)' }}></div>
              <p style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.8 }}>Accessing Command Center</p>
           </div>
           <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: 'hsl(var(--foreground))', marginBottom: '1.25rem', lineHeight: '1.05', fontWeight: 950, letterSpacing: '-0.05em' }}>
             Ready to <span className="text-gradient">Empire?</span>
           </h1>
           <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 'clamp(1rem, 3vw, 1.25rem)', maxWidth: '650px', lineHeight: '1.5', opacity: 0.9 }}>
             Select your specialized arena to begin dominance. Authenticated session at <strong>{mobileNumber}</strong> is active.
           </p>
        </section>

        {/* Premium Bento Selection */}
        <div className="bento-grid" style={{ marginBottom: '5rem' }}>
          {zones.map((zone, idx) => (
            <div 
              key={zone.id}
              className={`glass-premium span-6 animate-slide-up stagger-${idx + 1}`}
              onClick={() => navigate(zone.path)}
              style={{
                padding: 'clamp(2rem, 6vw, 3.5rem)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                minHeight: 'clamp(320px, 45vh, 400px)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ 
                  width: 'min(72px, 15vw)', 
                  height: 'min(72px, 15vw)', 
                  background: 'white', 
                  borderRadius: '1.75rem', 
                  color: zone.color,
                  marginBottom: '2rem',
                  boxShadow: `0 12px 24px -6px ${zone.color}33`
                }} className="flex-center">
                  {React.cloneElement(zone.icon, { size: 36, strokeWidth: 2 })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 900, background: 'rgba(0,0,0,0.06)', padding: '6px 14px', borderRadius: '1rem', color: 'hsl(var(--muted-foreground))', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{zone.tag}</span>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: zone.color, boxShadow: `0 0 10px ${zone.color}` }}></div>
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 950, marginBottom: '0.75rem', fontFamily: 'Lexend', letterSpacing: '-0.04em' }}>{zone.title}</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1rem', lineHeight: '1.6', fontWeight: 600, opacity: 0.9 }}>{zone.desc}</p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.8rem', color: zone.color, fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em', zIndex: 2 }}>
                Enter Arena <ArrowRight size={20} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>

        {/* Live Action Banner - Full Width Glass */}
        <div className="glass-premium animate-slide-up stagger-3 live-action-banner" style={{ 
          padding: '1.5rem clamp(1rem, 5vw, 3.5rem)',
          background: 'linear-gradient(135deg, hsla(var(--primary), 0.1) 0%, hsla(var(--secondary), 0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 5vw, 2rem)',
          overflow: 'hidden',
          flexWrap: 'wrap',
          border: '2px solid hsla(var(--accent), 0.2)',
          marginBottom: '3.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, minWidth: 'min(300px, 100%)' }}>
            <div className="flex-center" style={{ 
              width: '64px', height: '64px', 
              background: 'white', 
              borderRadius: '1.5rem', 
              color: '#f59e0b', 
              boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)', 
              flexShrink: 0 
            }}>
              <Zap size={32} fill="currentColor" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#b45309', padding: '4px 12px', borderRadius: '1rem', marginBottom: '0.5rem' }}>
                 <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }}></div>
                 <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Mega Challenge Active</span>
              </div>
              <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', fontWeight: 950, lineHeight: '1.2', letterSpacing: '-0.03em' }}>Elite Match Prediction: MI vs CSK Today</h3>
            </div>
          </div>
            <button 
              className="shimmer-btn"
              style={{ 
                padding: '1.25rem 2.5rem', 
                fontSize: '1.05rem', 
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                boxShadow: '0 15px 30px -5px rgba(245, 158, 11, 0.4)'
              }}
              onClick={() => navigate('/match-list')}
            >
              Start Prediction
            </button>
          </div>

        {/* Global Stats/Status Section */}
        <div className="animate-slide-up stagger-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-premium" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(0,0,0,0.02)', borderRadius: '1.5rem', color: 'hsl(var(--primary))', border: '1px solid rgba(0,0,0,0.03)' }}>
              <Target size={32} />
            </div>
            <div>
              <p style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-0.02em', color: 'hsl(var(--foreground))' }}>1,240+</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Global Engagements</p>
            </div>
          </div>
          <div className="glass-premium" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(0,0,0,0.02)', borderRadius: '1.5rem', color: 'hsl(var(--secondary))', border: '1px solid rgba(0,0,0,0.03)' }}>
              <Star size={32} fill="currentColor" />
            </div>
            <div>
              <p style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-0.02em', color: 'hsl(var(--foreground))' }}>Elite Rank</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member Since 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeChoicePage;
