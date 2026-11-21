'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { getCategoryLabel } from '../../lib/utils';

interface CategoryChartProps {
  data: { category: string; count: number }[];
}

const CATEGORY_COLORS = ['#315CFF', '#D6A900', '#168C83', '#8A63C7', '#24613B', '#202B45'];

export function CategoryChart({ data }: CategoryChartProps) {
  const formatted = data.map((d) => ({
    name: getCategoryLabel(d.category),
    count: d.count,
  }));

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Issue occurrences partitioned by infrastructure sector</CardDescription>
      </CardHeader>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E5ED" opacity={0.6} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#737F90' }} stroke="#C9CFD9" />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#4B5568' }}
              stroke="#C9CFD9"
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#202B45',
                borderColor: '#34415B',
                color: '#F7F5EF',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {formatted.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
