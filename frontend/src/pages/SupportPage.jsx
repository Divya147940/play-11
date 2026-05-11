import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone, Search, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';

const SupportPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { 
      q: "How do I withdraw my winnings?", 
      a: "Go to 'My Balance' section in your profile and click on 'Withdraw'. You can transfer your winnings to your bank account or UPI after verifying your identity." 
    },
    { 
      q: "My quiz got stuck. What should I do?", 
      a: "Don't worry. If it was a technical issue on our end, your entry fee will be refunded within 24 hours. Please take a screenshot and send it to support@play11.global." 
    },
    { 
      q: "How is the ranking calculated?", 
      a: "Rankings are based on accuracy (correct answers) and speed (time taken to answer). If two users have the same score, the one who finished faster gets a higher rank." 
    },
    { 
      q: "Can I use multiple accounts?", 
      a: "No, our policy only allows one account per person to ensure fair play for everyone in the arena." 
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: "'Outfit', sans-serif" }}>
      <div className="container" style={{ paddingTop: '7rem', maxWidth: '800px', margin: '0 auto', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>Help & Support</h1>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '70px', 
            height: '70px', 
            background: 'rgba(124, 58, 237, 0.1)', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <LifeBuoy size={36} color="#7c3aed" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0d1f3c', marginBottom: '10px' }}>How can we help?</h2>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Search our FAQs or contact our support team 24/7.</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '3rem' }}>
          <input 
            type="text" 
            placeholder="Search for help topics..."
            style={{ 
              width: '100%', 
              padding: '1.25rem 1.5rem 1.25rem 3.5rem', 
              borderRadius: '20px', 
              border: '1px solid #e2e8f0',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          />
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '4rem' }}>
          <a href="mailto:support@play11.global" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <Mail size={28} color="#7c3aed" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: '4px' }}>Email Us</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Response in 2 hrs</p>
            </div>
          </a>
          <a href="https://wa.me/911234567890" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <MessageCircle size={28} color="#10b981" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: '4px' }}>WhatsApp</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Live chat support</p>
            </div>
          </a>
        </div>

        {/* FAQs */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ 
                  width: '100%', 
                  padding: '1.25rem', 
                  background: 'none', 
                  border: 'none', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 1.25rem 1.25rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 500 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div style={{ 
          marginTop: '4rem', 
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', 
          padding: '2rem', 
          borderRadius: '30px', 
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Still need help?</h3>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem', fontSize: '0.9rem' }}>Our support agents are available 24 hours a day, 7 days a week.</p>
          <button style={{ 
            background: 'white', 
            color: '#7c3aed', 
            border: 'none', 
            padding: '10px 24px', 
            borderRadius: '12px', 
            fontWeight: 800, 
            cursor: 'pointer' 
          }}>
            Call Us Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
