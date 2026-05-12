import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Trophy, Clock, CheckCircle2, 
  XCircle, ArrowLeft, History as HistoryIcon,
  Calendar, Award, Target, Filter, RefreshCw
} from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHistory = () => {
    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    if (!sessionRaw) return setLoading(false);
    
    let token = '';
    try {
      const parsed = JSON.parse(sessionRaw);
      token = parsed.token || (typeof sessionRaw === 'string' ? sessionRaw : '');
    } catch (e) {
      token = sessionRaw;
    }
    
    setLoading(true);
    let url = `/api/auth/history?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error || 'Failed to fetch history') });
        }
        return res.json();
      })
      .then(data => {
        console.log('[HistoryPage] Received Data:', data);
        if (data.success) {
          const formatted = data.history
            .filter(h => h.title) // Strictly hide orphaned data
            .map(h => {
              const subDate = h.submitted_at ? new Date(h.submitted_at) : null;
              const isValidDate = subDate && !isNaN(subDate.getTime());
              
              return {
                id: h.id,
                title: h.title,
                zoneId: h.zone_id,
                type: h.zone_id === 'study-zone' ? 'Study' : 'Game',
                date: isValidDate 
                  ? subDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'N/A',
                rawDate: h.submitted_at,
                score: h.total_score || 0,
                rank: h.rank || '-',
                won: h.won_amount && h.won_amount > 0 ? `₹${h.won_amount}` : '-',
                winnerId: h.winner_id,
                winnerName: h.winner_name,
                userId: h.user_id
              };
            });
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
    if (filter === 'Practice') return h.type === 'Study';
    if (filter === 'Match') return h.type === 'Game';
    if (filter === 'Study Zone') return h.zoneId === 'study-zone';
    if (filter === 'Movie Zone') return h.zoneId === 'movie-zone';
    if (filter === 'Sport Zone') return h.zoneId === 'sport-zone';
    if (filter === 'News Zone') return h.zoneId === 'news-zone';
    return false;
  });

  return (
    <div className="history-page-root" style={{ 
      minHeight: '100vh', 
      paddingBottom: '8rem',
      background: 'linear-gradient(to bottom, #f8fafc, #ffffff)'
    }}>
      <div className="container" style={{ paddingTop: '6rem' }}>
        
        {/* Modern Header Section */}
        <div className="animate-fade-in" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => navigate('/profile')} 
              style={{ 
                width: '48px', height: '48px', borderRadius: '16px', 
                background: 'white', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(-4px)'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="glass-premium" style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Performance History</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 950, letterSpacing: '-0.04em', color: '#0f172a', lineHeight: 1 }}>
                My Activity.
              </h1>
              <p style={{ marginTop: '0.75rem', fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>
                Tracking your progress across <span style={{ fontWeight: 800, color: '#0f172a' }}>{filteredHistory.length}</span> {filter !== 'All' ? filter.toLowerCase() : ''} quiz sessions.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={fetchHistory}
                className="hover-lift"
                style={{ 
                  background: 'white', border: '1px solid #e2e8f0', color: '#0f172a',
                  padding: '12px 20px', borderRadius: '14px', fontSize: '0.9rem', 
                  fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Global Stats Summary */}
        <div className="animate-slide-up" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3.5rem'
        }}>
          {[
            { label: 'Total Quizzes', value: filteredHistory.length, icon: <Target size={24} />, color: '#3b82f6' },
            { label: 'Highest Score', value: Math.max(...filteredHistory.map(h => parseFloat(h.score) || 0), 0), icon: <Award size={24} />, color: '#f59e0b' },
            { label: 'Total Winnings', value: `₹${filteredHistory.reduce((sum, h) => sum + (parseFloat(String(h.won).replace('₹', '').replace(',', '')) || 0), 0).toLocaleString()}`, icon: <Trophy size={24} />, color: '#10b981' }
          ].map((stat, i) => (
            <div key={i} className="glass-premium" style={{ 
              padding: '2rem', borderRadius: '24px', background: 'white', border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)'
            }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '18px', 
                background: `${stat.color}10`, color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
          <div className="glass-premium" style={{ display: 'flex', padding: '6px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '4px' }}>
            {['All', 'Study Zone', 'Movie Zone', 'Sport Zone', 'News Zone', 'Practice', 'Match'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800,
                  background: filter === f ? '#0f172a' : 'transparent',
                  color: filter === f ? 'white' : '#64748b',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {f === 'All' ? 'All Rooms' : f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '14px' }}>
              <Calendar size={18} color="#94a3b8" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}
              />
              <span style={{ color: '#e2e8f0', fontWeight: 900 }}>—</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}
              />
              {(startDate || endDate) && (
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', marginLeft: '0.5rem' }}
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '8rem 0' }}>
            <RefreshCw size={48} className="animate-spin" color="#3b82f6" style={{ opacity: 0.3 }} />
            <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontWeight: 600 }}>Analyzing history records...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            {filteredHistory.map((item, idx) => (
              <div 
                key={item.id} 
                className="animate-slide-up" 
                style={{ 
                  animationDelay: `${idx * 0.05}s`,
                  background: 'white',
                  borderRadius: '32px',
                  border: '1px solid #e2e8f0',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 30px 60px -20px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.03)'; }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span style={{ 
                        fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
                        padding: '6px 14px', borderRadius: '10px',
                        background: item.type === 'Study' ? '#3b82f615' : '#8b5cf615',
                        color: item.type === 'Study' ? '#3b82f6' : '#8b5cf6',
                        border: `1px solid ${item.type === 'Study' ? '#3b82f620' : '#8b5cf620'}`
                      }}>
                        {item.type === 'Study' ? 'Practice' : 'Tournament'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{item.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {item.title}
                    </h3>
                  </div>
                  
                  {item.winnerId ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                       <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#10b981', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>RESULT DECLARED</span>
                       {item.won !== '-' && (
                          <div style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)', 
                            color: 'white', padding: '10px 18px', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)'
                          }}>
                            <Trophy size={16} fill="currentColor" /> {item.won}
                          </div>
                       )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#f59e0b', background: '#fef3c7', padding: '4px 8px', borderRadius: '6px' }}>AWAITING RESULT</span>
                  )}
                </div>

                {item.winnerId && (
                  <div style={{ marginTop: '-1rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Tournament Winner:</span>
                     <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>{item.winnerId === item.userId ? '🎉 YOU WON!' : item.winnerName}</span>
                  </div>
                )}

                {/* Score and Rank stats */}
                <div style={{ 
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', 
                  padding: '1.5rem', borderRadius: '24px', background: '#f8fafc', border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.02)' }}>
                      <Target size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{item.score}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.02)' }}>
                      <Trophy size={20} color="#f59e0b" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>#{item.rank}</p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button 
                  onClick={() => navigate(`/quiz-review/${item.id}`)}
                  style={{ 
                    width: '100%', padding: '16px', borderRadius: '18px', 
                    background: '#0f172a', color: 'white', border: 'none',
                    fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    transition: 'all 0.2s', boxShadow: '0 8px 20px -8px rgba(15, 23, 42, 0.4)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#0f172a'; }}
                >
                  <CheckCircle2 size={18} />
                  Review Performance
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-premium" style={{ textAlign: 'center', padding: '100px 40px', borderRadius: '40px', background: 'white', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '30px', background: '#f8fafc', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HistoryIcon size={40} color="#cbd5e1" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>No Activity Found</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 32px' }}>
              It looks like you haven't played any quizzes in this period yet. Time to test your knowledge!
            </p>
            <button 
              onClick={() => navigate('/home-choice')}
              style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '16px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Start Your First Quiz →
            </button>
          </div>
        )}
      </div>

      <style>{`
        .history-page-root {
          font-family: 'Lexend', sans-serif;
        }
        .container {
          max-width: 1300px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-lift {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          h1 { font-size: 2.2rem !important; }
          .container { padding-top: 4rem !important; }
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
