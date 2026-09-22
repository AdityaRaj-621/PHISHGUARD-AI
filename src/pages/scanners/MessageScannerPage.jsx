import React, { useState } from 'react';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ScannerForm from '../../components/scan/ScannerForm';
import ExamplePicker from '../../components/scan/ExamplePicker';
import ScanningOverlay from '../../components/scan/ScanningOverlay';
import scanService from '../../services/scanService';
import { useScan } from '../../hooks/useScan';
import { useToast } from '../../context/ToastContext';
import { MESSAGE_EXAMPLES } from '../../data/examples';
import { validateMessage } from '../../utils/validation';
import { Clipboard, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function MessageScannerPage() {
  const [content, setContent] = useState('');
  const [fieldError, setFieldError] = useState(null);

  const { overlayOpen, status, currentStage, error, startScan, cancelScan } = useScan(scanService.scanMessage);
  const { notify } = useToast();

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        setContent(text);
        setFieldError(null);
        notify.info('Pasted from clipboard');
      } else {
        notify.error('Clipboard blocked by your browser — paste manually');
      }
    } catch {
      notify.error('Clipboard blocked by your browser — paste manually');
    }
  };

  const handleSelectExample = (ex) => {
    setContent(ex.content);
    setFieldError(null);
    notify.info('Example loaded — edit or analyze it');
  };

  const handleSubmit = async () => {
    const val = validateMessage(content);
    if (!val.ok) {
      setFieldError(val.error);
      return;
    }
    setFieldError(null);
    await startScan({ content: val.value });
  };

  const hasUrlInContent = /https?:\/\/[^\s]+/i.test(content);
  const canSubmit = content.trim().length >= 10 && content.length <= 5000;

  const sidePanels = (
    <>
      {/* 1. Try an example */}
      <ExamplePicker
        title="Try an example"
        examples={MESSAGE_EXAMPLES}
        onSelectExample={handleSelectExample}
      />

      {/* 2. What PhishGuard checks */}
      <Card padding="md">
        <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
          What PhishGuard checks
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Urgency and psychological pressure wording</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Requests for OTP, PIN, password or card details</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Payment and registration fee requests</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Threats regarding account suspension or legal action</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Lookalike domains and unencrypted links</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>AI assessment of the overall communication intent</span>
          </li>
        </ul>
      </Card>

      {/* 3. Privacy notice card */}
      <div
        style={{
          padding: 'var(--space-4)',
          backgroundColor: 'var(--color-info-bg)',
          border: '1px solid var(--color-info-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
          <Info size={16} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
            The text you paste is analyzed defensively and stored securely in your private history. Please remove personal account numbers before scanning.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <ScannerForm
        type="message"
        title="Scan a suspicious message"
        subtitle="Paste anything you received — WhatsApp, SMS, Telegram, Instagram DM, or any other app. PhishGuard checks the wording, the links, and the tactics used."
        onSubmit={handleSubmit}
        onClear={() => {
          setContent('');
          setFieldError(null);
        }}
        canSubmit={canSubmit}
        submitLabel="Analyze message"
        loading={status === 'running'}
        sidePanels={sidePanels}
      >
        <Textarea
          label="Suspicious message text"
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          placeholder="Paste the suspicious message here... (e.g. URGENT: Your bank account will be blocked...)"
          error={fieldError}
          maxLength={5000}
          minHeight={240}
          maxHeight={560}
          required
        />

        {/* Toolbar under textarea */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: '-8px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePasteClipboard}
            icon={<Clipboard size={14} />}
          >
            Paste from clipboard
          </Button>
        </div>
      </ScannerForm>

      {/* Scanning Stage Overlay */}
      <ScanningOverlay
        open={overlayOpen}
        status={status}
        currentStage={currentStage}
        error={error}
        hasUrl={hasUrlInContent}
        onCancel={cancelScan}
        onRetry={handleSubmit}
      />
    </>
  );
}
