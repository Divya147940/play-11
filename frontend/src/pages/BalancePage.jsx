import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Landmark, History } from 'lucide-react';

const BalancePage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ coins: 0, points: 0, bonus: 0 });
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Quiz Won: IPL Special', amount: '+500', type: 'credit', date: 'Today, 2:30 PM' },
    { id: 2, title: 'Entry Fee: Banking Mock', amount: '-50', type: 'debit', date: 'Yesterday' },
    { id: 3, title: 'Bonus Received: Referral', amount: '+100', type: 'credit', date: '2 days ago' },
    { id: 4, title: 'Quiz Won: Player Knowledge', amount: '+200', type: 'credit', date: '3 days ago' },
  ]);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    if (!sessionRaw) {
      setLoading(false);
      return;
    }
    
    let token;
    try {
      const session = JSON.parse(sessionRaw);
      token = session.token || sessionRaw;
    } catch (e) {
      token = sessionRaw;
    }

    fetch('/api/auth/balance', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBalance(data.balance);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: "'Outfit', sans-serif" }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p style={{ fontWeight: 800, color: '#64748b' }}>Loading Wallet...</p>
        </div>
      ) : (
        <div className="container" style={{ paddingTop: '7rem', maxWidth: '800px', margin: '0 auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '12px', 
              background: 'white', 
              border: '1px solid #e2e8f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} color="#1e1b4b" />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>My Balance</h1>
        </div>

        {/* Balance Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0d1f3c 0%, #1e1b4b 100%)', 
          borderRadius: '30px', 
          padding: '2.5rem', 
          color: 'white',
          boxShadow: '0 20px 40px rgba(13, 31, 60, 0.2)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Decorative Circles */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem', fontWeight: 600 }}>Total Balance</p>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>₹{balance.coins}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
              <Wallet size={32} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '4px' }}>Points</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{balance.points}</p>
            </div>
            <div style={{ width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '4px' }}>Bonus</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{balance.bonus}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
          <button style={{ 
            background: '#0ea5e9', 
            color: 'white', 
            border: 'none', 
            padding: '1.25rem', 
            borderRadius: '20px', 
            fontWeight: 800, 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)'
          }}>
            <Plus size={20} /> Add Money
          </button>
          <button style={{ 
            background: 'white', 
            color: '#1e1b4b', 
            border: '1px solid #e2e8f0', 
            padding: '1.25rem', 
            borderRadius: '20px', 
            fontWeight: 800, 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <Landmark size={20} /> Withdraw
          </button>
        </div>

        {/* Transaction History */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={20} color="#7c3aed" /> Recent Activity
            </h3>
            <button style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 700, cursor: 'pointer' }}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '20px', 
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '14px', 
                    background: tx.type === 'credit' ? '#f0fdf4' : '#fff1f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={24} color="#10b981" /> : <ArrowUpRight size={24} color="#f43f5e" />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: '2px' }}>{tx.title}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{tx.date}</p>
                  </div>
                </div>
                <p style={{ 
                  fontWeight: 800, 
                  fontSize: '1.1rem', 
                  color: tx.type === 'credit' ? '#10b981' : '#f43f5e' 
                }}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default BalancePage;
