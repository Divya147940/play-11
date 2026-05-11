import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = ({ children, hideHeader = false, hideFooter = false, hideBottomNav = false, hideNav = false }) => {
  if (hideNav) return <>{children}</>;

  return (
    <div className="layout-wrapper" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      position: 'relative'
    }}>
      {!hideHeader && <Header />}
      
      <main className="main-content" style={{ 
        flex: 1, 
        paddingBottom: hideBottomNav ? '0' : '80px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>

      {!hideBottomNav && <BottomNav />}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
