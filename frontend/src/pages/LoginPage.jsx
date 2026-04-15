import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import logo from '../assets/logo-play11.png';
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
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }, []);

  const handleSendOTP = async () => {
    if (isInvalid) return;
    setIsLoading(true);
    setError(null);

    const fullPhoneNumber = '+91' + mobile;

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      
      // Store confirmationResult globally (for OtpPage to use)
      window.confirmationResult = confirmationResult;
      
      localStorage.setItem('temp_mobile', mobile);
      navigate('/otp');
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-immersive-container">
      {/* Dynamic Mesh Background */}
      <div className="auth-mesh-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-card-hub animate-slide-up" style={{ width: '100%', maxWidth: '480px' }}>
          <div className="premium-auth-card" style={{ 
            padding: 'clamp(1rem, 5vw, 2rem)',
            margin: '0 auto',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <img src={logo} alt="Play11" style={{ height: '64px', width: 'auto', margin: '0 auto' }} />
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 950, marginBottom: '0.75rem', fontFamily: 'Lexend', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
                Login with <span className="text-gradient">Mobile Number</span>
              </h2>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', opacity: 0.8 }}>
                Verify your mobile identity to proceed
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'hsl(var(--foreground))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mobile Number</label>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))' }}>+91 Territory</span>
                </div>
                <div className={`input-vessel-premium ${mobile.length === 10 ? 'verified' : ''}`}>
                  <div className="input-glass-icon">
                    <Smartphone size={22} />
                  </div>
                  <div className="vessel-divider" style={{ margin: '0 0.75rem' }}></div>
                  <input 
                    type="tel"
                    placeholder="00000 00000"
                    value={mobile}
                    onChange={handleMobileChange}
                    disabled={isLoading}
                    autoFocus
                    className="premium-input-field"
                  />
                </div>
                {error && (
                  <div className="auth-error-glass">
                    <div className="error-dot"></div>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="shimmer-btn premium-cta-btn" 
                disabled={isInvalid || isLoading}
              >
                {isLoading ? (
                  <div className="flex-center" style={{ gap: '1rem' }}>
                    <div className="auth-spinner"></div>
                    <span>Accessing Hub...</span>
                  </div>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={22} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            <div id="recaptcha-container"></div>

            <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', lineHeight: '1.6', fontWeight: 600 }}>
                By continuing, you agree to Play11's <br/>
                <span style={{ color: 'hsl(var(--primary))', cursor: 'pointer', fontWeight: 800 }}>Terms of Service</span> and <span style={{ color: 'hsl(var(--primary))', cursor: 'pointer', fontWeight: 800 }}>Privacy Policy</span>
              </p>
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

        .auth-card-hub {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }
        .premium-auth-card {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
