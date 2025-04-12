// withErrorBoundary.js
import React, { Component } from "react";

/**
 * Higher-Order Component (HOC) to provide error boundary functionality.
 * Wraps a given component and catches JavaScript errors in its child component tree.
 * Displays a fallback UI when an error occurs.
 *
 * @param {React.ComponentType} WrappedComponent - The component to wrap with the error boundary.
 * @returns {React.ComponentType} A new component with error boundary functionality.
 */
function withErrorBoundary(WrappedComponent) {
    // This HOC will wrap the passed component and provide error boundary functionality
    return class ErrorBoundaryHOC extends Component {

        /**
         * Creates an instance of the ErrorBoundaryHOC.
         * @param {Object} props - The component props.
         */
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
        }

        /**
         * Updates the state when an error is thrown in a child component.
         * @param {Error} error - The error that was thrown.
         * @returns {Object} The updated state.
         */
        static getDerivedStateFromError(error) {
            return { hasError: true, error };
        }

        /**
         * Logs error information to the console.
         * @param {Error} error - The error that was thrown.
         * @param {Object} info - Additional information about the error.
         */
        componentDidCatch(error, info) {
            console.error("Caught in HOC ErrorBoundary:", error, info);

        }

        /**
         * Renders the wrapped component or the fallback UI if an error occurred.
         * @returns {JSX.Element} The rendered component or fallback UI.
         */
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
