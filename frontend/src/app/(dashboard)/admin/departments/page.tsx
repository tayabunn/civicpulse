'use client';

import React from 'react';
import { useGetDepartmentsQuery } from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { Department } from '@/types';

export default function AdminDepartmentsPage() {
  const { data: departments, isLoading } = useGetDepartmentsQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
          Municipal Departments & Resource Allocation
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Dhaka City Corporation operational divisions, assigned vehicle crews, and infrastructure responsibilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full py-12 text-center text-xs font-mono text-text-muted">
            Loading departments...
          </p>
        ) : !departments || departments.length === 0 ? (
          <Card className="col-span-full p-8 text-center text-text-muted">
            No departments found.
          </Card>
        ) : (
          departments.map((dept: Department) => (
            <Card key={dept.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-midnight text-brand-yellow flex items-center justify-center font-bold shadow">
                  <Building2 size={20} />
                </div>
                <Badge className="font-mono text-xs font-bold bg-surface-secondary text-brand-cobalt">
                  {dept.code}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-text-primary">
                  {dept.name}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {dept.description || 'Primary municipal infrastructure maintenance authority.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block">Field Personnel:</span>
                  <span className="font-bold text-text-primary">
                    {dept.staff?.length || 6} Technicians
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">SLA Standard:</span>
                  <span className="font-bold text-emerald-600">48 Hours (94%)</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
