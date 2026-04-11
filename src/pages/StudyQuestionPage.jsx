import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Trash2, Send } from 'lucide-react';
import TimerBar from '../components/TimerBar';

const mockQuestions = [
  {
    id: 1,
    text: "Who was the first Indian woman to win an Olympic medal?",
    options: ["Karnam Malleswari", "Saina Nehwal", "P.V. Sindhu", "Mary Kom"],
    correct: 0
  },
  {
    id: 2,
    text: "The 'World Environment Day' is celebrated on which date?",
    options: ["June 5", "July 5", "August 5", "September 5"],
    correct: 0
  },
  {
    id: 3,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    id: 4,
    text: "The Harappan civilization was discovered in the year?",
    options: ["1921", "1935", "1942", "1901"],
    correct: 0
  },
  {
    id: 5,
    text: "Which of the following is NOT a fundamental right in India?",
    options: ["Right to Property", "Right to Equality", "Right against Exploitation", "Right to Freedom of Religion"],
    correct: 0
  }
];

const StudyQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quizzes/${id}/questions`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions.length > 0) {
          // Add default mock options since question_options table isn't fully populated yet in seed script
          const qs = data.questions.map((q, i) => ({
            id: q.id,
            text: q.question_text,
            options: i % 2 === 0 
              ? ["Arundhati Roy", "Chetan Bhagat", "Kiran Desai", "R.K. Narayan"]
              : ["Ampere", "Volt", "Ohm", "Watt"],
            correct: 0
          }));
          setQuestions(qs);
        } else {
          // Fallback if no questions
          setQuestions([
             { id: 'mock', text: 'No questions added to this arena yet.', options: ['A', 'B', 'C', 'D'], correct: 0 }
          ]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = useCallback(async () => {
    try {
       const userMobile = localStorage.getItem('user_mobile') || '0000000000';
       const response = await fetch(`/api/quizzes/${id}/submit`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ answers, mobile: userMobile })
       });

       const data = await response.json();
       if (data.success) {
         localStorage.setItem('last_quiz_results', JSON.stringify({
           answers,
           total: data.result.total,
           correct: data.result.correct,
           wrong: data.result.wrong,
           score: data.result.score
         }));
         navigate(`/study-result/${id}`);
       } else {
         console.error('Failed to submit');
       }
    } catch(err) {
      console.error(err);
    }
  }, [answers, id, navigate]);

  useEffect(() => {
    if (loading) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (optionIdx) => {
    setAnswers({ ...answers, [currentIdx]: optionIdx });
  };

  const progress = ((currentIdx + 1) / questions.length) * 100;

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Arena...</div>;
  }

  return (
    <div className="mesh-bg-blue" style={{ minHeight: '100vh', background: 'white' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Dynamic Background Glow */}
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: '250px', height: '250px', background: 'hsl(var(--primary) / 0.05)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

        {/* Header: Elite Style */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button className="flex-center" onClick={() => navigate(-1)} style={{ width: '48px', height: '48px', color: 'hsl(var(--foreground))', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'Lexend', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Study Arena
          </span>
          <button className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={() => navigate('/study-review')}>
            <Trash2 size={20} />
          </button>
        </div>

        {/* Modular Timer & Liquid Progress */}
        <div style={{ marginBottom: '3.5rem', maxWidth: '800px' }}>
          <TimerBar timeLeft={timeLeft} totalTime={600} formatTime={formatTime} />
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'hsl(var(--muted-foreground))' }}>
            <span>Arena Status: {Math.round(progress)}% Complete</span>
            <span style={{ color: 'hsl(var(--primary))' }}>Question {currentIdx + 1}/{questions.length}</span>
          </div>
        </div>

        {/* Question Context Branding */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ height: '1.5rem', width: '4px', background: 'hsl(var(--primary))', borderRadius: '4px' }}></div>
          <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'hsl(var(--foreground))', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Question {currentIdx + 1} <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>/ {questions.length}</span>
          </span>
        </div>

        {/* Main Question Arena */}
        <div className="animate-elite" key={currentIdx} style={{ flex: 1, maxWidth: '1000px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '3rem', lineHeight: '1.4', fontWeight: 700, fontFamily: 'Outfit', color: 'hsl(var(--foreground))' }}>
            {questions[currentIdx]?.text}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 45%, 500px), 1fr))', gap: '1.5rem' }}>
            {questions[currentIdx]?.options.map((option, idx) => {
              const isSelected = answers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className="bento-card"
                  style={{
                    textAlign: 'left',
                    padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                    border: isSelected ? '1px solid hsl(var(--primary) / 0.3)' : '1px solid hsl(var(--card-border))',
                    background: isSelected ? 'hsl(var(--primary) / 0.05)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    boxShadow: isSelected ? '0 15px 30px -10px hsl(var(--primary) / 0.15)' : 'none',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '1.25rem', 
                    background: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    border: isSelected ? 'none' : '1px solid hsl(var(--card-border))',
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: isSelected ? 'white' : 'hsl(var(--muted-foreground))',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Lexend',
                    flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', transition: 'all 0.3s ease' }}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arena Command Bar */}
        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', maxWidth: '600px', width: '100%' }}>
          <button 
            className="btn-elite" 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            style={{ 
              flex: 1, 
              background: 'hsl(var(--muted))', 
              border: '1px solid hsl(var(--card-border))', 
              color: 'hsl(var(--foreground))',
              opacity: currentIdx === 0 ? 0.3 : 1,
              height: '64px'
            }}
          >
            Previous
          </button>
          {currentIdx === questions.length - 1 ? (
            <button className="btn-elite btn-elite-primary" style={{ flex: 2, height: '64px' }} onClick={handleSubmit}>
              Submit Arena <Send size={20} style={{ marginLeft: '0.75rem' }} />
            </button>
          ) : (
            <button className="btn-elite btn-elite-primary" style={{ flex: 2, height: '64px' }} onClick={() => setCurrentIdx(prev => prev + 1)}>
              Next Question <ChevronRight size={20} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyQuestionPage;
