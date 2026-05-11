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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHistory = () => {
    const token = localStorage.getItem('play11_session');
    if (!token) return setLoading(false);
    
    setLoading(true);
    let url = `/api/auth/history?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
  };

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate]);

  const filteredHistory = filter === 'All' ? history : history.filter(h => {
    if (filter === 'Knowledge') return h.type === 'Study';
    if (filter === 'Tournament') return h.type === 'Game';
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '7rem' }}>
      <div className="container" style={{ paddingTop: '6.5rem' }}>
        
        {/* Header Glass Section */}
        <div className="history-header animate-slide-up" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(1.5rem, 5vw, 2.5rem)', 
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
           <button 
             onClick={() => navigate('/profile')} 
             className="flex-center glass-premium hover-lift" 
             style={{ width: '64px', height: '64px', borderRadius: '1.5rem', color: 'hsl(var(--foreground))', border: '1px solid rgba(0,0,0,0.03)', background: 'white', flexShrink: 0 }}
           >
             <ArrowLeft size={28} strokeWidth={2.5} />
           </button>
           <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                 <HistoryIcon size={18} color="hsl(var(--primary))" strokeWidth={2.5} />
                 <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--primary))', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Performance History</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', fontWeight: 950, letterSpacing: '-0.05em', color: 'hsl(var(--foreground))', lineHeight: 1.1 }}>
                My <span className="text-gradient">Quizzes.</span>
              </h1>
           </div>
        </div>

        {/* Stats Summary Bar */}
        {!loading && (
          <div className="glass-premium animate-slide-up stagger-1" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem', 
            marginBottom: '4rem', 
            padding: '2.5rem', 
            borderRadius: '2.5rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Total Quizzes</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 950, color: '#0f172a' }}>{history.length}</h2>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Highest Score</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 950, color: '#3b82f6' }}>{Math.max(...history.map(h => parseFloat(h.score) || 0), 0)}</h2>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Total Winnings</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 950, color: '#10b981' }}>₹{history.reduce((sum, h) => sum + (parseFloat(h.won.replace('₹', '').replace(',', '')) || 0), 0).toLocaleString()}</h2>
            </div>
          </div>
        )}

        {/* Date Filters & Type Tabs Row */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '4rem', alignItems: 'center' }}>
          {/* Tabs */}
          <div className="glass-premium animate-slide-up stagger-1" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.03)', flex: '1 1 400px' }}>
            {['All', 'Knowledge', 'Tournament'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  flex: 1,
                  padding: '1rem', 
                  borderRadius: '1.25rem', 
                  background: filter === f ? 'hsl(var(--primary))' : 'transparent',
                  color: filter === f ? 'white' : 'hsl(var(--muted-foreground))',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                {f === 'Knowledge' ? 'Practice' : (f === 'Tournament' ? 'Match' : f)}
              </button>
            ))}
          </div>

          {/* Date Picker Range */}
          <div className="animate-slide-up stagger-2" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '0.75rem 1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>FROM</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}
              />
            </div>
            <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>TO</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
              >
                CLEAR
              </button>
            )}
          </div>
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
                        {item.type === 'Study' ? 'Practice' : 'Tournament'} Mode
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700, opacity: 0.7 }}>{item.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'hsl(var(--foreground))', letterSpacing: '-0.04em', lineHeight: '1.15' }}>{item.title}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                    {item.won !== '-' && (
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
                    )}
                    <button 
                      onClick={() => navigate(`/quiz-review/${item.id}`)}
                      style={{ 
                        background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b',
                        padding: '10px 20px', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      <CheckCircle2 size={16} /> Review Answers
                    </button>
                  </div>
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
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
               <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#64748b' }}>No quiz records found for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
