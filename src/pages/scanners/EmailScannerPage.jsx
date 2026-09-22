import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import ScannerForm from '../../components/scan/ScannerForm';
import ExamplePicker from '../../components/scan/ExamplePicker';
import ScanningOverlay from '../../components/scan/ScanningOverlay';
import scanService from '../../services/scanService';
import { useScan } from '../../hooks/useScan';
import { useToast } from '../../context/ToastContext';
import { EMAIL_EXAMPLES } from '../../data/examples';
import { Mail, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';

export default function EmailScannerPage() {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { overlayOpen, status, currentStage, error, startScan, cancelScan } = useScan(scanService.scanEmail);
  const { notify } = useToast();

  const handleSelectExample = (ex) => {
    setSender(ex.sender || '');
    setSubject(ex.subject || '');
    setBody(ex.content || '');
    setUrl(ex.url || '');
    setFieldErrors({});
    notify.info('Example email loaded');
  };

  const handleClear = () => {
    setSender('');
    setSubject('');
    setBody('');
    setUrl('');
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!body.trim()) {
      errors.body = 'Email body content is required.';
    } else if (body.trim().length < 10) {
      errors.body = 'Paste at least 10 characters of the email body.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await startScan({
      sender: sender.trim(),
      subject: subject.trim(),
      body: body.trim(),
      url: url.trim()
    });
  };

  // Soft warning if display name and domain disagree
  const showSenderWarning = sender && sender.includes('@') && !sender.includes('.com') && !sender.includes('.org') && !sender.includes('.in');

  const sidePanels = (
    <>
      <ExamplePicker
        title="Try an example email"
        examples={EMAIL_EXAMPLES}
        onSelectExample={handleSelectExample}
      />

      <Card padding="md">
        <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
          What raises suspicion in email
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Sender domain that doesn't match the purported brand</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Urgency, deadlines, or threats of legal suspension</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Requests for passwords, OTPs, or credit card updates</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Payment, invoice, or refund requests with external portals</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <span>Links whose visible anchor text differs from destination</span>
          </li>
        </ul>
      </Card>

      <div
        style={{
          padding: 'var(--space-4)',
          backgroundColor: 'var(--color-info-bg)',
          border: '1px solid var(--color-info-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
          <strong>Attachment notice:</strong> PhishGuard inspects text, headers, and links. Never open unexpected file attachments (.exe, .zip, .html, .iso).
        </p>
      </div>
    </>
  );

  return (
    <>
      <ScannerForm
        type="email"
        title="Scan a suspicious email"
        subtitle="Paste email headers, body text, or links. PhishGuard checks sender discrepancies, phishing links, and deceptive phrasing."
        onSubmit={handleSubmit}
        onClear={handleClear}
        canSubmit={body.trim().length >= 10}
        submitLabel="Analyze email"
        loading={status === 'running'}
        sidePanels={sidePanels}
      >
        <Input
          label="Sender address (optional)"
          name="sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="support@yourbank-verify.com"
          mono={true}
          hint="From header or display address"
          prefixIcon={<Mail size={16} />}
        />

        {showSenderWarning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)', color: 'var(--color-warning)', marginTop: '-8px', marginBottom: 'var(--space-3)' }}>
            <AlertTriangle size={14} />
            <span>Does this sender domain match the official organization you know?</span>
          </div>
        )}

        <Input
          label="Email subject (optional)"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. FINAL NOTICE: Account suspension warning"
          maxLength={200}
        />

        <Textarea
          label="Email body text"
          name="body"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (fieldErrors.body) setFieldErrors({ ...fieldErrors, body: null });
          }}
          placeholder="Paste the full email body content here..."
          error={fieldErrors.body}
          minHeight={220}
          maxHeight={480}
          maxLength={10000}
          required
        />

        <Input
          label="Link found inside email (optional)"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://quick-invoices-portal.com/pay"
          prefixIcon={<Link2 size={16} />}
          mono={true}
        />
      </ScannerForm>

      <ScanningOverlay
        open={overlayOpen}
        status={status}
        currentStage={currentStage}
        error={error}
        hasUrl={Boolean(url || /https?:\/\//.test(body))}
        onCancel={cancelScan}
        onRetry={handleSubmit}
      />
    </>
  );
}
