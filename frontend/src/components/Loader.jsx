import React from 'react';

const Loader = ({ fullPage = true }) => {
  return (
    <div 
      className="premium-loader-container" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullPage ? '100vh' : '200px',
        width: '100%',
        background: fullPage ? 'radial-gradient(circle at center, #0f2d59 0%, #08152b 100%)' : 'transparent',
        position: fullPage ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Background Animated Blobs */}
      {fullPage && (
        <>
          <div 
            className="loader-bg-blob" 
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
              filter: 'blur(50px)',
              animation: 'floatBlob 8s infinite alternate'
            }}
          />
          <div 
            className="loader-bg-blob-2" 
            style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
              bottom: '15%',
              right: '10%',
              filter: 'blur(60px)',
              animation: 'floatBlob2 10s infinite alternate'
            }}
          />
        </>
      )}

      {/* Glassmorphic Loader Card */}
      <div 
        className="loader-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          maxWidth: '320px',
          width: '90%',
          transform: 'translateZ(0)'
        }}
      >
        {/* Modern Custom Spinning Ring with Pulse core */}
        <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
          {/* Outermost glowing border ring */}
          <div 
            className="loader-ring-glow"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: '4px solid transparent',
              borderTopColor: '#38bdf8',
              borderBottomColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spinClockwise 1.5s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite'
            }}
          />
          
          {/* Inner reverse spin ring */}
          <div 
            className="loader-ring-inner"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              width: '60px',
              height: '60px',
              border: '3px solid transparent',
              borderLeftColor: '#38bdf8',
              borderRightColor: '#60a5fa',
              borderRadius: '50%',
              animation: 'spinCounterClockwise 1s linear infinite',
              opacity: 0.8
            }}
          />
          
          {/* Centered glowing pulse dot */}
          <div 
            className="loader-core-dot"
            style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              borderRadius: '50%',
              boxShadow: '0 0 15px #38bdf8',
              animation: 'pulseCore 1.5s ease-in-out infinite'
            }}
          />
        </div>

        {/* Brand/App Title */}
        <h3 
          style={{ 
            color: 'white', 
            fontSize: '22px', 
            fontWeight: 900, 
            letterSpacing: '0.1em',
            margin: '0 0 8px 0',
            fontFamily: "'Lexend', sans-serif"
          }}
        >
          PLAY<span style={{ color: '#38bdf8' }}>11</span>
        </h3>
        
        <p 
          style={{ 
            color: '#94a3b8', 
            fontSize: '13px', 
            fontWeight: 500,
            margin: '0 0 20px 0'
          }}
        >
          Loading your gaming zone...
        </p>

        {/* Elegant Infinite Micro-Progress bar */}
        <div 
          style={{ 
            width: '120px', 
            height: '4px', 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              height: '100%',
              width: '50%',
              background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
              borderRadius: '10px',
              boxShadow: '0 0 8px #38bdf8',
              animation: 'shimmerProgress 1.4s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Styled Injecting Animations (Using standard JSX style tag so they are isolated and self-contained) */}
      <style>{`
        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinCounterClockwise {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulseCore {
          0%, 100% { transform: scale(0.85); opacity: 0.7; box-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 20px rgba(56, 189, 248, 0.9); }
        }
        @keyframes shimmerProgress {
          0% { left: -50%; }
          100% { left: 100%; }
        }
        @keyframes floatBlob {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes floatBlob2 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(-40px, 30px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
