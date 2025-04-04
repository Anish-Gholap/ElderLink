// withErrorBoundary.js
import React, { Component } from "react";


function withErrorBoundary(WrappedComponent) {
    // This HOC will wrap the passed component and provide error boundary functionality
    return class ErrorBoundaryHOC extends Component {

        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true, error };
        }

        componentDidCatch(error, info) {
            console.error("Caught in HOC ErrorBoundary:", error, info);

        }

        render() {
            if (this.state.hasError) {
                return (
                    <div>

                        <div style={{ textAlign: "center", padding: 20 }}>
                            <h2>Something went wrong.</h2>
                            <pre>{this.state.error?.message}</pre>
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                );
            }

            return <WrappedComponent {...this.props} />;
        }
    };
}

export default withErrorBoundary;
