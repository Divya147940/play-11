import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LegalPage = () => {
  const { hash } = useLocation();
  const [language, setLanguage] = React.useState('EN');

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const content = {
    EN: [
      {
        id: 'terms',
        title: 'Terms & Conditions',
        body: (
          <>
            <p>By accessing QUZO, you agree to these terms. QUZO is a knowledge-based quiz platform where rankings depend on user performance such as accuracy and speed.</p>
            <h3>1. Platform Nature</h3>
            <p>QUZO is a <em>knowledge-based quiz platform</em>. Rankings depend on user performance such as accuracy and speed.</p>
            <h3>2. Eligibility</h3>
            <ul>
              <li>Minimum age: 18 years</li>
              <li>One user = one account</li>
              <li>Correct details required</li>
            </ul>
            <h3>3. Quiz Format</h3>
            <ul>
              <li>10 Questions</li>
              <li>8 Minutes</li>
              <li>Answers must be submitted before timer ends</li>
            </ul>
            <h3>4. Ranking System</h3>
            <p>Ranking is based on: Correct answers and Time taken. Higher accuracy + faster completion = better rank.</p>
            <h3>5. Rewards</h3>
            <ul>
              <li>Only declared top-ranked eligible participants receive performance-based rewards.</li>
              <li>Rewards are <em>performance-based and not guaranteed</em>.</li>
              <li>Tie cases → rewards may be split according to policy.</li>
            </ul>
          </>
        )
      },
      {
        id: 'refund',
        title: 'Refund Policy',
        body: (
          <>
            <p>QUZO aims to provide a fair and seamless experience. Our refund policy is as follows:</p>
            <ul>
              <li>Entry fees are generally <strong>non-refundable</strong>.</li>
            </ul>
            <h3>Refunds are allowed only if:</h3>
            <ul>
              <li>The quiz is cancelled by QUZO.</li>
              <li>A verified technical failure occurs on our platform that prevents participation.</li>
            </ul>
          </>
        )
      },
      {
        id: 'privacy',
        title: 'Privacy Policy',
        body: (
          <>
            <p>Your privacy is important to us. QUZO collects minimal data required for account verification and reward distribution.</p>
            <ul>
              <li>We use OTP-based login for security.</li>
              <li>Personal details are used only for identity verification and platform improvement.</li>
              <li>We do not share your data with unauthorized third parties.</li>
            </ul>
          </>
        )
      },
      {
        id: 'disclaimer',
        title: 'Disclaimer',
        body: (
          <>
            <h3>Disclaimer – QUZO</h3>
            <ul>
              <li>QUZO is a <strong>knowledge-based quiz platform</strong>.</li>
              <li>It does not involve betting, gambling, or games of chance.</li>
              <li>Outcomes depend solely on user performance, knowledge, and speed.</li>
            </ul>
            <h3>⚠️ Rewards:</h3>
            <ul>
              <li>Rewards are <strong>not guaranteed</strong>.</li>
              <li>They are strictly based on rank and performance in the quiz.</li>
            </ul>
          </>
        )
      },
      {
        id: 'refer',
        title: 'Refer & Earn',
        body: (
          <>
            <h3>Refer & Earn Program – QUZO</h3>
            <ul>
              <li>Invite users to QUZO via your unique referral code.</li>
              <li>Rewards may be given based on the valid participation of referred users.</li>
            </ul>
            <p>QUZO reserves the right to modify, suspend, or terminate the referral program at any time.</p>
          </>
        )
      },
      {
        id: 'contact',
        title: 'Contact Us',
        body: (
          <>
            <p>We are here to help you. If you have any questions, concerns, or feedback, please reach out to us.</p>
            <h3>Support Email</h3>
            <p>📧 <a href="mailto:support@play11.games" style={{ color: '#38bdf8', fontWeight: 700 }}>support@play11.games</a></p>
          </>
        )
      }
    ],
    HI: [
      {
        id: 'terms',
        title: 'नियम और शर्तें',
        body: (
          <>
            <p>QUZO का उपयोग करके, आप इन शर्तों से सहमत होते हैं। QUZO एक ज्ञान-आधारित क्विज प्लेटफॉर्म है जहाँ रैंकिंग उपयोगकर्ता के प्रदर्शन जैसे सटीकता और गति पर निर्भर करती है।</p>
            <h3>1. प्लेटफॉर्म की प्रकृति</h3>
            <p>QUZO एक <em>ज्ञान-आधारित क्विज प्लेटफॉर्म</em> है। रैंकिंग सटीकता और गति जैसे प्रदर्शन पर निर्भर करती है।</p>
            <h3>2. पात्रता</h3>
            <ul>
              <li>न्यूनतम आयु: 18 वर्ष</li>
              <li>एक उपयोगकर्ता = एक खाता</li>
              <li>सही विवरण आवश्यक हैं</li>
            </ul>
            <h3>3. क्विज प्रारूप</h3>
            <ul>
              <li>10 प्रश्न</li>
              <li>8 मिनट</li>
              <li>टाइमर समाप्त होने से पहले उत्तर जमा करने होंगे</li>
            </ul>
            <h3>4. रैंकिंग प्रणाली</h3>
            <p>रैंकिंग आधारित है: सही उत्तर और लिया गया समय। अधिक सटीकता + तेज़ समापन = बेहतर रैंक।</p>
            <h3>5. पुरस्कार</h3>
            <ul>
              <li>केवल घोषित शीर्ष रैंक वाले पात्र प्रतिभागियों को ही प्रदर्शन आधारित पुरस्कार मिलते हैं।</li>
              <li>पुरस्कार <em>प्रदर्शन-आधारित हैं और गारंटीकृत नहीं हैं</em>।</li>
            </ul>
          </>
        )
      },
      {
        id: 'refund',
        title: 'धनवापसी नीति',
        body: (
          <>
            <p>QUZO का लक्ष्य एक निष्पक्ष अनुभव प्रदान करना है। हमारी धनवापसी नीति इस प्रकार है:</p>
            <ul>
              <li>प्रवेश शुल्क आम तौर पर <strong>गैर-वापसी योग्य</strong> होता है।</li>
            </ul>
            <h3>धनवापसी केवल तभी दी जाती है जब:</h3>
            <ul>
              <li>क्विज QUZO द्वारा रद्द कर दिया जाता है।</li>
              <li>हमारे प्लेटफॉर्म पर कोई सत्यापित तकनीकी विफलता होती है जो भागीदारी को रोकती है।</li>
            </ul>
          </>
        )
      },
      {
        id: 'privacy',
        title: 'गोपनीयता नीति',
        body: (
          <>
            <p>आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। QUZO खाता सत्यापन और पुरस्कार वितरण के लिए आवश्यक न्यूनतम डेटा एकत्र करता है।</p>
            <ul>
              <li>हम सुरक्षा के लिए ओटीपी-आधारित लॉगिन का उपयोग करते हैं।</li>
              <li>व्यक्तिगत विवरण का उपयोग केवल पहचान सत्यापन के लिए किया जाता है।</li>
              <li>हम आपका डेटा अनधिकृत तीसरे पक्षों के साथ साझा नहीं करते हैं।</li>
            </ul>
          </>
        )
      },
      {
        id: 'disclaimer',
        title: 'अस्वीकरण',
        body: (
          <>
            <h3>अस्वीकरण – QUZO</h3>
            <ul>
              <li>QUZO एक <strong>ज्ञान-आधारित क्विज प्लेटफॉर्म</strong> है।</li>
              <li>इसमें सट्टेबाजी, जुआ या भाग्य का खेल शामिल नहीं है।</li>
              <li>परिणाम पूरी तरह से उपयोगकर्ता के प्रदर्शन, ज्ञान और गति पर निर्भर करते हैं।</li>
            </ul>
            <h3>⚠️ पुरस्कार:</h3>
            <ul>
              <li>पुरस्कारों की <strong>गारंटी नहीं है</strong>।</li>
              <li>वे पूरी तरह से क्विज में रैंक और प्रदर्शन पर आधारित हैं।</li>
            </ul>
          </>
        )
      },
      {
        id: 'refer',
        title: 'रेफर करें और कमाएं',
        body: (
          <>
            <h3>रेफर और अर्न प्रोग्राम – QUZO</h3>
            <ul>
              <li>अपने अद्वितीय रेफरल कोड के माध्यम से उपयोगकर्ताओं को QUZO पर आमंत्रित करें।</li>
              <li>पुरस्कार रेफर किए गए उपयोगकर्ताओं की वैध भागीदारी के आधार पर दिए जा सकते हैं।</li>
            </ul>
            <p>QUZO किसी भी समय रेफरल कार्यक्रम को संशोधित करने, निलंबित करने या समाप्त करने का अधिकार सुरक्षित रखता है।</p>
          </>
        )
      },
      {
        id: 'contact',
        title: 'संपर्क करें',
        body: (
          <>
            <p>हम आपकी सहायता के लिए यहाँ हैं। यदि आपके कोई प्रश्न, चिंता या प्रतिक्रिया है, तो कृपया हमसे संपर्क करें।</p>
            <h3>सहायता ईमेल</h3>
            <p>📧 <a href="mailto:support@play11.games" style={{ color: '#38bdf8', fontWeight: 700 }}>support@play11.games</a></p>
          </>
        )
      }
    ]
  };

  const sections = content[language];

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={() => setLanguage('EN')}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer',
                background: language === 'EN' ? '#38bdf8' : '#1e293b', color: 'white'
              }}
            >EN</button>
            <button 
              onClick={() => setLanguage('HI')}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer',
                background: language === 'HI' ? '#38bdf8' : '#1e293b', color: 'white'
              }}
            >HI</button>
          </div>
          <div className="eyebrow">{language === 'HI' ? 'कानूनी केंद्र' : 'Legal Center'}</div>
          <h1>{language === 'HI' ? 'नीतियां और समझौते' : 'Policies & Agreements'}</h1>
          <p>{language === 'HI' ? 'QUZO प्लेटफॉर्म का उपयोग करने के बारे में आपको जो कुछ भी जानने की आवश्यकता है।' : 'Everything you need to know about using QUZO platform.'}</p>
        </div>
      </div>

      <div className="legal-content-wrapper">
        <div className="container">
          <div className="legal-grid">
            <aside className="legal-sidebar">
              <nav>
                {sections.map(section => (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`}
                    className={hash === `#${section.id}` ? 'active' : ''}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <main className="legal-main">
              {sections.map(section => (
                <section key={section.id} id={section.id} className="legal-section">
                  <h2>{section.title}</h2>
                  <div className="legal-text-content">
                    {section.body}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </div>

      <style>{`
        .legal-page {
          background: #f8fafc;
          min-height: 100vh;
          color: #1e293b;
          width: 100%;
          overflow-x: hidden;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          box-sizing: border-box;
        }

        .legal-hero {
          background: #0d1f3c;
          color: white;
          padding: clamp(3rem, 10vw, 6rem) 0 clamp(2rem, 5vw, 4rem);
          text-align: center;
        }

        .legal-hero .eyebrow {
          color: #38bdf8;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .legal-hero h1 {
          font-size: clamp(1.8rem, 8vw, 3.5rem);
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .legal-hero p {
          color: #94a3b8;
          font-size: clamp(0.9rem, 3vw, 1.1rem);
          max-width: 600px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .legal-content-wrapper {
          padding: clamp(1.5rem, 5vw, 4rem) 0;
        }

        .legal-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 3rem;
          width: 100%;
        }

        .legal-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .legal-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .legal-sidebar a {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          color: #64748b;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .legal-sidebar a:hover {
          color: #0d1f3c;
          background: #f1f5f9;
        }

        .legal-sidebar a.active {
          background: white;
          color: #38bdf8;
          border-color: #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .legal-main {
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 5vw, 4rem);
          min-width: 0;
        }

        .legal-section {
          background: white;
          padding: clamp(1.25rem, 5vw, 3rem);
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          scroll-margin-top: 100px;
          overflow-wrap: break-word;
          width: 100%;
          box-sizing: border-box;
        }

        .legal-section h2 {
          font-size: clamp(1.4rem, 5vw, 2rem);
          font-weight: 900;
          color: #0d1f3c;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
          line-height: 1.2;
        }

        .legal-text-content {
          line-height: 1.7;
          font-size: clamp(0.9rem, 2.5vw, 1.05rem);
          color: #475569;
        }

        .legal-text-content h3 {
          color: #1e293b;
          font-size: clamp(1.1rem, 3vw, 1.25rem);
          font-weight: 800;
          margin: 1.75rem 0 0.75rem;
        }

        .legal-text-content p {
          margin-bottom: 1.25rem;
        }

        .legal-text-content ul {
          margin-bottom: 1.25rem;
          padding-left: 1.25rem;
        }

        .legal-text-content li {
          margin-bottom: 0.4rem;
        }

        @media (max-width: 1024px) {
          .container {
            padding: 0 1rem !important;
          }
          .legal-grid {
            display: block !important;
          }
          .legal-sidebar {
            position: sticky;
            top: 60px;
            z-index: 100;
            background: #f8fafc;
            margin: 0 -1rem 2rem !important;
            padding: 0.5rem 1rem !important;
            border-bottom: 1px solid #e2e8f0;
          }
          .legal-sidebar nav {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 0.5rem;
            scrollbar-width: none;
            -ms-overflow-style: none;
            gap: 0.75rem;
            -webkit-overflow-scrolling: touch;
          }
          .legal-sidebar nav::-webkit-scrollbar {
            display: none;
          }
          .legal-sidebar a {
            white-space: nowrap !important;
            padding: 0.6rem 1.25rem !important;
            font-size: 0.85rem !important;
            background: #f1f5f9;
            border-radius: 100px !important;
          }
          .legal-sidebar a.active {
            background: #0d1f3c !important;
            color: white !important;
            border-color: #0d1f3c !important;
          }
          .legal-main {
            width: 100% !important;
          }
          .legal-section {
            padding: 1.5rem 1.25rem !important;
            border-radius: 16px !important;
          }
        }

        @media (max-width: 640px) {
          .legal-hero {
            padding-top: 4.5rem;
          }
          .legal-hero h1 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalPage;
