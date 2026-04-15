import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter, Search, ArrowLeft, BookOpen } from 'lucide-react';
import QuizCard from '../components/QuizCard';

const StudyCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryName = id?.toUpperCase() || 'Category';

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quizzes/category/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const mappedQuizzes = data.quizzes.map(q => ({
            id: q.id,
            title: q.title,
            subject: 'General',
            questions: q.total_questions,
            time: q.timer_minutes,
            status: q.reward_text ? 'premium' : 'free',
            difficulty: 'Medium'
          }));
          setQuizzes(mappedQuizzes);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '5rem' }}>
        
        {/* Website Style Header */}
        <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
          <button 
            onClick={() => navigate('/study-home')} 
            className="flex-center glass-card" 
            style={{ width: '60px', height: '60px', borderRadius: '1.75rem', color: 'hsl(var(--foreground))' }}
          >
            <ArrowLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
               <BookOpen size={16} color="hsl(var(--primary))" />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'hsl(var(--primary))', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Available Mocks</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'hsl(var(--foreground))', fontWeight: 950, letterSpacing: '-0.03em' }}>
              {categoryName} <span className="text-gradient">Arena.</span>
            </h1>
          </div>
        </div>

        {/* Website Style Filters */}
        <div className="animate-slide-up stagger-1" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '3.5rem', paddingBottom: '0.5rem' }}>
          {['All Subjects', 'Recent Mocks', 'High Impact', 'Beginner Friendly'].map((filter, idx) => (
            <button 
              key={filter}
              style={{ 
                padding: '0.85rem 1.75rem', 
                borderRadius: '1.25rem', 
                background: idx === 0 
                  ? 'hsl(var(--primary))' 
                  : 'white',
                color: idx === 0 ? 'white' : 'hsl(var(--muted-foreground))',
                border: idx === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
                fontSize: '0.9rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: idx === 0 ? '0 10px 20px -5px hsla(var(--primary), 0.3)' : 'none',
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Quiz List in Bento Vertical Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
          {loading ? (
            <div className="flex-center" style={{ padding: '5rem' }}>
               <div style={{ width: '40px', height: '40px', border: '4px solid hsl(var(--muted))', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : quizzes.length > 0 ? (
            quizzes.map((quiz, idx) => (
              <div key={quiz.id} className={`animate-slide-up stagger-${(idx % 3) + 1}`}>
                <QuizCard 
                  quiz={quiz} 
                  onClick={() => navigate(`/study-quiz-detail/${quiz.id}`)} 
                />
              </div>
            ))
          ) : (
            <div className="glass-card flex-center" style={{ padding: '4rem', textAlign: 'center' }}>
               <p style={{ fontWeight: 800, color: 'hsl(var(--muted-foreground))' }}>No academic mocks available for this selection yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyCategoryPage;
