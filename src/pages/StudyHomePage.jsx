import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, Building2, Zap, LandPlot, Shield } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import CategoryCard from '../components/CategoryCard';

const getIconForCategory = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes('ssc') || norm.includes('teaching')) return <GraduationCap />;
  if (norm.includes('upsc') || norm.includes('govt')) return <Building2 />;
  if (norm.includes('bank')) return <Zap />;
  if (norm.includes('rail')) return <LandPlot />;
  if (norm.includes('def') || norm.includes('police')) return <Shield />;
  return <GraduationCap />; // default
}

const StudyHomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories/study')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const mappedCats = data.categories.map(c => ({
            id: c.id,
            name: c.name,
            icon: getIconForCategory(c.name),
            count: '150+' // Placeholder for UI
          }));
          setCategories(mappedCats);
        }
      })
      .catch(console.error);
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Header Area */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '0.5rem', fontFamily: 'Lexend', letterSpacing: '-0.02em', color: 'hsl(var(--foreground))' }}>
            Select Your <span style={{ color: 'hsl(var(--primary))' }}>Arena</span>
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '0.9rem' }}>Choose an exam category to begin practicing</p>
        </div>

        {/* Search Bar - Elite Style */}
        <div style={{ marginBottom: '2.5rem', maxWidth: '800px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={22} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--primary))' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search Exam (e.g. SSC, UPSC)" 
              style={{ 
                paddingLeft: '3.5rem', 
                height: '64px', 
                fontSize: '1rem', 
                background: 'hsl(var(--muted))',
                border: '1px solid hsl(var(--card-border))',
                borderRadius: '1.25rem',
                color: 'hsl(var(--foreground))',
                width: '100%'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Daily Featured Quiz - Bolder Elite Design */}
        <div className="bento-card animate-elite" style={{ 
          padding: '2rem', 
          marginBottom: '3rem', 
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, white 100%)',
          border: '1px solid hsl(var(--primary) / 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '200px', height: '200px', background: 'hsl(var(--primary))', filter: 'blur(80px)', opacity: 0.1 }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Zap size={16} fill="currentColor" color="hsl(var(--primary))" />
                  <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 900, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'hsl(var(--primary))'
                  }}>Featured Hot</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Lexend', marginBottom: '0.5rem', color: 'hsl(var(--foreground))' }}>Today's Current Affairs</h3>
              <p style={{ fontSize: '0.95rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>15 Questions • 10 Mins • Free Entry</p>
            </div>
            <button 
              className="btn-elite btn-elite-primary" 
              style={{ width: 'auto', padding: '0.85rem 2rem', height: 'auto', fontSize: '0.9rem' }} 
              onClick={() => navigate('/study-quiz-detail/daily')}
            >
              Enter Now
            </button>
          </div>
        </div>

        {/* Categories Grid - Responsive Grid Integration */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {filteredCategories.map(cat => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              onClick={() => navigate(`/study-category/${cat.id}`)} 
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StudyHomePage;
