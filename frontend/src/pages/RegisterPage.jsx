import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, Sparkles, ShieldCheck, Trophy } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const mobile = localStorage.getItem('user_mobile');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name');
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, name })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      localStorage.setItem('user_name', name);
      // Update the user object in localStorage as well
      const savedUser = JSON.parse(localStorage.getItem('play11_user') || '{}');
      savedUser.name = name;
      localStorage.setItem('play11_user', JSON.stringify(savedUser));
      
      navigate('/home-choice');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-immersive-container">
      <div className="auth-mesh-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          <div className="glass-container animate-slide-up vault-card" style={{ padding: 'clamp(2.5rem, 6vw, 4rem)', borderRadius: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="flex-center" style={{ width: '80px', height: '80px', background: 'hsla(var(--primary), 0.1)', color: 'hsl(var(--primary))', borderRadius: '2rem', margin: '0 auto 2rem', border: '1px solid hsla(var(--primary), 0.1)' }}>
                 <User size={40} />
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '0.75rem', fontFamily: 'Lexend', letterSpacing: '-0.04em' }}>Complete Profile</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem', fontWeight: 600 }}>Welcome to Play11! Please enter your name to personalize your arena experience.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 850, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>Full Name</label>
                <div className={`input-vessel ${name.length > 2 ? 'active' : ''}`}>
                   <input 
                     type="text"
                     placeholder="Enter your name"
                     value={name}
                     onChange={(e) => { setName(e.target.value); setError(''); }}
                     disabled={isLoading}
                     autoFocus
                     className="morphism-input ghost-input"
                     style={{ paddingLeft: '0' }}
                   />
                </div>
                {error && (
                  <div className="auth-error-chip animate-slide-up" style={{ marginTop: '1.5rem' }}>
                     <span>{error}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="morphism-button premium-btn" 
                disabled={isLoading || !name.trim()}
                style={{ width: '100%', height: '80px', fontSize: '1.25rem' }}
              >
                {isLoading ? 'Finalizing Profile...' : (
                  <>
                    <span>Enter the Arena</span>
                    <ArrowRight size={24} />
                    <div className="btn-shine"></div>
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '3.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                  <ShieldCheck size={16} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>Profile Verified</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, justifyContent: 'flex-end' }}>
                  <Trophy size={16} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>Reward Active</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-immersive-container { min-height: 100vh; background: #f8f9fa; overflow: hidden; position: relative; }
        .auth-mesh-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
        .auth-blob { position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.15; animation: morph-blob 20s infinite alternate cubic-bezier(0.45, 0, 0.55, 1); }
        .auth-blob-1 { width: 60vw; height: 60vw; background: hsl(var(--primary)); top: -20%; left: -10%; }
        .auth-blob-2 { width: 50vw; height: 50vw; background: hsl(var(--secondary)); bottom: -15%; right: -5%; animation-delay: -5s; }
        @keyframes morph-blob { 0% { transform: scale(1) translate(0, 0); } 100% { transform: scale(1.1) translate(5%, 5%); } }
        .vault-card { background: rgba(255, 255, 255, 0.7) !important; backdrop-filter: blur(40px) !important; border: 1px solid rgba(255, 255, 255, 0.8) !important; box-shadow: 0 50px 100px -30px rgba(0,0,0,0.12) !important; }
        .input-vessel { display: flex; align-items: center; background: white; border: 2px solid rgba(0,0,0,0.04); border-radius: 1.5rem; height: 76px; padding: 0 1.5rem; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .input-vessel:focus-within { border-color: hsl(var(--primary)); box-shadow: 0 10px 30px -5px hsla(var(--primary), 0.15); transform: translateY(-2px); }
        .input-vessel.active { border-color: #10b981; background: rgba(16, 185, 129, 0.02); }
        .ghost-input { flex: 1; height: 100%; border: none !important; background: transparent !important; font-size: 1.4rem !important; font-weight: 900 !important; letter-spacing: 0.05em !important; }
        .premium-btn { height: 80px !important; border-radius: 2rem !important; background: linear-gradient(135deg, hsl(var(--primary)), #2563eb) !important; font-weight: 950 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; box-shadow: 0 20px 40px -10px hsla(var(--primary), 0.4) !important; position: relative; overflow: hidden; }
        .btn-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: all 0.6s ease; }
        .premium-btn:hover .btn-shine { left: 100%; }
        .auth-error-chip { background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 1.25rem; border: 1px solid rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.85rem; font-weight: 800; text-align: center; }
      `}</style>
    </div>
  );
};

export default RegisterPage;
