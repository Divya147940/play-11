import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronRight, ShieldCheck, History, Award, Mail, Wallet, Trophy, Ticket, Gamepad2, MoreHorizontal, Headphones, MoreVertical, FileText, Info } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const isGuest = !localStorage.getItem('play11_session');
  const mobile = localStorage.getItem('user_mobile') || 'Not Linked';
  const getInitialName = () => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) return storedName;
    
    const userStr = localStorage.getItem('play11_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.name) return user.name;
      } catch (e) {}
    }
    return isGuest ? 'Guest Explorer' : 'Scholar';
  };

  const [name, setName] = React.useState(getInitialName());
  const [isEditing, setIsEditing] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);

  const handleNameSave = (newName) => {
    localStorage.setItem('user_name', newName);
    setName(newName);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('play11_session');
    localStorage.removeItem('play11_user');
    localStorage.removeItem('user_mobile');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const stats = [
    { label: 'QUIZZES', value: '24', icon: <History size={24} />, bgColor: '#f3f0ff', iconColor: '#7c3aed' },
    { label: 'WINS', value: '12', icon: <Award size={24} />, bgColor: '#fffbeb', iconColor: '#f59e0b' },
    { label: 'POINTS', value: '4.5k', icon: <ShieldCheck size={24} />, bgColor: '#f0fdf4', iconColor: '#10b981' }
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
    ] : []),
    { 
      icon: isGuest ? <User size={20} /> : <LogOut size={20} />, 
      title: isGuest ? 'Sign In / Register' : 'Logout', 
      subtext: isGuest ? 'Access your account or create a new one' : 'Terminate your current session', 
      onClick: isGuest ? () => navigate('/login') : handleLogout,
      bgIcon: <User size={64} style={{ opacity: 0.05, position: 'absolute', right: '40px', transform: 'rotate(-10deg)' }} />
    }
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)';
                if (!item.isActive && !item.isSubsection) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (!item.isActive && !item.isSubsection) e.currentTarget.style.backgroundColor = 'white';
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
    </div>
  );
};

export default ProfilePage;
