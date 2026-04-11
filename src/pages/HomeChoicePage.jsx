import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, User, Bell, ChevronRight, Zap } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const HomeChoicePage = () => {
  const navigate = useNavigate();
  const mobile = localStorage.getItem('user_mobile') || 'User';

  const zones = [
    {
      id: 'study',
      title: 'Study Zone Quiz',
      subtitle: 'Crack SSC, UPSC, Banking & Railway Exams',
      icon: <BookOpen size={40} />,
      color: 'hsl(var(--primary))',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      path: '/study-home',
      tag: 'Academic'
    },
    {
      id: 'game',
      title: 'Game Zone Quiz',
      subtitle: 'IPL Special, Match Prediction & Rewards',
      icon: <Trophy size={40} />,
      color: 'hsl(var(--secondary))',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      path: '/game-home',
      tag: 'Sports'
    }
  ];

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: '140px', background: 'white' }}>
      <div className="container">
        {/* Dynamic Background Glows */}
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '300px', height: '300px', background: 'hsl(var(--primary) / 0.05)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

        {/* Header: High-End Profile Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <div className="flex-center" style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '1.25rem', 
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                padding: '1px',
                boxShadow: '0 10px 20px -5px hsl(var(--primary) / 0.3)'
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '1.2rem', background: 'white' }} className="flex-center">
                  <User size={28} color="hsl(var(--foreground))" />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', background: '#10b981', border: '4px solid white', borderRadius: '50%' }}></div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: 'hsl(var(--foreground))' }}>+91 {mobile}</h2>
                <span style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 900, 
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)', 
                  color: 'white', 
                  padding: '3px 8px', 
                  borderRadius: '0.5rem',
                  letterSpacing: '0.05em'
                }}>PRO</span>
              </div>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem', fontWeight: 600 }}>Elite Player Status</p>
            </div>
          </div>
          <button className="glass-card flex-center" style={{ width: '52px', height: '52px', borderRadius: '1.25rem', border: '1px solid hsl(var(--card-border))', background: 'white' }}>
            <Bell size={22} color="hsl(var(--muted-foreground))" />
          </button>
        </div>

        {/* Hero Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="animate-elite" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.05em', color: 'hsl(var(--foreground))', marginBottom: '0.5rem' }}>
            Welcome to the <br />
            <span style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Elite Arena</span>
          </h1>
          <p className="animate-elite" style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500, animationDelay: '0.1s' }}>Where Knowledge meets Rewards.</p>
        </div>

        {/* Bento Grid Layout - Responsive Grid */}
        <div className="laptop-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {zones.map((zone, idx) => (
            <div 
              key={zone.id}
              className="bento-card animate-elite"
              onClick={() => navigate(zone.path)}
              style={{
                padding: '2.5rem',
                background: `linear-gradient(135deg, ${zone.id === 'study' ? 'rgba(37, 99, 235, 0.05)' : 'rgba(139, 92, 246, 0.05)'}, white)`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                animationDelay: `${0.2 + idx * 0.1}s`,
                minHeight: '280px',
                justifyContent: 'center'
              }}
            >
              {/* Reflective Mesh Decor */}
              <div style={{ 
                position: 'absolute', 
                right: '-10%', 
                top: '-10%', 
                width: '200px', 
                height: '200px', 
                background: zone.color, 
                filter: 'blur(80px)', 
                opacity: 0.1,
                zIndex: 0
              }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div className="flex-center" style={{ 
                  background: 'hsl(var(--muted))', 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '1.5rem', 
                  border: '1px solid hsl(var(--card-border))',
                  color: zone.color,
                  boxShadow: `0 10px 20px -5px ${zone.color}22`
                }}>
                  {React.cloneElement(zone.icon, { size: 32 })}
                </div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  background: 'hsl(var(--muted))', 
                  padding: '6px 14px', 
                  borderRadius: '2rem', 
                  letterSpacing: '0.1em',
                  color: 'hsl(var(--muted-foreground))',
                  border: '1px solid hsl(var(--card-border))'
                }}>
                  {zone.tag}
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{zone.title}</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '90%' }}>{zone.subtitle}</p>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                fontWeight: 800, 
                fontSize: '0.85rem', 
                color: zone.color,
                marginTop: 'auto',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Enter Arena <ChevronRight size={18} strokeWidth={3} />
              </div>
            </div>
          ))}

          {/* Live Event Highlight: High Fidelity Bento Widget */}
          <div className="bento-card animate-elite shimmer" style={{ 
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05), white)',
            border: '1px solid rgba(251, 191, 36, 0.1)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            animationDelay: '0.45s',
            gridColumn: '1 / -1' // Full width on all screens
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '1.25rem', 
              background: 'rgba(251, 191, 36, 0.05)', 
              color: '#fbbf24',
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)'
            }} className="flex-center">
              <Zap size={32} fill="currentColor" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Mega Quiz</p>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'hsl(var(--foreground))' }}>MI vs CSK Match Prediction</p>
            </div>
            <button 
              className="btn-elite btn-elite-primary" 
              style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.85rem', height: 'auto', background: 'linear-gradient(135deg, #fbbf24, #d97706)', boxShadow: '0 10px 20px -5px rgba(217, 119, 6, 0.3)' }}
              onClick={() => navigate('/match-list')}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomeChoicePage;
