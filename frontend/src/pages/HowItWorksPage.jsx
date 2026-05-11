import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap, Trophy, ShieldCheck, Clock } from 'lucide-react';

const HowItWorksPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page" style={{ background: '#ffffff', color: '#0f172a', minHeight: '100vh' }}>
            <div className="topbar" style={{ 
                background: 'white', 
                height: '70px', 
                display: 'flex', 
                alignItems: 'center', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
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
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>How it Works</h1>
                    <div style={{ width: '45px' }}></div>
                </div>
            </div>

            <div className="section-inner" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
                <div className="center-head">
                    <div className="badge" style={{ margin: '0 auto 20px', background: '#f1f5f9', color: '#0369a1', borderColor: '#e0f2fe' }}>Step-by-Step Guide</div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 900 }}>How it <span style={{ color: '#0ea5e9' }}>works</span></h1>
                    <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', fontWeight: 500 }}>
                        Your journey from learning to earning starts here. Follow these 3 simple steps to join the arena.
                    </p>
                </div>

                <div className="how-it-works-grid" style={{ marginTop: '60px', display: 'grid', gap: '40px' }}>
                    <div className="how-step-card-long">
                        <div className="how-step-num">1</div>
                        <div className="how-step-content">
                            <h3>Choose your exam</h3>
                            <p>Select your favorite subject or target exam. We cover everything from UPSC and SSC to NEET, JEE, and Banking.</p>
                            <div className="how-step-features">
                                <span className="h-feat"><CheckCircle size={16} color="#0ea5e9" /> 50+ Categories</span>
                                <span className="h-feat"><CheckCircle size={16} color="#0ea5e9" /> Real-time Matches</span>
                            </div>
                        </div>
                        {/* Removed visual icon */}
                    </div>

                    <div className="how-step-card-long">
                        <div className="how-step-num">2</div>
                        <div className="how-step-content">
                            <h3>Pay & join</h3>
                            <p>Join the battle with an entry fee as low as ₹1. Compete against real players in live timed quizzes.</p>
                            <div className="how-step-features">
                                <span className="h-feat"><ShieldCheck size={16} color="#10b981" /> Secure Payments</span>
                                <span className="h-feat"><Clock size={16} color="#10b981" /> Fixed Schedule</span>
                            </div>
                        </div>
                        {/* Removed visual icon */}
                    </div>

                    <div className="how-step-card-long">
                        <div className="how-step-num">3</div>
                        <div className="how-step-content">
                            <h3>Rank & win</h3>
                            <p>Answer fast and accurately to climb the leaderboard. Top rankers win real cash prizes instantly credited to their wallet.</p>
                            <div className="how-step-features">
                                <span className="h-feat"><Trophy size={16} color="#f59e0b" /> Instant Rewards</span>
                                <span className="h-feat"><CheckCircle size={16} color="#f59e0b" /> Verified Results</span>
                            </div>
                        </div>
                        {/* Removed visual icon */}
                    </div>
                </div>
            </div>

            <style>{`
                .how-step-card-long {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 2.5rem;
                    padding: 3rem;
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 3rem;
                    align-items: center;
                    transition: all 0.4s ease;
                    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.05);
                }
                .how-step-card-long:hover {
                    transform: translateY(-5px);
                    border-color: #e2e8f0;
                    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
                }
                .how-step-num {
                    font-size: 4rem;
                    font-weight: 900;
                    color: #000000;
                    font-family: 'Inter', sans-serif;
                }
                .how-step-content h3 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 800;
                    color: #0f172a;
                }
                .how-step-content p {
                    color: #64748b;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .how-step-features {
                    display: flex;
                    gap: 20px;
                }
                .h-feat {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #1e293b;
                }
                .how-step-visual {
                    width: 120px;
                    height: 120px;
                    background: #f8fafc;
                    border-radius: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (max-width: 768px) {
                    .how-step-card-long {
                        grid-template-columns: 1fr;
                        padding: 2rem;
                        gap: 1.5rem;
                        text-align: center;
                    }
                    .how-step-num { font-size: 3rem; }
                    .how-step-features { justify-content: center; flex-direction: column; gap: 10px; }
                    .how-step-visual { margin: 0 auto; }
                }
            `}</style>
        </div>
    );
};

export default HowItWorksPage;
