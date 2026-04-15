import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronRight, Settings, ShieldCheck, History, Award, Mail, Phone } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const mobile = localStorage.getItem('user_mobile') || 'Guest';
  const name = localStorage.getItem('user_name') || '';

  const handleLogout = () => {
    localStorage.removeItem('play11_session');
    localStorage.removeItem('play11_user');
    localStorage.removeItem('user_mobile');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const stats = [
    { label: 'Quizzes', value: '24', icon: <History size={20} color="hsl(var(--primary))" /> },
    { label: 'Wins', value: '12', icon: <Award size={20} color="#fbbf24" /> },
    { label: 'Points', value: '4.5k', icon: <ShieldCheck size={20} color="#10b981" /> }
  ];

  return (
    <div style={{ paddingBottom: '7rem' }}>
      <div className="container" style={{ paddingTop: '6.5rem' }}>
        
        {/* Website Profile Header Section */}
        <div className="profile-header-container" style={{ 
          display: 'flex', 
          gap: 'clamp(2rem, 6vw, 4rem)', 
          alignItems: 'center', 
          marginBottom: '6rem', 
          flexWrap: 'wrap',
          justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
        }}>
          <div style={{ position: 'relative', width: 'clamp(140px, 35vw, 180px)', height: 'clamp(140px, 35vw, 180px)', flexShrink: 0 }}>
            <div className="flex-center" style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '2.5rem', 
              background: 'white', 
              border: '1px solid rgba(0,0,0,0.03)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
              position: 'relative',
              zIndex: 2
            }}>
              <User size={72} color="hsl(var(--foreground))" strokeWidth={1} />
            </div>
            <div style={{ 
              position: 'absolute', 
              top: '-15%', left: '-15%', width: '130%', height: '130%', 
              background: 'linear-gradient(135deg, hsla(var(--primary), 0.1), hsla(var(--secondary), 0.1))',
              filter: 'blur(40px)',
              borderRadius: '3rem',
              zIndex: 1
            }}></div>
            <div className="flex-center" style={{ position: 'absolute', bottom: '15px', right: '5px', background: '#10b981', border: '6px solid #f8f9fa', width: '42px', height: '42px', borderRadius: '1.2rem', color: 'white', zIndex: 3, boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}>
               <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'pulse-green 1.5s infinite' }}></div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '320px', textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
             <div style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '1.25rem', 
               marginBottom: '0.75rem', 
               flexWrap: 'wrap',
               justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
             }}>
               <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, letterSpacing: '-0.05em', color: 'hsl(var(--foreground))' }}>{name || `+91 ${mobile}`}</h1>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: 'white', padding: '6px 18px', borderRadius: '1.5rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)' }}>
                  <Award size={14} fill="currentColor" />
                  <span>Elite Pro</span>
               </div>
             </div>
             <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem', fontWeight: 600, marginBottom: '2rem', opacity: 0.8 }}>
                {name ? `+91 ${mobile} • ` : ''}Unified Arena Voyager • Rank 420
             </p>
             <div style={{ 
               display: 'flex', 
               gap: '2rem', 
               flexWrap: 'wrap',
               justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
             }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700, fontSize: '0.9rem' }}>
                   <div style={{ width: '32px', height: '32px', background: 'hsla(var(--primary), 0.05)', borderRadius: '0.75rem' }} className="flex-center">
                      <Mail size={16} color="hsl(var(--primary))" />
                   </div>
                   support@play11.global
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700, fontSize: '0.9rem' }}>
                   <div style={{ width: '32px', height: '32px', background: 'hsla(var(--secondary), 0.05)', borderRadius: '0.75rem' }} className="flex-center">
                      <ShieldCheck size={16} color="hsl(var(--secondary))" />
                   </div>
                   Biometric Active
                </div>
             </div>
          </div>
        </div>

        {/* Stats Grid: Elite Bento Style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass-premium animate-slide-up" style={{ padding: '3rem', textAlign: 'center', animationDelay: `${i * 0.15}s` }}>
              <div style={{ marginBottom: '2rem', background: 'hsla(var(--foreground), 0.03)', width: '72px', height: '72px', borderRadius: '2rem', margin: '0 auto 2rem', border: '1px solid rgba(0,0,0,0.02)' }} className="flex-center">{stat.icon}</div>
              <p style={{ fontWeight: 950, fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-0.04em', color: 'hsl(var(--foreground))' }}>{stat.value}</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 900, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.18em', opacity: 0.6 }}>Total {stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {/* Options Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '1.25rem', paddingLeft: '0.75rem', fontFamily: 'Lexend', letterSpacing: '-0.02em' }}>Intelligence & Governance</h3>
            {[
              { icon: <History size={22} />, label: 'Arena Engagement Log', onClick: () => navigate('/history'), color: 'hsl(var(--primary))' },
              { icon: <ShieldCheck size={22} />, label: 'Neural Security Protocol', onClick: () => {}, color: 'hsl(var(--secondary))' },
              { icon: <Settings size={22} />, label: 'Interface Configurations', onClick: () => {}, color: 'hsl(var(--accent))' }
            ].map((item, i) => (
              <div key={i} className="glass-premium" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer', transition: 'all 0.4s ease' }} onClick={item.onClick}>
                <div style={{ width: '56px', height: '56px', background: 'hsla(var(--foreground), 0.03)', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.02)' }} className="flex-center">
                   {React.cloneElement(item.icon, { color: item.color, strokeWidth: 2.5 })}
                </div>
                <span style={{ flex: 1, fontWeight: 850, fontSize: '1.2rem', color: 'hsl(var(--foreground))' }}>{item.label}</span>
                <ChevronRight size={24} strokeWidth={3} style={{ opacity: 0.2 }} />
              </div>
            ))}
          </div>

          {/* Additional Info Column */}
          <div className="glass-premium" style={{ padding: '3.5rem', background: 'linear-gradient(135deg, hsla(var(--primary), 0.05), hsla(var(--secondary), 0.05))', border: '2px solid hsla(var(--accent), 0.2)' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '2rem', fontFamily: 'Lexend', letterSpacing: '-0.03em' }}>Tier: Dominator</h3>
             <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, lineHeight: '1.8', marginBottom: '3rem', fontSize: '1.1rem', opacity: 0.9 }}>
               You are presently holding a **Dominator Badge**. Access to high-stakes IPL multipliers andSSC-CGL elite simulations is fully authorized.
             </p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="shimmer-btn" style={{ padding: '1.25rem', fontSize: '1rem', width: '100%', background: 'linear-gradient(135deg, hsl(var(--primary)), #4338ca)' }}>Evolution Protocol (Upgrade)</button>
                <button 
                   onClick={handleLogout} 
                   className="resend-action-premium" 
                   style={{ 
                     width: '100%', 
                     justifyContent: 'center', 
                     background: 'rgba(239, 68, 68, 0.05)', 
                     color: '#ef4444', 
                     border: '1px solid rgba(239, 68, 68, 0.15)',
                     fontSize: '0.9rem',
                     padding: '1rem'
                   }}
                >
                   <LogOut size={20} strokeWidth={2.5} />
                   <span>TERMINATE SESSION</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
