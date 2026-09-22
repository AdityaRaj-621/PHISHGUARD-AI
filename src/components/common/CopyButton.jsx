import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../ui/Button';

export default function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  size = 'sm',
  variant = 'ghost',
  className = ''
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e?.stopPropagation();
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      icon={copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
      className={className}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
