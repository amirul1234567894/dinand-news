'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold text-saffron-700 mb-4">!</p>
      <h1 className="font-display text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-ink-600 mb-8">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="inline-block px-6 py-3 bg-ink-900 text-ink-50 hover:bg-saffron-700 transition-colors rounded font-medium"
      >
        Try again
      </button>
    </div>
  );
}
