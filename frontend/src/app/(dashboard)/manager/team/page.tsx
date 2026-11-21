'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetDepartmentsQuery } from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail } from 'lucide-react';
import { User, Department } from '@/types';

export default function ManagerTeamPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: departments, isLoading } = useGetDepartmentsQuery();

  const currentDept = departments?.find((d: Department) => d.id === user?.departmentId) || departments?.[0];
  const staff = currentDept?.staff || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
          Field Maintenance Crew Roster
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Active field technicians, repair vehicles, and current work order load for {currentDept?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full py-12 text-center text-xs font-mono text-text-muted">
            Loading team roster...
          </p>
        ) : staff.length === 0 ? (
          <Card className="col-span-full p-8 text-center text-text-muted">
            No maintenance crew records found for this department.
          </Card>
        ) : (
          staff.map((member: User, idx: number) => {
            const activeCount = (idx * 2 + 1) % 4;
            return (
              <Card key={member.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-brand-midnight text-brand-yellow font-bold flex items-center justify-center text-sm shadow">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-text-primary">{member.name}</h4>
                      <Badge className="bg-blue-50 text-brand-cobalt border-blue-200 text-[10px]">
                        Field Technician
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-text-secondary pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-text-muted" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-text-muted" />
                    <span>{member.phone || '+880 1711-000000'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Active Work Orders</span>
                    <span className="font-mono text-brand-cobalt">{activeCount} Assigned</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-cobalt"
                      style={{ width: `${(activeCount / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
