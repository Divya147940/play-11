import React from 'react';
import { FileText, Clock, Lock, Unlock, ChevronRight, Award } from 'lucide-react';

const QuizCard = ({ quiz, onClick }) => {
  const difficultyColor = quiz.difficulty === 'Hard' ? '#ef4444' : (quiz.difficulty === 'Easy' ? '#10b981' : '#eab308');
  const isLocked = quiz.status === 'locked';

  return (
    <div 
      className="glass-card"
      style={{ 
        padding: '2rem',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.8 : 1,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onClick={!isLocked ? onClick : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '5px 12px', 
              borderRadius: '2rem', 
              background: 'white',
              color: 'hsl(var(--primary))',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
            }}>
              {quiz.subject}
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '5px 12px', 
              borderRadius: '2rem', 
              background: `${difficultyColor}15`,
              color: difficultyColor,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {quiz.difficulty}
            </span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Lexend', lineHeight: '1.25', color: 'hsl(var(--foreground))' }}>{quiz.title}</h3>
        </div>
        <div className="flex-center" style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '1rem', 
          background: isLocked ? 'rgba(0,0,0,0.03)' : 'hsla(var(--primary), 0.1)',
          color: isLocked ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))',
          boxShadow: isLocked ? 'none' : '0 8px 16px hsla(var(--primary), 0.1)'
        }}>
          {isLocked ? <Lock size={22} /> : <Unlock size={22} />}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>
          <FileText size={18} color="hsl(var(--primary))" /> {quiz.questions} <span style={{opacity: 0.6}}>Qns</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700 }}>
          <Clock size={18} color="hsl(var(--secondary))" /> {quiz.time} <span style={{opacity: 0.6}}>Mins</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLocked ? '#94a3b8' : '#10b981', boxShadow: isLocked ? 'none' : '0 0 10px #10b981' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.02em' }}>{isLocked ? 'LOCKED CONTENT' : 'ARENA OPEN'}</span>
        </div>
        
        <button 
          className="morphism-button" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '1.25rem', 
            fontSize: '0.85rem', 
            height: 'auto',
            background: isLocked ? 'rgba(0,0,0,0.05)' : undefined, 
            color: isLocked ? 'hsl(var(--muted-foreground))' : undefined,
            boxShadow: isLocked ? 'none' : undefined,
            pointerEvents: isLocked ? 'none' : 'auto'
          }}
        >
          {isLocked ? 'Get Access' : 'Enter Arena'} <ChevronRight size={18} style={{ marginLeft: '0.25rem' }} />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
