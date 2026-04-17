import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock, User } from 'lucide-react';
import Logo from '../components/Logo';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('play11_admin_session', data.token);
        localStorage.setItem('play11_admin_user', JSON.stringify(data.admin));
        navigate('/admin');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
       <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-premium animate-elite" style={{ width: '100%', maxWidth: '480px', padding: '4rem 3rem', border: '1px solid rgba(0,0,0,0.05)' }}>
             <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                  <Logo size="large" />
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '6px 16px', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                   <ShieldAlert size={14} />
                   <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Secure Restricted Access</span>
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 950, marginBottom: '0.75rem', fontFamily: 'Lexend', letterSpacing: '-0.04em' }}>
                  Admin <span className="text-gradient">Portal.</span>
                </h2>
                <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '0.9rem', opacity: 0.8 }}>
                  Authorize high-level administrative protocols.
                </p>
             </div>

             <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }}>
                    <User size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Email or Mobile" 
                    required
                    style={{ paddingLeft: '3.5rem' }}
                    className="morphism-input"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }}>
                    <Lock size={20} />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Security Password" 
                    required
                    style={{ paddingLeft: '3.5rem' }}
                    className="morphism-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="shimmer-btn" 
                  style={{ 
                    marginTop: '2rem', 
                    height: '72px', 
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)'
                  }}
                >
                  {loading ? (
                    <div className="auth-spinner" style={{ width: '24px', height: '24px', borderTopColor: 'white' }}></div>
                  ) : (
                    <>
                      <span>Authorize Secure Access</span>
                      <ArrowRight size={22} strokeWidth={3} />
                    </>
                  )}
                </button>
             </form>

             <p style={{ marginTop: '3rem', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', textAlign: 'center', fontWeight: 600, opacity: 0.6 }}>
                Session activity is permanently logged for security audits.
             </p>
          </div>
       </div>
    </div>
  );
};

export default AdminLoginPage;
