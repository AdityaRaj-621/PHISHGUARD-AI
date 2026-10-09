import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/feedback/EmptyState';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
      <EmptyState
        icon={<ShieldAlert size={32} />}
        title="404 — Page Not Found"
        description="The requested page address does not exist or has been moved."
        action={{ label: 'Back to Dashboard', onClick: () => navigate('/dashboard'), icon: <Home size={16} /> }}
        secondaryAction={{ label: 'Go to Landing Page', onClick: () => navigate('/'), icon: <ArrowLeft size={16} /> }}
      />
    </div>
  );
}
