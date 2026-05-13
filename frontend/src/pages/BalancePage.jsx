import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Landmark, History, X, CheckCircle2, ShieldCheck } from 'lucide-react';

const BalancePage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ coins: 0, points: 0, bonus: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [step, setStep] = useState('input'); // input, processing, success
  
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Quiz Won: IPL Special', amount: '+500', type: 'credit', status: 'success', date: 'Today, 2:30 PM' },
    { id: 2, title: 'Entry Fee: Banking Mock', amount: '-50', type: 'debit', status: 'success', date: 'Yesterday' },
    { id: 3, title: 'Withdrawal: Bank Transfer', amount: '-1000', type: 'debit', status: 'pending', date: 'Yesterday' },
    { id: 4, title: 'Bonus Received: Referral', amount: '+100', type: 'credit', status: 'success', date: '2 days ago' },
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

    const headers = { 'Authorization': `Bearer ${token}` };

    // Fetch Balance
    fetch('/api/wallet/balance', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBalance(data.balance);
        }
      })
      .catch(console.error);

    // Fetch Transactions
    fetch('/api/wallet/transactions', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(data.transactions.map(tx => ({
            ...tx,
            amount: (tx.type === 'credit' ? '+' : '') + tx.amount,
            date: new Date(tx.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
          })));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (type) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (type === 'withdraw' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID');
      return;
    }

    const sessionRaw = localStorage.getItem('play11_session') || localStorage.getItem('play11_admin_session');
    let token;
    try {
      const session = JSON.parse(sessionRaw);
      token = session.token || sessionRaw;
    } catch (e) {
      token = sessionRaw;
    }

    setStep('processing');
    
    try {
      const endpoint = type === 'add' ? '/api/wallet/add-money' : '/api/wallet/withdraw';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: Number(amount), upiId })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStep('success');
        // Refresh balance
        const balRes = await fetch('/api/wallet/balance', { headers: { 'Authorization': `Bearer ${token}` } });
        const balData = await balRes.json();
        if (balData.success) setBalance(balData.balance);
      } else {
        alert(data.message || 'Transaction failed');
        setStep('input');
      }
    } catch (error) {
      console.error('Transaction Error:', error);
      alert('Network error. Please try again.');
      setStep('input');
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setShowWithdrawModal(false);
    setAmount('');
    setUpiId('');
    setStep('input');
  };

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
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              background: '#0ea5e9', color: 'white', border: 'none', padding: '1.25rem', borderRadius: '20px', fontWeight: 800, fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)'
            }}
          >
            <Plus size={20} /> Add Money
          </button>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            style={{ 
              background: 'white', color: '#1e1b4b', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '20px', fontWeight: 800, fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer'
            }}
          >
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
                background: 'white', padding: '1.25rem', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '14px', background: tx.type === 'credit' ? '#f0fdf4' : '#fff1f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={24} color="#10b981" /> : <ArrowUpRight size={24} color="#f43f5e" />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontWeight: 700, color: '#1e1b4b' }}>{tx.title}</p>
                      {tx.status === 'pending' && (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#fffbeb', color: '#b45309', borderRadius: '999px', fontWeight: 800, textTransform: 'uppercase' }}>Pending</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{tx.date}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: tx.type === 'credit' ? '#10b981' : '#f43f5e' }}>{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL SYSTEM */}
        {(showAddModal || showWithdrawModal) && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b' }}>{showAddModal ? 'Add Money' : 'Withdraw Money'}</h3>
                <button onClick={resetModal} style={{ background: '#f8fafc', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} color="#64748b" />
                </button>
              </div>

              <div style={{ padding: '2rem' }}>
                {step === 'input' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Amount (₹)</label>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount (e.g. 500)"
                        style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', fontSize: '1.5rem', fontWeight: 800, outline: 'none', background: '#f8fafc' }}
                      />
                    </div>

                    {showWithdrawModal && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>UPI ID</label>
                        <input 
                          type="text" 
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', fontSize: '1.1rem', fontWeight: 700, outline: 'none', background: '#f8fafc' }}
                        />
                        <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <ShieldCheck size={14} color="#10b981" /> Verified withdrawal destination
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[50, 100, 500, 1000].map(v => (
                        <button key={v} onClick={() => setAmount(v)} style={{ flex: 1, padding: '8px', borderRadius: '10px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#1e1b4b', cursor: 'pointer', fontSize: '0.8rem' }}>+₹{v}</button>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleAction(showAddModal ? 'add' : 'withdraw')}
                      style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', background: '#0d1f3c', color: 'white', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem' }}
                    >
                      {showAddModal ? 'Proceed to Pay' : 'Verify & Withdraw'}
                    </button>
                  </div>
                )}

                {step === 'processing' && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #f1f5f9', borderTopColor: '#0ea5e9', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b' }}>Processing...</h4>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Please do not close this window</p>
                  </div>
                )}

                {step === 'success' && (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b' }}>Transaction Successful!</h4>
                    <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1rem', fontWeight: 600 }}>₹{amount} has been {showAddModal ? 'added to' : 'debited from'} your wallet.</p>
                    <button 
                      onClick={resetModal}
                      style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', background: '#1e1b4b', color: 'white', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', marginTop: '2rem' }}
                    >
                      Awesome!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        </div>
      )}
    </div>
  );
};

export default BalancePage;
