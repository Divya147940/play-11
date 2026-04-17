import React, { useState } from "react";

export default function QuzoMobileFirstLanding() {
  const [showLogin, setShowLogin] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOpenLogin = () => {
    setShowLogin(true);
    setOtpStep(false);
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
          <div className="logo-boxes">
            <div className="logo-box">Q</div>
            <div className="logo-box">U</div>
            <div className="logo-box">Z</div>
            <div className="logo-box">O</div>
          </div>
          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#how">How it works</a>
            <a href="#contests">Contests</a>
            <a href="#faq">FAQ</a>
          </nav>

          {!isLoggedIn ? (
            <button className="login-btn" onClick={handleOpenLogin}>
              Login
            </button>
          ) : (
            <div className="user-chip" style={{ display: "flex" }}>
              <div className="avatar">A</div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "800" }}>Aman Kumar</div>
                <div style={{ fontSize: "11px", color: "#cbd5e1" }}>+91 98XXXXXX21</div>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-grid">
          <div>
            <div className="badge">India’s Smartest Quiz Arena 🧠</div>
            <h1>
              Earn from <br />
              <span>what you learn.</span>
            </h1>
            <p>
              A mobile-first quiz platform for competitive exam aspirants. Join live quizzes before deadline, answer
              within time, and compete on leaderboard for performance-based rewards.
            </p>
            <div className="hero-actions">
              <button className="primary-btn">Unlock Quiz</button>
              <button className="secondary-btn">Watch Demo</button>
            </div>
            <div className="stats-row">
              <div className="stat-card">
                <strong>50K+</strong>
                <span>Users reached</span>
              </div>
              <div className="stat-card">
                <strong>100+</strong>
                <span>Daily quizzes</span>
              </div>
              <div className="stat-card">
                <strong>Top 3</strong>
                <span>Rewarded</span>
              </div>
              <div className="stat-card">
                <strong>10+</strong>
                <span>Exam categories</span>
              </div>
            </div>
          </div>

          <div className="hero-phone">
            <div className="hero-phone-inner">
              <div className="row-between">
                <div>
                  <div className="subtle">Live Quiz</div>
                  <div className="white-title">UPSC • General Studies</div>
                </div>
                <div className="live-pill">Live Now</div>
              </div>

              <div className="deadline-box">
                <div className="row-between">
                  <div>
                    <div className="subtle" style={{ color: "#94a3b8" }}>
                      Quiz deadline
                    </div>
                    <div className="white-title">Closes in 00h 20m</div>
                  </div>
                  <div className="timer-badge">00:20:12</div>
                </div>
              </div>

              <div className="mini-grid">
                <div className="mini-item">
                  <div className="label">Unlock</div>
                  <div className="value">₹5</div>
                </div>
                <div className="mini-item">
                  <div className="label">Reward Pool</div>
                  <div className="value">₹500</div>
                </div>
                <div className="mini-item">
                  <div className="label">Joined</div>
                  <div className="value">78</div>
                </div>
              </div>

              <div className="question-box">
                <div className="question-header">
                  <div className="subtle">Question 1 of 11</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700" }}>Live leaderboard active</div>
                </div>
                <div className="question">Who is widely known as the architect of the Indian Constitution?</div>
                <button className="option">
                  <span className="alpha">A</span>Mahatma Gandhi
                </button>
                <button className="option correct">
                  <span className="alpha">B</span>Dr. B.R. Ambedkar
                </button>
                <button className="option">
                  <span className="alpha">C</span>Jawaharlal Nehru
                </button>
                <button className="option">
                  <span className="alpha">D</span>Sardar Vallabhbhai Patel
                </button>
              </div>

              <div className="notice">
                Rankings depend on accuracy, time efficiency, and final submission order. Rewards are performance-based
                and not guaranteed.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="section-inner">
          <div className="center-head">
            <div className="eyebrow">How it works</div>
            <h2>Earn from what you learn.</h2>
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

      <section className="section alt">
        <div className="section-inner">
          <div className="center-head">
            <div className="eyebrow">Categories</div>
            <h2>Live quizzes at scheduled times.</h2>
          </div>
          <div className="tags">
            <span className="tag">UPSC</span>
            <span className="tag">SSC CGL</span>
            <span className="tag">NEET</span>
            <span className="tag">JEE</span>
            <span className="tag">Bank PO</span>
            <span className="tag">Railway</span>
            <span className="tag">GATE</span>
            <span className="tag">CAT</span>
            <span className="tag">CLAT</span>
            <span className="tag">CUET</span>
          </div>
        </div>
      </section>

      <section className="section" id="contests">
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
              <button className="card-btn">View Upcoming Quiz</button>
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
              <button className="dark-btn">Join Live Quiz</button>
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

      {isLoggedIn && (
        <section className="dashboard-logged" style={{ display: "block" }} id="loggedSection">
          <div className="wrap">
            <div className="welcome-card">
              <div className="eyebrow" style={{ color: "#7dd3fc" }}>
                Welcome back
              </div>
              <h3>Aman Kumar</h3>
              <p>Ready for today’s live quizzes. Join before deadline and improve your rank.</p>
              <div className="welcome-stats">
                <div className="welcome-mini">
                  <strong>12</strong>
                  <span>Joined</span>
                </div>
                <div className="welcome-mini">
                  <strong>₹240</strong>
                  <span>Rewards</span>
                </div>
                <div className="welcome-mini">
                  <strong>#28</strong>
                  <span>Rank</span>
                </div>
              </div>
            </div>
            <div className="my-dash">
              <div className="eyebrow">My dashboard</div>
              <div className="my-dash-list">
                <div className="list-tile">
                  <strong>My Live Quizzes</strong>
                  <span>3 active</span>
                </div>
                <div className="list-tile">
                  <strong>Upcoming Joins</strong>
                  <span>5 scheduled</span>
                </div>
                <div className="list-tile">
                  <strong>Reward Wallet</strong>
                  <span>₹240 available</span>
                </div>
                <div className="list-tile">
                  <strong>Leaderboard Rank</strong>
                  <span>#28 this week</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
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
                  <button className="dark-btn">View Quiz Details</button>
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
                  <button className="dark-btn">View Quiz Details</button>
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
                  <button className="dark-btn">View Quiz Details</button>
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

              <div className="nav-preview" style={{ marginTop: "16px" }}>
                <div className="eyebrow">Bottom navigation</div>
                <div className="bottom-nav">
                  <div className="active">Home</div>
                  <div>Live</div>
                  <div>Rewards</div>
                  <div>Leaderboard</div>
                  <div>Profile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
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

      <section className="section" id="faq">
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
          <h2 style={{ color: "white" }}>Ready to launch your next quiz?</h2>
          <p>
            A cleaner mobile-first preview for QUZO with app-like sections, contest cards, and safer positioning around
            quiz participation and rewards.
          </p>
          <div className="cta-form">
            <input type="text" placeholder="Enter mobile number" />
            <button className="primary-btn">Get Started</button>
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

      {showLogin && (
        <div
          className="login-modal"
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target.className === "login-modal") handleCancel();
          }}
        >
          <div className="modal-card">
            {!otpStep ? (
              <div id="loginStep">
                <h3>Login</h3>
                <p>Enter mobile number</p>
                <input type="text" placeholder="Enter mobile number" />
                <button className="modal-btn" onClick={handleSendOtp}>
                  Send OTP
                </button>
              </div>
            ) : (
              <div id="otpStep">
                <h3>Verify OTP</h3>
                <p>Enter the 4-digit OTP sent to your mobile number</p>
                <div className="otp-grid">
                  <input maxLength={1} />
                  <input maxLength={1} />
                  <input maxLength={1} />
                  <input maxLength={1} />
                </div>
                <button className="modal-btn" onClick={handleVerify}>
                  Verify & Continue
                </button>
              </div>
            )}
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
