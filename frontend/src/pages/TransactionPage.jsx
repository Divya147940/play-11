import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, CheckCircle2, ShieldCheck, Image as ImageIcon } from 'lucide-react';

const TransactionPage = () => {
  const navigate = useNavigate();
  const { type } = useParams(); // 'add' or 'withdraw'
  const isAdd = type === 'add';

  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [step, setStep] = useState('input'); // input, processing, success
  
  const handleAction = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const qrCode = window.qrCodeData;
    if (!isAdd && !upiId.includes('@') && !qrCode) {
      alert('Please enter a valid UPI ID or Upload QR Code');
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
      const endpoint = isAdd ? '/api/wallet/deposit' : '/api/wallet/withdraw';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: Number(amount), upiId, qrCode })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStep('success');
      } else {
        alert(data.error || data.message || 'Transaction failed');
        setStep('input');
      }
    } catch (error) {
      console.error('Transaction Error:', error);
      alert('Network error. Please try again.');
      setStep('input');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/balance')} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={20} color="#1e293b" />
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          {isAdd ? 'Add Money' : 'Withdraw Money'}
        </h2>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)', padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        {step === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Amount (₹)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g. 500)"
                style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', fontSize: '1.5rem', fontWeight: 800, outline: 'none', background: '#f8fafc' }}
              />
            </div>

            {!isAdd && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>UPI ID</label>
                  <input 
                    type="text" 
                    value={upiId} 
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', fontSize: '1.2rem', fontWeight: 700, outline: 'none', background: '#f8fafc' }}
                  />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase' }}>OR UPLOAD QR SCANNER</p>
                  <input 
                    type="file" 
                    id="qr-upload" 
                    accept="image/*" 
                    hidden 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          window.qrCodeData = reader.result;
                          alert('QR Code uploaded successfully!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label 
                    htmlFor="qr-upload"
                    style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', 
                      padding: '2rem', border: '2px dashed #cbd5e1', borderRadius: '20px', cursor: 'pointer',
                      background: '#f8fafc', transition: 'all 0.2s'
                    }}
                  >
                    <ImageIcon size={36} color="#64748b" />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#475569' }}>Click to Upload QR Image</span>
                  </label>
                  {window.qrCodeData && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#10b981', fontWeight: 800 }}>✅ QR Image Attached</p>
                  )}
                </div>

                <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={16} color="#10b981" /> Verified withdrawal destination
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              {[50, 100, 500, 1000].map(v => (
                <button key={v} onClick={() => setAmount(v)} style={{ flex: 1, padding: '12px 8px', borderRadius: '12px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#1e1b4b', cursor: 'pointer', fontSize: '1rem' }}>+₹{v}</button>
              ))}
            </div>

            <button 
              onClick={handleAction}
              style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', background: '#0d1f3c', color: 'white', border: 'none', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', marginTop: '1rem' }}
            >
              {isAdd ? 'Proceed to Pay' : 'Verify & Withdraw'}
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '60px', height: '60px', border: '4px solid #f1f5f9', borderTopColor: '#0ea5e9', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>Processing...</h4>
            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem' }}>Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <CheckCircle2 size={72} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h4 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e1b4b' }}>{isAdd ? 'Transaction Successful!' : 'Withdrawal Request Sent!'}</h4>
            <p style={{ color: '#64748b', marginTop: '12px', fontSize: '1.1rem', fontWeight: 600 }}>
              {isAdd 
                ? `₹${amount} has been added to your wallet.` 
                : `₹${amount} withdrawal request is pending admin approval.`}
            </p>
            <button 
              onClick={() => navigate('/balance')}
              style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', background: '#1e1b4b', color: 'white', border: 'none', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', marginTop: '2rem' }}
            >
              Back to Wallet
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default TransactionPage;
