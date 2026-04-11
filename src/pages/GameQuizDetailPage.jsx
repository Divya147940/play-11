import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Zap, TrendingUp, DollarSign } from 'lucide-react';

const GameQuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMatch(data.match);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Match Data...</div>;
  if (!match) return <div style={{ padding: '2rem', textAlign: 'center' }}>Match not found</div>;

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div className="container" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <button onClick={() => navigate(-1)} className="flex-center" style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '0.75rem', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--card-border))' }}>
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>Contest Arena</h1>
        </div>

        {/* Match Heading - Pro Style */}
        <div className="bento-card animate-elite" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.05), white)', border: '1px solid hsl(var(--card-border))' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'hsl(var(--primary))', borderRadius: '50%', boxShadow: '0 10px 20px hsl(var(--primary) / 0.2)', color: 'white' }} className="flex-center">
                 <span style={{ fontWeight: 900 }}>{match.team_a}</span>
              </div>
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'hsl(var(--card-border))', fontFamily: 'Lexend' }}>VS</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#fbbf24', borderRadius: '50%', boxShadow: '0 10px 20px rgba(251, 191, 36, 0.2)', color: 'white' }} className="flex-center">
                 <span style={{ fontWeight: 900 }}>{match.team_b}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Outfit', color: 'hsl(var(--foreground))' }}>{match.sport_type} • {match.venue}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', padding: '6px 14px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '2rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
             <div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
             <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{match.status}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="bento-card" style={{ padding: '1.25rem', background: 'white', border: '1px solid hsl(var(--card-border))' }}>
            <p style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reward Pool</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, color: '#10b981', fontSize: '1.4rem' }}>
              <TrendingUp size={20} /> ₹50,000
            </div>
          </div>
          <div className="bento-card" style={{ padding: '1.25rem', background: 'white', border: '1px solid hsl(var(--card-border))' }}>
            <p style={{ fontSize: '0.65rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Spots</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>
              <Zap size={20} color="hsl(var(--secondary))" /> 5,000
            </div>
          </div>
        </div>

        {/* Scoring Rules Section */}
        <section className="bento-card animate-elite" style={{ padding: '2rem', flex: 1, background: 'white', border: '1px solid hsl(var(--card-border))' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>
            <Info size={18} color="hsl(var(--secondary))" /> Scoring Matrix
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Winner Predict', pts: '50' },
              { label: 'Top Batsman', pts: '100' },
              { label: 'Top Bowler', pts: '100' },
              { label: 'Captain Bonus', pts: '2.0x' },
              { label: 'Vice-Captain', pts: '1.5x' }
            ].map((rule, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '4px', height: '16px', background: 'hsl(var(--secondary))', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.95rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{rule.label}</span>
                 </div>
                 <span style={{ fontWeight: 900, color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>{rule.pts}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action Button */}
        <div style={{ padding: '2.5rem 0' }}>
          <button 
            className="btn-elite btn-elite-primary" 
            style={{ width: '100%', height: '72px', fontSize: '1.25rem', background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))', boxShadow: '0 20px 40px -10px hsl(var(--secondary) / 0.3)' }}
            onClick={() => navigate(`/game-quiz-play/${id}`)}
          >
            Predict Hub Entrance <Zap size={24} style={{ marginLeft: '0.75rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameQuizDetailPage;
