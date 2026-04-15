import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Clock, CheckCircle2, XCircle, ArrowLeft, History as HistoryIcon } from 'lucide-react';

const mockHistory = [
  { id: 1, title: 'IPL Today Match', type: 'Game', date: '09 Apr, 2024', score: '1250', rank: '4', won: '₹1,000' },
  { id: 2, title: 'SSC CGL Mock 1', type: 'Study', date: '08 Apr, 2024', score: '42/50', rank: '124', won: '-' },
  { id: 3, title: 'Player Knowledge', type: 'Game', date: '07 Apr, 2024', score: '850', rank: '15', won: '₹200' },
  { id: 4, title: 'Banking Awareness', type: 'Study', date: '06 Apr, 2024', score: '15/20', rank: '45', won: '-' }
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobile = localStorage.getItem('user_mobile');
    if (!mobile) return setLoading(false);
    
    fetch(`/api/auth/history?mobile=${mobile}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.history.map(h => ({
            id: h.id,
            title: h.title,
            type: h.zone_id === 'study-zone' ? 'Study' : 'Game',
            date: new Date(h.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            score: h.total_score,
            rank: h.rank || '-',
            won: h.won_amount ? `₹${h.won_amount}` : '-'
          }));
          setHistory(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = filter === 'All' ? history : history.filter(h => h.type === filter);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '7rem' }}>
      <div className="container" style={{ paddingTop: '6.5rem' }}>
        
        {/* Header Glass Section */}
        <div className="history-header animate-slide-up" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(1.5rem, 5vw, 2.5rem)', 
          marginBottom: '5rem',
          flexWrap: 'wrap'
        }}>
           <button 
             onClick={() => navigate('/home-choice')} 
             className="flex-center glass-premium hover-lift" 
             style={{ width: '64px', height: '64px', borderRadius: '1.5rem', color: 'hsl(var(--foreground))', border: '1px solid rgba(0,0,0,0.03)', background: 'white', flexShrink: 0 }}
           >
             <ArrowLeft size={28} strokeWidth={2.5} />
           </button>
           <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                 <HistoryIcon size={18} color="hsl(var(--primary))" strokeWidth={2.5} />
                 <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--primary))', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Engagement Archive</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', fontWeight: 950, letterSpacing: '-0.05em', color: 'hsl(var(--foreground))', lineHeight: 1.1 }}>
                Arena <span className="text-gradient">Archives.</span>
              </h1>
           </div>
        </div>

        {/* Website Style Filters */}
        <div className="glass-premium animate-slide-up stagger-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '5rem', padding: '0.75rem', borderRadius: '2.25rem', maxWidth: '520px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.03)' }}>
          {['All', 'Study', 'Game'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{ 
                flex: 1,
                padding: '1.25rem', 
                borderRadius: '1.75rem', 
                background: filter === f ? 'hsl(var(--primary))' : 'transparent',
                color: filter === f ? 'white' : 'hsl(var(--muted-foreground))',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 900,
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: filter === f ? '0 12px 24px -6px hsla(var(--primary), 0.5)' : 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* History Grid - Premium Content */}
        <div className="bento-grid">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, idx) => (
              <div key={item.id} className={`glass-premium animate-slide-up stagger-${(idx % 3) + 1}`} style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '6px 16px', 
                        borderRadius: '1rem', 
                        background: item.type === 'Study' ? 'hsla(var(--primary), 0.12)' : 'hsla(var(--secondary), 0.12)',
                        color: item.type === 'Study' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        border: `1px solid ${item.type === 'Study' ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--secondary), 0.1)'}`
                      }}>
                        {item.type} Sector
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700, opacity: 0.7 }}>{item.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'hsl(var(--foreground))', letterSpacing: '-0.04em', lineHeight: '1.15' }}>{item.title}</h3>
                  </div>
                  {item.won !== '-' && (
                     <div style={{ textAlign: 'right' }}>
                       <div className="shimmer-btn" style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          background: 'linear-gradient(135deg, #10b981, #059669)', 
                          padding: '12px 24px', 
                          borderRadius: '1.5rem', 
                          fontSize: '1.2rem', 
                          fontWeight: 950,
                          boxShadow: '0 12px 24px -6px rgba(16, 185, 129, 0.4)'
                        }}>
                         <Trophy size={20} fill="currentColor" /> {item.won}
                       </div>
                     </div>
                  )}
                </div>

                <div style={{ 
                  marginTop: 'auto',
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                  gap: '1.5rem', 
                  background: 'hsla(var(--foreground), 0.02)', 
                  padding: '2rem', 
                  borderRadius: '2rem', 
                  border: '1px solid rgba(0,0,0,0.02)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div className="flex-center" style={{ width: '56px', height: '56px', borderRadius: '1.5rem', background: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', flexShrink: 0, border: '1px solid rgba(0,0,0,0.02)' }}>
                      <Clock size={24} color="hsl(var(--primary))" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.6 }}>Neural Score</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: 950, color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>{item.score}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div className="flex-center" style={{ width: '56px', height: '56px', borderRadius: '1.5rem', background: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', flexShrink: 0, border: '1px solid rgba(0,0,0,0.02)' }}>
                      <CheckCircle2 size={24} color="#f59e0b" strokeWidth={3} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.6 }}>Global Rank</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: 950, color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>#{item.rank}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-premium flex-center" style={{ gridColumn: '1/-1', padding: '8rem', flexDirection: 'column', gap: '2rem' }}>
               <div style={{ width: '100px', height: '100px', background: 'hsla(var(--primary), 0.05)', borderRadius: '50%', color: 'hsl(var(--primary))' }} className="flex-center">
                  <HistoryIcon size={48} strokeWidth={1} />
               </div>
               <div style={{ textAlign: 'center' }}>
                 <p style={{ fontSize: '1.5rem', fontWeight: 950, color: 'hsl(var(--foreground))', marginBottom: '0.5rem' }}>No Data Fragments Found</p>
                 <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>Your engagement record is currently empty.</p>
               </div>
               <button className="shimmer-btn" onClick={() => navigate('/home-choice')} style={{ padding: '1.25rem 2.5rem' }}>ENTER FIRST ARENA</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
