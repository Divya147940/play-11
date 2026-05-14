import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, Trophy, ChevronRight, BookOpen, Film, Target } from 'lucide-react';

const zoneConfig = {
  'sport-zone': {
    tag: 'SPORT ARENA',
    title: 'Match-based quiz battles',
    subtitle: 'Elite sports knowledge tests',
    aboutTitle: 'About Sport Arena Quizzes',
    aboutDesc: 'Sport Arena quizzes are designed to test your knowledge of cricket, football, and other major sports events. Compete with others and climb the leaderboard.',
    practiceTitle: 'Cricket Trivia Practice',
    practiceMode: 'Free Mode',
    practiceType: 'Sports General',
    practiceBtn: 'Play Practice',
    practiceAction: '/match-list',
    themeColor: '#10b981'
  },
  'game-zone': {
    tag: 'GAME ZONE',
    title: 'Cricket-based quiz battles',
    subtitle: 'Skill-based match quizzes (IPL style)',
    aboutTitle: 'About Game Zone Quizzes',
    aboutDesc: 'Match-based quizzes are designed to test your real-time cricket knowledge. Join a room before it closes to participate in the upcoming live battle. Rewards are distributed automatically based on final leaderboard positions.',
    practiceTitle: 'Cricket Knowledge Practice',
    practiceMode: 'Practice Quiz',
    practiceType: 'Past match based',
    practiceBtn: 'Play Practice',
    practiceAction: '/dummy-quiz-flow',
    themeColor: '#3b82f6'
  },
  'study-zone': {
    tag: 'STUDY ARENA',
    title: 'Academic-based quiz battles',
    subtitle: 'Elite educational mock tests',
    aboutTitle: 'About Study Arena Quizzes',
    aboutDesc: 'Academic quizzes are designed to simulate real-world competitive exam environments. Join a session to test your preparation against thousands of aspirants. Results and analytics are updated post-completion.',
    practiceTitle: 'Daily General Knowledge',
    practiceMode: 'Practice Quiz',
    practiceType: 'Mixed Subjects',
    practiceBtn: 'Join Quiz',
    practiceAction: '/study-home',
    themeColor: '#2563eb'
  },
  'movie-zone': {
    tag: 'MOVIE ARENA',
    title: 'Cinema-based quiz battles',
    subtitle: 'Bollywood & Hollywood trivia',
    aboutTitle: 'About Movie Arena Quizzes',
    aboutDesc: 'Movie-based quizzes test your knowledge of cinema, actors, and pop culture. Challenge your friends and prove you are the ultimate movie buff!',
    practiceTitle: 'Actor Trivia Practice',
    practiceMode: 'Free Play',
    practiceType: 'Pop Culture',
    practiceBtn: 'Start Practice',
    practiceAction: '/dummy-quiz-flow',
    themeColor: '#f97316'
  },
  'news-zone': {
    tag: 'NEWS ARENA',
    title: 'News-based quiz battles',
    subtitle: 'Stay updated with daily trends',
    aboutTitle: 'About News Arena Quizzes',
    aboutDesc: 'Stay ahead of the curve with our daily news quizzes. Covering global events, politics, and technology to keep you informed and sharp.',
    practiceTitle: 'Weekly News Recap',
    practiceMode: 'Review Mode',
    practiceType: 'Current Affairs',
    practiceBtn: 'Start Review',
    practiceAction: '/dummy-quiz-flow',
    themeColor: '#0ea5e9'
  }
};

const QuizArenaPage = () => {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState('');

  const config = zoneConfig[zoneId] || zoneConfig['sport-zone'];

  useEffect(() => {
    let apiZone = zoneId;
    const session = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    let headers = {};
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const token = parsed.token || session;
        headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        headers['Authorization'] = `Bearer ${session}`;
      }
    }

    const fetchQuizzes = () => {
      fetch(`/api/quizzes/zone/${apiZone}`, { headers })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.quizzes && data.quizzes.length > 0) {
            const formatted = data.quizzes.map(q => {
              const openTime = new Date(q.open_at);
              const timeStr = openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const subDate = q.submitted_at ? new Date(q.submitted_at) : null;
              const formattedSubTime = subDate ? subDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

              const closeTime = new Date(q.close_at);
              const closeStr = closeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return {
                ...q,
                tag: config.tag,
                statusColor: q.status_label ? q.status_label.toLowerCase() : 'live',
                submittedAt: formattedSubTime,
                timerLabel: q.status_label === 'UPCOMING' ? 'STARTS AT' : (q.status_label === 'CLOSED' ? 'ENDED' : 'ENDS AT'),
                timerValue: q.status_label === 'UPCOMING' ? timeStr : (q.status_label === 'CLOSED' ? 'Closed' : closeStr),
                questions: q.total_questions,
                players: (q.player_count || 0),
                rewards: q.reward_text || (q.entry_amount > 0 ? `₹${q.entry_amount * 5}` : 'Free'),
                btnText: q.is_submitted ? 'View Result' : (q.status_label === 'UPCOMING' ? 'View Details' : (q.status_label === 'CLOSED' ? 'View Results' : 'Join Quiz')),
                active: true
              };
            });
            setQuizzes(formatted);
          } else {
             setQuizzes([]);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchQuizzes();

    // Fetch banners: Check zone-specific first, then global
    const fetchBanners = async () => {
      try {
        // Try zone-specific banner first (e.g., banner_zone_study-zone)
        const zoneRes = await fetch(`/api/settings/banner_zone_${zoneId}`);
        const zoneData = await zoneRes.json();
        
        if (zoneData.success && zoneData.value) {
          setActiveBanner(zoneData.value);
        } else {
          // Fallback to global home banner
          const globalRes = await fetch('/api/settings/home_banner_url');
          const globalData = await globalRes.json();
          if (globalData.success) setActiveBanner(globalData.value);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();

    const interval = setInterval(fetchQuizzes, 3000);
    return () => clearInterval(interval);
  }, [zoneId, config.tag]);

  return (
    <div className="quiz-room-bg" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', paddingLeft: '3%', paddingRight: '3%' }}>
        
        {/* Global or Zone-Specific Banner */}
        {activeBanner && (
          <div className="quiz-arena-banner-container" style={{ 
            width: 'calc(100% + 6%)', 
            marginLeft: '-3%',
            marginRight: '-3%',
            height: 'clamp(160px, 25vh, 300px)', 
            borderRadius: '0', 
            padding: '0', 
            marginBottom: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img 
              src={activeBanner} 
              alt="Arena Banner" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'fill', 
                display: 'block' 
              }} 
            />
          </div>
        )}

        <button 
          onClick={() => navigate('/home-choice')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'white', border: '1px solid #e2e8f0', padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '2rem', cursor: 'pointer' 
          }}
          className="hover-lift"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'end', marginBottom: '2.5rem', paddingLeft: '1rem' }} className="animate-slide-up">
           <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 900, color: config.themeColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{config.tag}</p>
              <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{config.title}</h1>
           </div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#eff6ff', color: config.themeColor, padding: '8px 16px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
              <span>{config.subtitle}</span>
           </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '5rem' }}>
             <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: config.themeColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="animate-slide-up">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="game-zone-card" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>{quiz.tag}</div>
                   <div className={`badge-${quiz.statusColor}-mini`}>{quiz.status_label || 'LIVE'}</div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>{quiz.title}</h3>

                <div className="game-status-box" style={{ 
                  background: quiz.is_submitted ? '#f0fdf4' : 'rgba(15, 23, 42, 0.02)',
                  borderColor: quiz.is_submitted ? '#bbf7d0' : '#f1f5f9',
                  padding: '0.5rem'
                }}>
                   <p style={{ fontSize: '0.55rem', fontWeight: 800, color: quiz.is_submitted ? '#16a34a' : '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                      {quiz.is_submitted ? 'RESULT' : quiz.timerLabel}
                   </p>
                   <p style={{ fontSize: '1.1rem', fontWeight: 900, color: quiz.is_submitted ? '#16a34a' : '#ef4444' }}>
                      {quiz.is_submitted ? 'Done' : quiz.timerValue}
                   </p>
                </div>

                <div className="game-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1.5rem' }}>
                   <div className="arena-metric" style={{ padding: '0.4rem' }}>
                      <span className="label" style={{ fontSize: '0.5rem' }}>Qs</span>
                      <span className="value" style={{ fontSize: '0.7rem' }}>{quiz.questions}</span>
                   </div>
                   <div className="arena-metric" style={{ padding: '0.4rem' }}>
                      <span className="label" style={{ fontSize: '0.5rem' }}>PLAYERS</span>
                      <span className="value" style={{ fontSize: '0.7rem' }}>{quiz.players}</span>
                   </div>
                   <div className="arena-metric" style={{ padding: '0.4rem' }}>
                      <span className="label" style={{ fontSize: '0.5rem' }}>WIN</span>
                      <span className="value" style={{ fontSize: '0.7rem' }}>{quiz.rewards}</span>
                   </div>
                </div>

                <button 
                  className={`shimmer-btn ${quiz.is_submitted ? 'bg-slate-500' : ''}`}
                  onClick={() => {
                    if (quiz.is_submitted || quiz.status_label === 'CLOSED') {
                      navigate(zoneId === 'study-zone' ? `/study-result/${quiz.id}` : `/game-result/${quiz.id}`);
                    } else if (quiz.status_label === 'UPCOMING') {
                      navigate(zoneId === 'study-zone' ? `/study-quiz-detail/${quiz.id}` : `/match-quiz-room/${quiz.id}`);
                    } else {
                      navigate(zoneId === 'study-zone' ? `/study-quiz-play/${quiz.id}` : `/game-quiz-play/${quiz.id}`);
                    }
                  }}
                  style={{ 
                    marginTop: 'auto', 
                    height: '44px',
                    background: quiz.is_submitted ? '#64748b' : config.themeColor,
                    boxShadow: quiz.is_submitted ? 'none' : `0 6px 12px -3px ${config.themeColor}4D`,
                    fontSize: '0.8rem',
                    padding: '0 1rem'
                  }}
                >
                   <span>{quiz.is_submitted ? 'Result' : quiz.btnText}</span>
                   <ChevronRight size={16} strokeWidth={3} />
                </button>
                
                {quiz.is_submitted && (
                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: '#16a34a', fontWeight: 800 }}>
                    Successfully submitted on {new Date(quiz.submitted_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}

            {/* Practice Card */}
              <div key="practice" className="game-zone-card" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>PRACTICE</div>
                   <div className="badge-practice-mini" style={{ fontSize: '0.5rem', padding: '2px 4px' }}>FREE</div>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2 }}>{config.practiceTitle}</h3>
                <div className="game-status-box" style={{ padding: '0.5rem' }}>
                   <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>MODE</p>
                   <p style={{ fontSize: '1.1rem', fontWeight: 950, color: config.themeColor }}>{config.practiceMode}</p>
                </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1.5rem' }}>
                <div className="arena-metric" style={{ padding: '0.4rem' }}>
                    <span className="label" style={{ fontSize: '0.5rem' }}>Qs</span>
                    <span className="value" style={{ fontSize: '0.7rem' }}>10</span>
                </div>
                <div className="arena-metric" style={{ padding: '0.4rem' }}>
                    <span className="label" style={{ fontSize: '0.5rem' }}>PLAYERS</span>
                    <span className="value" style={{ fontSize: '0.7rem' }}>300+</span>
                </div>
                <div className="arena-metric" style={{ padding: '0.4rem' }}>
                    <span className="label" style={{ fontSize: '0.5rem' }}>TYPE</span>
                    <span className="value" style={{ fontSize: '0.7rem' }}>{config.practiceType}</span>
                </div>
              </div>
              <button className="shimmer-btn" onClick={() => navigate(config.practiceAction)} style={{ marginTop: 'auto', height: '56px', background: '#64748b' }}>
                <span>{config.practiceBtn}</span>
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }} className="animate-slide-up">
           <div style={{ color: config.themeColor }}><Info size={24} /></div>
           <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>{config.aboutTitle}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{config.aboutDesc}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuizArenaPage;
