import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck, Lock, Zap, Eye, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Back Link */}
        <div className="auth-back-link">
          <Link to="/" className="auth-back-btn">
            <ArrowLeft size={16} />
            <span>PhishGuard AI</span>
          </Link>
        </div>

        <div className="auth-split">
          {/* Main Auth Card */}
          <div className="auth-main">
            <Card padding="lg" variant="elevated" className="auth-card">
              <div className="auth-brand-header">
                <div className="auth-brand-logo">
                  <ShieldCheck size={26} />
                </div>
                <h2 className="auth-brand-title">PhishGuard AI</h2>
              </div>
              <Outlet />
            </Card>
          </div>

          {/* Right Trust Panel (Desktop >= 1024) */}
          <div className="auth-trust-panel">
            <h3 className="auth-trust-title">Security without compromise</h3>
            <p className="auth-trust-subtitle">
              Verify incoming messages, emails, and web links before taking irreversible actions.
            </p>

            <div className="auth-trust-items">
              <div className="auth-trust-item">
                <div className="auth-trust-icon">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="auth-trust-item-title">Private & Confidential</h4>
                  <p className="auth-trust-item-desc">Your text is analyzed securely and never published or shared.</p>
                </div>
              </div>

              <div className="auth-trust-item">
                <div className="auth-trust-icon">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="auth-trust-item-title">Real-Time Risk Scoring</h4>
                  <p className="auth-trust-item-desc">Combines rule engines and specialized threat AI in under 3 seconds.</p>
                </div>
              </div>

              <div className="auth-trust-item">
                <div className="auth-trust-icon">
                  <Eye size={18} />
                </div>
                <div>
                  <h4 className="auth-trust-item-title">Explainable Evidence</h4>
                  <p className="auth-trust-item-desc">Every flagged item provides concrete, quoted evidence and actionable safety steps.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
