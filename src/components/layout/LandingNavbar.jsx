import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`landing-header ${isScrolled ? 'landing-header--scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        height: '72px',
        zIndex: 'var(--z-sticky)',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'var(--color-surface)',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)'
      }}
    >
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <span
            style={{
              fontSize: 'var(--fs-h4)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-text)',
              letterSpacing: '-0.02em'
            }}
          >
            PhishGuard <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </span>
        </Link>

        {/* Center Nav Links (Desktop >= 1024) */}
        <nav
          className="landing-desktop-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-6)'
          }}
        >
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('threats')}
            style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            Threat types
          </button>
          <Link
            to="/education"
            style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text-secondary)' }}
          >
            Security education
          </Link>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: 'var(--space-3)' }} className="landing-desktop-actions">
          {isAuthenticated ? (
            <Button variant="primary" size="md" to="/dashboard">
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="md" to="/login">
                Log in
              </Button>
              <Button variant="primary" size="md" to="/register" icon={<ArrowRight size={16} />} iconPosition="right">
                Get started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="landing-mobile-toggle">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)'
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Panel */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--color-surface)',
            zIndex: 'var(--z-drawer)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'fadeIn 200ms var(--ease)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', textAlign: 'left' }}
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', textAlign: 'left' }}
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('threats')}
              style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', textAlign: 'left' }}
            >
              Threat types
            </button>
            <Link
              to="/education"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}
            >
              Security education
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
            {isAuthenticated ? (
              <Button variant="primary" size="lg" to="/dashboard" fullWidth onClick={() => setMobileMenuOpen(false)}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="primary" size="lg" to="/register" fullWidth onClick={() => setMobileMenuOpen(false)}>
                  Get started
                </Button>
                <Button variant="secondary" size="lg" to="/login" fullWidth onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .landing-desktop-nav { display: flex !important; }
          .landing-desktop-actions { display: flex !important; }
          .landing-mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
