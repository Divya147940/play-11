import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobile(value);
      setError(null);
    }
  };

  const isInvalid = mobile.length !== 10;

  const handleSendOTP = async () => {
    if (isInvalid) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('temp_mobile', mobile);
        navigate('/otp');
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="leadnius-auth-wrapper">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="logo-boxes" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="logo-box">Q</div>
            <div className="logo-box">U</div>
            <div className="logo-box">Z</div>
            <div className="logo-box">O</div>
          </div>
          
          <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <a href="#home" onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}>Home</a>
            <a href="/how-it-works" onClick={(e) => { e.preventDefault(); navigate("/how-it-works"); setIsMenuOpen(false); }}>How it works</a>
            <a href="#contests" onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}>Contests</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}>FAQ</a>
          </nav>

          <div className="header-actions">
            <>
              <button className="secondary-btn desktop-only" style={{ padding: "10px 18px", borderRadius: "12px", fontSize: "14px" }} onClick={() => navigate("/register")}>
                Signup
              </button>
              <button className="login-btn desktop-only" onClick={() => navigate("/login")}>
                Login
              </button>
            </>
            
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      <main className="auth-main-content">
        <div className="join-card">
          <h1 className="card-title">Your Quzo Journey Starts Here</h1>
          <p className="card-subtitle">
            Get early access to live quizzes and join 50,000+ serious aspirants.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }} className="auth-form">
            <div className={`input-group ${mobile.length === 10 ? 'active' : ''}`}>
              <input 
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={handleMobileChange}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && <div className="error-text">{error}</div>}

            <button 
              type="submit" 
              className="join-btn"
              disabled={isInvalid || isLoading}
            >
              {isLoading ? 'Sending...' : 'Join Now →'}
            </button>
          </form>

          <p className="footer-link">
            Already a member? <span className="link-text" onClick={() => navigate('/register')}>Sign In</span>
          </p>
        </div>
      </main>

      <style>{`
        .leadnius-auth-wrapper {
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          font-family: 'Lexend', sans-serif;
        }
        .auth-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e2e8f0;
          width: 100%;
        }
        .topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-boxes { display: flex; gap: 8px; }
        .logo-box {
          width: 38px;
          height: 38px;
          background: #0c4a6e;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
        }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { color: #64748b; text-decoration: none; font-weight: 600; font-size: 14px; }
        .auth-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 100px 20px 40px;
        }
        .join-card {
          background: white;
          width: 100%;
          max-width: 480px;
          margin: auto;
          border-radius: 32px;
          padding: 40px 40px 48px;
          position: relative;
          text-align: center;
          box-shadow: none;
        }
        .close-btn { position: absolute; top: 24px; right: 24px; border: none; background: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
        .mini-box { width: 38px; height: 38px; background: #0c4a6e; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; }
        .card-top-logo { display: flex; gap: 6px; justify-content: center; margin-bottom: 32px; }
        .card-title { color: #0f172a; font-size: 38px; font-weight: 850; letter-spacing: -1px; margin-bottom: 20px; }
        .card-subtitle { color: #64748b; font-size: 17px; margin-bottom: 40px; }
        .input-group { border: 2px solid #e2e8f0; border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
        .input-group.active { border-color: #3b82f6; }
        .input-group input { 
          width: 100%; 
          padding: 18px 24px; 
          border: none; 
          outline: none; 
          font-size: 16px;
          color: #0f172a; /* Dark text for white background */
          background: transparent;
        }
        .join-btn { width: 100%; background: #404eed; color: white; border: none; padding: 18px; border-radius: 16px; font-size: 18px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .join-btn:hover { background: #3641c8; }
        .join-btn:disabled { background: #94a3b8; cursor: not-allowed; }
        .error-text { color: #ef4444; font-size: 13px; font-weight: 600; margin-bottom: 12px; text-align: center; }
        .footer-link { margin-top: 32px; color: #64748b; font-size: 14px; }
        .link-text { color: #1a56db; font-weight: 700; cursor: pointer; }

        @media (max-width: 768px) {
          .auth-main-content {
            padding-top: 80px;
          }
          .join-card {
            padding: 10px 20px 30px;
          }
          .card-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
