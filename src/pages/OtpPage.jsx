import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';

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

    // Auto focus next
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
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile, otp_code: code })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
           throw new Error(data.error || 'Verification failed');
        }

        // Store tokens
        localStorage.setItem('play11_session', data.token);
        localStorage.setItem('user_mobile', mobile);
        
        navigate('/home-choice');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Enter complete 6-digit code');
    }
  };

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div className="container" style={{ maxWidth: '520px', padding: 'var(--page-padding)' }}>
        {/* Back navigation */}
        <button 
           onClick={() => navigate('/login')} 
           className="flex-center" 
           style={{ 
             width: '44px', 
             height: '44px', 
             background: 'hsl(var(--muted))', 
             borderRadius: '1rem', 
             color: 'hsl(var(--foreground))', 
             marginBottom: '2rem',
             border: '1px solid hsl(var(--card-border))'
           }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Header content */}
        <div style={{ marginBottom: '3rem' }} className="animate-elite">
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, fontFamily: 'Lexend', marginBottom: '0.75rem', color: 'hsl(var(--foreground))' }}>Secure Entry</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '0.95rem' }}>
            Verification code sent to <span style={{ color: 'hsl(var(--primary))', fontWeight: 800 }}>+91 {mobile}</span>
          </p>
        </div>

        {/* OTP Entry Card */}
        <div className="bento-card animate-elite" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', background: 'white' }}>
          <div style={{ display: 'flex', gap: 'clamp(0.4rem, 2vw, 0.75rem)', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 'clamp(40px, 8vw, 56px)',
                  height: 'clamp(52px, 10vw, 68px)',
                  textAlign: 'center',
                  fontSize: 'clamp(1.2rem, 3vw, 1.75rem)',
                  fontWeight: '800',
                  fontFamily: 'Lexend',
                  borderRadius: '1rem',
                  border: '1px solid' + (digit ? ' hsl(var(--primary) / 0.5)' : ' hsl(var(--card-border))'),
                  background: digit ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--muted))',
                  color: 'hsl(var(--foreground))',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxShadow: digit ? '0 0 20px hsl(var(--primary) / 0.1)' : 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary) / 0.5)'}
                onBlur={(e) => { if(!otp[i]) e.target.style.borderColor = 'hsl(var(--card-border))' }}
              />
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
               {error}
            </div>
          )}

          <button 
            className="btn-elite btn-elite-primary" 
            onClick={handleVerify}
            disabled={isLoading}
            style={{ 
               width: '100%', 
               height: '64px', 
               fontSize: '1rem',
               opacity: isLoading ? 0.5 : 1,
               pointerEvents: isLoading ? 'none' : 'auto'
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify Identity'}
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            {timer > 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
                Request new code in <span style={{ color: 'hsl(var(--foreground))', fontWeight: 800 }}>{timer}s</span>
              </p>
            ) : (
              <button 
                style={{ fontSize: '0.9rem', color: 'hsl(var(--primary))', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => { setTimer(30); setOtp(['','','','','','']); inputs.current[0].focus(); }}
              >
                <RefreshCw size={14} /> Resend Access Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
