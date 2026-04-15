import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo-play11.png';

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
    <div className="auth-immersive-container">
      {/* Shared Auth Mesh Background */}
      <div className="auth-mesh-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          <div className="auth-card-hub animate-slide-up" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
            <div className="premium-auth-card" style={{ 
              padding: 'clamp(1rem, 5vw, 2rem)',
              margin: '0 auto',
              width: '100%',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <img src={logo} alt="Play11" style={{ height: '64px', width: 'auto', margin: '0 auto' }} />
                </div>
                
                <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 950, marginBottom: '0.75rem', fontFamily: 'Lexend', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
                  Authorize <span className="text-gradient">Access.</span>
                </h2>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '0.9rem', opacity: 0.8 }}>
                  Code sent to +91 {mobile}
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: 'clamp(0.4rem, 2vw, 0.8rem)', 
                    justifyContent: 'center', 
                    marginBottom: '2rem' 
                  }}>
                    {otp.map((digit, index) => (
                      <div key={index} className={`otp-slot-premium ${digit ? 'active' : ''}`}>
                        <input
                          ref={el => inputs.current[index] = el}
                          type="tel"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="otp-digit-field"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="auth-error-glass" style={{ marginBottom: '2.5rem' }}>
                     <div className="error-dot"></div>
                     <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="shimmer-btn premium-cta-btn" 
                  disabled={isLoading}
                  style={{ width: '100%', height: '80px', fontSize: '1.2rem' }}
                >
                  {isLoading ? (
                    <div className="flex-center" style={{ gap: '1rem' }}>
                      <div className="auth-spinner"></div>
                      <span>Decrypting...</span>
                    </div>
                  ) : (
                    <>
                      <span>Authorize Access</span>
                      <ArrowRight size={22} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                {timer > 0 ? (
                  <div className="flex-center" style={{ gap: '0.6rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, fontSize: '0.9rem', opacity: 0.7 }}>
                    <RotateIcon size={18} />
                    <span>NEW KEY IN <strong style={{ color: 'hsl(var(--foreground))' }}>{timer}s</strong></span>
                  </div>
                ) : (
                  <button 
                    className="resend-action-premium animate-slide-up"
                    onClick={() => { setTimer(30); setOtp(['','','','','','']); inputs.current[0].focus(); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--primary))', fontWeight: 800 }}
                  >
                    <RefreshCw size={20} strokeWidth={2.5} />
                    <span>REGENERATE SECURITY CODE</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-immersive-container {
          min-height: 100vh;
          background: transparent;
          overflow: hidden;
          position: relative;
        }
        .auth-mesh-bg {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 1;
        }
        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.15;
          animation: morph-blob 20s infinite alternate cubic-bezier(0.45, 0, 0.55, 1);
        }
        .auth-blob-1 {
          width: 60vw; height: 60vw;
          background: hsl(var(--primary));
          top: -20%; left: -20%;
        }
        .auth-blob-2 {
          width: 50vw; height: 50vw;
          background: hsl(var(--secondary));
          bottom: -15%; right: -15%;
          animation-delay: -5s;
        }
        @keyframes morph-blob {
          0% { transform: scale(1) translate(0, 0) rotate(0); }
          33% { transform: scale(1.1) translate(10%, 5%) rotate(5deg); }
          66% { transform: scale(0.9) translate(-5%, 10%) rotate(-5deg); }
          100% { transform: scale(1) translate(0, 0) rotate(0); }
        }
      `}</style>
    </div>
  );
}

const RotateIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 4s linear infinite' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default OtpPage;
