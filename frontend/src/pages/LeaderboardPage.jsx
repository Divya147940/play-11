import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Medal, Star, ChevronRight, Users } from 'lucide-react';

const LeaderboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quizzes/${id}/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeaders(data.leaderboard);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}><div className="auth-spinner"></div></div>;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '5rem' }}>
        
        {/* Header Section */}
        <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="flex-center glass-card" 
            style={{ width: '60px', height: '60px', borderRadius: '1.75rem', color: 'hsl(var(--foreground))' }}
          >
            <ArrowLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
               <Trophy size={16} color="#fbbf24" fill="#fbbf24" />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Elite Honor Roll</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'hsl(var(--foreground))', fontWeight: 950, letterSpacing: '-0.03em' }}>
              Arena <span className="text-gradient">Champions.</span>
            </h1>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'clamp(1rem, 4vw, 3rem)', marginBottom: '5rem', padding: '2rem 0' }}>
           {/* 2nd Place */}
           {leaders[1] && (
             <div className="animate-slide-up stagger-2" style={{ textAlign: 'center', flex: 1, maxWidth: '200px' }}>
                <div style={{ position: 'relative', width: 'clamp(80px, 15vw, 120px)', height: 'clamp(80px, 15vw, 120px)', margin: '0 auto 1.5rem' }}>
                   <div style={{ width: '100%', height: '100%', borderRadius: '2rem', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 950 }}>{leaders[1].name?.charAt(0) || '2'}</span>
                   </div>
                   <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '40px', height: '40px', background: '#94a3b8', borderRadius: '50%', color: 'white', fontWeight: 900, border: '4px solid white' }} className="flex-center">2</div>
                </div>
                <p style={{ fontWeight: 850, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{leaders[1].name || 'Anonymous'}</p>
                <p style={{ color: 'hsl(var(--primary))', fontWeight: 900 }}>{leaders[1].total_score} pts</p>
             </div>
           )}

           {/* 1st Place */}
           {leaders[0] && (
             <div className="animate-slide-up stagger-1" style={{ textAlign: 'center', flex: 1.2, maxWidth: '240px' }}>
                <div style={{ position: 'relative', width: 'clamp(100px, 20vw, 160px)', height: 'clamp(100px, 20vw, 160px)', margin: '0 auto 2rem' }}>
                   <div style={{ width: '100%', height: '100%', borderRadius: '3rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '8px solid white', boxShadow: '0 25px 60px -10px rgba(245, 158, 11, 0.4)' }}>
                      <Trophy size={48} color="white" fill="white" />
                   </div>
                   <div style={{ position: 'absolute', bottom: '-15px', right: '-5px', width: '56px', height: '56px', background: '#fbbf24', borderRadius: '50%', color: 'white', fontWeight: 950, border: '5px solid white', fontSize: '1.25rem' }} className="flex-center">1</div>
                </div>
                <p style={{ fontWeight: 950, fontSize: '1.4rem', marginBottom: '0.4rem' }}>{leaders[0].name || 'Anonymous'}</p>
                <p style={{ color: 'hsl(var(--primary))', fontWeight: 950, fontSize: '1.2rem' }}>{leaders[0].total_score} pts</p>
             </div>
           )}

           {/* 3rd Place */}
           {leaders[2] && (
             <div className="animate-slide-up stagger-3" style={{ textAlign: 'center', flex: 1, maxWidth: '200px' }}>
                <div style={{ position: 'relative', width: 'clamp(80px, 15vw, 120px)', height: 'clamp(80px, 15vw, 120px)', margin: '0 auto 1.5rem' }}>
                   <div style={{ width: '100%', height: '100%', borderRadius: '2rem', background: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 950 }}>{leaders[2].name?.charAt(0) || '3'}</span>
                   </div>
                   <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '40px', height: '40px', background: '#d97706', borderRadius: '50%', color: 'white', fontWeight: 900, border: '4px solid white' }} className="flex-center">3</div>
                </div>
                <p style={{ fontWeight: 850, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{leaders[2].name || 'Anonymous'}</p>
                <p style={{ color: 'hsl(var(--primary))', fontWeight: 900 }}>{leaders[2].total_score} pts</p>
             </div>
           )}
        </div>

        {/* List View for others */}
        <div className="glass-premium animate-slide-up stagger-3" style={{ padding: '1rem', borderRadius: '2.5rem' }}>
           {leaders.length > 3 ? leaders.slice(3).map((player, idx) => (
             <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem', borderBottom: idx < leaders.length - 4 ? '1px solid rgba(0,0,0,0.03)' : 'none' }}>
                <span style={{ width: '40px', fontSize: '1.1rem', fontWeight: 950, color: 'hsl(var(--muted-foreground))' }}>#{idx + 4}</span>
                <div style={{ width: '48px', height: '48px', borderRadius: '1.25rem', background: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>
                   {player.name?.charAt(0) || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                   <p style={{ fontWeight: 850, fontSize: '1.1rem' }}>{player.name || 'Anonymous Navigator'}</p>
                   <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>{player.mobile ? `+91 ${player.mobile.slice(0,2)}***${player.mobile.slice(-2)}` : 'Verified Player'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontWeight: 950, fontSize: '1.2rem', color: 'hsl(var(--primary))' }}>{player.total_score}</p>
                   <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Arena Pts</p>
                </div>
             </div>
           )) : (
             <div className="flex-center" style={{ padding: '6rem', flexDirection: 'column', gap: '1.5rem', opacity: 0.5 }}>
                <Medal size={48} strokeWidth={1.5} />
                <p style={{ fontWeight: 800 }}>No other contestants ranked yet.</p>
             </div>
           )}
        </div>

        <button 
          className="shimmer-btn" 
          style={{ width: '100%', height: '74px', marginTop: '4rem', fontSize: '1.2rem' }}
          onClick={() => navigate('/home-choice')}
        >
          Return to Hub Command
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
