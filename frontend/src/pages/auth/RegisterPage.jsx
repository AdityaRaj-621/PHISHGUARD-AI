import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, Circle, AlertCircle, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateEmail, getPasswordStrength } from '../../utils/validation';
import './LoginPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const strength = getPasswordStrength(formData.password);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    const emailRes = validateEmail(formData.email);
    if (!emailRes.ok) {
      errors.email = emailRes.error;
    }

    if (!strength.isMinValid) {
      errors.password = 'Password must be at least 8 characters with letters and numbers.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      await register({
        name: formData.name.trim(),
        username: formData.username.trim() || formData.email.split('@')[0],
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password2: formData.confirmPassword || formData.password
      });

      notify.success('Account created successfully');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.fields) {
        setFieldErrors(err.fields);
      } else {
        setFormError(err.message || 'Unable to create account. Please check the form.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ['#E2E8F0', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  return (
    <div className="login-form-wrapper">
      <div className="login-header">
        <h1 className="login-title">Create your account</h1>
        <p className="login-subtitle">
          Start scanning suspicious content with full history tracking.
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
          label="Full name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Aisha Kumar"
          error={fieldErrors.name}
          autoComplete="name"
          required
          disabled={loading}
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="aisha@example.com"
          error={fieldErrors.email}
          autoComplete="email"
          required
          disabled={loading}
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="••••••••"
          error={fieldErrors.password}
          autoComplete="new-password"
          required
          disabled={loading}
          suffixAction={
            <button
              type="button"
              className="pwd-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* 4-segment strength bar */}
        {formData.password && (
          <div className="pwd-strength-container">
            <div className="pwd-strength-bar">
              {[1, 2, 3, 4].map((seg) => (
                <div
                  key={seg}
                  className="pwd-strength-segment"
                  style={{
                    backgroundColor: seg <= strength.score ? strengthColors[strength.score] : 'var(--color-border)'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="pwd-strength-label">Strength: <strong>{strength.label}</strong></span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Min 8 chars, 1 letter & 1 number</span>
            </div>
          </div>
        )}

        <Input
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          required
          disabled={loading}
        />

        {/* Honest terms line */}
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 'var(--space-3) 0 var(--space-5) 0' }}>
          By creating an account you agree that PhishGuard stores the content you submit for scanning so you can view your history.
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          loadingLabel="Creating account…"
          icon={<ArrowRight size={18} />}
          iconPosition="right"
        >
          Create account
        </Button>
      </form>

      <div className="auth-footer-link">
        <span>Already have an account? </span>
        <Link to="/login" className="auth-switch-link">
          Sign in
        </Link>
      </div>
    </div>
  );
}
