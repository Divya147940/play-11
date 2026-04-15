import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, Building2, Zap, LandPlot, Shield, Sparkles, ArrowRight } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';

const getIconForCategory = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes('ssc') || norm.includes('teaching')) return <GraduationCap size={28} />;
  if (norm.includes('upsc') || norm.includes('govt')) return <Building2 size={28} />;
  if (norm.includes('bank')) return <Zap size={28} />;
  if (norm.includes('rail')) return <LandPlot size={28} />;
  if (norm.includes('def') || norm.includes('police')) return <Shield size={28} />;
  return <GraduationCap size={28} />; // default
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
            count: '150+' 
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
    <div style={{ minHeight: '100vh', paddingBottom: '140px' }}>
      <div className="container" style={{ paddingTop: '6.5rem' }}>
        
        {/* Website Section Header */}
        <div className="animate-slide-up" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
             <div className="flex-center" style={{ width: '36px', height: '36px', background: 'hsla(var(--primary), 0.12)', color: 'hsl(var(--primary))', borderRadius: '1rem', boxShadow: '0 6px 12px hsla(var(--primary), 0.15)' }}>
                <GraduationCap size={20} strokeWidth={2.5} />
             </div>
             <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--primary))', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Academic Sector</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 950, marginBottom: '1rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))', letterSpacing: '-0.05em', lineHeight: 1.05 }}>
            Academic <span className="text-gradient">Empire.</span>
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '1.2rem', maxWidth: '650px', opacity: 0.9, lineHeight: 1.5 }}>Master competitive domains with high-fidelity simulated environments and expert analytics.</p>
        </div>

        <div className="animate-slide-up stagger-1" style={{ marginBottom: '4rem', maxWidth: '850px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={24} style={{ position: 'absolute', left: '1.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--primary))', opacity: 0.7, zIndex: 1 }} />
            <input 
              type="text" 
              className="morphism-input" 
              placeholder="Search specialized sectors (e.g. UPSC, SSC CGL...)" 
              style={{ 
                width: '100%', 
                height: '80px', 
                paddingLeft: '4.5rem', 
                fontSize: '1.2rem',
                borderRadius: '1.75rem',
                border: '1px solid rgba(0,0,0,0.04)',
                background: 'rgba(255,255,255,0.8)'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

          {/* Featured Card - High Fidelity Glass */}
        <div className="glass-premium animate-slide-up stagger-2" style={{ 
          padding: 'clamp(1.5rem, 5vw, 3.5rem)', 
          marginBottom: 'clamp(3rem, 8vw, 4.5rem)', 
          background: 'linear-gradient(135deg, hsla(var(--primary), 0.12) 0%, rgba(255,255,255,0.4) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(2rem, 5vw, 3rem)',
          border: '2px solid hsla(var(--primary), 0.2)'
        }}>
          <div style={{ flex: 1, minWidth: 'min(300px, 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '10px', height: '10px', background: 'hsl(var(--primary))', borderRadius: '50%', boxShadow: '0 0 15px hsla(var(--primary), 0.6)' }}></div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'hsl(var(--primary))' }}>Prime Intel Arena</span>
            </div>
            <h3 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 950, fontFamily: 'Lexend', marginBottom: '0.75rem', color: 'hsl(var(--foreground))', letterSpacing: '-0.04em' }}>Current Affairs 2024</h3>
            <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', color: 'hsl(var(--muted-foreground))', fontWeight: 600, marginBottom: '2rem', opacity: 0.9 }}>15 Top Tier Questions • 10 Mins • Elite Status Boost</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
               <div style={{ background: 'white', padding: '6px 14px', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 950, color: 'hsl(var(--foreground))', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>#DailyPulse</div>
               <div style={{ background: 'white', padding: '6px 14px', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 950, color: 'hsl(var(--foreground))', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>#VerifiedMock</div>
            </div>
          </div>
          <button 
            className="shimmer-btn" 
            style={{ padding: '1.25rem 2.5rem', fontSize: '1rem', width: 'fit-content' }} 
            onClick={() => navigate('/study-quiz-detail/daily')}
          >
            <span>Initiate Mastery</span>
            <ArrowRight size={22} strokeWidth={3} />
          </button>
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
           <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 950, fontFamily: 'Lexend', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>Curated <span className="text-gradient">Specializations</span></h2>
           <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, hsla(var(--primary), 0.15), transparent)' }}></div>
        </div>

        {/* Category Grid */}
        <div className="bento-grid">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, idx) => (
              <div key={cat.id} className={`animate-slide-up stagger-${(idx % 3) + 1}`}>
                <CategoryCard 
                  category={cat} 
                  onClick={() => navigate(`/study-category/${cat.id}`)} 
                />
              </div>
            ))
          ) : (
            <div className="glass-premium flex-center" style={{ gridColumn: '1/-1', padding: '6rem', flexDirection: 'column', gap: '1.5rem' }}>
               <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', opacity: 0.7 }}>Sector "{searchTerm}" not found in current rotation</p>
               <button className="resend-action-premium" onClick={() => setSearchTerm('')} style={{ padding: '1rem 2rem' }}>RESET SEARCH FILTER</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyHomePage;
