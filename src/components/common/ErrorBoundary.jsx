import React from 'react';
import ErrorState from '../feedback/ErrorState';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PhishGuard ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)' }}>
          <ErrorState
            title="Something broke on this page"
            description="We ran into an unexpected problem. Try reloading the page to continue."
            onRetry={this.handleReload}
            retryLabel="Reload application"
            details={this.state.error?.message}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
