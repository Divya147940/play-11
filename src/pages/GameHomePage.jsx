import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, Star, Zap, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const getIconForGameCategory = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes('ipl')) return { icon: <Zap />, color: '#fbbf24' };
  if (norm.includes('match')) return { icon: <Calendar />, color: '#ef4444' };
  if (norm.includes('player')) return { icon: <Users />, color: '#3b82f6' };
  if (norm.includes('team')) return { icon: <Star />, color: '#10b981' };
  return { icon: <Trophy />, color: '#8b5cf6' };
};

const GameHomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories/game')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const mappedCats = data.categories.map(c => {
            const display = getIconForGameCategory(c.name);
            return {
              id: c.id,
              name: c.name,
              icon: display.icon,
              color: display.color,
              count: 'Available'
            };
          });
          setCategories(mappedCats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '0.5rem', color: 'hsl(var(--foreground))', fontFamily: 'Lexend' }}>Sports Quiz Hub</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>Test your knowledge & win rewards</p>
        </div>

        {/* Featured Banner */}
        <div className="bento-card animate-elite" style={{ 
          padding: '2.5rem', 
          marginBottom: '3rem', 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, white 100%)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-2%', top: '-10%', opacity: 0.1, transform: 'rotate(15deg)' }}>
            <Trophy size={180} color="#fbbf24" />
          </div>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'hsl(var(--foreground))', fontWeight: 800, fontFamily: 'Lexend' }}>IPL 2024 Mega Quiz</h2>
            <p style={{ fontSize: '1rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem', fontWeight: 600 }}>
              Predict match outcomes and player stats to win big points! New matches added daily.
            </p>
            <button className="btn-elite btn-elite-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem', height: 'auto' }} onClick={() => navigate('/match-list')}>
              Join The Arena
            </button>
          </div>
        </div>

        {/* Categories Grid - Responsive Integration */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading sports hubs...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            {categories.map(cat => (
              <div 
                key={cat.id} 
                className="bento-card animate-elite" 
                onClick={() => navigate('/match-list')}
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.25rem',
                  cursor: 'pointer',
                  background: 'white',
                  border: '1px solid hsl(var(--card-border))'
                }}
              >
                <div style={{ 
                  background: cat.color + '10', 
                  color: cat.color,
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {React.cloneElement(cat.icon, { size: 30 })}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'hsl(var(--foreground))', marginBottom: '0.2rem' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{cat.count}</p>
                </div>
                <ChevronRight size={20} color="hsl(var(--card-border))" strokeWidth={3} />
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default GameHomePage;
