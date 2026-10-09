import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LandingNavbar />
      <main id="main" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
