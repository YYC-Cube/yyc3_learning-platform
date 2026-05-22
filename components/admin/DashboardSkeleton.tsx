import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent } from '../ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-slate-800" />
          <Skeleton className="h-4 w-40 bg-slate-800" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-11 w-32 rounded-xl bg-slate-800" />
          <Skeleton className="h-11 w-40 rounded-xl bg-slate-800" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[#0F172A] border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <Skeleton className="w-12 h-12 rounded-xl bg-slate-800" />
                <Skeleton className="w-16 h-4 bg-slate-800" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-16 bg-slate-800" />
                <Skeleton className="h-8 w-24 bg-slate-800" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 bg-[#0F172A] border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-8 border-b border-white/5">
            <Skeleton className="h-6 w-48 bg-slate-800" />
          </div>
          <CardContent className="p-8">
            <Skeleton className="h-[350px] w-full rounded-2xl bg-slate-800" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-[#0F172A] border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-8 border-b border-white/5">
            <Skeleton className="h-6 w-40 bg-slate-800" />
          </div>
          <CardContent className="p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20 bg-slate-800" />
                  <Skeleton className="h-3 w-8 bg-slate-800" />
                </div>
                <Skeleton className="h-2 w-full bg-slate-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
