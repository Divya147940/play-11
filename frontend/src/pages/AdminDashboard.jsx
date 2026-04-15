import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, BookOpen, Trophy, 
  Settings, LayoutDashboard, PlusCircle, 
  AlertCircle, ChevronRight, Search, 
  MoreVertical, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Globe, Lock, Unlock, Edit, Trash2, Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/dashboard');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStatsData(statsData.stats);
        setRecentUsers(statsData.recentActivity);
      }

      if (activeTab === 'Users') {
        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        if (usersData.success) setAllUsers(usersData.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleToggleUser = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

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
      {/* Sidebar */}
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
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', borderRadius: '1.25rem' }} className="flex-center">
               <Shield size={22} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Play11 HQ</h2>
          </div>
        </div>
        <SidebarItem icon={<LayoutDashboard />} label="Overview" />
        <SidebarItem icon={<Users />} label="Users" />
        <SidebarItem icon={<BookOpen />} label="Study Zone" />
        <SidebarItem icon={<Trophy />} label="Match Zone" />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 'clamp(1rem, 5vw, 3rem)', marginLeft: '0px' }} className="main-content-admin">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
           <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>{activeTab} Control</h1>
           <button onClick={() => setIsSidebarOpen(true)} className="sidebar-toggle" style={{ display: 'none' }}><LayoutDashboard /></button>
        </div>

        {activeTab === 'Overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
               <div className="bento-card" style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))' }}>TOTAL USERS</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{statsData?.users || 0}</h3>
               </div>
               <div className="bento-card" style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'hsl(var(--muted-foreground))' }}>ACTIVE QUIZZES</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{statsData?.quizzes || 0}</h3>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className="animate-elite bento-card" style={{ padding: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: 800 }}>{user.name || 'Anonymous'}</p>
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>{user.mobile}</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '1rem', 
                        fontSize: '0.7rem', 
                        fontWeight: 900, 
                        background: user.status === 'active' ? '#10b98115' : '#ef444415',
                        color: user.status === 'active' ? '#10b981' : '#ef4444'
                      }}>{user.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleToggleUser(user.id, user.status)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: user.status === 'active' ? '#ef4444' : '#10b981' }}
                      >
                        {user.status === 'active' ? <Lock size={20} /> : <Unlock size={20} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Study Zone' && (
          <div className="animate-elite">
            <div className="bento-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem' }}>Add New Study Quiz</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const quizData = Object.fromEntries(formData.entries());
                quizData.zone_id = 'study-zone';
                try {
                  const res = await fetch('/api/admin/quizzes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(quizData)
                  });
                  if ((await res.json()).success) {
                    alert('Quiz Added successfully!');
                    e.target.reset();
                    fetchData();
                  }
                } catch(err) { console.error(err); }
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <input name="title" placeholder="Quiz Title" className="morphism-input" required />
                  <input name="category_id" placeholder="Category (e.g., cat-1)" className="morphism-input" required />
                  <input name="total_questions" type="number" placeholder="Total Questions" className="morphism-input" required />
                  <input name="timer_minutes" type="number" placeholder="Timer (Minutes)" className="morphism-input" required />
                  <input name="marks_per_q" type="number" placeholder="Marks Per Question" className="morphism-input" defaultValue="2" />
                </div>
                <textarea name="description" placeholder="Short Description..." className="morphism-input" style={{ width: '100%', minHeight: '100px', marginBottom: '1.5rem' }}></textarea>
                <button type="submit" className="btn-elite btn-elite-primary" style={{ padding: '1rem 2rem' }}>Deploy Quiz to Arena</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'Match Zone' && (
          <div className="animate-elite">
            <div className="bento-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem' }}>Add Live Match</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const matchData = Object.fromEntries(formData.entries());
                try {
                  const res = await fetch('/api/admin/matches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(matchData)
                  });
                  if ((await res.json()).success) {
                    alert('Match Added successfully!');
                    e.target.reset();
                    fetchData();
                  }
                } catch(err) { console.error(err); }
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <input name="team_a" placeholder="Team A" className="morphism-input" required />
                  <input name="team_b" placeholder="Team B" className="morphism-input" required />
                  <input name="sport_type" placeholder="Sport (Cricket/Football)" className="morphism-input" required />
                  <input name="venue" placeholder="Venue" className="morphism-input" required />
                  <input name="start_time" type="datetime-local" className="morphism-input" required />
                </div>
                <button type="submit" className="btn-elite btn-elite-primary" style={{ padding: '1rem 2rem' }}>Announce Match</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar-desktop { transform: translateX(0) !important; }
          .main-content-admin { margin-left: 300px !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
