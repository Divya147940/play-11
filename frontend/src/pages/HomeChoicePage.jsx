import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import UpcomingQuizzes from '../components/UpcomingQuizzes';
import { quizService, settingsService } from '../services/api';

// Import Assets
import studyIcon from '../assets/study-icon.png';
import sportsIcon from '../assets/sports-icon.png';
import movieIcon from '../assets/movie-icon.png';
import newsIcon from '../assets/news-icon.png';

const HomeChoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('user_name') || 'Scholar';

  const quizRooms = [
    {
      id: 'study-zone',
      title: 'Study Zone',
      desc: 'SSC, GK, reasoning, news and exam-style questions for serious aspirants.',
      icon: studyIcon,
      prize: '₹500',
      entry: '₹10',
      players: '154',
      time: '02:15:30',
      path: '/quiz-arena/study-zone',
      btnColor: 'primary'
    },
    {
      id: 'sport-zone',
      title: 'Sport Zone',
      desc: 'Cricket, IPL, match awareness and sports knowledge battle.',
      icon: sportsIcon,
      prize: '₹500',
      entry: '₹10',
      players: '255',
      time: '03:42:18',
      path: '/quiz-arena/sport-zone',
      btnColor: 'secondary'
    },
    {
      id: 'movie-zone',
      title: 'Movie Quiz',
      desc: 'Bollywood, Hollywood, actors, songs, dialogues and cinema trivia.',
      icon: movieIcon,
      prize: '₹500',
      entry: '₹10',
      players: '172',
      time: '05:20:45',
      path: '/quiz-arena/movie-zone',
      btnColor: 'orange'
    },
    {
      id: 'news-zone',
      title: 'Daily News Quiz',
      desc: 'News, current affairs, India, world affairs and daily awareness.',
      icon: newsIcon,
      prize: '₹500',
      entry: '₹10',
      players: '188',
      time: '06:10:05',
      path: '/quiz-arena/news-zone',
      btnColor: 'blue'
    },
  ];

  const tabs = ['All Rooms', 'Live', 'Upcoming', 'My Joined'];
  const [selectedTab, setSelectedTab] = React.useState(location.state?.tab || 'All Rooms');
  const [allQuizzes, setAllQuizzes] = React.useState([]);
  const [joinedQuizzes, setJoinedQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [globalBanner, setGlobalBanner] = React.useState('');

  React.useEffect(() => {
    const fetchQuizzes = async () => {
      // Only show loading on initial fetch
      if (allQuizzes.length === 0) setLoading(true);
      
      try {
        const all = await quizService.getAllQuizzes();
        setAllQuizzes(all);
        
        // Fetch global banner
        const bannerData = await settingsService.getSetting('home_banner_url');
        if (bannerData.success) {
          setGlobalBanner(bannerData.value);
        }
      } catch (err) {
        console.error('Failed to fetch all quizzes:', err);
      }

      try {
        const session = localStorage.getItem('play11_session');
        if (session) {
          const joined = await quizService.getJoinedQuizzes();
          setJoinedQuizzes(joined);
        }
      } catch (err) {
        console.warn('Could not fetch joined quizzes (might be guest):', err);
      }

      setLoading(false);
    };

    fetchQuizzes();
    
    // Real-time update: Refresh every 30 seconds
    const interval = setInterval(fetchQuizzes, 30000);
    return () => clearInterval(interval);
  }, []); // Only run on mount, interval handles updates

  const getFilteredQuizzes = () => {
    if (!Array.isArray(allQuizzes)) return [];
    
    if (selectedTab === 'All Rooms') {
      return allQuizzes;
    }
    if (selectedTab === 'Live') {
      return allQuizzes.filter(q => q.status_label?.toUpperCase() === 'LIVE');
    }
    if (selectedTab === 'Upcoming') {
      return allQuizzes.filter(q => q.status_label?.toUpperCase() === 'UPCOMING');
    }
    if (selectedTab === 'My Joined') {
      return joinedQuizzes;
    }
    return [];
  };

  const getLiveCount = (zoneId) => {
    if (!Array.isArray(allQuizzes)) return 0;
    return allQuizzes.filter(q => q.zone_id === zoneId && q.status_label?.toUpperCase() === 'LIVE').length;
  };

  const getUpcomingTime = (zoneId) => {
    if (!Array.isArray(allQuizzes)) return null;
    const upcoming = allQuizzes
      .filter(q => q.zone_id === zoneId && q.status_label?.toUpperCase() === 'UPCOMING')
      .sort((a, b) => new Date(a.open_at) - new Date(b.open_at))[0];
    if (!upcoming) return null;
    return new Date(upcoming.open_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredQuizzes = getFilteredQuizzes();

  return (
    <div className="quiz-room-bg">
      <div style={{ paddingTop: '70px', paddingBottom: '6rem' }}>
        
        {/* Hero Banner Section */}
        <div className="quiz-banner-container animate-slide-up stagger-1" style={{ 
          width: '100%', 
          position: 'relative',
          marginBottom: '2rem',
          overflow: 'hidden',
          borderRadius: '0',
          background: '#0d1f3c',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          {globalBanner && (
            <div style={{ 
              width: '100%', 
              height: 'clamp(200px, 30vh, 350px)', 
              overflow: 'hidden' 
            }}>
              <img 
                src={globalBanner} 
                alt="Banner" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'fill', 
                  display: 'block'
                }} 
              />
            </div>
          )}
          {!globalBanner && (
            <div style={{ 
              padding: '3rem 5%', 
              background: 'radial-gradient(circle at top right, #1e3a8a, #0d1f3c)',
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div className="banner-text-container">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '999px', marginBottom: '1rem', backdropFilter: 'blur(5px)' }}>
                  <Sparkles size={16} color="#38bdf8" fill="#38bdf8" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'white' }}>QUIZ LIVE FORMAT</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1, color: 'white' }}>
                  Earn from what you learn
                </h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 500, lineHeight: 1.5, color: 'white' }}>
                  Compete in real quiz battles, rank higher, win real prizes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Welcome Header */}
        <div className="container animate-slide-up" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', paddingLeft: '4%', paddingRight: '4%' }}>
           <div>
             <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Choose your contest room</h1>
           </div>
        </div>

        <div className="container" style={{ paddingLeft: 'clamp(0rem, 2vw, 3%)', paddingRight: 'clamp(0rem, 2vw, 3%)' }}>
        {/* Navigation Tabs */}
        <div style={{ margin: '3rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="animate-slide-up stagger-2">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              className={`tab ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex-center" style={{ padding: '3rem' }}>
             <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : selectedTab === 'All Rooms' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }} className="mobile-grid-2">
            {quizRooms.map((room, idx) => (
              <div key={room.id} className={`quiz-card-premium animate-slide-up stagger-${(idx % 4) + 1}`} style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    {/* Status Badge */}
                    <div style={{ 
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.3rem', 
                      background: getLiveCount(room.id) > 0 ? '#fee2e2' : '#f1f5f9', 
                      color: getLiveCount(room.id) > 0 ? '#ef4444' : '#64748b', 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.5rem', 
                      fontWeight: 900, 
                      textTransform: 'uppercase',
                      zIndex: 1
                    }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: getLiveCount(room.id) > 0 ? '#ef4444' : '#94a3b8' }}></div>
                        {getLiveCount(room.id) > 0 ? 'LIVE' : 'OFF'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                      <div className="quiz-icon-container" style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '0.75rem' }}>
                        <img src={room.icon} alt={room.title} style={{ width: '60%' }} />
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem', textAlign: 'center' }}>{room.title}</h3>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>Prize <strong>{room.prize}</strong></div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.45rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{getUpcomingTime(room.id) ? 'NEXT' : 'TIME'}</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4f46e5', fontFamily: 'monospace' }}>{getUpcomingTime(room.id) || room.time}</p>
                    </div>

                    <button 
                      className={`quiz-join-btn ${room.btnColor}`} 
                      onClick={() => navigate(room.path)}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <UpcomingQuizzes 
            quizzes={filteredQuizzes} 
            title={selectedTab === 'My Joined' ? 'Quizzes you have participated in' : `Currently ${selectedTab.toLowerCase()} quiz battles`}
            subtitle={selectedTab === 'My Joined' ? 'YOUR PARTICIPATION HISTORY' : `${selectedTab.toUpperCase()} QUIZ ARENA`}
          />
        )}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .banner-stats-container {
            padding-right: 5% !important;
            justify-content: center;
            width: 100%;
            margin-top: 1rem;
          }
          .banner-text-container {
            text-align: center;
            padding-right: 5% !important;
          }
        }
        .mobile-full-width {
          @media (max-width: 480px) {
            max-width: 100% !important;
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid #f1f5f9;
            padding-top: 1.5rem;
          }
        }
        .mobile-grid-2 {
           grid-template-columns: 1fr 1fr !important;
           gap: 6px !important;
           padding: 0 2px !important;
        }
      `}</style>
    </div>
  );
};

export default HomeChoicePage;
