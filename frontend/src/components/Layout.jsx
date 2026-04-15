import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = ({ children, hideNav = false }) => {
  if (hideNav) return <>{children}</>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Header />
      <main className="main-content" style={{ flex: 1, paddingBottom: hideNav ? '0' : '80px' }}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
      <Footer />
    </div>
  );
};

export default Layout;
