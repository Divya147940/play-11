import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, ShieldCheck, History, Award, Wallet, Trophy, Ticket, Gamepad2, MoreHorizontal, Headphones, FileText } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const getInitialName = () => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) return storedName;
    return 'Scholar';
  };

  const [name, setName] = React.useState(getInitialName());
  const [isEditing, setIsEditing] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const [userStats, setUserStats] = React.useState({ quizzes: 0, wins: 0, points: 0 });
  const [balance, setBalance] = React.useState({ coins: 0, points: 0, bonus: 0 });
  const [showBonusModal, setShowBonusModal] = React.useState(false);
  const [bonusTransactions, setBonusTransactions] = React.useState([]);
  const [activeModalTab, setActiveModalTab] = React.useState('offers');
  const [bonusOffers, setBonusOffers] = React.useState({
    welcome_bonus: '0',
    referral_referrer_bonus: '0',
    referral_referee_bonus: '0',
    daily_login_bonus: '0',
    first_deposit_bonus: '0'
  });

  const getReferralCode = () => {
    try {
      const sessionRaw = localStorage.getItem('play11_session');
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        return parsed.user?.referral_code || 'PLAY11';
      }
    } catch (e) {
      console.error(e);
    }
    return 'PLAY11';
  };
  const referralCode = getReferralCode();

  React.useEffect(() => {
    const guestId = localStorage.getItem('play11_guest_id');
    const sessionRaw = localStorage.getItem('play11_session');
    
    let token = '';
    let headers = {};
    
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        token = parsed.token || sessionRaw;
        headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        token = sessionRaw;
        headers['Authorization'] = `Bearer ${token}`;
      }
    } else if (guestId) {
      headers['x-guest-id'] = guestId;
    }

    fetch('/api/auth/history', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.history) {
          const quizzes = data.history.length;
          const wins = data.history.filter(h => h.display_won_amount && parseFloat(h.display_won_amount) > 0).length;
          const points = data.history.reduce((sum, h) => sum + (parseFloat(h.total_score) || 0), 0);
          setUserStats({ quizzes, wins, points });
        }
      })
      .catch(console.error);

    fetch('/api/wallet/balance', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBalance(data.balance);
        }
      })
      .catch(console.error);

    fetch('/api/wallet/transactions', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.transactions) {
          const bonusTx = data.transactions.filter(tx => tx.category === 'bonus' || tx.title.toLowerCase().includes('bonus'));
          setBonusTransactions(bonusTx);
        }
      })
      .catch(console.error);

    const fetchOffer = async (key) => {
      try {
        const res = await fetch(`/api/settings/${key}`);
        const data = await res.json();
        if (data.success) return data.value || '0';
      } catch (e) {
        console.error(e);
      }
      return '0';
    };

    Promise.all([
      fetchOffer('welcome_bonus'),
      fetchOffer('referral_referrer_bonus'),
      fetchOffer('referral_referee_bonus'),
      fetchOffer('daily_login_bonus'),
      fetchOffer('first_deposit_bonus')
    ]).then(([welcome, referrer, referee, daily, firstDeposit]) => {
      setBonusOffers({
        welcome_bonus: welcome,
        referral_referrer_bonus: referrer,
        referral_referee_bonus: referee,
        daily_login_bonus: daily,
        first_deposit_bonus: firstDeposit
      });
    });
  }, []);

  const handleNameSave = (newName) => {
    localStorage.setItem('user_name', newName);
    setName(newName || 'Scholar');
    setIsEditing(false);
  };

  const stats = [
    { label: 'QUIZZES', value: userStats.quizzes.toString(), icon: <History size={24} />, bgColor: '#f3f0ff', iconColor: '#7c3aed' },
    { label: 'WINS', value: userStats.wins.toString(), icon: <Award size={24} />, bgColor: '#fffbeb', iconColor: '#f59e0b' },
    { label: 'POINTS', value: userStats.points.toString(), icon: <ShieldCheck size={24} />, bgColor: '#f0fdf4', iconColor: '#10b981' }
  ];

  const menuItems = [
    { 
      icon: <Wallet size={20} />, 
      title: 'My Wallet', 
      subtext: 'View your coins, points and rewards', 
      onClick: () => navigate('/balance'),
      bgIcon: <Wallet size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    },
    { 
      icon: <Award size={20} />, 
      title: 'My Bonuses', 
      subtext: 'View your active bonuses and referral rewards', 
      onClick: () => setShowBonusModal(true),
      bgIcon: <Award size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    },
    { 
      icon: <Trophy size={20} />, 
      title: 'My Quizzes', 
      subtext: 'Check your quiz history and stats', 
      onClick: () => navigate('/history'),
      bgIcon: <Trophy size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    },
    { 
      icon: <Ticket size={20} />, 
      title: 'My Vouchers', 
      subtext: 'View and manage your vouchers', 
      onClick: () => navigate('/vouchers'),
      bgIcon: <Ticket size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    },
    { 
      icon: <Gamepad2 size={20} />, 
      title: 'How to Play', 
      subtext: 'Learn the rules and gameplay', 
      onClick: () => navigate('/how-it-works'),
      bgIcon: <Gamepad2 size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    },
    { 
      icon: <Headphones size={20} />, 
      title: '24x7 Help & Support', 
      subtext: "We're here to help you anytime", 
      onClick: () => navigate('/support'),
      bgIcon: <Headphones size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    },
    { 
      icon: <MoreHorizontal size={20} />, 
      title: 'More', 
      subtext: showMore ? 'Show fewer options' : 'Explore more options and features', 
      onClick: () => setShowMore(!showMore),
      bgIcon: <MoreHorizontal size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />,
      isActive: showMore
    },
    ...(showMore ? [
      { 
        icon: <Trophy size={18} />, 
        title: 'About Us', 
        subtext: 'Learn more about our platform', 
        onClick: () => navigate('/about'),
        isSubsection: true
      },
      { 
        icon: <FileText size={18} />, 
        title: 'Terms And Conditions', 
        subtext: 'Read our legal policies', 
        onClick: () => navigate('/legal'),
        isSubsection: true
      }
    ] : [])
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfd', paddingBottom: '100px', fontFamily: "'Outfit', sans-serif" }}>
      <div className="container" style={{ paddingTop: '8rem', maxWidth: '800px', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {isEditing ? (
            <input 
              autoFocus
              onBlur={(e) => handleNameSave(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(e.target.value); }}
              defaultValue={name}
              style={{ 
                fontSize: '1.75rem', 
                fontWeight: 800, 
                color: '#1e1b4b',
                background: 'transparent',
                border: 'none',
                borderBottom: '3px solid #7c3aed',
                outline: 'none',
                textAlign: 'center',
                width: 'auto'
              }}
            />
          ) : (
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <h1 
                onClick={() => setIsEditing(true)}
                style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800, 
                  color: '#1e1b4b',
                  cursor: 'pointer',
                  marginBottom: '8px'
                }}
              >
                {name}
              </h1>
              <div style={{ width: '40px', height: '4px', background: '#7c3aed', borderRadius: '2px', margin: '0 auto' }}></div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ 
              background: 'white', 
              padding: '1.25rem', 
              borderRadius: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid #f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '1rem', 
                  backgroundColor: stat.bgColor, 
                  color: stat.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', lineHeight: 1.1 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
              <ChevronRight size={16} color="#e2e8f0" strokeWidth={3} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item, i) => (
            <div 
              key={i} 
              onClick={item.onClick}
              style={{ 
                background: item.isSubsection ? '#f8fafc' : (item.isActive ? '#fdfaff' : 'white'), 
                marginLeft: item.isSubsection ? '2.5rem' : '0',
                padding: item.isSubsection ? '0.75rem 1.25rem' : '1rem 1.5rem', 
                borderRadius: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: item.isActive ? '0 8px 25px rgba(124, 58, 237, 0.1)' : (item.isSubsection ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'),
                border: item.isActive ? '1.5px solid #7c3aed' : (item.isSubsection ? '1px dashed #e2e8f0' : '1px solid #f8fafc'),
                transition: 'all 0.3s ease',
                zIndex: item.isActive ? 5 : 1,
                opacity: item.isSubsection ? 0.9 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 2 }}>
                <div style={{ 
                  width: item.isSubsection ? '36px' : '42px', 
                  height: item.isSubsection ? '36px' : '42px', 
                  borderRadius: '0.75rem', 
                  backgroundColor: item.isActive ? '#7c3aed' : '#f3f0ff', 
                  color: item.isActive ? 'white' : '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: item.isSubsection ? '1rem' : '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: item.isActive ? '#7c3aed' : '#94a3b8' }}>{item.subtext}</div>
                </div>
              </div>
              
              {!item.isSubsection && item.bgIcon}
              
              <ChevronRight 
                size={item.isSubsection ? 14 : 18} 
                color={item.isActive ? '#7c3aed' : '#e2e8f0'} 
                strokeWidth={3} 
                style={{ 
                  zIndex: 2, 
                  transition: 'transform 0.3s ease',
                  transform: item.isActive ? 'rotate(90deg)' : 'rotate(0deg)'
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Premium Custom Bonus Modal */}
      {showBonusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.25rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #31108f 100%)',
              color: 'white',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Award size={32} color="#facc15" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>My Bonus Rewards</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Track your referral and promotional bonus cash</p>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowBonusModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 900
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <button 
                onClick={() => setActiveModalTab('offers')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  background: activeModalTab === 'offers' ? 'white' : 'transparent',
                  color: activeModalTab === 'offers' ? '#7c3aed' : '#64748b',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderBottom: activeModalTab === 'offers' ? '3px solid #7c3aed' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                🔥 Active Offers
              </button>
              <button 
                onClick={() => setActiveModalTab('history')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  background: activeModalTab === 'history' ? 'white' : 'transparent',
                  color: activeModalTab === 'history' ? '#7c3aed' : '#64748b',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderBottom: activeModalTab === 'history' ? '3px solid #7c3aed' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                📊 My Earnings ({bonusTransactions.length})
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem 1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
              {/* Total Bonus Banner */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '1.5rem',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Active Bonus</span>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e1b4b', marginTop: '2px' }}>₹{balance.bonus}</div>
                </div>
                <div style={{
                  background: '#fef9c3',
                  color: '#ca8a04',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #fef08a'
                }}>
                  100% Usable
                </div>
              </div>

              {/* Tab Contents */}
              {activeModalTab === 'offers' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Welcome Bonus Card */}
                  {parseFloat(bonusOffers.welcome_bonus) > 0 && (
                    <div style={{
                      padding: '1.25rem',
                      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                      borderRadius: '1.25rem',
                      borderLeft: '5px solid #a855f7',
                      borderTop: '1px solid #f3e8ff',
                      borderRight: '1px solid #f3e8ff',
                      borderBottom: '1px solid #f3e8ff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>Welcome SignUp Reward</span>
                          <span style={{ background: '#a855f7', color: 'white', fontSize: '0.55rem', fontWeight: 900, padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase' }}>Active</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>Get credited instantly upon registering your account!</p>
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7e22ce' }}>₹{bonusOffers.welcome_bonus}</div>
                    </div>
                  )}

                  {/* Daily Login Reward Card */}
                  {parseFloat(bonusOffers.daily_login_bonus) > 0 && (
                    <div style={{
                      padding: '1.25rem',
                      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      borderRadius: '1.25rem',
                      borderLeft: '5px solid #10b981',
                      borderTop: '1px solid #d1fae5',
                      borderRight: '1px solid #d1fae5',
                      borderBottom: '1px solid #d1fae5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>Daily Login Bonus</span>
                          <span style={{ background: '#10b981', color: 'white', fontSize: '0.55rem', fontWeight: 900, padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase' }}>Claim Daily</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>Open the app every single day to get free promotional cash!</p>
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#047857' }}>₹{bonusOffers.daily_login_bonus}</div>
                    </div>
                  )}

                  {/* First Deposit Bonus Card */}
                  {parseFloat(bonusOffers.first_deposit_bonus) > 0 && (
                    <div style={{
                      padding: '1.25rem',
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      borderRadius: '1.25rem',
                      borderLeft: '5px solid #0ea5e9',
                      borderTop: '1px solid #e0f2fe',
                      borderRight: '1px solid #e0f2fe',
                      borderBottom: '1px solid #e0f2fe',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>First Deposit Match</span>
                          <span style={{ background: '#0ea5e9', color: 'white', fontSize: '0.55rem', fontWeight: 900, padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase' }}>Boost Balance</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#075985', fontWeight: 600 }}>Get bonus added instantly on your very first wallet deposit!</p>
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369a1' }}>₹{bonusOffers.first_deposit_bonus}</div>
                    </div>
                  )}

                  {/* Refer and Earn Card */}
                  {(parseFloat(bonusOffers.referral_referrer_bonus) > 0 || parseFloat(bonusOffers.referral_referee_bonus) > 0) && (
                    <div style={{
                      padding: '1.25rem',
                      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                      borderRadius: '1.25rem',
                      borderLeft: '5px solid #f59e0b',
                      borderTop: '1px solid #fef3c7',
                      borderRight: '1px solid #fef3c7',
                      borderBottom: '1px solid #fef3c7'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>Refer & Earn Program</span>
                            <span style={{ background: '#f59e0b', color: 'white', fontSize: '0.55rem', fontWeight: 900, padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase' }}>Unlimited</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#78350f', fontWeight: 600 }}>Invite a friend to join and earn promotional cash together!</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', background: 'white', padding: '0.75rem', borderRadius: '12px' }}>
                        <div style={{ textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>YOU GET (REFERRER)</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706' }}>₹{bonusOffers.referral_referrer_bonus}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>THEY GET (REFEREE)</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706' }}>₹{bonusOffers.referral_referee_bonus}</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.4)',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px dashed #f59e0b'
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#78350f' }}>Your Invite Code: <b>{referralCode}</b></span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(referralCode);
                            alert('Referral Code copied successfully!');
                          }}
                          style={{
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* History Tab */
                bonusTransactions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No bonus transactions yet</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Claim check-ins or join matches to earn bonuses!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {bonusTransactions.map((tx) => (
                      <div key={tx.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '1rem',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b' }}>{tx.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', fontWeight: 600 }}>
                            {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: 900,
                          color: tx.type === 'credit' ? '#10b981' : '#ef4444'
                        }}>
                          {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
