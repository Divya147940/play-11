import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

const OtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const mobile = localStorage.getItem('temp_mobile') || '0000000000';
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length === 6) {
      setIsLoading(true);
      setError('');
      try {
        if (!window.confirmationResult) {
          throw new Error('No pending verification found. Please go back to login.');
        }

        const result = await window.confirmationResult.confirm(code);
        const user = result.user;
        const idToken = await user.getIdToken();

        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseToken: idToken, mobile })
        });
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(response.status === 504 ? 'Auth Service Unreachable' : (text || 'Unexpected server response'));
        }
        
        if (!response.ok) {
           throw new Error(data.error || 'Backend verification failed');
        }

        localStorage.setItem('play11_session', data.token);
        localStorage.setItem('play11_user', JSON.stringify(data.user));
        localStorage.setItem('user_mobile', mobile);
        
        if (data.isNewUser) {
          navigate('/register');
        } else {
          localStorage.setItem('user_name', data.user.name || '');
          navigate('/home-choice');
        }
      } catch (err) {
        console.error('OTP Verification Error:', err);
        setError(err.message === 'Firebase: Error (auth/invalid-verification-code).' 
          ? 'Invalid OTP code. Please check and try again.' 
          : err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Enter complete 6-digit code');
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
            <a href="/#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <a href="/#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>How it works</a>
            <a href="/#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Contests</a>
            <a href="/#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FAQ</a>
          </nav>
          <div className="header-spacer"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="auth-main-content">
        <div className="join-card">
          <button className="close-btn" onClick={() => navigate('/login')}>×</button>
          
          <div className="card-top-logo">
            <div className="mini-box">Q</div>
            <div className="mini-box">U</div>
            <div className="mini-box">Z</div>
            <div className="mini-box">O</div>
          </div>

          <h1 className="card-title">Securing Your Access</h1>
          <p className="card-subtitle">
            Enter the 6-digit code sent to <strong>+91 {mobile}</strong> to finalize your entry.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="auth-form">
            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <div key={index} className={`otp-slot ${digit ? 'filled' : ''}`}>
                  <input
                    ref={el => inputs.current[index] = el}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                </div>
              ))}
            </div>

            {error && <div className="error-text">{error}</div>}

            <button 
              type="submit" 
              className="join-btn"
              disabled={isLoading || otp.join('').length < 6}
            >
              {isLoading ? 'Decrypting...' : 'Verify & Join →'}
            </button>
          </form>

          <div style={{ marginTop: '24px' }}>
            {timer > 0 ? (
              <p className="timer-text">Resend code in <strong>{timer}s</strong></p>
            ) : (
              <button 
                className="resend-btn"
                onClick={() => { setTimer(30); setOtp(['','','','','','']); inputs.current[0].focus(); }}
              >
                <RefreshCw size={16} />
                <span>Resend Code</span>
              </button>
            )}
          </div>
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
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .card-subtitle {
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        .otp-input-container {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }

        .otp-slot {
          aspect-ratio: 1;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s;
        }

        .otp-slot.filled {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .otp-slot input {
          width: 100%;
          text-align: center;
          border: none;
          outline: none;
          font-size: 24px;
          font-weight: 800;
          color: #1e293b;
          background: transparent;
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
        .join-btn:hover { background: #3641c8; transform: translateY(-1px); }
        .join-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }

        .error-text {
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
        }

        .timer-text { color: #64748b; font-size: 14px; font-weight: 500; }
        .resend-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
          background: transparent;
          border: none;
          color: #1a56db;
          font-weight: 700;
          cursor: pointer;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .join-card { padding: 48px 24px 32px; }
          .card-title { font-size: 28px; }
        }
      `}</style>
    </div>
  );
};

export default OtpPage;
