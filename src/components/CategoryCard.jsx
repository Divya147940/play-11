import React from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div 
      className="bento-card animate-elite" 
      style={{ 
        padding: '1.25rem', 
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1rem',
        minWidth: '100px',
        background: 'white'
      }}
      onClick={onClick}
    >
      <div style={{ 
        width: '56px', 
        height: '56px', 
        borderRadius: '1.25rem', 
        background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1))',
        border: '1px solid hsl(var(--card-border))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'hsl(var(--primary))'
      }}>
        {category.icon}
      </div>
      <div>
        <p style={{ fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Lexend', marginBottom: '0.2rem', color: 'hsl(var(--foreground))' }}>{category.name}</p>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category.count || '0'} Quizzes</p>
      </div>
    </div>
  );
};

export default CategoryCard;
