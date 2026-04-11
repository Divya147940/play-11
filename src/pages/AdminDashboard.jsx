import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, BookOpen, Trophy, 
  Settings, LayoutDashboard, PlusCircle, 
  AlertCircle, ChevronRight, Search, 
  MoreVertical, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [statsData, setStatsData] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatsData(data.stats);
          
          // Map backend recent activity to UI format
          const mappedUsers = data.recentActivity.map(act => ({
            name: act.name || 'Anonymous User',
            mobile: act.mobile ? act.mobile.substring(0,2) + '*** **' + act.mobile.substring(act.mobile.length-3) : 'N/A',
            status: act.user_status === 'active' ? 'Active' : 'Blocked',
            joined: new Date(act.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            score: act.total_score
          }));
          setRecentUsers(mappedUsers);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Users', value: statsData ? statsData.users : '...', change: '+12.5%', isUp: true, icon: <Users size={22} /> },
    { label: 'Active Quizzes', value: statsData ? statsData.quizzes : '...', change: '+5.2%', isUp: true, icon: <BookOpen size={22} /> },
    { label: 'Live Matches', value: statsData ? statsData.matches : '...', change: '+2', isLive: true, isUp: true, icon: <Trophy size={22} /> },
    { label: 'Submissions', value: statsData ? statsData.submissions : '...', change: 'Live', isUp: true, icon: <Globe size={22} /> }
  ];

  const SidebarItem = ({ icon, label }) => (
    <div 
      onClick={() => {
        setActiveTab(label);
        setIsSidebarOpen(false);
      }}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '0.85rem 1.25rem', 
        borderRadius: '1rem',
        cursor: 'pointer',
        background: activeTab === label ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))' : 'transparent',
        color: activeTab === label ? 'white' : 'hsl(var(--muted-foreground))',
        fontWeight: activeTab === label ? '800' : '600',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: activeTab === label ? '0 10px 25px -5px hsl(var(--primary) / 0.4)' : 'none'
      }}
    >
      {React.cloneElement(icon, { size: 20 })} <span style={{ fontSize: '0.95rem' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white', color: 'hsl(var(--foreground))', position: 'relative' }}>
      {/* Background Decorative Glow */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'radial-gradient(circle at 80% 0%, hsl(var(--primary) / 0.05), transparent 40%)', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* Sidebar - Pro Dashboard Style */}
      <div style={{ 
        width: '300px', 
        background: 'white', 
        borderRight: '1px solid hsl(var(--card-border))', 
        padding: '2.5rem 1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        zIndex: 100,
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      }} className="sidebar-desktop">
        <div style={{ padding: '0 1rem', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', 
              borderRadius: '1.25rem',
              boxShadow: '0 10px 20px -5px hsl(var(--primary) / 0.3)'
            }} className="flex-center">
               <Trophy size={22} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Lexend', letterSpacing: '-0.04em' }}>Play11 <span style={{ color: 'hsl(var(--primary))' }}>HQ</span></h2>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'hsl(var(--muted-foreground))', padding: '0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>Command Centre</p>
          <SidebarItem icon={<LayoutDashboard />} label="Overview" />
          <SidebarItem icon={<Users />} label="Users" />
          <SidebarItem icon={<BookOpen />} label="Study Zone" />
          <SidebarItem icon={<Trophy />} label="Match Zone" />
          <SidebarItem icon={<BarChart3 />} label="Analytics" />
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <SidebarItem icon={<Settings />} label="Settings" />
          <div className="bento-card" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--card-border))' }}>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem', fontWeight: 700 }}>Storage Alert</p>
            <div style={{ height: '6px', width: '100%', background: 'white', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <div style={{ width: '68%', height: '100%', background: 'hsl(var(--primary))' }}></div>
            </div>
            <p style={{ fontSize: '0.7rem', fontWeight: 800 }}>6.4 / 10 GB Used</p>
          </div>
        </div>
      </div>

      {/* Overlay for Sidebar Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90, backdropFilter: 'blur(4px)' }}
        ></div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: 'clamp(1rem, 5vw, 3rem)', overflowX: 'hidden', position: 'relative', zIndex: 1, marginLeft: '0px' }} className="main-content-admin">
        {/* Top Header Mobile/Desktop */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="flex-center sidebar-toggle"
                 style={{ width: '44px', height: '44px', background: 'hsl(var(--muted))', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}
               >
                 <LayoutDashboard size={20} />
               </button>
               <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, fontFamily: 'Lexend' }}>Dashboard Overview</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} color="hsl(var(--primary))" /> {time.toLocaleTimeString()}</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                Optimal Status
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: 'max-content' }} className="header-actions-admin">
            <button className="btn-elite btn-elite-primary" style={{ padding: '0 1.5rem', height: '52px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              <PlusCircle size={18} strokeWidth={2.5} style={{ marginRight: '0.5rem' }} /> Create Quiz
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'Overview' && (
          <div className="animate-elite">
            {/* Bento Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {stats.map((stat, i) => (
                <div key={i} className="bento-card" style={{ padding: '1.75rem', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '1.25rem', 
                      background: 'hsl(var(--muted))', 
                      border: '1px solid hsl(var(--card-border))',
                      color: i === 0 ? 'hsl(var(--primary))' : (i === 1 ? '#10b981' : (i === 2 ? '#ef4444' : '#fbbf24'))
                    }} className="flex-center">
                      {stat.icon}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 900, 
                      color: stat.isUp ? '#10b981' : '#ef4444',
                      background: stat.isUp ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      padding: '4px 10px',
                      borderRadius: '2rem'
                    }}>
                      {stat.change}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{stat.label}</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Lexend' }}>{stat.value}</h3>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
               <div className="bento-card" style={{ padding: '2rem', background: 'white', flex: 1.5 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Lexend' }}>Recent Activity</h3>
                   <button onClick={() => setActiveTab('Users')} style={{ fontSize: '0.8rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>View All</button>
                 </div>
                 <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                       <tbody>
                          {recentUsers.map((user, i) => (
                            <tr key={i} style={{ background: 'hsl(var(--muted))' }}>
                               <td style={{ padding: '1.25rem', borderRadius: '1rem 0 0 1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                     <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', background: 'white', fontWeight: 900 }} className="flex-center">{user.name.charAt(0)}</div>
                                     <span style={{ fontWeight: 800 }}>{user.name}</span>
                                  </div>
                               </td>
                               <td style={{ padding: '1.25rem' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 900, padding: '4px 8px', borderRadius: '4px', background: user.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: user.status === 'Active' ? '#10b981' : '#ef4444' }}>{user.status}</span>
                               </td>
                               <td style={{ padding: '1.25rem', borderRadius: '0 1rem 1rem 0', textAlign: 'right' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{user.joined}</span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </div>
               
               <div className="bento-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, hsl(var(--primary) / 0.05), white)', border: '1px solid hsl(var(--primary) / 0.1)' }}>
                  <h4 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'hsl(var(--primary))' }}>Quick Insights</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                     <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}>
                        <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, marginBottom: '0.25rem' }}>HIGHEST ENGAGEMENT</p>
                        <p style={{ fontWeight: 800, fontSize: '1.25rem' }}>Mega Quiz 24</p>
                     </div>
                     <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', border: '1px solid hsl(var(--card-border))' }}>
                        <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', fontWeight: 800, marginBottom: '0.25rem' }}>USER RETENTION</p>
                        <p style={{ fontWeight: 800, fontSize: '1.25rem', color: '#10b981' }}>92.4%</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab !== 'Overview' && (
          <div className="bento-card animate-elite" style={{ padding: '2rem', background: 'white', minHeight: '60vh' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Lexend', marginBottom: '2rem' }}>{activeTab} Management</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', color: 'hsl(var(--muted-foreground))' }}>
              <p style={{ fontWeight: 600 }}>Detailed {activeTab} control panel is under synthesis.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar-desktop {
            transform: translateX(0) !important;
          }
          .main-content-admin {
            margin-left: 300px !important;
          }
          .sidebar-toggle {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .main-content-admin {
            margin-left: 0 !important;
          }
          .header-actions-admin {
            max-width: 100% !important;
          }
        }
      `}</style>
      <style>{`
        .shimmer-hover:hover {
          background: white !important;
          transform: translateX(4px);
          transition: all 0.3s ease;
          box-shadow: var(--shadow-elite);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
