import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './LoginPage.css';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errors = {};
    const id = identifier.trim();
    if (!id) {
      errors.identifier = 'Email or username is required.';
    } else if (id.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
      errors.identifier = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await login({ identifier: identifier.trim(), password });
      notify.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || "We couldn't sign you in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // Instant demo helper for hackathon judges
  const handleQuickLogin = (demoIdentifier, demoPassword) => {
    setIdentifier(demoIdentifier);
    setPassword(demoPassword);
    setFieldErrors({});
    setFormError(null);
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-header">
        <h1 className="login-title">Sign in to PhishGuard</h1>
        <p className="login-subtitle">
          Access your security dashboard, scan history, and threat analysis.
        </p>
      </div>

      {formError && (
        <div className="auth-error-banner" role="alert" tabIndex={-1}>
          <AlertCircle size={16} />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email or username"
          name="identifier"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: null });
          }}
          placeholder="aisha@example.com or aisha"
          error={fieldErrors.identifier}
          autoComplete="username"
          required
          disabled={loading}
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
          }}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="current-password"
          required
          disabled={loading}
          suffixAction={
            <button
              type="button"
              className="pwd-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            loadingLabel="Signing in…"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Sign in
          </Button>
        </div>
      </form>

      {/* Pre-seeded demo credentials for instant hackathon evaluation */}
      <div className="demo-credentials-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
          <UserCheck size={14} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}>
            One-Click Hackathon Demo Login:
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickLogin('aisha@example.com', 'DemoPass123!')}
            style={{ fontSize: 'var(--fs-xs)', flex: 1 }}
          >
            Demo User (Aisha)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickLogin('admin@phishguard.ai', 'AdminPass123!')}
            style={{ fontSize: 'var(--fs-xs)', flex: 1 }}
          >
            Admin Account
          </Button>
        </div>
      </div>

      <div className="auth-footer-link">
        <span>Don't have an account? </span>
        <Link to="/register" className="auth-switch-link">
          Create account
        </Link>
      </div>
    </div>
  );
}
