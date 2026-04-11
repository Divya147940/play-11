import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import QuizCard from '../components/QuizCard';

const StudyCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // We can pass the real name if we had it, but for now just title case the ID or use 'Category'
  const categoryName = id?.toUpperCase() || 'Category';

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quizzes/category/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Map to match frontend expectations
          const mappedQuizzes = data.quizzes.map(q => ({
            id: q.id,
            title: q.title,
            subject: 'General', // Not in DB yet
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
    <div className="container" style={{ padding: '1.5rem', paddingBottom: 'calc(var(--nav-height) + 2rem)', background: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/study-home')} className="flex-center" style={{ color: 'hsl(var(--foreground))', background: 'none', border: 'none' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', color: 'hsl(var(--foreground))' }}>{categoryName} Quizzes</h1>
      </div>

      {/* Filters (Mock) */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        {['All', 'Maths', 'Reasoning', 'English', 'GS', 'Newest'].map(filter => (
          <button 
            key={filter}
            style={{ 
              padding: '0.6rem 1.25rem', 
              borderRadius: '2rem', 
              background: filter === 'All' 
                ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' 
                : 'hsl(var(--muted))',
              color: filter === 'All' ? 'white' : 'hsl(var(--muted-foreground))',
              border: filter === 'All' ? 'none' : '1px solid hsl(var(--card-border))',
              fontSize: '0.875rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: filter === 'All' ? '0 8px 16px -4px rgba(37, 99, 235, 0.3)' : 'none'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Quiz List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>Loading quizzes...</div>
        ) : quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              onClick={() => navigate(`/study-quiz-detail/${quiz.id}`)} 
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>No quizzes available for this category yet.</div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default StudyCategoryPage;
