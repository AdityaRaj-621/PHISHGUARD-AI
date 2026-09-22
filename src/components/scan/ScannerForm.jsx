import React, { useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ArrowRight, Trash2 } from 'lucide-react';
import './ScannerForm.css';

export default function ScannerForm({
  type = 'message',
  title,
  subtitle,
  children,
  onSubmit,
  onClear,
  canSubmit = true,
  submitLabel = 'Analyze',
  loading = false,
  sidePanels = null,
  className = ''
}) {
  // Ctrl+Enter or Cmd+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (canSubmit && !loading) {
          e.preventDefault();
          onSubmit?.();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSubmit, loading, onSubmit]);

  return (
    <div className={`scanner-layout ${className}`}>
      {/* Main Input Column */}
      <div className="scanner-main">
        <div className="scanner-header">
          <h1 className="scanner-title">{title}</h1>
          {subtitle && <p className="scanner-subtitle">{subtitle}</p>}
        </div>

        <Card padding="lg" className="scanner-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit && !loading) onSubmit?.();
            }}
          >
            {children}

            {/* Action Toolbar */}
            <div className="scanner-actions-bar">
              {onClear && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onClear}
                  disabled={loading}
                  icon={<Trash2 size={16} />}
                >
                  Clear
                </Button>
              )}

              <div className="scanner-submit-wrapper">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={!canSubmit}
                  loadingLabel="Analyzing…"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  {submitLabel}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      {/* Side Panels Column */}
      {sidePanels && <div className="scanner-sidebar">{sidePanels}</div>}
    </div>
  );
}
