import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Gift, Clock, CheckCircle2, Copy, Search } from 'lucide-react';

const VouchersPage = () => {
  const navigate = useNavigate();
  const vouchers = [
    { id: 1, title: 'Welcome Bonus', code: 'WELCOME100', discount: '₹100 Bonus', expiry: 'Expires in 5 days', type: 'Bonus', color: '#7c3aed' },
    { id: 2, title: 'First Quiz Free', code: 'FREEARENA', discount: '100% OFF', expiry: 'Expires in 2 days', type: 'Free Entry', color: '#0ea5e9' },
    { id: 3, title: 'Mega Contest Pass', code: 'IPL2024', discount: '₹50 Discount', expiry: 'Expires in 12 hours', type: 'Discount', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: "'Outfit', sans-serif" }}>
      <div className="container" style={{ paddingTop: '7rem', maxWidth: '800px', margin: '0 auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Header */}
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>My Vouchers</h1>
        </div>

        {/* Promo Search */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <input 
            type="text" 
            placeholder="Enter promo code manually..."
            style={{ 
              width: '100%', 
              padding: '1.25rem 1.5rem 1.25rem 3.5rem', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none',
              background: 'white'
            }}
          />
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }} />
          <button style={{ 
            position: 'absolute', 
            right: '8px', 
            top: '8px', 
            bottom: '8px', 
            padding: '0 1.5rem', 
            borderRadius: '14px', 
            background: '#0d1f3c', 
            color: 'white', 
            border: 'none', 
            fontWeight: 800, 
            cursor: 'pointer' 
          }}>
            Apply
          </button>
        </div>

        {/* Vouchers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {vouchers.map(v => (
            <div key={v.id} style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '1.5rem', 
              border: '1px solid #f1f5f9',
              display: 'flex',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              {/* Ticket Notch effect */}
              <div style={{ position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #f1f5f9' }}></div>
              <div style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #f1f5f9' }}></div>

              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '18px', 
                background: `${v.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Gift size={32} color={v.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ fontSize: '0.8rem', color: v.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v.type}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                    <Clock size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{v.expiry}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '12px' }}>{v.discount}</h3>
                
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '10px 16px', 
                  borderRadius: '12px', 
                  border: '1.5px dashed #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#0d1f3c', letterSpacing: '2px' }}>{v.code}</span>
                  <button style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Copy size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>COPY</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State / Bottom Tip */}
        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'rgba(124, 58, 237, 0.03)', borderRadius: '24px', border: '1px dashed rgba(124, 58, 237, 0.2)' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            Play more quizzes to unlock exclusive rewards and custom vouchers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default VouchersPage;
