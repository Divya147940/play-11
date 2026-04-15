import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, Star, Zap, ChevronRight, TrophyIcon, ArrowRight, Sparkles } from 'lucide-react';

const getIconForGameCategory = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes('ipl')) return { icon: <Zap size={28} />, color: '#fbbf24' };
  if (norm.includes('match')) return { icon: <Calendar size={28} />, color: '#ef4444' };
  if (norm.includes('player')) return { icon: <Users size={28} />, color: '#3b82f6' };
  if (norm.includes('team')) return { icon: <Star size={28} />, color: '#10b981' };
  return { icon: <Trophy size={28} />, color: '#8b5cf6' };
};

const GameHomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories/game')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const mappedCats = data.categories.map(c => {
            const display = getIconForGameCategory(c.name);
            return {
              id: c.id,
              name: c.name,
              icon: display.icon,
              color: display.color,
              count: 'Live Arena'
            };
          });
          setCategories(mappedCats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '140px' }}>
      <div className="container" style={{ paddingTop: '6.5rem' }}>
        
        {/* Website Section Header */}
        <header className="animate-slide-up" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
             <div className="flex-center" style={{ width: '36px', height: '36px', background: 'hsla(var(--secondary), 0.12)', color: 'hsl(var(--secondary))', borderRadius: '1rem', boxShadow: '0 6px 12px hsla(var(--secondary), 0.15)' }}>
                <TrophyIcon size={20} fill="currentColor" strokeWidth={2.5} />
             </div>
             <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--secondary))', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Digital Coliseum</span>
          </div>
          <h1 className="text-balance" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 950, marginBottom: '1rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))', letterSpacing: '-0.05em', lineHeight: 1.05 }}>
            Elite <span className="text-gradient">Gaming Arena.</span>
          </h1>
          <p className="text-balance" style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '1.2rem', maxWidth: '650px', opacity: 0.9, lineHeight: 1.5 }}>Where sports expertise meets precision rewards. Enter the most sophisticated prediction environment.</p>
        </header>

        {/* Hero Sports Banner - Premium Glass */}
        <div className="glass-premium animate-slide-up stagger-1 ipl-hero-banner" style={{ 
          padding: 'clamp(1.5rem, 5vw, 4rem)', 
          marginBottom: 'clamp(2.5rem, 8vw, 5rem)', 
          background: 'linear-gradient(135deg, hsla(var(--secondary), 0.12) 0%, rgba(255,255,255,0.4) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(1.5rem, 5vw, 3rem)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid hsla(var(--secondary), 0.2)'
        }}>
          <div style={{ position: 'absolute', right: '-8%', top: '-25%', opacity: 0.04, transform: 'rotate(12deg)', zIndex: 0 }}>
             <Trophy size={320} fill="currentColor" />
          </div>

          <div style={{ flex: 2, minWidth: 'min(320px, 100%)', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.6)', padding: '6px 16px', borderRadius: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
               <Sparkles size={16} color="hsl(var(--accent))" strokeWidth={3} />
               <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'hsl(var(--foreground))' }}>Active Season Live</span>
            </div>
            <h2 className="text-balance" style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', fontWeight: 950, fontFamily: 'Lexend', marginBottom: '1.25rem', lineHeight: '1.1', letterSpacing: '-0.04em' }}>IPL 2024 Prediction Hub</h2>
            <p className="text-balance" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', color: 'hsl(var(--muted-foreground))', fontWeight: 600, marginBottom: '2rem', maxWidth: '95%', lineHeight: 1.5, opacity: 0.9 }}>
              Experience high-fidelity match forecasting. Secure your position in the global elite rankings through pinpoint sports analysis.
            </p>
            <button 
              className="shimmer-btn" 
              style={{ padding: '1.25rem 2.5rem', fontSize: '1rem', background: 'linear-gradient(135deg, hsl(var(--secondary)), #7c3aed)', width: 'fit-content' }} 
              onClick={() => navigate('/match-list')}
            >
              <span>Explore Multipliers</span>
              <ArrowRight size={22} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
           <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 950, fontFamily: 'Lexend', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>Specialized <span className="text-gradient">Sectors</span></h2>
           <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, hsla(var(--secondary), 0.15), transparent)' }}></div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex-center" style={{ padding: '6rem' }}>
             <div className="auth-spinner" style={{ width: '48px', height: '48px', borderTopColor: 'hsl(var(--secondary))', borderWidth: '5px' }}></div>
          </div>
        ) : (
          <div className="bento-grid">
            {categories.map((cat, idx) => (
              <div 
                key={cat.id} 
                className={`glass-premium animate-slide-up stagger-${(idx % 3) + 1}`} 
                onClick={() => navigate('/match-list')}
                style={{ 
                  padding: '2.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2rem',
                  cursor: 'pointer',
                  justifyContent: 'space-between',
                  transition: 'all 0.5s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div className="flex-center" style={{ 
                    background: 'white', 
                    color: cat.color,
                    width: '76px', 
                    height: '76px', 
                    borderRadius: '2rem', 
                    boxShadow: `0 10px 20px -5px ${cat.color}33`,
                    border: '1px solid rgba(0,0,0,0.03)'
                  }}>
                    {React.cloneElement(cat.icon, { size: 36, strokeWidth: 2 })}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'hsl(var(--foreground))', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>{cat.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color }}></div>
                       <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{cat.count}</p>
                    </div>
                  </div>
                </div>
                <div style={{ color: cat.color, opacity: 0.6 }}>
                   <ChevronRight size={32} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHomePage;
