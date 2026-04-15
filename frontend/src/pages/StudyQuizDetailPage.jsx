import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, AlertCircle, PlayCircle } from 'lucide-react';

const StudyQuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuiz(data.quiz);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Arena...</div>;
  }

  if (!quiz) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Arena not found</div>;
  }

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div className="container" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <button onClick={() => navigate(-1)} className="flex-center" style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '0.75rem', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--card-border))' }}>
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>Arena Entry</h1>
        </div>

        <div className="bento-card animate-elite" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'white', border: '1px solid hsl(var(--card-border))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
             <div style={{ width: '8px', height: '24px', background: 'hsl(var(--primary))', borderRadius: '4px' }}></div>
             <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{quiz.description || 'Examination'}</span>
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', fontFamily: 'Lexend', lineHeight: '1.2', color: 'hsl(var(--foreground))' }}>{quiz.title}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '1.25rem 0.75rem', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--card-border))', borderRadius: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Items</p>
              <p style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{quiz.total_questions}</p>
            </div>
            <div style={{ padding: '1.25rem 0.75rem', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--card-border))', borderRadius: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Time</p>
              <p style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{quiz.timer_minutes}m</p>
            </div>
            <div style={{ padding: '1.25rem 0.75rem', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--card-border))', borderRadius: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Points</p>
              <p style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>{quiz.total_questions * 2}</p>
            </div>
          </div>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>
              <Info size={18} color="hsl(var(--primary))" /> Arena Rules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {[
                 'Each question has 4 options. Only one is correct.',
                 '+2 marks for every correct answer.',
                 '-0.5 marks for every negative response.',
                 'The arena will auto-submit when the timer ends.'
               ].map((rule, i) => (
                 <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '6px', minWidth: '6px', height: '6px', background: 'hsl(var(--primary))', borderRadius: '50%' }}></div>
                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500, lineHeight: '1.4' }}>{rule}</p>
                 </div>
               ))}
            </div>
          </section>

          <div style={{ padding: '1.25rem', background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.1)', borderRadius: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
              <AlertCircle size={16} /> 1 Attempt Remaining Today
            </p>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingBottom: '3rem' }}>
          <button 
            className="btn-elite btn-elite-primary" 
            style={{ width: '100%', height: '72px', fontSize: '1.25rem' }}
            onClick={() => navigate(`/study-quiz-play/${id}`)}
          >
            Enter Arena <PlayCircle size={24} style={{ marginLeft: '0.75rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyQuizDetailPage;
