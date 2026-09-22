import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ScanSearch,
  ListChecks,
  Lock,
  Zap,
  Eye,
  MessageSquare,
  Link2,
  Cpu,
  BarChart3,
  CheckCircle2,
  History,
  FileCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Briefcase,
  TrendingUp,
  KeyRound,
  Package,
  Headphones,
  Users
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SecurityReportPreview from './SecurityReportPreview';
import TubesBackground from '../../components/background/TubesBackground';
import './LandingPage.css';

export default function LandingPage() {
  const [show3dBackground, setShow3dBackground] = useState(true);

  const threatChips = [
    { slug: 'phishing', name: 'Phishing', icon: ShieldCheck, example: '"Your account will be suspended today."' },
    { slug: 'banking-scams', name: 'Banking scam', icon: Building2, example: '"Update your PAN/KYC to avoid freeze."' },
    { slug: 'job-scams', name: 'Job scam', icon: Briefcase, example: '"Remote work ₹45k/mo — pay ₹2,500 fee."' },
    { slug: 'investment-scams', name: 'Investment scam', icon: TrendingUp, example: '"Guaranteed 20% daily return on crypto."' },
    { slug: 'otp-safety', name: 'OTP scam', icon: KeyRound, example: '"Share 6-digit OTP to claim ₹1,500 refund."' },
    { slug: 'delivery-scams', name: 'Delivery scam', icon: Package, example: '"Parcel held at customs — pay ₹45 duty."' },
    { slug: 'fake-support', name: 'Tech support scam', icon: Headphones, example: '"Download AnyDesk for urgent refund."' },
    { slug: 'social-media-scams', name: 'Social media scam', icon: Users, example: '"Copyright violation — appeal in 24h."' }
  ];

  const features = [
    { title: 'Message scanning', desc: 'Inspect text from WhatsApp, SMS, Telegram, and DMs for deceptive language patterns.', icon: MessageSquare },
    { title: 'URL analysis', desc: 'Safely evaluate typosquatting, raw IP hosts, and obfuscated shortened web links.', icon: Link2 },
    { title: 'AI content analysis', desc: 'Examine cognitive pressure tactics, urgency indicators, and concealed intent.', icon: Cpu },
    { title: 'Risk scoring', desc: 'Get a calibrated 0–100 score across Low, Medium, High, and Critical bands.', icon: BarChart3 },
    { title: 'Threat classification', desc: 'Categorize attacks into recognized domains like banking, job, or parcel scams.', icon: ShieldCheck },
    { title: 'Explainable results', desc: 'See exact quoted phrases extracted directly from your input with reasoning.', icon: FileCheck },
    { title: 'Actionable safety steps', desc: 'Clear, prioritized guidance on who to verify with and how to protect yourself.', icon: CheckCircle2 },
    { title: 'Scan history & stats', desc: 'Track your personal security awareness metrics and revisit previous scans.', icon: History }
  ];

  return (
    <div className="landing-page">
      {/* 13.2 Hero Section with 3D Tubes Integration */}
      <section className="landing-hero-section">
        {show3dBackground ? (
          <TubesBackground className="landing-tubes-wrapper" overlayOpacity={0.65}>
            <div className="container landing-hero-container">
              <div className="landing-hero-grid">
                {/* Left Column */}
                <div className="landing-hero-left">
                  <div className="landing-interactive-pill">
                    <Sparkles size={14} style={{ color: '#38BDF8' }} />
                    <span>3D Interactive Cursor Mesh · Click to change neon</span>
                  </div>

                  <h1 className="landing-hero-title">
                    Don't trust it. <span className="hero-highlight">Scan it.</span>
                  </h1>

                  <p className="landing-hero-sub">
                    Paste a suspicious message, link, or email. PhishGuard checks it against known scam patterns and AI analysis, then tells you what's wrong with it and what to do next.
                  </p>

                  <div className="landing-hero-ctas">
                    <Button variant="primary" size="lg" to="/scan/message" icon={<ArrowRight size={18} />} iconPosition="right">
                      Scan a message
                    </Button>
                    <Button variant="outline-inverse" size="lg" to="/scan/url">
                      Check a URL
                    </Button>
                  </div>

                  {/* Trust Row */}
                  <div className="landing-trust-row">
                    <div className="landing-trust-item">
                      <Lock size={16} />
                      <span>Your text is analyzed, not published</span>
                    </div>
                    <div className="landing-trust-item">
                      <Zap size={16} />
                      <span>Results in seconds</span>
                    </div>
                    <div className="landing-trust-item">
                      <Eye size={16} />
                      <span>Explains every flag</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Security Report Preview */}
                <div className="landing-hero-right">
                  <SecurityReportPreview />
                </div>
              </div>
            </div>
          </TubesBackground>
        ) : (
          <div className="container landing-hero-container" style={{ padding: 'var(--space-9) 0' }}>
            {/* Fallback standard view */}
            <div className="landing-hero-grid">
              <div className="landing-hero-left">
                <h1 className="landing-hero-title" style={{ color: 'var(--color-text)' }}>
                  Don't trust it. Scan it.
                </h1>
                <p className="landing-hero-sub" style={{ color: 'var(--color-text-secondary)' }}>
                  Paste a suspicious message or link. PhishGuard checks it against known scam patterns and AI analysis, then tells you what's wrong with it and what to do next.
                </p>
                <div className="landing-hero-ctas">
                  <Button variant="primary" size="lg" to="/scan/message">Scan a message</Button>
                  <Button variant="secondary" size="lg" to="/scan/url">Check a URL</Button>
                </div>
              </div>
              <div className="landing-hero-right">
                <SecurityReportPreview />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 13.3 Problem Section */}
      <section className="landing-section landing-section--surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Scams don't look like scams anymore.</h2>
          </div>

          <div className="landing-problem-grid">
            {/* Left: 3 short paragraphs */}
            <div className="landing-problem-text">
              <p>
                Modern cyber attacks copy real bank, HR, and courier wording with pixel-perfect accuracy. Attackers no longer rely on poor grammar — they use realistic branded templates and authentic tone.
              </p>
              <p>
                Artificial urgency bypasses your natural caution. Deadlines like "Account suspended in 2 hours" or "Immediate customs clearance required" force quick reactions before you have time to think.
              </p>
              <p>
                The links look almost right. Small character substitutions (like paypa1.com or hdfc-verify.top) and raw IP hosts easily trick busy people on small mobile screens.
              </p>
            </div>

            {/* Right: Realistic Chat Bubbles */}
            <div className="landing-problem-examples">
              {/* Bubble 1: SMS */}
              <div className="sample-bubble sample-bubble--sms">
                <span className="sample-badge">SMS · AX-HDFCBK</span>
                <p className="sample-text">
                  URGENT: Your account #4902 is locked due to pending KYC. Update PAN immediately to restore access: http://secure-hdfc-kyc.top
                </p>
                <span className="sample-caption">Example — not a real message · Looks legitimate?</span>
              </div>

              {/* Bubble 2: WhatsApp */}
              <div className="sample-bubble sample-bubble--whatsapp">
                <span className="sample-badge">WhatsApp · Recruiter HR</span>
                <p className="sample-text">
                  Hi! Amazon HR has approved your remote data entry application (₹45,000/mo). Pay ₹2,500 registration deposit to start: http://amz-jobs.in/pay
                </p>
                <span className="sample-caption">Example — not a real message · Looks legitimate?</span>
              </div>

              {/* Bubble 3: Email */}
              <div className="sample-bubble sample-bubble--email">
                <span className="sample-badge">Email · Billing Notice</span>
                <p className="sample-text">
                  FINAL NOTICE: Outstanding invoice #INV-8891 requires immediate clearance before legal recovery charges apply.
                </p>
                <span className="sample-caption">Example — not a real message · Looks legitimate?</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13.4 How it works */}
      <section id="how-it-works" className="landing-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">How PhishGuard AI protects you</h2>
            <p className="section-subtitle">Three straightforward steps to complete peace of mind.</p>
          </div>

          <div className="how-it-works-grid">
            <Card padding="lg" className="how-step-card">
              <div className="how-step-num">1</div>
              <div className="how-step-icon"><ScanSearch size={24} /></div>
              <h3 className="how-step-title">Detect</h3>
              <p className="how-step-desc">
                Rules and AI check the content for known scam patterns, risky links, and pressure tactics.
              </p>
            </Card>

            <Card padding="lg" className="how-step-card">
              <div className="how-step-num">2</div>
              <div className="how-step-icon"><ListChecks size={24} /></div>
              <h3 className="how-step-title">Understand</h3>
              <p className="how-step-desc">
                You get a calibrated risk score and a plain-language list of exactly what was flagged with quoted evidence.
              </p>
            </Card>

            <Card padding="lg" className="how-step-card">
              <div className="how-step-num">3</div>
              <div className="how-step-icon"><ShieldCheck size={24} /></div>
              <h3 className="how-step-title">Protect</h3>
              <p className="how-step-desc">
                Then the specific steps to take — what not to click, who to verify with, and where to report.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 13.5 Features grid */}
      <section id="features" className="landing-section landing-section--surface">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">Calibrated security intelligence</h2>
            <p className="section-subtitle">Engineered for clarity, accuracy, and everyday comprehension.</p>
          </div>

          <div className="landing-features-grid">
            {features.map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <Card key={i} padding="md" className="feature-item-card">
                  <div className="feature-icon-wrapper">
                    <IconComp size={20} />
                  </div>
                  <h4 className="feature-title">{feat.title}</h4>
                  <p className="feature-desc">{feat.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13.6 Threat categories */}
      <section id="threats" className="landing-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
            <h2 className="section-title">Common threat categories</h2>
            <p className="section-subtitle">Click any category to explore warning signs and protective guidelines.</p>
          </div>

          <div className="threat-chips-grid">
            {threatChips.map((chip) => {
              const IconComp = chip.icon;
              return (
                <Link key={chip.slug} to={`/education/${chip.slug}`} className="threat-chip-link">
                  <div className="threat-chip">
                    <div className="threat-chip-header">
                      <IconComp size={18} className="threat-chip-icon" />
                      <span className="threat-chip-name">{chip.name}</span>
                    </div>
                    <span className="threat-chip-example">{chip.example}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13.7 Security report preview section */}
      <section className="landing-section landing-section--surface">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">This is what a result looks like</h2>
            <p className="section-subtitle">No security jargon. Clear risk levels, extracted indicators, and immediate action items.</p>
          </div>

          <div className="annotated-preview-wrapper">
            <div className="annotated-card-column">
              <SecurityReportPreview />
            </div>

            <div className="annotations-column">
              <div className="annotation-item">
                <span className="annotation-badge">1. Calibrated Risk Meter</span>
                <h4 className="annotation-title">Transparent 0–100 Scale</h4>
                <p className="annotation-desc">Shows precisely where the score sits across Low, Medium, High, and Critical thresholds.</p>
              </div>

              <div className="annotation-item">
                <span className="annotation-badge">2. Plain Language Evidence</span>
                <h4 className="annotation-title">Quoted Signals</h4>
                <p className="annotation-desc">Highlights exact phrases found in your input so you understand why it was flagged.</p>
              </div>

              <div className="annotation-item">
                <span className="annotation-badge">3. Urgent Next Steps</span>
                <h4 className="annotation-title">Prioritized Action Guidance</h4>
                <p className="annotation-desc">Tells you who to contact, what not to click, and how to verify safely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13.8 Final CTA */}
      <section className="landing-final-cta">
        <div className="container">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Got something suspicious right now?</h2>
            <p className="final-cta-sub">
              Scan it before you reply, click, or pay. Check takes under 5 seconds with zero account tracking.
            </p>
            <div className="final-cta-buttons">
              <Button variant="primary" size="lg" to="/scan/message" icon={<ArrowRight size={18} />} iconPosition="right">
                Scan a message
              </Button>
              <Button variant="outline-inverse" size="lg" to="/scan/url">
                Check a URL
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
