import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, SquareCheckBig, SquareSlash } from 'lucide-react';

const StudyReviewPage = () => {
  const navigate = useNavigate();
  // We'll mock the state for now, but in a real app this would come from the QuestionPage state/context
  const answered = 4;
  const total = 5;

  return (
    <div className="container" style={{ padding: '1.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="flex-center" style={{ color: 'hsl(var(--foreground))', background: 'none', border: 'none' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>Review Submission</h1>
      </div>

      <div className="glass-card animate-fade" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'white', border: '1px solid hsl(var(--card-border))' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <SquareCheckBig color="#10b981" size={24} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'hsl(var(--foreground))' }}>{answered}</p>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>Answered</p>
          </div>
          <div style={{ flex: 1, padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '1rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
            <SquareSlash color="#ef4444" size={24} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'hsl(var(--foreground))' }}>{total - answered}</p>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>Pending</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 800, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>Question Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
          {[1, 2, 3, 4, 5].map(q => (
            <div 
              key={q}
              className="flex-center"
              style={{
                width: '100%',
                aspectRatio: '1',
                background: q <= answered ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                borderRadius: '0.75rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: q <= answered ? 'white' : 'hsl(var(--muted-foreground))',
                border: q <= answered ? 'none' : '1px solid hsl(var(--card-border))',
                cursor: 'pointer'
              }}
              onClick={() => navigate(-1)}
            >
              {q}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
          By clicking submit, your final score will be calculated and cannot be changed.
        </p>
        <button 
          className="btn-elite btn-elite-primary" 
          style={{ height: '64px', fontSize: '1.1rem', width: '100%' }}
          onClick={() => navigate('/study-result/mock')}
        >
          <Send size={24} style={{ marginRight: '0.75rem' }} /> Final Submit
        </button>
      </div>
    </div>
  );
};

export default StudyReviewPage;
