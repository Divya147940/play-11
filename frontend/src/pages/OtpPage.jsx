import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

const OtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const mobile = localStorage.getItem('temp_mobile') || '8009799550';
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
    if (code.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Call the real backend API to verify OTP and get JWT token
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile,
          otp_code: code
        })
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store real JWT session
        localStorage.setItem('play11_session', JSON.stringify({ token: data.token, user: data.user }));
        localStorage.setItem('user_name', data.user?.name || 'Scholar');
        localStorage.setItem('user_mobile', mobile);
        localStorage.setItem('play11_user', JSON.stringify(data.user));
        localStorage.removeItem('temp_mobile');
        
        // Check for smart redirection (e.g., back to quiz after login)
        const redirectPath = localStorage.getItem('auth_redirect');
        if (redirectPath) {
          localStorage.removeItem('auth_redirect');
          navigate(redirectPath);
        } else if (data.isNewUser) {
          navigate('/register');
        } else {
          navigate('/home-choice');
        }
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('OTP Verify error:', err);
      setError('Network error. Please check your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="leadnius-auth-wrapper">
      <main className="auth-main-content">
        <div className="join-card">
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
                    disabled={isLoading}
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
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
        }
        .nav-links {
          display: flex;
          gap: 24px;
          color: #64748b;
          font-size: 14px;
        }
        .nav-links a { 
          color: inherit; 
          text-decoration: none; 
          font-weight: 600;
        }
        .nav-links a:hover { color: #0f172a; }
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
          border: 1px solid rgba(59, 130, 246, 0.2);
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
          color: #1e293b; /* Dark text for white background */
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
          .auth-main-content { padding-top: 80px; }
          .join-card { padding: 10px 20px 30px; }
          .card-title { font-size: 28px; }
        }
      `}</style>
    </div>
  );
};

export default OtpPage;
