import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const userName = localStorage.getItem('user_name') || 'Scholar';

  const quizRooms = [
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
  const [selectedTab, setSelectedTab] = React.useState('All Rooms');
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
        {selectedTab === 'All Rooms' && (
          <div className="quiz-banner-card animate-slide-up stagger-1" style={{ 
            width: '100%', 
            paddingLeft: '0', 
            paddingRight: '0', 
            paddingTop: '0', 
            paddingBottom: '0',
            borderRadius: '0',
            background: globalBanner ? `url("${globalBanner}") center/100% 100% no-repeat` : 'radial-gradient(circle at top right, #1e3a8a, #0d1f3c)',
            backgroundColor: '#0d1f3c', // Fallback color
            minHeight: '180px',
            position: 'relative',
            marginBottom: '3rem',
            overflow: 'hidden'
          }}>
            {/* Blurred Background Layer */}
            {globalBanner && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `url("${globalBanner}") center/100% 100% no-repeat`,
                filter: 'blur(20px) brightness(0.7)',
                transform: 'scale(1.1)', // Prevent white edges from blur
                zIndex: 0
              }}></div>
            )}
            
            {/* Main Content Layer */}
            <div style={{ 
              position: 'relative', 
              zIndex: 1, 
              width: '100%', 
              height: '100%',
              background: globalBanner ? `url("${globalBanner}") center/100% 100% no-repeat` : 'radial-gradient(circle at top right, #1e3a8a, #0d1f3c)',
              minHeight: '180px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {!globalBanner && <div className="quiz-banner-overlay"></div>}
              
              {!globalBanner && (
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                  <div className="banner-text-container" style={{ flex: 1, minWidth: '300px', paddingLeft: '5%' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '999px', marginBottom: '0.75rem', backdropFilter: 'blur(5px)' }}>
                      <Sparkles size={14} color="#38bdf8" fill="#38bdf8" />
                      <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>QUIZ LIVE FORMAT</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>
                      Earn from what you learn
                    </h2>
                    <p style={{ fontSize: '1rem', opacity: 0.8, fontWeight: 500, lineHeight: 1.5 }}>
                      Compete in real quiz battles, rank higher, win real prizes.
                    </p>
                  </div>
                  
                  <div className="banner-stats-container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingRight: '5%' }}>
                    <div className="quiz-stat-box" style={{ padding: '0.5rem 1rem', minWidth: '80px', borderRadius: '1rem' }}>
                      <p style={{ fontSize: '0.55rem', fontWeight: 800, opacity: 0.7, marginBottom: '0.2rem', textTransform: 'uppercase' }}>QUESTIONS</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>10</p>
                    </div>
                    <div className="quiz-stat-box" style={{ padding: '0.5rem 1rem', minWidth: '80px', borderRadius: '1rem', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                      <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#7dd3fc', marginBottom: '0.2rem', textTransform: 'uppercase' }}>DURATION</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>8 Min</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
