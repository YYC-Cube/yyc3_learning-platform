import React from 'react';
import { Skeleton } from './ui/skeleton';

export function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-7xl space-y-8">
        {/* Sidebar Skeleton (Hidden on Mobile) */}
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-white/5 hidden lg:block p-6 space-y-8">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:pl-64 space-y-8 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-900 border border-white/5 rounded-3xl p-6 space-y-4">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
