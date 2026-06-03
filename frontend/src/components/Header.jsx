import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Trophy, History, User, LogOut, Globe } from 'lucide-react';
import logoImg from '../assets/quzo 1.jpeg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
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
        <div
          onClick={() => navigate('/')}
          className="header-logo-container"
        >
          <img
            src={logoImg}
            alt="QUZO"
            className="header-logo-img"
          />
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'none' }}>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => {
                if (item.path === '/home-choice') {
                  navigate(item.path, { state: { tab: 'All Rooms', reset: Date.now() } });
                } else {
                  navigate(item.path);
                }
              }}
              className={`nav-link-btn ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </button>
          ))}

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
        <div className="mobile-nav-overlay">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path === '/home-choice') {
                    navigate(item.path, { state: { tab: 'All Rooms', reset: Date.now() } });
                  } else {
                    navigate(item.path);
                  }
                  setIsOpen(false);
                }}
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


          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 961px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Header;
