'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Issue } from '../../types';

const DynamicMap = dynamic(() => import('./issue-map-client'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-surface-secondary rounded-xl border border-border">
      <Skeleton className="w-16 h-16 rounded-full mb-3" />
      <p className="text-xs font-mono text-text-muted">Loading Leaflet Map Engine...</p>
    </div>
  ),
});

export interface IssueMapProps {
  issues: Issue[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: Issue) => void;
  center?: [number, number];
  zoom?: number;
  highlightRadiusMeters?: number;
  className?: string;
}

export function IssueMap(props: IssueMapProps) {
  return <DynamicMap {...props} />;
}
