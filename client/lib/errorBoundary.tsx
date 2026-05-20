import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('view_error', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-[#0f071a] flex flex-col items-center justify-center p-6 text-center">
            <p className="text-white font-bold mb-2">页面出现异常</p>
            <p className="text-gray-400 text-sm mb-4">请刷新后重试</p>
            <button
              type="button"
              className="px-4 py-2 bg-purple-600 rounded-xl text-white text-sm font-bold"
              onClick={() => window.location.reload()}
            >
              刷新
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
