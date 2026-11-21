import React from 'react';
import { Card } from '../ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  timeframe?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  timeframe = 'vs last month',
  icon,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && <div className="p-2 rounded-lg bg-surface-secondary text-brand-cobalt">{icon}</div>}
      </div>

      <div className="mt-3">
        <h3 className="text-3xl font-bold font-display text-text-primary tracking-tight">
          {value}
        </h3>
        {change && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span
              className={cn(
                'flex items-center font-semibold px-1.5 py-0.5 rounded',
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              )}
            >
              {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {change}
            </span>
            <span className="text-text-muted">{timeframe}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
