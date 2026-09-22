import React, { useState } from 'react';
import { Link2, AlertTriangle, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ScannerForm from '../../components/scan/ScannerForm';
import ExamplePicker from '../../components/scan/ExamplePicker';
import ScanningOverlay from '../../components/scan/ScanningOverlay';
import scanService from '../../services/scanService';
import { useScan } from '../../hooks/useScan';
import { useToast } from '../../context/ToastContext';
import { URL_EXAMPLES } from '../../data/examples';
import { normalizeUrl } from '../../utils/validation';

export default function UrlScannerPage() {
  const [rawUrl, setRawUrl] = useState('');
  const [fieldError, setFieldError] = useState(null);

  const { overlayOpen, status, currentStage, error, startScan, cancelScan } = useScan(scanService.scanUrl);
  const { notify } = useToast();

  const parsedValidation = normalizeUrl(rawUrl);

  const handleSelectExample = (ex) => {
    setRawUrl(ex.content);
    setFieldError(null);
    notify.info('Example URL loaded');
  };

  const handleSubmit = async () => {
    if (!parsedValidation.ok) {
      setFieldError(parsedValidation.error);
      return;
    }
    setFieldError(null);
    await startScan({ url: parsedValidation.value });
  };

  const sidePanels = (
    <>
      <ExamplePicker
        title="Try an example link"
        examples={URL_EXAMPLES}
        onSelectExample={handleSelectExample}
      />

      <Card padding="md">
        <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
          What gets checked
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>HTTPS encryption and SSL protocol use</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Domain structure, subdomains, and TLD validity</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Lookalike characters and brand typosquatting</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Raw IP-address hosts (e.g. 192.168.1.1)</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Shortened URL mask detection</span>
          </li>
        </ul>
      </Card>

      <div
        style={{
          padding: 'var(--space-4)',
          backgroundColor: 'var(--color-warning-bg)',
          border: '1px solid var(--color-warning-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
          <AlertTriangle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4, margin: 0 }}>
            <strong>Safety tip:</strong> Don't open the link to test it. Copy it with a long-press (mobile) or right-click → Copy link address (desktop).
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <ScannerForm
        type="url"
        title="Check a suspicious link"
        subtitle="Paste the link without opening it. PhishGuard inspects the address itself — you never have to visit the site."
        onSubmit={handleSubmit}
        onClear={() => {
          setRawUrl('');
          setFieldError(null);
        }}
        canSubmit={rawUrl.trim().length > 3}
        submitLabel="Analyze link"
        loading={status === 'running'}
        sidePanels={sidePanels}
      >
        <Input
          label="Suspicious web address"
          name="url"
          value={rawUrl}
          onChange={(e) => {
            setRawUrl(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          placeholder="https://secure-bank-verify.co/login"
          prefixIcon={<Link2 size={18} />}
          mono={true}
          error={fieldError}
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          required
        />

        {/* Real-time Parsed Preview Strip (Client-side new URL() only) */}
        {parsedValidation.ok && parsedValidation.parsed && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-card-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-xs)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={14} style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>Protocol:</span>
              <strong className="font-mono">{parsedValidation.parsed.protocol}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Domain:</span>
              <strong className="font-mono" style={{ color: 'var(--color-critical)' }}>{parsedValidation.parsed.hostname}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Path:</span>
              <span className="font-mono">{parsedValidation.parsed.pathname}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subdomains:</span>
              <span>{parsedValidation.parsed.subdomains}</span>
            </div>
          </div>
        )}

        {parsedValidation.ok && parsedValidation.addedScheme && (
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Analyzing as <code>http://{rawUrl.trim()}</code> — the link had no https:// or http:// prefix.
          </p>
        )}
      </ScannerForm>

      <ScanningOverlay
        open={overlayOpen}
        status={status}
        currentStage={currentStage}
        error={error}
        hasUrl={true}
        onCancel={cancelScan}
        onRetry={handleSubmit}
      />
    </>
  );
}
