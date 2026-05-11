import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Phone, MessageSquare, Globe } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="logo-boxes" onClick={() => navigate('/')} style={{ cursor: 'pointer', marginBottom: '1.25rem' }}>
              <div className="logo-box">Q</div>
              <div className="logo-box">U</div>
              <div className="logo-box">Z</div>
              <div className="logo-box">O</div>
            </div>
            <p className="footer-desc">
              The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena.
            </p>
            <div className="social-row">
               <button className="social-icon-btn"><Mail size={18} /></button>
               <button className="social-icon-btn"><Phone size={18} /></button>
               <button className="social-icon-btn"><MessageSquare size={18} /></button>
               <button className="social-icon-btn"><Globe size={18} /></button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Explore Zones</h4>
            <ul>
              <li onClick={() => navigate('/study-home')}>Study Arena</li>
              <li onClick={() => navigate('/game-home')}>Game Arena</li>

              <li onClick={() => navigate('/history')}>History & Archives</li>
            </ul>
          </div>

          <div className="footer-links-col">
             <h4>Your Profile</h4>
             <ul>
               <li onClick={() => navigate('/profile')}>Personal Stats</li>
               <li onClick={() => navigate('/login')}>Access Account</li>
             </ul>
          </div>

          <div className="footer-links-col">
             <h4>Company</h4>
             <ul>
               <li onClick={() => navigate('/legal#privacy')}>Privacy Policy</li>
                <li onClick={() => navigate('/legal#refund')}>Refund Policy</li>
               <li onClick={() => navigate('/legal#terms')}>Terms of Use</li>
               <li onClick={() => navigate('/legal#refer')}>Refer & Earn</li>
                <li onClick={() => navigate('/legal#contact')}>Contact Us</li>
                <li onClick={() => navigate('/legal#disclaimer')}>Disclaimer</li>
             </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
            <div className="copyright-flex">
               <div className="spark-circle">
                  <Sparkles size={10} fill="currentColor" />
               </div>
               <span>© {year} QUZO Global Arena. All Rights Reserved.</span>
            </div>
            <div className="footer-info-tags">
               <span>Secure Connection</span>
               <span>v2.0.4 Premium</span>
            </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #020617; /* Deep Black */
          color: #94a3b8;
          padding: 3.5rem 0 2rem;
          margin-top: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .footer-grid {
          display: grid;
          gap: 2.5rem;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          margin-bottom: 3rem;
        }

        .footer-brand .footer-desc {
          color: #64748b;
          font-weight: 500;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 320px;
        }

        .social-row { display: flex; gap: 0.75rem; }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-icon-btn:hover { 
          background: rgba(255, 255, 255, 0.08);
          color: #38bdf8;
          transform: translateY(-3px);
        }

        .footer-links-col h4 {
          font-size: 0.95rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
          color: #f8fafc;
          letter-spacing: 0.02em;
        }

        .footer-links-col ul { list-style: none; padding: 0; margin: 0; }
        
        .footer-links-col li {
          color: #64748b;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .footer-links-col li:hover { color: #38bdf8; }

        .footer-bottom-bar {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
        }

        .copyright-flex { display: flex; align-items: center; gap: 0.5rem; }
        
        .spark-circle {
          width: 20px; height: 20px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-info-tags { display: flex; gap: 1.5rem; }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .site-footer { padding: 2.5rem 0 1.5rem; }
          .footer-grid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 2rem 1rem; 
            margin-bottom: 2rem;
          }
          .footer-brand { 
            grid-column: 1 / -1; 
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .logo-boxes { justify-content: center; }
          .social-row { justify-content: center; width: 100%; }
          .footer-brand .footer-desc { 
            margin-left: auto; 
            margin-right: auto;
            font-size: 0.85rem;
          }
          .footer-links-col h4 { margin-bottom: 1rem; font-size: 0.9rem; }
          .footer-links-col li { font-size: 0.8rem; margin-bottom: 0.6rem; }
          .footer-bottom-bar { 
            flex-direction: column; 
            text-align: center; 
            padding-top: 1.5rem;
            gap: 1.5rem;
          }
          .footer-info-tags { justify-content: center; width: 100%; }
        }
        @media (max-width: 480px) {
           .footer-grid { gap: 1.5rem 0.75rem; }
           .footer-links-col { padding: 0 5px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
