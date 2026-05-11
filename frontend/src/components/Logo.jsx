import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = ({ size = 'medium' }) => {
  const navigate = useNavigate();
  
  const sizeMap = {
    small: { box: '32px', font: '14px', gap: '4px' },
    medium: { box: '40px', font: '18px', gap: '6px' },
    large: { box: '52px', font: '24px', gap: '8px' }
  };

  const config = sizeMap[size] || sizeMap.medium;

  return (
    <div 
      className="logo-boxes" 
      onClick={() => navigate('/')} 
      style={{ 
        cursor: 'pointer', 
        display: 'flex', 
        gap: config.gap,
        justifyContent: 'center'
      }}
    >
      {['Q', 'U', 'Z', 'O'].map((letter, i) => (
        <div 
          key={i} 
          className="logo-box"
          style={{
            width: config.box,
            height: config.box,
            fontSize: config.font,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
            color: 'white',
            fontWeight: 900,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)'
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default Logo;
