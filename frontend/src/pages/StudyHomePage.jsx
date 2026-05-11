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
            count: `${c.quiz_count || 0} Quizzes` 
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '140px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(45, 212, 191, 0.05) 0%, transparent 40%)', zIndex: 0, pointerEvents: 'none' }}></div>
      
      <div className="container" style={{ paddingTop: '7rem', position: 'relative', zIndex: 10 }}>
        
        {/* Website Section Header */}
        <div className="animate-slide-up" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
             <div className="flex-center" style={{ width: '36px', height: '36px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '1rem', boxShadow: '0 6px 12px rgba(59, 130, 246, 0.08)' }}>
                <GraduationCap size={20} strokeWidth={2.5} />
             </div>
             <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#3b82f6', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Academic Sector</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 950, marginBottom: '1rem', fontFamily: 'Lexend', color: '#0f172a', letterSpacing: '-0.05em', lineHeight: 1.05 }}>
            Academic <span className="text-gradient">Empire.</span>
          </h1>
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.2rem', maxWidth: '650px', opacity: 0.9, lineHeight: 1.5 }}>Master competitive domains with high-fidelity simulated environments and expert analytics.</p>
        </div>

        {/* Search Bar */}
        <div className="animate-slide-up stagger-1" style={{ marginBottom: '4rem', maxWidth: '850px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={24} style={{ position: 'absolute', left: '1.75rem', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6', opacity: 0.7, zIndex: 1 }} />
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
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#0f172a',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                fontWeight: 600
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Featured Card */}
        <div className="glass-card animate-slide-up stagger-2" style={{ 
          padding: 'clamp(1.5rem, 5vw, 3.5rem)', 
          marginBottom: 'clamp(3rem, 8vw, 4.5rem)', 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, white 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(2rem, 5vw, 3rem)',
          border: '1px solid #e2e8f0',
          borderRadius: '2.5rem',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)'
        }}>
          <div style={{ flex: 1, minWidth: 'min(300px, 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}></div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#3b82f6' }}>Prime Intel Arena</span>
            </div>
            <h3 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 950, fontFamily: 'Lexend', marginBottom: '0.75rem', color: '#0f172a', letterSpacing: '-0.04em' }}>Current Affairs 2024</h3>
            <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', color: '#64748b', fontWeight: 600, marginBottom: '2rem', opacity: 0.9 }}>15 Top Tier Questions • 10 Mins • Elite Status Boost</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
               <div style={{ background: '#f1f5f9', padding: '6px 14px', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 950, color: '#0f172a', border: '1px solid #e2e8f0' }}>#DailyPulse</div>
               <div style={{ background: '#f1f5f9', padding: '6px 14px', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 950, color: '#0f172a', border: '1px solid #e2e8f0' }}>#VerifiedMock</div>
            </div>
          </div>
          <button 
            className="quiz-join-btn blue" 
            style={{ padding: '1.25rem 2.5rem', fontSize: '1rem', width: 'fit-content', border: 'none' }} 
            onClick={() => navigate('/study-quiz-detail/daily')}
          >
            <span>Initiate Mastery</span>
            <ArrowRight size={22} strokeWidth={3} style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
           <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 950, fontFamily: 'Lexend', letterSpacing: '-0.03em', whiteSpace: 'nowrap', color: '#0f172a' }}>Curated <span className="text-gradient">Specializations</span></h2>
           <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, #e2e8f0, transparent)' }}></div>
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
            <div className="glass-card flex-center" style={{ gridColumn: '1/-1', padding: '6rem', flexDirection: 'column', gap: '1.5rem', background: 'white' }}>
               <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748b', opacity: 0.7 }}>Sector "{searchTerm}" not found in current rotation</p>
               <button className="resend-action-premium" onClick={() => setSearchTerm('')} style={{ padding: '1rem 2rem' }}>RESET SEARCH FILTER</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyHomePage;
