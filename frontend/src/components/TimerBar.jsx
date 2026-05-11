import React from 'react';
import { Clock } from 'lucide-react';

const TimerBar = ({ timeLeft, totalTime, formatTime }) => {
  const progress = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft < 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          background: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          padding: '0.6rem 1.25rem',
          borderRadius: '1.25rem',
          color: isUrgent ? '#ef4444' : 'white',
          fontWeight: 800,
          fontFamily: 'Lexend',
          border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
          boxShadow: isUrgent ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <Clock size={20} strokeWidth={2.5} /> {formatTime(timeLeft)}
        </div>
        
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          color: isUrgent ? '#ef4444' : 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {isUrgent ? 'Closing Soon' : 'Arena Clock Active'}
        </div>
      </div>

      <div className="liquid-progress" style={{ height: '6px' }}>
        <div 
          className="liquid-progress-fill" 
          style={{ 
            width: `${progress}%`,
            background: isUrgent ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))'
          }}
        ></div>
      </div>
    </div>
  );
};

export default TimerBar;
