import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, User, History, Search } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: <Home size={22} />, label: 'Home', path: '/home-choice' },
    { id: 'activity', icon: <Search size={22} />, label: 'Quiz', path: '/study-home' },
    { id: 'history', icon: <History size={22} />, label: 'Results', path: '/history' },
    { id: 'profile', icon: <User size={22} />, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="floating-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            position: 'relative',
            color: isActive(item.path) ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isActive(item.path) ? 'translateY(-4px) scale(1.1)' : 'none'
          }}
        >
          <div style={{
            position: 'relative',
            zIndex: 1,
            filter: isActive(item.path) ? 'drop-shadow(0 0 8px hsla(var(--primary), 0.5))' : 'none'
          }}>
            {React.cloneElement(item.icon, { 
              strokeWidth: isActive(item.path) ? 2.5 : 2 
            })}
          </div>
          
          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            opacity: isActive(item.path) ? 1 : 0.7,
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            {item.label}
          </span>

          {isActive(item.path) && (
            <div 
              style={{
                position: 'absolute',
                top: '-5px',
                width: '4px',
                height: '4px',
                background: 'hsl(var(--primary))',
                borderRadius: '50%',
                boxShadow: '0 0 10px hsl(var(--primary))'
              }}
            />
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
