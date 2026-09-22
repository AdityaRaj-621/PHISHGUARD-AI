import React, { useEffect, useState } from 'react';
import { Check, MinusCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import './ScanningOverlay.css';

const DEFAULT_STAGES = [
  { id: 1, label: 'Receiving your input' },
  { id: 2, label: 'Checking security indicators' },
  { id: 3, label: 'Analyzing links' },
  { id: 4, label: 'Running AI analysis' },
  { id: 5, label: 'Calculating risk' },
  { id: 6, label: 'Preparing your report' }
];

export default function ScanningOverlay({
  open = false,
  status = 'running', // 'running', 'success', 'error', 'timeout'
  currentStage = 1,
  error = null,
  hasUrl = true,
  onCancel = null,
  onRetry = null
}) {
  const [canCancel, setCanCancel] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!open || status !== 'running') {
      setCanCancel(false);
      setElapsed(0);
      return;
    }

    // Spec §20: Show cancel after 3s
    const cancelTimer = setTimeout(() => {
      setCanCancel(true);
    }, 3000);

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(cancelTimer);
      clearInterval(interval);
    };
  }, [open, status]);

  if (!open) return null;

  const stages = DEFAULT_STAGES.filter((s) => (s.id === 3 && !hasUrl ? false : true));

  return (
    <div
      className="scanning-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanning-title"
    >
      <div className="scanning-modal">
        <div className="scanning-header">
          <div className="scanning-header__title-row">
            <h3 id="scanning-title" className="scanning-title">
              {status === 'error' ? 'Analysis issue' : status === 'timeout' ? 'Scan taking longer' : 'Analyzing submission…'}
            </h3>
            {status === 'running' && (
              <span className="scanning-elapsed" aria-live="polite">
                {elapsed}s elapsed
              </span>
            )}
          </div>
          <p className="scanning-subtitle">
            {status === 'error'
              ? 'We encountered an error while processing the content.'
              : status === 'timeout'
              ? 'This is taking longer than expected.'
              : 'Verifying scam patterns, linguistic signals, and technical indicators.'}
          </p>
        </div>

        {status === 'error' || status === 'timeout' ? (
          <div className="scanning-error-panel" role="alert">
            <AlertTriangle size={24} style={{ color: 'var(--color-critical)' }} />
            <p className="scanning-error-msg">{error || "PhishGuard couldn't complete the scan."}</p>
            <div className="scanning-actions">
              {onRetry && (
                <Button variant="primary" size="md" onClick={onRetry}>
                  Try again
                </Button>
              )}
              {onCancel && (
                <Button variant="secondary" size="md" onClick={onCancel}>
                  Cancel scan
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="scanning-stages-list" aria-live="polite">
            {stages.map((stage, idx) => {
              const isDone = stage.id < currentStage || status === 'success';
              const isActive = stage.id === currentStage && status === 'running';
              const isPending = stage.id > currentStage && status !== 'success';

              return (
                <div
                  key={stage.id}
                  className={`scanning-stage-row ${isActive ? 'scanning-stage-row--active' : ''} ${isDone ? 'scanning-stage-row--done' : ''}`}
                >
                  <div className="scanning-dot-wrapper">
                    <div
                      className={`scanning-dot ${isDone ? 'scanning-dot--done' : isActive ? 'scanning-dot--active' : 'scanning-dot--pending'}`}
                    >
                      {isDone ? <Check size={12} strokeWidth={3} /> : null}
                    </div>
                    {idx < stages.length - 1 && (
                      <div
                        className={`scanning-rail ${isDone ? 'scanning-rail--done' : isActive ? 'scanning-rail--active' : ''}`}
                      />
                    )}
                  </div>

                  <span className="scanning-stage-label">{stage.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {status === 'running' && canCancel && onCancel && (
          <div className="scanning-footer">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel scan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
