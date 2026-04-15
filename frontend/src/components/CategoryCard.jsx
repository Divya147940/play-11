import React from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div 
      className="glass-premium flex-center" 
      style={{ 
        padding: '2rem', 
        cursor: 'pointer',
        flexDirection: 'column',
        gap: '1.25rem',
        minWidth: '160px',
        textAlign: 'center',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onClick}
    >
      <div className="flex-center" style={{ 
        width: '72px', 
        height: '72px', 
        borderRadius: '1.75rem', 
        background: 'white',
        boxShadow: '0 10px 20px -5px hsla(var(--primary), 0.15)',
        color: 'hsl(var(--primary))',
        border: '1px solid rgba(0,0,0,0.03)'
      }}>
        {React.cloneElement(category.icon, { size: 32, strokeWidth: 2 })}
      </div>
      <div>
        <p style={{ fontWeight: 950, fontSize: '1.2rem', fontFamily: 'Lexend', marginBottom: '0.4rem', color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>{category.name}</p>
        <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.6 }}>{category.count || '0'} Specialized</p>
      </div>
    </div>
  );
};

export default CategoryCard;
