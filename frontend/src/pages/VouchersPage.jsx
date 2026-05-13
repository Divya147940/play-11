import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Gift, Clock, CheckCircle2, Copy, Search, X, Sparkles, AlertCircle } from 'lucide-react';

const VouchersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [redeemStep, setRedeemStep] = useState('confirm'); // confirm, success
  const [copiedCode, setCopiedCode] = useState(null);

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const sessionRaw = localStorage.getItem('play11_session');
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

    try {
      const res = await fetch('/api/vouchers/my-vouchers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVouchers(data.vouchers.map(v => ({
          ...v,
          expiry: v.user_status === 'expired' ? 'Expired' : `Expires in ${v.expiry_days} days`,
          status: v.user_status || 'active',
          discount: v.discount_text
        })));
      }
    } catch (error) {
      console.error('Fetch Vouchers Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openRedeem = (v) => {
    if (v.status === 'used' || v.status === 'expired') return;
    setSelectedVoucher(v);
    setShowRedeemModal(true);
    setRedeemStep('confirm');
  };

  const handleRedeem = async (manualCode = null) => {
    const codeToRedeem = manualCode || selectedVoucher?.code;
    if (!codeToRedeem) return;

    const sessionRaw = localStorage.getItem('play11_session');
    let token;
    try {
      const session = JSON.parse(sessionRaw);
      token = session.token || sessionRaw;
    } catch (e) {
      token = sessionRaw;
    }

    setRedeemStep('processing');
    try {
      const res = await fetch('/api/vouchers/redeem', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: codeToRedeem })
      });
      const data = await res.json();
      
      if (data.success) {
        setRedeemStep('success');
        fetchVouchers(); // Refresh list
      } else {
        alert(data.message || 'Redemption failed');
        setRedeemStep('confirm');
        if (!manualCode) setShowRedeemModal(false);
      }
    } catch (error) {
      console.error('Redeem Error:', error);
      alert('Network error. Please try again.');
      setRedeemStep('confirm');
    }
  };

  const filteredVouchers = vouchers.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: "'Outfit', sans-serif" }}>
      <div className="container" style={{ paddingTop: '7rem', maxWidth: '800px', margin: '0 auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} color="#1e1b4b" />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>My Vouchers</h1>
        </div>

        {/* Promo Search */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <input 
            type="text" 
            placeholder="Search or enter code manually..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '1.25rem 1.5rem 1.25rem 3.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '1rem', fontWeight: 600, outline: 'none', background: 'white' }}
          />
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }} />
          <button 
            onClick={() => handleRedeem(searchTerm)}
            style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 1.5rem', borderRadius: '14px', background: '#0d1f3c', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
          >
            Apply
          </button>
        </div>

        {/* Vouchers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredVouchers.map(v => (
            <div 
              key={v.id} 
              onClick={() => openRedeem(v)}
              style={{ 
                background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem', position: 'relative', overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', cursor: v.status === 'expired' ? 'default' : 'pointer', opacity: v.status === 'expired' ? 0.7 : 1, transition: 'all 0.3s ease'
              }}
            >
              <div style={{ position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #f1f5f9' }}></div>
              <div style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #f1f5f9' }}></div>

              <div style={{ width: '80px', height: '80px', borderRadius: '18px', background: `${v.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {v.status === 'expired' ? <AlertCircle size={32} color="#94a3b8" /> : <Gift size={32} color={v.color} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ fontSize: '0.8rem', color: v.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v.type}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: v.status === 'expired' ? '#f43f5e' : '#94a3b8' }}>
                    <Clock size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{v.expiry}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '12px' }}>{v.discount}</h3>
                
                <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', border: '1.5px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#0d1f3c', letterSpacing: '2px' }}>{v.code}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(v.code); }}
                    style={{ background: 'none', border: 'none', color: copiedCode === v.code ? '#10b981' : '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {copiedCode === v.code ? <CheckCircle2 size={16} /> : <Copy size={16} />} 
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{copiedCode === v.code ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && selectedVoucher && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '32px', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b' }}>Redeem Voucher</h3>
                <button onClick={() => setShowRedeemModal(false)} style={{ background: '#f8fafc', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} color="#64748b" />
                </button>
              </div>

              <div style={{ padding: '2rem', textAlign: 'center' }}>
                {redeemStep === 'confirm' && (
                  <>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `${selectedVoucher.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <Ticket size={48} color={selectedVoucher.color} />
                    </div>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b' }}>{selectedVoucher.discount}</h4>
                    <p style={{ color: '#64748b', marginTop: '8px', fontWeight: 500 }}>Would you like to redeem this voucher for your account?</p>
                    
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button onClick={handleRedeem} style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', background: '#0d1f3c', color: 'white', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}>
                        Confirm Redemption
                      </button>
                      <button onClick={() => setShowRedeemModal(false)} style={{ width: '100%', padding: '1rem', borderRadius: '18px', background: 'transparent', color: '#64748b', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {redeemStep === 'processing' && (
                  <div style={{ padding: '2rem 0' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #f1f5f9', borderTopColor: selectedVoucher.color, borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b' }}>Verifying Code...</h4>
                  </div>
                )}

                {redeemStep === 'success' && (
                  <>
                    <Sparkles size={64} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b' }}>Voucher Applied!</h4>
                    <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1rem', fontWeight: 600 }}>Your benefits have been added to your profile.</p>
                    <button onClick={() => setShowRedeemModal(false)} style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', background: '#1e1b4b', color: 'white', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', marginTop: '2rem' }}>
                      Great!
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
};

export default VouchersPage;
