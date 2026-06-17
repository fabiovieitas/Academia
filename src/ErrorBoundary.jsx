import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', fontFamily: 'sans-serif' }}>
          <h2>Oops! Algo deu errado no app.</h2>
          <p style={{ color: '#ff6b6b' }}>{this.state.error?.message}</p>
          <p>Tente limpar os dados e recarregar o aplicativo.</p>
          <button 
            onClick={this.handleReset}
            style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}
          >
            Limpar Dados e Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
