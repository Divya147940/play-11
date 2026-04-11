import React from 'react';
import { FileText, Clock, Lock, Unlock, ChevronRight } from 'lucide-react';

const QuizCard = ({ quiz, onClick }) => {
  const difficultyColor = quiz.difficulty === 'Hard' ? '#ef4444' : (quiz.difficulty === 'Easy' ? '#10b981' : '#eab308');
  const isLocked = quiz.status === 'locked';

  return (
    <div 
      className="bento-card animate-elite"
      style={{ 
        padding: '1.5rem',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.7 : 1,
        background: 'white'
      }}
      onClick={!isLocked ? onClick : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '4px 10px', 
              borderRadius: '2rem', 
              background: 'hsl(var(--muted))',
              color: 'hsl(var(--primary))',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: '1px solid hsl(var(--card-border))'
            }}>
              {quiz.subject}
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '4px 10px', 
              borderRadius: '2rem', 
              background: `${difficultyColor}10`,
              color: difficultyColor,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {quiz.difficulty}
            </span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Lexend', lineHeight: '1.3', color: 'hsl(var(--foreground))' }}>{quiz.title}</h3>
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: isLocked ? 'hsl(var(--muted))' : 'hsl(var(--primary) / 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isLocked ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))'
        }}>
          {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
          <FileText size={16} color="hsl(var(--primary))" /> {quiz.questions} Questions
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
          <Clock size={16} color="hsl(var(--secondary))" /> {quiz.time} Mins
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLocked ? '#94a3b8' : '#10b981' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))' }}>{isLocked ? 'LOCKED CONTENT' : 'ENROLLMENT OPEN'}</span>
        </div>
        <button 
          className={`btn-elite ${isLocked ? '' : 'btn-elite-primary'}`} 
          style={{ padding: '0.75rem 1.5rem', borderRadius: '1rem', height: 'auto', fontSize: '0.8rem', background: isLocked ? 'hsl(var(--muted))' : undefined, color: isLocked ? 'hsl(var(--muted-foreground))' : undefined }}
          disabled={isLocked}
        >
          {isLocked ? 'Get Access' : 'Start Arena'} <ChevronRight size={16} style={{ marginLeft: '0.4rem' }} />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
