import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronRight, Settings, ShieldCheck, History, Award } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const ProfilePage = () => {
  const navigate = useNavigate();
  const mobile = localStorage.getItem('user_mobile') || '9876543210';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const stats = [
    { label: 'Quizzes', value: '24', icon: <History size={20} color="hsl(var(--primary))" /> },
    { label: 'Wins', value: '12', icon: <Award size={20} color="#fbbf24" /> },
    { label: 'Points', value: '4.5k', icon: <ShieldCheck size={20} color="#10b981" /> }
  ];

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header: Elite Profile Branding */}
        <div className="animate-elite" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ position: 'relative', width: 'clamp(100px, 15vw, 140px)', height: 'clamp(100px, 15vw, 140px)', margin: '0 auto 1.5rem' }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '3rem', 
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', 
              padding: '1px',
              boxShadow: '0 20px 40px -10px hsl(var(--primary) / 0.3)'
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '2.9rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={64} color="hsl(var(--foreground))" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />
              </div>
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '2px', 
              right: '2px', 
              background: '#10b981', 
              width: '36px', 
              height: '36px', 
              borderRadius: '12px', 
              border: '4px solid white',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
            }} className="flex-center">
               <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '0.5rem', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>+91 {mobile}</h1>
          <div style={{ 
            display: 'inline-flex', 
            background: 'hsl(var(--muted))', 
            padding: '8px 20px', 
            borderRadius: '2rem', 
            border: '1px solid hsl(var(--card-border))',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'hsl(var(--muted-foreground))',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            Elite Tier Player
          </div>
        </div>

        {/* Stats Grid: Elite Bento Style - Fully Responsive */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} className="bento-card animate-elite" style={{ padding: '1.75rem', textAlign: 'center', animationDelay: `${i * 0.1}s`, background: 'white' }}>
              <div style={{ marginBottom: '1rem', background: 'hsl(var(--muted))', width: '48px', height: '48px', borderRadius: '1rem', margin: '0 auto 1rem', border: '1px solid hsl(var(--card-border))' }} className="flex-center">{stat.icon}</div>
              <p style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.2rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{stat.value}</p>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Options List: Luxury Menu */}
        <div className="animate-elite" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem', animationDelay: '0.3s' }}>
          {[
            { icon: <History size={20} />, label: 'Arena History', onClick: () => navigate('/history') },
            { icon: <ShieldCheck size={20} />, label: 'Security & Compliance', onClick: () => {} },
            { icon: <Award size={20} />, label: 'Achievements', onClick: () => {} },
            { icon: <Settings size={20} />, label: 'System Preferences', onClick: () => {} }
          ].map((item, i) => (
            <div key={i} className="bento-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', borderRadius: '1.75rem', background: 'white' }} onClick={item.onClick}>
              <div style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '1.25rem', color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--card-border))' }} className="flex-center">{item.icon}</div>
              <span style={{ flex: 1, fontWeight: 700, fontSize: '1.1rem', color: 'hsl(var(--foreground))' }}>{item.label}</span>
              <ChevronRight size={20} color="hsl(var(--card-border))" strokeWidth={3} />
            </div>
          ))}
        </div>

        {/* Logout: Elite Style */}
        <div className="animate-elite" style={{ animationDelay: '0.4s', maxWidth: '400px', margin: '0 auto' }}>
          <button 
            className="btn-elite" 
            style={{ width: '100%', height: '64px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', textTransform: 'uppercase', fontSize: '1rem' }}
            onClick={handleLogout}
          >
            <LogOut size={22} style={{ marginRight: '0.75rem' }} /> Logout from Arena
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
