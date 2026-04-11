import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, Clock, HelpCircle, UserCheck } from 'lucide-react';
import TimerBar from '../components/TimerBar';

const mockGameQuestions = [
  {
    id: 1,
    type: 'winner',
    text: "Who will win the match?",
    options: ["Mumbai Indians", "Chennai Super Kings"],
    points: 50
  },
  {
    id: 2,
    type: 'player',
    text: "Select your Captain (2x points)",
    options: ["Rohit Sharma", "MS Dhoni", "Jasprit Bumrah", "Ravindra Jadeja"],
    points: 100
  },
  {
    id: 3,
    type: 'stat',
    text: "Who will hit the most sixes?",
    options: ["Suryakumar Yadav", "Shivam Dube", "Tim David", "Ruturaj Gaikwad"],
    points: 75
  },
  {
    id: 4,
    type: 'stat',
    text: "Total wickets for Jasprit Bumrah?",
    options: ["0", "1", "2", "3+"],
    points: 50
  }
];

const GameQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selections, setSelections] = useState({});

  const handleNext = () => {
    if (currentIdx < mockGameQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      navigate(`/game-review`);
    }
  };

  const currentQ = mockGameQuestions[currentIdx];

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Dynamic Cyber Purple Glow */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '250px', height: '250px', background: 'hsl(var(--secondary) / 0.05)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

        {/* Header: Pro Gaming Style */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button className="flex-center" onClick={() => navigate(-1)} style={{ width: '48px', height: '48px', color: 'hsl(var(--foreground))', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Prediction Hub
          </span>
          <button className="flex-center" style={{ width: '48px', height: '48px', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))', color: 'hsl(var(--foreground))' }}>
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Modular Timer */}
        <div style={{ marginBottom: '3rem', maxWidth: '800px' }}>
          <TimerBar timeLeft={5045} totalTime={7200} formatTime={(s) => "01:24:05"} />
        </div>

        {/* Segmented Progress: Hub Style */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3.5rem', maxWidth: '800px' }}>
          {mockGameQuestions.map((_, i) => (
            <div key={i} style={{ 
              flex: 1, 
              height: '8px', 
              background: i <= currentIdx ? 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)))' : 'hsl(var(--muted))',
              borderRadius: '10px',
              boxShadow: i <= currentIdx ? '0 0 10px hsl(var(--secondary) / 0.3)' : 'none',
              transition: 'all 0.5s ease'
            }}></div>
          ))}
        </div>

        {/* Prediction Arena Area */}
        <div className="animate-elite" key={currentIdx} style={{ flex: 1, maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ height: '1.5rem', width: '4px', background: 'hsl(var(--secondary))', borderRadius: '4px' }}></div>
            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'hsl(var(--secondary))', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {currentQ.type} System <span style={{ color: 'hsl(var(--muted-foreground))' }}>• {currentQ.points} PTS</span>
            </span>
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '3.5rem', lineHeight: '1.25', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--foreground))' }}>
            {currentQ.text}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 45%, 480px), 1fr))', gap: '1.5rem' }}>
            {currentQ.options.map((opt, i) => {
               const isSelected = selections[currentIdx] === i;
               return (
                <button 
                  key={i}
                  onClick={() => setSelections({ ...selections, [currentIdx]: i })}
                  className="bento-card"
                  style={{
                    padding: 'clamp(2rem, 5vw, 3rem) 1.5rem',
                    textAlign: 'center',
                    border: isSelected ? '1px solid hsl(var(--secondary) / 0.3)' : '1px solid hsl(var(--card-border))',
                    background: isSelected ? 'hsl(var(--secondary) / 0.05)' : 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    boxShadow: isSelected ? '0 20px 40px -10px hsl(var(--secondary) / 0.2)' : 'none',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    cursor: 'pointer'
                  }}
                >
                  {currentQ.type === 'player' && (
                    <div style={{ 
                      width: 'clamp(60px, 10vw, 90px)', 
                      height: 'clamp(60px, 10vw, 90px)', 
                      borderRadius: '2.5rem', 
                      background: isSelected ? 'hsl(var(--secondary))' : 'hsl(var(--muted))', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 900,
                      color: isSelected ? 'white' : 'hsl(var(--foreground))',
                      border: '1px solid hsl(var(--card-border))',
                      boxShadow: isSelected ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
                      fontFamily: 'Lexend'
                    }}>
                      {opt.charAt(0)}
                    </div>
                  )}
                  <span style={{ fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>{opt}</span>
                </button>
               );
            })}
          </div>
        </div>

        {/* Control Stack */}
        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', maxWidth: '600px', width: '100%' }}>
          <button 
            className="btn-elite" 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            style={{ 
              flex: 1, 
              height: '64px',
              background: 'hsl(var(--muted))', 
              border: '1px solid hsl(var(--card-border))',
              color: 'hsl(var(--foreground))',
              opacity: currentIdx === 0 ? 0.3 : 1
            }}
          >
            Previous
          </button>
          <button 
            className="btn-elite btn-elite-primary" 
            onClick={handleNext}
            style={{ 
              flex: 2, 
              height: '64px',
              background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))',
              boxShadow: '0 20px 40px -10px hsl(var(--secondary) / 0.3)'
            }}
          >
            {currentIdx === mockGameQuestions.length - 1 ? 'Finish Prediction' : 'Save & Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameQuestionPage;
