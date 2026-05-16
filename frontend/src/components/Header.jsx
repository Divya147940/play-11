import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Trophy, History, User, LogOut, Globe } from 'lucide-react';

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
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Quiz Arena', path: '/home-choice', icon: <Globe size={18} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
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
    <nav className="topbar">
      <div className="topbar-inner">
        
        {/* Logo - QUZO Branding */}
        <div className="logo-boxes" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
          
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <button 
                onClick={() => navigate('/history')}
                className="user-profile-btn"
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>My Activity</span>
              </button>
            </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
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
            top: '66px', 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: '#0d1f3c', 
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
                  background: isActive(item.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: 'none',
                  padding: '1.25rem',
                  borderRadius: '1.25rem',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isActive(item.path) ? '#38bdf8' : 'white'
                }}
              >
                 {item.icon}
                 {item.name}
              </button>
            ))}
            
            <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
            
            <button
              onClick={() => { navigate('/history'); setIsOpen(false); }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                padding: '1.25rem',
                borderRadius: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'white'
              }}
            >
               <User size={20} /> My Activity
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
