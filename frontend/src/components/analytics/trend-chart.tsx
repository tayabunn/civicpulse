'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface TrendChartProps {
  data: { month: string; submitted: number; resolved: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Resolution Trajectory</CardTitle>
        <CardDescription>Monthly volume of submitted vs resolved municipal incidents</CardDescription>
      </CardHeader>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#315CFF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#315CFF" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#24613B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#24613B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E5ED" opacity={0.6} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737F90' }} stroke="#C9CFD9" />
            <YAxis tick={{ fontSize: 12, fill: '#737F90' }} stroke="#C9CFD9" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#202B45',
                borderColor: '#34415B',
                color: '#F7F5EF',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="submitted"
              name="Submitted"
              stroke="#315CFF"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorSubmitted)"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              name="Resolved"
              stroke="#24613B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorResolved)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-cobalt"></span>
          <span>Submitted Issues</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span>Resolved Issues</span>
        </div>
      </div>
    </Card>
  );
}
