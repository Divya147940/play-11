import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, Shield } from 'lucide-react';
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

  const BackgroundIcons = () => {
    const icons = [
      { Icon: Trophy, top: '5%', left: '10%', rotate: '15deg' },
      { Icon: Zap, top: '15%', left: '80%', rotate: '-10deg' },
      { Icon: Shield, top: '40%', left: '5%', rotate: '20deg' },
      { Icon: Trophy, top: '70%', left: '15%', rotate: '-15deg' },
      { Icon: Zap, top: '85%', left: '75%', rotate: '10deg' },
      { Icon: Shield, top: '30%', left: '90%', rotate: '45deg' },
      { Icon: Trophy, top: '60%', left: '85%', rotate: '-10deg' },
      { Icon: Zap, top: '10%', left: '40%', rotate: '5deg' },
      { Icon: Shield, top: '50%', left: '45%', rotate: '-20deg' },
      { Icon: Trophy, top: '90%', left: '30%', rotate: '10deg' },
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.04 }}>
        {icons.map((item, index) => (
          <div key={index} style={{ 
            position: 'absolute', 
            top: item.top, 
            left: item.left, 
            transform: `rotate(${item.rotate})`,
            color: 'hsl(var(--primary))'
          }}>
            <item.Icon size={48} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      padding: 'var(--page-padding)',
      overflow: 'hidden',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <BackgroundIcons />

      <div className="animate-elite" style={{ 
        textAlign: 'center', 
        zIndex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1,
        maxWidth: '400px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={logo} 
            alt="Play11 Logo" 
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Catchphrase */}
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          color: 'hsl(var(--foreground))', 
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
          fontFamily: "'Lexend', sans-serif"
        }}>
          Where Knowledge Meets The Game
        </h2>

        {/* Description */}
        <p style={{ 
          fontSize: '1rem', 
          color: 'hsl(var(--muted-foreground))', 
          lineHeight: 1.6,
          marginBottom: '4rem',
          maxWidth: '340px'
        }}>
          Play11 is your unified platform for engaging Study Zone quizzes and thrilling Game Zone challenges. Test your skills and win rewards!
        </p>
      </div>

      {/* Action Button */}
      <div className="animate-elite" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        paddingBottom: '3rem',
        zIndex: 10
      }}>
        <button 
          className="btn-elite btn-elite-primary" 
          onClick={handleStart}
          style={{ 
            width: '100%', 
            height: '64px', 
            fontSize: '1.25rem'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplashPage;
