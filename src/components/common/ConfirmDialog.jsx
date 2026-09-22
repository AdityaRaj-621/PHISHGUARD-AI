import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  loading = false
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        {isDestructive && (
          <div style={{ color: 'var(--color-critical)', flexShrink: 0, marginTop: '2px' }}>
            <AlertTriangle size={20} />
          </div>
        )}
        <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-secondary)', lineHeight: varCss('--lh-body', 1.6) }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}

function varCss(v, fallback) {
  return fallback;
}
