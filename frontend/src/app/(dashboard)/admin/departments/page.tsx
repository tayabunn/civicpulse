'use client';

import React, { useState } from 'react';
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetUsersQuery,
} from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  Building2,
  Plus,
  Edit2,
  Power,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Department } from '@/types';

export default function AdminDepartmentsPage() {
  const { data: departments, isLoading, refetch } = useGetDepartmentsQuery();
  const { data: usersData } = useGetUsersQuery();
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Create Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState('');

  // Edit Dialog State
  const [editDept, setEditDept] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editManagerId, setEditManagerId] = useState('');

  // Eligible managers
  const eligibleManagers = (usersData?.users || []).filter(
    (u: any) => u.role === 'department_manager' || u.role === 'admin'
  );

  const handleOpenEdit = (dept: any) => {
    setEditDept(dept);
    setEditName(dept.name);
    setEditDescription(dept.description || '');
    setEditManagerId(dept.managerId || '');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDepartment({
        name,
        code: code.toUpperCase(),
        description,
        managerId: managerId || undefined,
      }).unwrap();

      setFeedbackMsg({ type: 'success', text: `Department "${name}" created successfully!` });
      setIsCreateOpen(false);
      setName('');
      setCode('');
      setDescription('');
      setManagerId('');
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.data?.error || 'Failed to create department.' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDept) return;
    try {
      await updateDepartment({
        id: editDept.id,
        name: editName,
        description: editDescription,
        managerId: editManagerId || undefined,
      }).unwrap();

      setFeedbackMsg({ type: 'success', text: `Department "${editName}" updated successfully!` });
      setEditDept(null);
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.data?.error || 'Failed to update department.' });
    }
  };

  const handleToggleActive = async (dept: any) => {
    const newStatus = !dept.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    if (!confirm(`Are you sure you want to ${action} ${dept.name}?`)) return;

    try {
      await updateDepartment({
        id: dept.id,
        isActive: newStatus,
      }).unwrap();

      setFeedbackMsg({
        type: 'success',
        text: `Department "${dept.name}" ${newStatus ? 'activated' : 'deactivated'}.`,
      });
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg({ type: 'error', text: `Failed to ${action} department.` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Municipal Structural Governance
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            Department Management & Resources
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Create, update, and deactivate municipal divisions, assign department heads, and monitor service standards.
          </p>
        </div>
        <Button
          variant="accent"
          size="lg"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 font-bold shadow-md shrink-0"
        >
          <Plus size={18} /> Add Department
        </Button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2 text-sm border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full py-12 text-center text-xs font-mono text-text-muted">
            Loading departments...
          </p>
        ) : !departments || departments.length === 0 ? (
          <Card className="col-span-full p-8 text-center text-text-muted">
            No departments found. Click "Add Department" to create one.
          </Card>
        ) : (
          departments.map((dept: any) => {
            const isActive = dept.isActive !== false;
            return (
              <Card
                key={dept.id}
                className={`p-6 space-y-4 border transition-all ${
                  isActive ? 'border-border' : 'border-dashed border-slate-300 bg-surface-secondary/40 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-midnight text-brand-yellow flex items-center justify-center font-bold shadow">
                    <Building2 size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-200 text-slate-700'
                      }
                    >
                      {isActive ? 'Active' : 'Deactivated'}
                    </Badge>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-secondary text-brand-cobalt border border-border">
                      {dept.code}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-text-primary">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
                    {dept.description || 'Primary municipal infrastructure maintenance authority.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-muted block">Department Head:</span>
                    <span className="font-semibold text-text-primary truncate block">
                      {dept.managerName || 'Unassigned'}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Field Personnel:</span>
                    <span className="font-bold text-brand-cobalt">
                      {dept.staffCount || dept.staff?.length || 6} Technicians
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(dept)}
                    className="text-xs gap-1.5 font-semibold flex-1"
                  >
                    <Edit2 size={13} /> Edit
                  </Button>
                  <Button
                    variant={isActive ? 'ghost' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleActive(dept)}
                    className={`text-xs gap-1.5 ${
                      isActive
                        ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Power size={13} />
                    {isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Department Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Municipal Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Department Name *"
            placeholder="e.g. Parks & Recreation Authority"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
          />

          <Input
            label="Department Code *"
            placeholder="e.g. PRA or WATER"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            required
          />

          <Textarea
            label="Description & Scope"
            placeholder="Describe municipal responsibilities, equipment, and jurisdiction..."
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={3}
          />

          <Select
            label="Assign Department Manager"
            value={managerId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setManagerId(e.target.value)}
            options={[
              { label: '— Assign Later —', value: '' },
              ...eligibleManagers.map((m: any) => ({
                label: `${m.name} (${m.email})`,
                value: m.id,
              })),
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating} className="font-bold">
              Create Department
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog
        isOpen={Boolean(editDept)}
        onClose={() => setEditDept(null)}
        title={`Edit Department: ${editDept?.name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Department Name *"
            value={editName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
            required
          />

          <Textarea
            label="Description & Scope"
            value={editDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}
            rows={3}
          />

          <Select
            label="Department Manager"
            value={editManagerId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditManagerId(e.target.value)}
            options={[
              { label: '— None / Vacant —', value: '' },
              ...eligibleManagers.map((m: any) => ({
                label: `${m.name} (${m.email})`,
                value: m.id,
              })),
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setEditDept(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdating} className="font-bold">
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
