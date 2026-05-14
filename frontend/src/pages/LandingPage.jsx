import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Home, Trophy, Wallet, BarChart3, User, Check, ArrowRight, Zap } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check login state on mount
    const user = localStorage.getItem("play11_user");
    setIsLoggedIn(!!user);
  }, []);

  const handleJoinContest = () => {
    navigate("/home-choice");
  };

  const handleOpenLogin = () => {
    navigate("/login");
  };

  const handleSendOtp = () => {
    setOtpStep(true);
  };

  const handleVerify = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setOtpStep(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowLogin(false);
    setOtpStep(false);
  };

  return (
    <div className="page">
      <header className="topbar">
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
            <a href="#contests" onClick={() => setIsMenuOpen(false)}>Contests</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            {/* Removed redundant buttons */}
          </nav>

          <div className="header-actions">
            <>
              <button className="secondary-btn desktop-only" style={{ padding: "10px 18px", borderRadius: "12px", fontSize: "14px" }} onClick={() => navigate("/register")}>
                Signup
              </button>
              <button className="login-btn desktop-only" onClick={handleOpenLogin}>
                Login
              </button>
            </>
            
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="badge">India’s Smartest Quiz Arena 🧠</div>
            <h1>
              Earn from <br />
              <span>what you learn</span>
            </h1>
            <p>
              compete in real quiz battles, rank higher, win real prizes.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={handleJoinContest}>Explore Quiz</button>
              <button className="secondary-btn">Watch Demo</button>
            </div>
            <div className="stats-row">
              <div className="stat-card">
                <strong>50K+</strong>
                <span>Active Players</span>
              </div>
              <div className="stat-card">
                <strong>₹10L+</strong>
                <span>Prize Distributed</span>
              </div>
              <div className="stat-card">
                <strong>1000+</strong>
                <span>Daily Contests</span>
              </div>
              <div className="stat-card">
                <strong>4.8★</strong>
                <span>User Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section white" id="how">
        <div className="section-inner">
          <div className="center-head">
            <div className="eyebrow">Steps</div>
            <h2>How to join</h2>
            <div className="subtext">
              Join live quizzes, compete with others, and prove your knowledge under real-time pressure.
            </div>
          </div>
          <div className="steps-grid">
            <div className="panel">
              <div className="step-num">1</div>
              <h3>Login</h3>
              <p>Sign in with mobile number and access your dashboard.</p>
            </div>
            <div className="panel">
              <div className="step-num">2</div>
              <h3>Choose live quiz</h3>
              <p>Select an upcoming live quiz with a fixed start and end time.</p>
            </div>
            <div className="panel">
              <div className="step-num">3</div>
              <h3>Unlock quiz</h3>
              <p>Unlock and join before the timer ends. Quiz closes automatically at scheduled time.</p>
            </div>
            <div className="panel">
              <div className="step-num">4</div>
              <h3>Rank & get rewarded</h3>
              <p>Top performers receive rewards based on declared ranking rules.</p>
            </div>
          </div>
        </div>
      </section>




      <section className="section" style={{ backgroundColor: "#f8fafc" }}>

        <div className="section-inner">
          <div className="center-head">
            <h2 style={{ color: "#0d1f3c", fontSize: "36px" }}>All exams. One arena.</h2>
            <div className="subtext" style={{ color: "#64748b" }}>
              Practice & compete for every major exam in India
            </div>
          </div>
          <div className="tags" style={{ marginTop: "24px" }}>
            <span className="tag">UPSC</span>
            <span className="tag">SSC CGL</span>
            <span className="tag">NEET</span>
            <span className="tag">JEE</span>
            <span className="tag">Bank PO</span>
            <span className="tag">Railway RRB</span>
            <span className="tag">GATE</span>
            <span className="tag">CAT</span>
            <span className="tag">NDA</span>
            <span className="tag">& more</span>
          </div>

        </div>
      </section>

      {/* Removed Live Quiz Contests section */}

      {/* Dashboard section removed */}

      {/* Removed App Dashboard Preview section */}

      <section className="section white">
        <div className="section-inner">
          <div className="center-head">
            <div className="eyebrow">Why QUZO</div>
            <h2>Built for serious aspirants</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 style={{ marginTop: "14px" }}>Skill-based competitions</h3>
              <p>Compete through timed live quizzes where rankings depend on accuracy and time efficiency.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 style={{ marginTop: "14px" }}>Top performers rewarded</h3>
              <p>Reward distribution is rank-based and visible before the quiz begins.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 style={{ marginTop: "14px" }}>Exam-focused practice</h3>
              <p>Prepare for competitive exams while competing in structured live quiz formats.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 style={{ marginTop: "14px" }}>Secure and fair play</h3>
              <p>OTP login, one-user rules, and review checks help keep competition fair.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section white" id="faq">
        <div className="section-inner" style={{ maxWidth: "900px" }}>
          <div className="center-head">
            <div className="eyebrow">FAQ</div>
            <h2>Common questions</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>
                Is QUZO a quiz platform?<span>+</span>
              </summary>
              <p>
                Yes. QUZO is positioned as a skill-based quiz competition platform where results depend on knowledge,
                accuracy, and time efficiency.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                How are rankings decided?<span>+</span>
              </summary>
              <p>
                Rankings are based on correct answers first, then time efficiency, and then final submission order.
                Exact ties may result in reward splits according to policy.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                Who receives rewards?<span>+</span>
              </summary>
              <p>
                Only declared top-ranked eligible participants receive performance-based rewards. Rewards are not
                guaranteed.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                What exams are covered?<span>+</span>
              </summary>
              <p>
                Live quizzes are scheduled for different exams like UPSC, SSC, NEET, JEE, Banking, Railways and more.
                Each quiz opens and closes at a fixed time similar to match-based contests.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="section-inner">
          {/* Removed Limited Early Access badge */}
          <h2>Ready to earn from what you learn?</h2>
          <p>
            Join 50,000+ aspirants already winning on QUZO. Get exclusive rewards and early bird benefits.
          </p>
          <div className="cta-form">
            <input type="tel" placeholder="Enter your mobile number" maxLength={10} />
            <button className="primary-btn" onClick={handleJoinContest}>
              Get Early Access <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Removed inline terms section - moved to /legal page */}

      <footer className="footer">
        <div className="footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/legal#terms"); }}>Terms</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/legal#privacy"); }}>Privacy Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/legal#refund"); }}>Refund Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/legal#refer"); }}>Refer & Earn</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/legal#disclaimer"); }}>Disclaimer</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin"); }}>Admin</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/legal#contact"); }}>Contact</a>
        </div>
        <p>
          This preview uses skill-based quiz positioning. Rewards are performance-based and not guaranteed. Paid
          participation may need additional legal, tax, and state-level compliance before production launch.
        </p>
        <p>© 2026 QUZO. All rights reserved.</p>
      </footer>

    </div>
  );
}
