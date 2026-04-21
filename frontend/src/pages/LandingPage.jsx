import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Home, Trophy, Wallet, BarChart3, User, Check } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("play11_user"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleJoinContest = () => {
    const isLoggedIn = !!localStorage.getItem("play11_user");
    const hasAccount = localStorage.getItem("play11_has_account") === "true";

    if (isLoggedIn) {
      navigate("/game-quiz-play/1");
    } else if (hasAccount) {
      navigate("/login");
    } else {
      navigate("/register");
    }
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
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#how" onClick={() => setIsMenuOpen(false)}>How it works</a>
            <a href="#contests" onClick={() => setIsMenuOpen(false)}>Contests</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            {!isLoggedIn && (
              <>
                <button className="secondary-btn mobile-only" onClick={() => navigate("/register")}>
                  Signup
                </button>
                <button className="login-btn mobile-only" onClick={handleOpenLogin}>
                  Login
                </button>
              </>
            )}
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
              <span>what you learn.</span>
            </h1>
            <p>
              India's Smartest Quiz Arena — compete in real quiz battles, rank higher, win real prizes.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={handleJoinContest}>Join Quiz</button>
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

      <section className="section" style={{ backgroundColor: "#f1f5f9" }}>
        <div className="section-inner">
          <div className="center-head">
            <div className="eyebrow" style={{ color: "#0d1f3c" }}>How it works</div>
            <h2 style={{ color: "#0d1f3c" }}>How it works</h2>
            <div className="subtext" style={{ color: "#64748b" }}>
              3 simple steps to win real prizes
            </div>
          </div>
          <div className="steps-grid three-cols">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Choose your exam</h3>
              <p>Select from UPSC, SSC, NEET, JEE, Bank & more</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Pay & join</h3>
              <p>Entry starts at ₹1. Join live quiz battle with real players</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Rank & win</h3>
              <p>Answer correctly & fast. Top rankers win real cash prizes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section white" id="pricing">
        <div className="section-inner">
          <div className="center-head">
            <div className="eyebrow">Price Plans</div>
            <h2>Simple pricing</h2>
            <div className="subtext">
              Start free. Win real.
            </div>
          </div>

          <div className="price-grid">
            <div className="price-card">
              <div className="pill exam">Free</div>
              <div className="price-amount">
                <strong>₹0</strong>
                <span>/month</span>
              </div>
              <div className="price-list">
                <div className="price-item">
                  <Check size={16} /> Unlimited practice
                </div>
                <div className="price-item">
                  <Check size={16} /> All exam categories
                </div>
                <div className="price-item">
                  <Check size={16} /> Basic leaderboard
                </div>
              </div>
              <button className="card-btn">Get started free</button>
            </div>

            <div className="price-card featured">
              <div className="pill popular">Most Popular</div>
              <div className="price-amount">
                <strong>₹1</strong>
                <span>/contest</span>
              </div>
              <div className="price-list">
                <div className="price-item">
                  <Check size={16} /> Live competitions
                </div>
                <div className="price-item">
                  <Check size={16} /> Real cash prizes
                </div>
                <div className="price-item">
                  <Check size={16} /> Live leaderboard
                </div>
                <div className="price-item">
                  <Check size={16} /> Instant UPI payout
                </div>
              </div>
              <button className="dark-btn">Play for ₹1</button>
            </div>

            <div className="price-card">
              <div className="pill upcoming">Pro</div>
              <div className="price-amount">
                <strong>₹99</strong>
                <span>/month</span>
              </div>
              <div className="price-list">
                <div className="price-item">
                  <Check size={16} /> Unlimited contests
                </div>
                <div className="price-item">
                  <Check size={16} /> Higher prize pools
                </div>
                <div className="price-item">
                  <Check size={16} /> Mock test series
                </div>
              </div>
              <button className="card-btn">Go Pro</button>
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

      <section className="section white" id="contests">
        <div className="section-inner">
          <div className="section-head-row">
            <div>
              <div className="eyebrow">Live quiz contests</div>
              <h2>Join upcoming live quizzes</h2>
            </div>
            <div className="small-chip">Rewards shown below are illustrative preview values</div>
          </div>

          <div className="tabs">
            <button className="tab">Upcoming</button>
            <button className="tab active">Live</button>
            <button className="tab">Closed</button>
          </div>

          <div className="contest-grid">
            <div className="contest-card">
              <div className="contest-top">
                <span className="pill exam">SSC CGL</span>
                <span className="pill upcoming">Upcoming</span>
              </div>
              <h3 style={{ marginTop: "14px" }}>SSC CGL Mega Live Quiz</h3>
              <div className="info-block">
                <small>Countdown</small>
                <strong>Starts in 02h 15m</strong>
              </div>
              <div className="stack-3">
                <div className="metric">
                  <small>Unlock Fee</small>
                  <strong>₹1</strong>
                </div>
                <div className="metric">
                  <small>Reward Pool</small>
                  <strong>Up to ₹100</strong>
                </div>
                <div className="metric">
                  <small>Rewards</small>
                  <strong>Top 3 rewarded</strong>
                </div>
                <div className="metric">
                  <small>Live status</small>
                  <strong>43/100 joined</strong>
                </div>
              </div>
              <button className="card-btn" onClick={handleJoinContest}>View Upcoming Quiz</button>
            </div>

            <div className="contest-card featured">
              <div className="contest-top">
                <span className="pill exam">UPSC</span>
                <span className="pill live">Live</span>
              </div>
              <div className="pill popular">Most Popular</div>
              <h3>UPSC Daily Challenge</h3>
              <div className="info-block">
                <small>Countdown</small>
                <strong>Closes in 00h 20m</strong>
              </div>
              <div className="stack-3">
                <div className="metric">
                  <small>Unlock Fee</small>
                  <strong>₹5</strong>
                </div>
                <div className="metric">
                  <small>Reward Pool</small>
                  <strong>Up to ₹500</strong>
                </div>
                <div className="metric">
                  <small>Rewards</small>
                  <strong>Top 3 rewarded</strong>
                </div>
                <div className="metric">
                  <small>Live status</small>
                  <strong>78/100 joined</strong>
                </div>
              </div>
              <button className="dark-btn" onClick={handleJoinContest}>Join Live Quiz</button>
            </div>

            <div className="contest-card">
              <div className="contest-top">
                <span className="pill exam">NEET</span>
                <span className="pill closed">Closed</span>
              </div>
              <h3 style={{ marginTop: "14px" }}>NEET Rapid Quiz</h3>
              <div className="info-block">
                <small>Countdown</small>
                <strong>Closed</strong>
              </div>
              <div className="stack-3">
                <div className="metric">
                  <small>Unlock Fee</small>
                  <strong>₹11</strong>
                </div>
                <div className="metric">
                  <small>Reward Pool</small>
                  <strong>Up to ₹1,100</strong>
                </div>
                <div className="metric">
                  <small>Rewards</small>
                  <strong>Top 3 rewarded</strong>
                </div>
                <div className="metric">
                  <small>Live status</small>
                  <strong>24/100 joined</strong>
                </div>
              </div>
              <button className="card-btn" style={{ background: "#e2e8f0", color: "#64748b" }}>
                Quiz Closed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard section removed */}

      <section className="section white">
        <div className="section-inner">
          <div className="section-head-row">
            <div>
              <div className="eyebrow">App dashboard preview</div>
              <h2>Upcoming live quizzes</h2>
            </div>
            <div className="small-chip">Mobile-first dashboard layout</div>
          </div>

          <div className="dashboard-grid">
            <div className="dash-box">
              <div className="stats-mini">
                <div className="dash-stat">
                  <strong>12</strong>
                  <span>Live now</span>
                </div>
                <div className="dash-stat">
                  <strong>28</strong>
                  <span>Upcoming</span>
                </div>
                <div className="dash-stat">
                  <strong>1.2K</strong>
                  <span>Joined today</span>
                </div>
                <div className="dash-stat">
                  <strong>₹5,000</strong>
                  <span>Top reward</span>
                </div>
              </div>

              <div className="quiz-list">
                <div className="quiz-item">
                  <div className="quiz-main">
                    <div>
                      <span className="pill exam">SSC CGL</span>
                      <h4>General Awareness Blitz</h4>
                      <p>Today • 7:00 PM</p>
                      <div className="deadline-red">Join before 6:59 PM</div>
                    </div>
                    <div className="unlock-box">
                      <small>Unlock</small>
                      <strong>₹1</strong>
                    </div>
                  </div>
                  <div className="info-row-3">
                    <div className="info-3">
                      <small>Reward</small>
                      <strong>Up to ₹100</strong>
                    </div>
                    <div className="info-3">
                      <small>Status</small>
                      <strong>Upcoming</strong>
                    </div>
                    <div className="info-3">
                      <small>Joined</small>
                      <strong>56 joined</strong>
                    </div>
                  </div>
                  <button className="dark-btn" onClick={handleJoinContest}>View Quiz Details</button>
                </div>

                <div className="quiz-item">
                  <div className="quiz-main">
                    <div>
                      <span className="pill exam">UPSC</span>
                      <h4>Polity Power Hour</h4>
                      <p>Today • 8:30 PM</p>
                      <div className="deadline-red">Join before 8:29 PM</div>
                    </div>
                    <div className="unlock-box">
                      <small>Unlock</small>
                      <strong>₹5</strong>
                    </div>
                  </div>
                  <div className="info-row-3">
                    <div className="info-3">
                      <small>Reward</small>
                      <strong>Up to ₹500</strong>
                    </div>
                    <div className="info-3">
                      <small>Status</small>
                      <strong>Upcoming</strong>
                    </div>
                    <div className="info-3">
                      <small>Joined</small>
                      <strong>92 joined</strong>
                    </div>
                  </div>
                  <button className="dark-btn" onClick={handleJoinContest}>View Quiz Details</button>
                </div>

                <div className="quiz-item">
                  <div className="quiz-main">
                    <div>
                      <span className="pill exam">NEET</span>
                      <h4>Biology Speed Quiz</h4>
                      <p>Tomorrow • 6:00 PM</p>
                      <div className="deadline-red">Join before 5:59 PM</div>
                    </div>
                    <div className="unlock-box">
                      <small>Unlock</small>
                      <strong>₹11</strong>
                    </div>
                  </div>
                  <div className="info-row-3">
                    <div className="info-3">
                      <small>Reward</small>
                      <strong>Up to ₹1,100</strong>
                    </div>
                    <div className="info-3">
                      <small>Status</small>
                      <strong>Upcoming</strong>
                    </div>
                    <div className="info-3">
                      <small>Joined</small>
                      <strong>38 joined</strong>
                    </div>
                  </div>
                  <button className="dark-btn" onClick={handleJoinContest}>View Quiz Details</button>
                </div>
              </div>
            </div>

            <div>
              <div className="board-box">
                <div className="eyebrow" style={{ color: "#7dd3fc" }}>
                  Leaderboard preview
                </div>
                <h3 style={{ color: "white", marginTop: "10px" }}>Today’s top performers</h3>
                <div className="board-row">
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "900" }}>Aman</div>
                    <small>10/11 • 08m 12s</small>
                  </div>
                  <div className="rank-pill">#1</div>
                </div>
                <div className="board-row">
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "900" }}>Priya</div>
                    <small>10/11 • 08m 39s</small>
                  </div>
                  <div className="rank-pill">#2</div>
                </div>
                <div className="board-row">
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "900" }}>Rahul</div>
                    <small>9/11 • 07m 58s</small>
                  </div>
                  <div className="rank-pill">#3</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

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
          <div className="badge" style={{ marginBottom: "12px" }}>
            Early access
          </div>
          <h2 style={{ color: "white" }}>Ready to earn from what you learn?</h2>
          <p>
            Join 50,000+ aspirants already winning on QUZO
          </p>
          <div className="cta-form">
            <input type="text" placeholder="Enter your mobile number" />
            <button className="primary-btn">Get Early Access</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
        <p>
          This preview uses skill-based quiz positioning. Rewards are performance-based and not guaranteed. Paid
          participation may need additional legal, tax, and state-level compliance before production launch.
        </p>
        <p>© 2026 QUZO. All rights reserved.</p>
      </footer>

      <div className="sticky-bottom-nav">
        <div className="bottom-nav-inner">
          <div className="nav-item active">
            <Home size={20} />
            <span>Home</span>
          </div>
          <div className="nav-item">
            <Trophy size={20} />
            <span>Live</span>
          </div>
          <div className="nav-item">
            <Wallet size={20} />
            <span>Rewards</span>
          </div>
          <div className="nav-item">
            <BarChart3 size={20} />
            <span>Ranks</span>
          </div>
          <div className="nav-item" onClick={handleOpenLogin}>
            <User size={20} />
            <span>Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
