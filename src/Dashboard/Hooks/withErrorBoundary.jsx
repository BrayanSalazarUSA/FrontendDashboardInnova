import React from 'react';

const withErrorBoundary = (WrappedComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error("Error caught in ErrorBoundary: ", error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong: {this.state.error.message}</div>;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withErrorBoundary;