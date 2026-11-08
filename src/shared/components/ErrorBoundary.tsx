import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Rendering failures are isolated here; API failures keep their own UI state.
    void error;
    void errorInfo;
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render(): ReactNode {
    if (this.state.hasError)
      return (
        <section className="page catalog-status" role="alert">
          <p className="eyebrow">MARIGOLD</p>
          <h1>Something interrupted this page.</h1>
          <p>Please try loading it again.</p>
          <Button
            className="button"
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again <span>→</span>
          </Button>
        </section>
      );
    return this.props.children;
  }
}
