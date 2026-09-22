import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Link2,
  Mail,
  History,
  GraduationCap,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './AppLayout.css';

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Esc key closes drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const handleConfirmLogout = async () => {
    await logout();
    setLogoutModalOpen(false);
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Scan message', path: '/scan/message', icon: MessageSquare },
    { label: 'Check URL', path: '/scan/url', icon: Link2 },
    { label: 'Scan email', path: '/scan/email', icon: Mail },
    { label: 'Scan history', path: '/scans', icon: History },
    { label: 'Security education', path: '/education', icon: GraduationCap },
    { label: 'Profile', path: '/profile', icon: User },
    ...(isAdmin ? [{ label: 'Admin', path: '/admin', icon: ShieldCheck }] : [])
  ];

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/dashboard') return 'Dashboard';
    if (p === '/scan/message') return 'Scan message';
    if (p === '/scan/url') return 'Check URL';
    if (p === '/scan/email') return 'Scan email';
    if (p === '/scans') return 'Scan history';
    if (p.startsWith('/scans/')) return 'Security report';
    if (p === '/education') return 'Security education';
    if (p.startsWith('/education/')) return 'Education guide';
    if (p === '/profile') return 'User profile';
    if (p === '/admin') return 'Admin platform';
    return 'PhishGuard AI';
  };

  const renderNavList = () => (
    <nav className="app-nav-list" aria-label="Main Navigation">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `app-nav-link ${isActive ? 'app-nav-link--active' : ''}`
            }
          >
            <IconComponent size={18} className="app-nav-icon" />
            <span className="app-nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="app-shell">
      {/* Desktop Fixed Sidebar */}
      <aside className="app-sidebar" aria-label="Sidebar">
        <div className="app-sidebar-top">
          <Link to="/dashboard" className="app-brand-link">
            <div className="app-brand-icon">
              <ShieldCheck size={22} />
            </div>
            <span className="app-brand-text">
              PhishGuard <span style={{ color: 'var(--color-primary)' }}>AI</span>
            </span>
          </Link>
        </div>

        <div className="app-sidebar-content">
          {renderNavList()}
        </div>

        {/* User Block at bottom */}
        <div className="app-sidebar-bottom">
          <div className="app-user-chip">
            <Avatar name={user?.name || user?.username || 'User'} size={34} />
            <div className="app-user-info">
              <span className="app-user-name">{user?.name || user?.username || 'User'}</span>
              <span className="app-user-email">{user?.email || 'user@example.com'}</span>
            </div>
          </div>
          <button
            type="button"
            className="app-logout-btn"
            onClick={() => setLogoutModalOpen(true)}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div
          className="app-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <div
            ref={drawerRef}
            className="app-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="app-drawer-header">
              <Link to="/dashboard" className="app-brand-link">
                <div className="app-brand-icon">
                  <ShieldCheck size={20} />
                </div>
                <span className="app-brand-text">PhishGuard AI</span>
              </Link>
              <button
                type="button"
                className="app-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="app-drawer-content">
              {renderNavList()}
            </div>

            <div className="app-sidebar-bottom">
              <div className="app-user-chip">
                <Avatar name={user?.name || user?.username || 'User'} size={34} />
                <div className="app-user-info">
                  <span className="app-user-name">{user?.name || user?.username || 'User'}</span>
                  <span className="app-user-email">{user?.email || 'user@example.com'}</span>
                </div>
              </div>
              <button
                type="button"
                className="app-logout-btn"
                onClick={() => {
                  setDrawerOpen(false);
                  setLogoutModalOpen(true);
                }}
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area with Topbar */}
      <div className="app-main-wrapper">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <button
              type="button"
              className="app-hamburger-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={22} />
            </button>
            <h1 className="app-topbar-title">{getPageTitle()}</h1>
          </div>

          <div className="app-topbar-right">
            <Link to="/profile" className="app-topbar-profile-link" aria-label="View user profile">
              <Avatar name={user?.name || user?.username || 'User'} size={32} />
            </Link>
          </div>
        </header>

        <main id="main" className="app-content-area">
          <div className="app-content-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmDialog
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out of PhishGuard AI?"
        message="Your active session will end. You can sign back in anytime to access your scan history."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        isDestructive={true}
      />
    </div>
  );
}
