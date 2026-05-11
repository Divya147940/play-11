import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Calendar, Briefcase, ShieldCheck, ArrowRight, X, Menu } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    profession: '',
    isEighteenPlus: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) return setError('Please enter your full name');
    if (formData.mobile.length !== 10) return setError('Please enter a valid 10-digit mobile number');
    if (!formData.email.includes('@')) return setError('Please enter a valid email address');
    if (!formData.dob) return setError('Please select your date of birth');
    if (!formData.profession) return setError('Please select your profession');
    if (!formData.isEighteenPlus) return setError('You must be 18+ to join');

    setIsLoading(true);
    try {
      // In a real app, we would call the API here
      // For now, we simulate success and save to localStorage
      localStorage.setItem('user_name', formData.name);
      localStorage.setItem('user_mobile', formData.mobile);
      localStorage.setItem('user_profession', formData.profession);
      localStorage.setItem('play11_has_account', 'true');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to login page to complete authentication via OTP
      // We DO NOT remove 'auth_redirect' here, so OtpPage can use it after login.
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <header className="topbar" style={{ zIndex: 100 }}>
        <div className="topbar-inner">
          <div className="logo-boxes" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="logo-box">Q</div>
            <div className="logo-box">U</div>
            <div className="logo-box">Z</div>
            <div className="logo-box">O</div>
          </div>
          
          <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <a href="#home" onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}>Home</a>
            <a href="/how-it-works" onClick={(e) => { e.preventDefault(); navigate("/how-it-works"); setIsMenuOpen(false); }}>How it works</a>
            <a href="#contests" onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}>Contests</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}>FAQ</a>
          </nav>

          <div className="header-actions">
            <>
              <button className="secondary-btn desktop-only" style={{ padding: "10px 18px", borderRadius: "12px", fontSize: "14px", background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }} onClick={() => navigate("/register")}>
                Signup
              </button>
              <button className="login-btn desktop-only" style={{ background: '#3b82f6', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: 700, border: 'none' }} onClick={() => navigate("/login")}>
                Login
              </button>
            </>
            
            <button className="menu-toggle" style={{ background: 'none', border: 'none', color: 'white' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div className="auth-mesh-bg">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      <div className="auth-container">
        <div className="registration-card animate-slide-up">
          <div className="card-header">
            <h1 className="card-title">Your Quzo Journey Starts Here</h1>
            <p className="card-subtitle">
              Get early access to live quizzes and join 50,000+ serious aspirants.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-grid">
              {/* Candidate Name */}
              <div className="input-group">
                <label><User size={16} /> Candidate Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter full name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Mobile Number */}
              <div className="input-group">
                <label><Phone size={16} /> Mobile Number</label>
                <div className="mobile-input-wrapper">
                  <span className="prefix">+91</span>
                  <input 
                    type="tel" 
                    name="mobile"
                    placeholder="Enter 10-digit number" 
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, mobile: val }));
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email ID */}
              <div className="input-group">
                <label><Mail size={16} /> Mail ID</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* DOB */}
              <div className="input-group">
                <label><Calendar size={16} /> Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="date-input"
                />
              </div>

              {/* Profession Dropdown */}
              <div className="input-group full-width">
                <label><Briefcase size={16} /> Profession</label>
                <select 
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="profession-select"
                >
                  <option value="" disabled>Select your profession</option>
                  <option value="College Student">College Student</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Salaried">Salaried</option>
                </select>
              </div>
            </div>

            {/* 18+ Verification */}
            <div className="verification-row">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  name="isEighteenPlus"
                  checked={formData.isEighteenPlus}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">I confirm that I am 18 years or older</span>
              </label>
              <div className="age-notice">
                <ShieldCheck size={14} /> You must be 18+ only can login
              </div>
            </div>

            {error && <div className="error-message animate-fade-in">{error}</div>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                <>Join Now <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="footer-text">
            Already a member? <span className="link" onClick={() => navigate('/login')}>Sign In</span>
          </p>
        </div>
      </div>

      <style>{`
        .register-wrapper {
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          padding: 100px 24px 40px;
          font-family: 'Lexend', 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .auth-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: auto;
        }

        .auth-mesh-bg {
          display: none;
        }

        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.15;
          animation: morph-blob 20s infinite alternate ease-in-out;
        }

        .auth-blob-1 {
          width: 60vw;
          height: 60vw;
          background: #404eed;
          top: -20%;
          left: -10%;
        }

        .auth-blob-2 {
          width: 50vw;
          height: 50vw;
          background: #0369a1;
          bottom: -15%;
          right: -5%;
          animation-delay: -5s;
        }

        @keyframes morph-blob {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.1) translate(5%, 5%); }
        }

        .registration-card {
          width: 100%;
          max-width: 540px;
          background: white;
          border-radius: 32px;
          padding: 30px 40px 50px;
          position: relative;
          z-index: 10;
          box-shadow: none;
        }

        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #0d121f;
        }

        .card-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-boxes {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .logo-box {
          width: 42px;
          height: 42px;
          background: #0c4a6e;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 16px;
        }

        .card-title {
          font-size: 32px;
          font-weight: 850;
          color: #0f172a;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .card-subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 500;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .full-width {
          grid-column: span 2;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .input-group input, 
        .input-group select {
          padding: 14px 18px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .input-group input:focus, 
        .input-group select:focus {
          outline: none;
          border-color: #404eed;
          background: white;
          box-shadow: 0 0 0 4px rgba(64, 78, 237, 0.1);
        }

        .mobile-input-wrapper {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          overflow: hidden;
        }

        .prefix {
          padding: 0 14px;
          font-weight: 700;
          color: #64748b;
          border-right: 2px solid #f1f5f9;
        }

        .mobile-input-wrapper input {
          border: none !important;
          background: none !important;
          box-shadow: none !important;
          width: 100%;
        }

        .date-input {
          height: 100%;
        }

        .profession-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .verification-row {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 32px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          user-select: none;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 22px;
          width: 22px;
          background-color: #f1f5f9;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .checkbox-container:hover input ~ .checkmark {
          background-color: #e2e8f0;
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #404eed;
          border-color: #404eed;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2.5px 2.5px 0;
          transform: rotate(45deg);
        }

        .age-notice {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          width: fit-content;
        }

        .error-message {
          color: #ef4444;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
        }

        .submit-btn {
          margin-top: 10px;
          background: #404eed;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 750;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(64, 78, 237, 0.4);
        }

        .submit-btn:hover:not(:disabled) {
          background: #3641c8;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(64, 78, 237, 0.5);
        }

        .submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .footer-text {
          margin-top: 32px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
        }

        .link {
          color: #404eed;
          font-weight: 800;
          cursor: pointer;
        }

        .link:hover {
          text-decoration: underline;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (max-width: 640px) {
          .register-wrapper {
            padding-top: 80px;
          }
          .registration-card {
            padding: 10px 24px 30px;
            border-radius: 24px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .card-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
