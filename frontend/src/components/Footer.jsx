import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Phone, MessageSquare, Globe, ArrowRight } from 'lucide-react';
import logo from '../assets/logo-play11.png';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <img src={logo} alt="Play11" style={{ height: '44px', width: 'auto', marginBottom: '1.5rem' }} />
            <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <button className="social-icon flex-center"><Mail size={20} /></button>
               <button className="social-icon flex-center"><Phone size={20} /></button>
               <button className="social-icon flex-center"><MessageSquare size={20} /></button>
               <button className="social-icon flex-center"><Globe size={20} /></button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Explore Zones</h4>
            <ul>
              <li onClick={() => navigate('/study-home')}>Study Arena</li>
              <li onClick={() => navigate('/game-home')}>Game Arena</li>
              <li onClick={() => navigate('/match-list')}>Match Predictions</li>
              <li onClick={() => navigate('/history')}>History & Archives</li>
            </ul>
          </div>

          <div className="footer-links">
             <h4>Your Profile</h4>
             <ul>
               <li onClick={() => navigate('/profile')}>Personal Stats</li>
               <li onClick={() => navigate('/login')}>Access Account</li>
               <li onClick={() => navigate('/admin')}>Elite Panel</li>
               <li onClick={() => navigate('/otp')}>Verification</li>
             </ul>
          </div>

          <div className="footer-links">
             <h4>Company</h4>
             <ul>
               <li>About Play11</li>
               <li>Privacy Policy</li>
               <li>Terms of Use</li>
               <li>Partner With Us</li>
             </ul>
          </div>
        </div>

        <div className="footer-bottom">
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', fontWeight: 700, fontSize: '0.85rem' }}>
              <div className="flex-center" style={{ width: '24px', height: '24px', background: 'hsla(var(--primary), 0.1)', color: 'hsl(var(--primary))', borderRadius: '50%' }}>
                 <Sparkles size={12} fill="currentColor" />
              </div>
              © {year} Play11 Global Arena. All Rights Reserved.
           </div>
           <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', fontWeight: 700, color: 'hsl(var(--muted-foreground))' }}>
              <span>Secure Connection</span>
              <span>v2.0.4 Premium</span>
           </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.5);
          padding: 5rem 0 3rem;
          margin-top: 5rem;
        }
        .footer-grid {
          display: grid;
          gap: 3rem;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          margin-bottom: 4rem;
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
        .footer-links h4 {
          font-family: 'Lexend', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: hsl(var(--foreground));
        }
        .footer-links ul { list-style: none; }
        .footer-links li {
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .footer-links li:hover { color: hsl(var(--primary)); padding-left: 5px; }
        .social-icon {
          width: 44px; height: 44px;
          border-radius: 1rem;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .social-icon:hover { 
          transform: translateY(-4px); 
          color: hsl(var(--primary));
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
