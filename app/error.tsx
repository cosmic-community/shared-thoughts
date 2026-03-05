'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-950 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😵</div>
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-8">
          {error.message || 'An unexpected error occurred while loading the billboard.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-canvas-600 hover:bg-canvas-500 text-white rounded-xl font-semibold transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}