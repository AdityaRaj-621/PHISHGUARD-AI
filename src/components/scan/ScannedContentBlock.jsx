import React, { useState } from 'react';
import { ChevronDown, FileText, Globe, Mail, ShieldAlert } from 'lucide-react';
import Card from '../ui/Card';
import CopyButton from '../common/CopyButton';

export default function ScannedContentBlock({
  scanType = 'message',
  inputText = '',
  inputMeta = {},
  urlAnalysis = null,
  className = ''
}) {
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  const parseUrlComponents = (rawUrl) => {
    try {
      const u = new URL(rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`);
      return {
        protocol: u.protocol,
        hostname: u.hostname,
        pathname: u.pathname,
        search: u.search
      };
    } catch {
      return { protocol: '', hostname: rawUrl, pathname: '', search: '' };
    }
  };

  const isLongMessage = inputText && inputText.length > 300;

  return (
    <Card className={`scanned-content-card ${className}`} padding="none">
      <details
        className="scanned-details"
        open={true}
        style={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <summary
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            cursor: 'pointer',
            backgroundColor: 'var(--color-card-alt)',
            borderBottom: '1px solid var(--color-border)',
            listStyle: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {scanType === 'message' && <FileText size={18} style={{ color: 'var(--color-primary)' }} />}
            {scanType === 'url' && <Globe size={18} style={{ color: 'var(--color-primary)' }} />}
            {scanType === 'email' && <Mail size={18} style={{ color: 'var(--color-primary)' }} />}
            <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', margin: 0 }}>
              What was scanned
            </h3>
          </div>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)' }}>
            Submitted content
          </span>
        </summary>

        <div style={{ padding: 'var(--space-6)' }}>
          {/* Message Scanner Content */}
          {scanType === 'message' && (
            <div>
              <div
                style={{
                  backgroundColor: 'var(--color-card-alt)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-2)' }}>
                  <CopyButton text={inputText} size="sm" />
                </div>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-sm)',
                    lineHeight: 1.6,
                    color: 'var(--color-text)',
                    maxHeight: isLongMessage && !isMessageExpanded ? '180px' : 'none',
                    overflow: 'hidden'
                  }}
                >
                  {inputText}
                </div>
                {isLongMessage && (
                  <button
                    type="button"
                    onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                    style={{
                      marginTop: 'var(--space-2)',
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--color-primary)',
                      fontWeight: 'var(--fw-semibold)',
                      cursor: 'pointer'
                    }}
                  >
                    {isMessageExpanded ? 'Show less' : 'Show full message'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* URL Scanner Content */}
          {scanType === 'url' && (
            <div>
              {(() => {
                const parts = parseUrlComponents(inputText || inputMeta?.url || '');
                return (
                  <div
                    style={{
                      backgroundColor: 'var(--color-card-alt)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                        Parsed URL Breakdown
                      </span>
                      <CopyButton text={inputText} size="sm" />
                    </div>

                    {/* Safe Non-Clickable Mono Breakdown */}
                    <div
                      className="font-mono"
                      style={{
                        padding: 'var(--space-3)',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--fs-sm)',
                        wordBreak: 'break-all',
                        marginBottom: 'var(--space-3)'
                      }}
                    >
                      <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{parts.protocol}//</span>
                      <span style={{ color: 'var(--color-critical)', fontWeight: 'bold' }}>{parts.hostname}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{parts.pathname}{parts.search}</span>
                    </div>

                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                      <ShieldAlert size={14} />
                      <span>Links here are shown as plain text and are not clickable for your safety.</span>
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Email Scanner Content */}
          {scanType === 'email' && (
            <div
              style={{
                backgroundColor: 'var(--color-card-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)'
              }}
            >
              <dl style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 'var(--space-2) var(--space-4)', fontSize: 'var(--fs-sm)' }}>
                {inputMeta?.sender && (
                  <>
                    <dt style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>Sender:</dt>
                    <dd className="font-mono" style={{ margin: 0, color: 'var(--color-text)' }}>{inputMeta.sender}</dd>
                  </>
                )}
                {inputMeta?.subject && (
                  <>
                    <dt style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>Subject:</dt>
                    <dd style={{ margin: 0, color: 'var(--color-text)', fontWeight: 'var(--fw-semibold)' }}>{inputMeta.subject}</dd>
                  </>
                )}
                {inputMeta?.url && (
                  <>
                    <dt style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>Embedded link:</dt>
                    <dd className="font-mono" style={{ margin: 0, color: 'var(--color-critical)' }}>{inputMeta.url}</dd>
                  </>
                )}
              </dl>

              {inputText && (
                <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>
                    Email Body Content:
                  </span>
                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--color-text)',
                      backgroundColor: 'var(--color-surface)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {inputText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </details>
    </Card>
  );
}
