import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Trophy, History, User, LogOut } from 'lucide-react';
import logo from '../assets/logo-play11.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = localStorage.getItem('user_mobile');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/home-choice', icon: <Home size={20} /> },
    { name: 'Study Zone', path: '/study-home', icon: <BookOpen size={20} /> },
    { name: 'Game Zone', path: '/game-home', icon: <Trophy size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('play11_session');
    localStorage.removeItem('play11_user');
    localStorage.removeItem('user_mobile');
    localStorage.removeItem('user_name');
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/home-choice')}>
          <img src={logo} alt="Play11" style={{ height: '40px', width: 'auto' }} />
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '2rem' }}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: isActive(item.path) ? 900 : 600,
                fontSize: '0.9rem',
                color: isActive(item.path) ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {item.name}
              {isActive(item.path) && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />}
            </button>
          ))}
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(0,0,0,0.1)', margin: '0 0.5rem' }}></div>
          
          {mobile ? (
            <>
              <button 
                onClick={() => navigate('/profile')}
                className="flex-center glass-card hover-lift"
                style={{ padding: '0.5rem 1rem', gap: '0.75rem', borderRadius: '1rem', background: 'white', border: '1px solid rgba(0,0,0,0.05)', transition: 'all 0.3s' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }} className="flex-center">
                  <User size={18} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{localStorage.getItem('user_name') || `+91 ${mobile}`}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex-center glass-card hover-lift"
                style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', transition: 'all 0.3s' }}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="morphism-button" style={{ padding: '0.75rem 1.5rem', height: 'auto', fontSize: '0.85rem' }}>
              Access Arena
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-toggle flex-center" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: 'hsl(var(--foreground))', cursor: 'pointer' }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="animate-slide-up"
          style={{ 
            position: 'fixed', 
            top: '80px', 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(255,255,255,0.98)', 
            backdropFilter: 'blur(30px)',
            zIndex: 999,
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                style={{
                  background: isActive(item.path) ? 'white' : 'transparent',
                  border: isActive(item.path) ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  padding: '1.25rem',
                  borderRadius: '1.25rem',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isActive(item.path) ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                  boxShadow: isActive(item.path) ? '0 10px 20px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                 {item.icon}
                 {item.name}
              </button>
            ))}
            
            <hr style={{ border: 'none', height: '1px', background: 'rgba(0,0,0,0.05)', margin: '1rem 0' }} />
            
            <button
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
              style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.05)',
                padding: '1.25rem',
                borderRadius: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1.1rem',
                fontWeight: 800
              }}
            >
               <User size={20} /> Profile Arena
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '1.25rem',
                borderRadius: '1.25rem',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}
            >
               Logout from Session
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Header;
