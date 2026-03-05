export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-950">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-neon-pink animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-neon-green animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-gray-400 text-lg">Loading the billboard...</p>
      </div>
    </div>
  );
}