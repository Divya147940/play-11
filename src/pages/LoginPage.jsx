import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import logo from '../assets/logo-play11.png';

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      localStorage.setItem('temp_mobile', mobile);
      // The API currently returns a mock OTP reference, but our OTP screen doesn't explicitly need to pass it yet unless we want to.
      navigate('/otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div className="container" style={{ padding: 'var(--page-padding)' }}>
        
        <div className="auth-split">
          {/* Header Branding */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="animate-elite auth-brand">
            <img 
              src={logo} 
              alt="Play11 Logo" 
              style={{ 
                width: 'clamp(180px, 20vw, 280px)', 
                height: 'auto', 
                objectFit: 'contain',
                marginBottom: '1rem',
                marginLeft: 'auto',
                marginRight: 'auto'
              }} 
            />
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, fontFamily: 'Lexend', marginBottom: '0.75rem', color: 'hsl(var(--foreground))' }}>Play11 Elite</h1>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 'clamp(0.95rem, 2vw, 1.2rem)' }}>The Arena of Champions</p>
          </div>

          {/* Login Card */}
          <div className="auth-card-container">
            <div className="bento-card animate-elite" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', background: 'white' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Lexend', marginBottom: '0.5rem', color: 'hsl(var(--foreground))' }}>Welcome Back</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', fontWeight: 500 }}>Enter your mobile to access the arena</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Mobile Identity</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '1.25rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'hsl(var(--muted-foreground))',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}>
                    <span>+91</span>
                    <div style={{ width: '1px', height: '16px', background: 'hsl(var(--card-border))' }}></div>
                  </div>
                  <input 
                    type="tel"
                    placeholder="00000 00000"
                    value={mobile}
                    onChange={handleMobileChange}
                    disabled={isLoading}
                    style={{ 
                      width: '100%',
                      height: '64px',
                      paddingLeft: '4rem',
                      paddingRight: '1rem',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      fontFamily: 'Lexend',
                      background: 'hsl(var(--muted))',
                      border: '1px solid hsl(var(--card-border))',
                      borderRadius: '1.25rem',
                      color: 'hsl(var(--foreground))',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      opacity: isLoading ? 0.7 : 1
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(var(--primary) / 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(var(--card-border))'}
                  />
                </div>
                {error && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>{error}</p>
                )}
              </div>

              <button 
                className="btn-elite btn-elite-primary" 
                disabled={isInvalid || isLoading}
                onClick={handleSendOTP}
                style={{ 
                  width: '100%', 
                  height: '64px', 
                  fontSize: '1rem',
                  opacity: (isInvalid || isLoading) ? 0.5 : 1,
                  pointerEvents: (isInvalid || isLoading) ? 'none' : 'auto'
                }}
              >
                {isLoading ? 'Verifying...' : 'Authenticate Now'}
              </button>
            </div>

            {/* Footer Meta */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }} className="animate-elite">
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
                By continuing, you agree to our <br/>
                <span style={{ color: 'hsl(var(--primary))', cursor: 'pointer' }}>Terms of Service</span> & <span style={{ color: 'hsl(var(--primary))', cursor: 'pointer' }}>Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
