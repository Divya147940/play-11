import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobile(value);
      setError(null);
    }
  };

  const isInvalid = mobile.length !== 10;

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendOTP = async () => {
    if (isInvalid) return;
    setIsLoading(true);
    setError(null);

    const fullPhoneNumber = '+91' + mobile;

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      
      window.confirmationResult = confirmationResult;
      localStorage.setItem('temp_mobile', mobile);
      navigate('/otp');
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          if (window.grecaptcha) window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="leadnius-auth-wrapper">
      {/* Top Header - Restored God-tier Logo Blocks */}
      <header className="auth-topbar">
        <div className="topbar-inner">
          <div className="logo-boxes">
            <div className="logo-box">Q</div>
            <div className="logo-box">U</div>
            <div className="logo-box">Z</div>
            <div className="logo-box">O</div>
          </div>
          <nav className="nav-links">
            <a href="/#home" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <a href="/#how" onClick={(e) => { e.preventDefault(); navigate('/'); }}>How it works</a>
            <a href="/#contests" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Contests</a>
            <a href="/#faq" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FAQ</a>
          </nav>
          <div className="header-spacer"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="auth-main-content">
        <div className="join-card">
          <button className="close-btn" onClick={() => navigate('/')}>×</button>
          
          <div className="card-top-logo">
            <div className="mini-box">Q</div>
            <div className="mini-box">U</div>
            <div className="mini-box">Z</div>
            <div className="mini-box">O</div>
          </div>

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

          <div id="recaptcha-container"></div>

          <p className="footer-link">
            Already a member? <span className="link-text" onClick={() => navigate('/register')}>Sign In</span>
          </p>
        </div>
      </main>

      <style>{`
        .leadnius-auth-wrapper {
          min-height: 100vh;
          background: #1a1b1e;
          display: flex;
          flex-direction: column;
          font-family: 'Lexend', sans-serif;
        }

        .auth-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(13, 31, 60, 0.96);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          width: 100%;
        }

        .topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .logo-boxes { display: flex; gap: 8px; }
        
        .logo-box {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #0c4a6e;
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
        }

        .nav-links {
          display: flex;
          gap: 24px;
          color: #cbd5e1;
          font-size: 14px;
        }

        .nav-links a { 
          color: inherit; 
          text-decoration: none; 
          font-weight: 600;
        }
        
        .nav-links a:hover { color: #fff; }

        .header-spacer {
          width: 100px; /* To balance the logo side since button is hidden */
          display: none;
        }

        @media (max-width: 960px) {
          .nav-links { display: none; }
        }

        .auth-main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .join-card {
          background: white;
          width: 100%;
          max-width: 480px;
          border-radius: 32px;
          padding: 60px 40px 48px;
          position: relative;
          text-align: center;
          box-shadow: 0 24px 48px rgba(0,0,0,0.2);
        }

        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: none;
          font-size: 24px;
          color: #94a3b8;
          cursor: pointer;
        }

        .card-top-logo {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .mini-box {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #0c4a6e;
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #fff;
          font-weight: 900;
          font-size: 14px;
        }

        .card-title {
          color: #0f172a;
          font-size: 38px;
          font-weight: 850;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .card-subtitle {
          color: #64748b;
          font-size: 17px;
          line-height: 1.5;
          margin-bottom: 40px;
          padding: 0 10px;
        }

        .auth-form {
          width: 100%;
        }

        .input-group {
          width: 100%;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          margin-bottom: 16px;
          transition: all 0.2s;
          overflow: hidden;
        }

        .input-group.active {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .input-group input {
          width: 100%;
          padding: 18px 24px;
          border: none;
          outline: none;
          font-size: 16px;
          color: #0f172a;
          font-weight: 500;
        }

        .input-group input::placeholder {
          color: #94a3b8;
        }

        .join-btn {
          width: 100%;
          background: #404eed;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 4px 14px rgba(64, 78, 237, 0.3);
        }

        .join-btn:hover {
          background: #3641c8;
          transform: translateY(-1px);
        }

        .join-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .error-text {
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: left;
          padding-left: 4px;
        }

        .footer-link {
          margin-top: 32px;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .link-text {
          color: #1a56db;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .auth-header-ribbon {
            padding: 0 20px;
            height: 70px;
          }
          .card-title {
            font-size: 32px;
          }
          .join-card {
            padding: 48px 24px 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
