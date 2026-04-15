import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import logo from '../assets/logo-play11.png';

const SplashPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const session = localStorage.getItem('play11_session');
    if (session) {
      navigate('/home-choice');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', width: '100%', padding: 'var(--page-padding)' }}>
      {/* Absolute Decorative elements */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '150px', height: '150px', background: 'hsla(var(--primary), 0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: '200px', height: '200px', background: 'hsla(var(--secondary), 0.1)', filter: 'blur(70px)', borderRadius: '50%' }}></div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        
        <div className="animate-slide-up" style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Play11 Logo" 
            style={{ 
              width: '280px', 
              height: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))'
            }} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
             <Sparkles size={16} color="hsl(var(--primary))" fill="currentColor" />
             <p style={{ 
               fontSize: '0.85rem', 
               fontWeight: 900, 
               color: 'hsl(var(--foreground))', 
               fontFamily: "'Lexend', sans-serif",
               letterSpacing: '0.15em',
               textTransform: 'uppercase',
               opacity: 0.8
             }}>
               Study Zone + Game Zone
             </p>
          </div>
        </div>

        <h1 className="animate-slide-up stagger-1 text-balance" style={{ 
          fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', 
          fontWeight: 950, 
          color: 'hsl(var(--foreground))', 
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.04em',
          fontFamily: "'Lexend', sans-serif"
        }}>
          Where Knowledge <span className="text-gradient">Meets The Game.</span>
        </h1>

        <p className="animate-slide-up stagger-2 text-balance" style={{ 
          fontSize: '1.15rem', 
          color: 'hsl(var(--muted-foreground))', 
          lineHeight: 1.6,
          marginBottom: '4rem',
          maxWidth: '540px',
          fontWeight: 600
        }}>
          The ultimate platform for academic mastery and sports prediction. Test your skills, climb the elite leaderboards, and win premium rewards!
        </p>

        <div className="animate-slide-up stagger-3" style={{ width: '100%', maxWidth: '440px' }}>
          <button 
            className="shimmer-btn" 
            onClick={handleStart}
            style={{ 
              width: '100%', 
              height: '74px', 
              fontSize: '1.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <Trophy size={26} fill="currentColor" strokeWidth={1.5} />
            <span>Get Started</span>
            <ArrowRight size={26} />
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', opacity: 0.6 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--primary))' }}></div>
                SECURE
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--secondary))' }}></div>
                REAL-TIME
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--accent))' }}></div>
                ELITE
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
