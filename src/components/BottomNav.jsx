import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, BarChart3, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', icon: <Home size={24} />, label: 'Home', path: '/home-choice' },
    { id: 'quiz', icon: <LayoutGrid size={24} />, label: 'Quiz', path: '/study-home' }, // Default to study for now
    { id: 'results', icon: <BarChart3 size={24} />, label: 'Results', path: '/history' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="glass-card" style={{
      position: 'fixed',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 2rem)',
      maxWidth: '500px',
      height: 'var(--nav-height)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 1rem',
      borderRadius: '2rem',
      zIndex: 100,
      border: '1px solid hsl(var(--card-border))',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)'
    }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              transform: isActive ? 'translateY(-4px) scale(1.1)' : 'scale(1)',
              filter: isActive ? 'drop-shadow(0 0 10px hsl(var(--primary) / 0.2))' : 'none'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px',
              background: isActive ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              {tab.icon}
            </div>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              opacity: isActive ? 1 : 0.6
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
