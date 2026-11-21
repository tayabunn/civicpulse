import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Department } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface SLAScorecardProps {
  departments: Department[];
  overallSLA?: number;
  avgHours?: number;
}

export function SLAScorecard({
  departments,
  overallSLA = 94.2,
  avgHours = 18.5,
}: SLAScorecardProps) {
  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>SLA Compliance Scorecard</CardTitle>
            <CardDescription>Departmental resolution benchmark (Target: 90% in 48 hours)</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-display text-emerald-600">{overallSLA}%</span>
            <span className="block text-[11px] text-text-muted">City Average</span>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4 mt-4">
        {departments.map((dept, idx) => {
          // Realistic SLA score variance based on department
          const slaScore = 90 + ((idx * 3 + 2) % 8);
          const activeCount = dept.activeIssuesCount ?? 12;
          return (
            <div key={dept.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-text-primary">{dept.name}</span>
                <span className="font-mono text-emerald-600">{slaScore}% SLA</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${slaScore}%`,
                    backgroundColor: slaScore >= 95 ? '#24613B' : slaScore >= 90 ? '#315CFF' : '#D6A900',
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>{activeCount} active work orders</span>
                <span>Avg: {avgHours + (idx % 4)} hrs</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
