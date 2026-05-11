import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Users, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

const AboutUsPage = () => {
  const navigate = useNavigate();

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>About Us</h1>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)'
          }}>
            <Sparkles size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0d1f3c', marginBottom: '1rem', lineHeight: 1.1 }}>
            India's Smartest <br /> <span style={{ color: '#0ea5e9' }}>Quiz Arena.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            We are on a mission to gamify learning and reward knowledge. QUZO is where your intelligence meets opportunity.
          </p>
        </div>

        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '4rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '30px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
              <Target size={28} color="#7c3aed" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b' }}>Our Mission</h3>
            </div>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem' }}>
              To provide a fair, transparent, and competitive platform where students and enthusiasts can test their skills, improve their knowledge, and earn rewards based strictly on their performance.
            </p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '30px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
              <Eye size={28} color="#0ea5e9" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b' }}>Our Vision</h3>
            </div>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem' }}>
              To become the world's leading destination for skill-based gaming, bridging the gap between education and entertainment through innovative technology and engaging user experiences.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '2rem', textAlign: 'center' }}>Why Choose QUZO?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '24px', textAlign: 'center' }}>
            <ShieldCheck size={32} color="#10b981" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontWeight: 800, color: '#064e3b', marginBottom: '5px' }}>Fair Play</h4>
            <p style={{ fontSize: '0.85rem', color: '#065f46', opacity: 0.8 }}>Strict anti-cheat policies and transparent rankings.</p>
          </div>
          <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '24px', textAlign: 'center' }}>
            <Trophy size={32} color="#3b82f6" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontWeight: 800, color: '#1e3a8a', marginBottom: '5px' }}>Skill Based</h4>
            <p style={{ fontSize: '0.85rem', color: '#1e40af', opacity: 0.8 }}>Success depends only on your knowledge and speed.</p>
          </div>
          <div style={{ background: '#fdf4ff', padding: '1.5rem', borderRadius: '24px', textAlign: 'center' }}>
            <Users size={32} color="#d946ef" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontWeight: 800, color: '#701a75', marginBottom: '5px' }}>Community</h4>
            <p style={{ fontSize: '0.85rem', color: '#86198f', opacity: 0.8 }}>Join thousands of scholars and compete globally.</p>
          </div>
          <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '24px', textAlign: 'center' }}>
            <Sparkles size={32} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontWeight: 800, color: '#78350f', marginBottom: '5px' }}>Rewards</h4>
            <p style={{ fontSize: '0.85rem', color: '#92400e', opacity: 0.8 }}>Instant payouts and exclusive prizes for top performers.</p>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
            © 2024 QUZO Arena. All Rights Reserved. <br />
            Powered by Play11 Technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
