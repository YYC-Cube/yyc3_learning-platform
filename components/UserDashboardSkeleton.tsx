import React from 'react';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

export function UserDashboardSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="space-y-12 pb-12">
      {/* Section 1 */}
      <div>
        <Skeleton className="h-10 w-48 mb-6" />
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-900 border-white/5 rounded-2xl overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 2 */}
      <div className="mt-12">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-900 border-white/5 rounded-3xl p-6">
               <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
               <Skeleton className="h-6 w-32 mb-2" />
               <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
