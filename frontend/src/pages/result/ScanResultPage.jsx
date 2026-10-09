import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  RotateCcw,
  Copy,
  Clock,
  Cpu,
  Layers,
  CheckCircle2,
  AlertOctagon,
  HelpCircle
} from 'lucide-react';
import scanService from '../../services/scanService';
import { getRiskMeta } from '../../utils/risk';
import { formatRelativeTime, formatFullDate } from '../../utils/format';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import RiskScore from '../../components/risk/RiskScore';
import RiskBadge from '../../components/risk/RiskBadge';
import ThreatBadge from '../../components/risk/ThreatBadge';
import IndicatorCard from '../../components/scan/IndicatorCard';
import RecommendationCard from '../../components/scan/RecommendationCard';
import AIAnalysisCard from '../../components/scan/AIAnalysisCard';
import ScannedContentBlock from '../../components/scan/ScannedContentBlock';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';
import EmptyState from '../../components/feedback/EmptyState';
import CopyButton from '../../components/common/CopyButton';
import './ScanResultPage.css';

export default function ScanResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useToast();

  const isFreshScan = Boolean(location.state?.fresh);
  const [scan, setScan] = useState(location.state?.result ?? null);
  const [loading, setLoading] = useState(!scan);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scan && id) {
      setLoading(true);
      setError(null);
      scanService.getScan(id)
        .then((data) => {
          setScan(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [id, scan]);

  if (loading) {
    return (
      <div className="result-page-loading">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <LoadingState lines={1} height="32px" />
        </div>
        <Card padding="lg" style={{ marginBottom: 'var(--space-6)' }}>
          <LoadingState lines={4} height="40px" />
        </Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Card padding="md"><LoadingState lines={3} /></Card>
          <Card padding="md"><LoadingState lines={3} /></Card>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.status === 404) {
      return (
        <EmptyState
          title="Scan not found"
          description="This scan doesn't exist or isn't associated with your account."
          action={{ label: 'Back to scan history', onClick: () => navigate('/scans'), icon: <ArrowLeft size={16} /> }}
        />
      );
    }
    return (
      <ErrorState
        title="Couldn't load this report"
        description={error.message || 'An error occurred while retrieving the scan result.'}
        onRetry={() => window.location.reload()}
        onBack={() => navigate('/scans')}
      />
    );
  }

  if (!scan) return null;

  const riskMeta = getRiskMeta(scan.risk_level || scan.risk_score);
  const indicators = scan.indicators || [];
  const recommendations = scan.recommendations || [];

  // Sort indicators severity desc: high -> medium -> low
  const severityRank = { high: 3, medium: 2, low: 1 };
  const sortedIndicators = [...indicators].sort((a, b) => {
    const rankA = severityRank[a.severity?.toLowerCase()] || 0;
    const rankB = severityRank[b.severity?.toLowerCase()] || 0;
    return rankB - rankA;
  });

  // Sort recommendations priority desc: critical -> high -> normal -> info
  const priorityRank = { critical: 4, high: 3, normal: 2, info: 1 };
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const rankA = priorityRank[a.priority?.toLowerCase()] || 0;
    const rankB = priorityRank[b.priority?.toLowerCase()] || 0;
    return rankB - rankA;
  });

  const reportSummaryText = `PhishGuard AI Security Report:
Risk Score: ${scan.risk_score !== null ? `${scan.risk_score}/100` : 'Not determined'} (${scan.risk_level})
Threat Type: ${scan.threat_type || 'Unknown'}
Summary: ${scan.summary || ''}
Indicators Found: ${indicators.length}`;

  return (
    <div className={`scan-result-page ${isFreshScan ? 'scan-result-page--fresh' : ''}`}>
      {/* Screen reader status announcement */}
      <div className="sr-only" role="status">
        Scan complete. Risk score {scan.risk_score || 'unknown'} out of 100, {scan.risk_level?.toLowerCase()} risk, {scan.threat_type}.
      </div>

      {/* Top Breadcrumb / Back Row */}
      <div className="result-top-bar">
        <Link to="/scans" className="result-back-link">
          <ArrowLeft size={16} />
          <span>Back to history</span>
        </Link>

        <div className="result-top-actions">
          <CopyButton text={reportSummaryText} label="Copy report summary" copiedLabel="Summary copied" />
          <Button variant="secondary" size="sm" to={`/scan/${scan.scan_type || 'message'}`} icon={<RotateCcw size={14} />}>
            Scan another {scan.scan_type || 'message'}
          </Button>
        </div>
      </div>

      {/* 21.1 Verdict Hero */}
      <div
        className="result-hero"
        style={{
          backgroundColor: riskMeta.bg,
          border: `1px solid ${riskMeta.border}`,
          borderTop: `4px solid ${riskMeta.color}`
        }}
      >
        <div className="result-hero__header">
          <RiskBadge
            level={scan.risk_level}
            score={scan.risk_score}
            uppercase={true}
            size="md"
          />
          <span className="result-hero__time">
            Scanned {formatRelativeTime(scan.created_at)}
          </span>
        </div>

        {/* Score & Calibrated Meter */}
        <div className="result-hero__score-block">
          <RiskScore
            score={scan.risk_score}
            level={scan.risk_level}
            size="lg"
            animate={isFreshScan}
            showMeter={true}
            showDisclaimer={false}
          />
        </div>

        {/* Facts Row */}
        <div className="result-hero__facts">
          <div className="result-hero__fact">
            <span className="fact-label">Threat type:</span>
            <ThreatBadge threatType={scan.threat_type} size="sm" />
          </div>

          <div className="result-hero__fact">
            <span className="fact-label">Confidence:</span>
            <span className="fact-value">
              {scan.ai_analysis?.confidence !== undefined && scan.ai_analysis.confidence !== null
                ? (scan.ai_analysis.confidence > 0.75 ? 'High' : scan.ai_analysis.confidence >= 0.5 ? 'Moderate' : 'Low')
                : 'Rule-based'}
            </span>
          </div>

          <div className="result-hero__fact">
            <span className="fact-label">Analysis engine:</span>
            <span className="fact-value">
              {scan.analysis_mode === 'rules_ai' ? 'Rules + AI' : 'Rules only'}
            </span>
          </div>
        </div>

        {/* One-sentence summary */}
        <p className="result-hero__summary">
          {scan.summary}
        </p>

        {/* Disclaimer */}
        <p className="result-hero__disclaimer">
          This score reflects detected patterns and AI analysis. It is not proof that the content is or isn't malicious.
        </p>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="result-content-grid">
        {/* Left Column: Recommendations, Indicators, AI, Input */}
        <div className="result-main-col">
          {/* 21.2 What to do now (Recommendations) - Placed high for panicking users */}
          <section className="result-section">
            <div className="result-section-header">
              <h2 className="result-section-title">
                {scan.risk_level === 'LOW' ? 'Stay careful' : 'What should you do?'}
              </h2>
              <span className="result-section-badge">
                {sortedRecommendations.length} action steps
              </span>
            </div>

            <Card padding="md" className="recommendations-container">
              {sortedRecommendations.length === 0 ? (
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  No immediate intervention required. Maintain standard digital caution.
                </p>
              ) : (
                sortedRecommendations.map((rec, index) => (
                  <RecommendationCard
                    key={rec.id || index}
                    number={index + 1}
                    title={rec.title}
                    description={rec.description}
                    priority={rec.priority}
                  />
                ))
              )}
            </Card>
          </section>

          {/* 21.3 Why this was flagged (Indicators) */}
          <section className="result-section">
            <div className="result-section-header">
              <h2 className="result-section-title">
                Why this was flagged
              </h2>
              <span className="result-section-badge">
                {sortedIndicators.length} indicators found
              </span>
            </div>

            {sortedIndicators.length === 0 ? (
              <Card padding="md" style={{ backgroundColor: 'var(--color-card-alt)' }}>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {scan.risk_score && scan.risk_score > 30
                    ? 'The rule engine didn\'t return specific indicators for this scan. The score comes from AI analysis alone.'
                    : 'No specific suspicious indicators were triggered during rule-based inspection.'}
                </p>
              </Card>
            ) : (
              <div className="indicators-grid">
                {sortedIndicators.map((ind) => (
                  <IndicatorCard
                    key={ind.id}
                    type={ind.indicator_type}
                    title={ind.title}
                    description={ind.description}
                    severity={ind.severity}
                    evidence={ind.evidence}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 21.4 AI Analysis Card */}
          <section className="result-section">
            <AIAnalysisCard
              ai={scan.ai_analysis}
              fallbackLevel={scan.risk_level}
            />
          </section>

          {/* 21.5 What was scanned (Collapsible) */}
          <section className="result-section">
            <ScannedContentBlock
              scanType={scan.scan_type}
              inputText={scan.input_text}
              inputMeta={scan.input_meta}
              urlAnalysis={scan.url_analysis}
            />
          </section>
        </div>

        {/* Right Sticky Sidebar on Desktop */}
        <div className="result-side-col">
          {/* Scan Metadata Card */}
          <Card padding="md" className="result-meta-card">
            <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-3)' }}>
              Scan details
            </h3>

            <dl className="meta-dl">
              <dt>Scan ID:</dt>
              <dd className="font-mono">#{scan.id}</dd>

              <dt>Scan Type:</dt>
              <dd style={{ textTransform: 'capitalize' }}>{scan.scan_type || 'Message'}</dd>

              <dt>Date & Time:</dt>
              <dd>{formatFullDate(scan.created_at)}</dd>

              <dt>Mode:</dt>
              <dd>{scan.analysis_mode === 'rules_ai' ? 'Rules + AI Analyzer' : 'Rule Engine Only'}</dd>
            </dl>

            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Button
                variant="primary"
                size="md"
                to={`/scan/${scan.scan_type || 'message'}`}
                fullWidth
              >
                Scan another {scan.scan_type || 'message'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                to="/scans"
                fullWidth
              >
                View all past scans
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
