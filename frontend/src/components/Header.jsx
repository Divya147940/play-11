import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Trophy, History, User, LogOut } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = localStorage.getItem('user_mobile');
  const userName = localStorage.getItem('user_name');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/home-choice', icon: <Home size={18} /> },
    { name: 'Study Zone', path: '/study-home', icon: <BookOpen size={18} /> },
    { name: 'Game Zone', path: '/game-home', icon: <Trophy size={18} /> },
    { name: 'Leaderboard', path: '/leaderboard/1', icon: <Trophy size={18} /> },
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
        
        {/* Logo - QUEZO Branding */}
        <div className="logo-boxes" onClick={() => navigate('/home-choice')} style={{ cursor: 'pointer' }}>
          <div className="logo-box">Q</div>
          <div className="logo-box">U</div>
          <div className="logo-box">Z</div>
          <div className="logo-box">O</div>
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'none' }}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-link-btn ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </button>
          ))}
          
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>
          
          {mobileNumber ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <button 
                onClick={() => navigate('/profile')}
                className="user-profile-btn"
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{userName || `+91 ${mobileNumber.slice(-10)}`}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="logout-btn-header"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="primary-btn" style={{ padding: '8px 20px', borderRadius: '12px', fontSize: '13px' }}>
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'block', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="mobile-nav-overlay"
          style={{ 
            position: 'fixed', 
            top: '70px', 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(13, 31, 60, 0.98)', 
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                style={{
                  background: isActive(item.path) ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '1rem',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: isActive(item.path) ? '#38bdf8' : 'white'
                }}
              >
                 {item.icon}
                 {item.name}
              </button>
            ))}
            
            <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />
            
            <button
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: 'none',
                padding: '1rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1rem',
                fontWeight: 800,
                color: 'white'
              }}
            >
               <User size={20} /> Profile
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}
            >
               Logout
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Header;
