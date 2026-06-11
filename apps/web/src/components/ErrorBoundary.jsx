import React from "react";
import { ServerError } from "../pages/ServerError";

/**
 * ErrorBoundary class component to intercept React page crashes.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "ErrorBoundary caught an uncaught exception:",
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return <ServerError error={this.state.error} />;
    }

    return this.props.children;
  }
}
