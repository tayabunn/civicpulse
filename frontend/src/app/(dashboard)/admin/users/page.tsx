'use client';

import React, { useState } from 'react';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetDepartmentsQuery,
} from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Building2,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Department } from '@/types';

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: usersData, isLoading, refetch } = useGetUsersQuery({
    role: roleFilter || undefined,
    search: searchTerm || undefined,
  });
  const { data: departments } = useGetDepartmentsQuery();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Role Edit Dialog State
  const [editUser, setEditUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  // Create User Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('maintenance_staff');
  const [newDepartmentId, setNewDepartmentId] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const users = usersData?.users || [];

  const handleOpenEdit = (user: any) => {
    setEditUser(user);
    setSelectedRole(user.role);
    setSelectedDepartmentId(user.departmentId || '');
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await updateUser({
        id: editUser.id,
        role: selectedRole,
        departmentId: selectedDepartmentId || undefined,
      }).unwrap();

      setFeedbackMsg({ type: 'success', text: `Permissions updated for ${editUser.name}` });
      setEditUser(null);
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to update user permissions.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        departmentId: newDepartmentId || undefined,
        phone: newPhone || undefined,
      }).unwrap();

      setFeedbackMsg({ type: 'success', text: `New user ${newName} created successfully.` });
      setIsCreateOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.data?.error || 'Failed to create user.' });
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user ${name}?`)) return;
    try {
      await deleteUser(id).unwrap();
      setFeedbackMsg({ type: 'success', text: `User ${name} removed.` });
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to delete user.' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">City Admin</Badge>;
      case 'department_manager':
      case 'manager':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Dept Manager</Badge>;
      case 'maintenance_staff':
      case 'staff':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Field Staff</Badge>;
      default:
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Citizen</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Administrative Control Panel
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            User Directory & Permissions
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Assign administrative permissions, designate department managers, and manage field technician access.
          </p>
        </div>
        <Button
          variant="accent"
          size="lg"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 font-bold shadow-md shrink-0"
        >
          <UserPlus size={18} /> Add New User
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

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface border border-border">
        <div className="relative">
          <Input
            label="Search Directory"
            placeholder="Search by name, email, or dept..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          label="Filter by Role"
          value={roleFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(e.target.value)}
          options={[
            { label: 'All Roles', value: '' },
            { label: 'City Admin (admin)', value: 'admin' },
            { label: 'Department Manager (manager)', value: 'department_manager' },
            { label: 'Maintenance Staff (staff)', value: 'maintenance_staff' },
            { label: 'Citizen (citizen)', value: 'citizen' },
          ]}
        />

        <div className="flex items-end">
          <p className="text-xs text-text-muted font-mono mb-3">
            Total Records: <strong className="text-text-primary">{users.length}</strong>
          </p>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-secondary text-[11px] font-mono uppercase text-text-muted border-b border-border">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role / Permission</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted font-mono text-xs">
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-surface-secondary/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-midnight text-brand-yellow font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{u.name}</p>
                          <p className="text-xs text-text-muted font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4">
                      {u.departmentName ? (
                        <span className="font-semibold text-xs text-brand-cobalt flex items-center gap-1.5">
                          <Building2 size={13} /> {u.departmentName}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-text-secondary">
                      {u.phone || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(u)}
                          className="h-8 text-xs gap-1 font-semibold"
                        >
                          <Shield size={13} /> Assign Role
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Role & Department Dialog */}
      <Dialog
        isOpen={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        title={`Assign Permissions: ${editUser?.name}`}
      >
        <form onSubmit={handleSaveRole} className="space-y-4">
          <p className="text-xs text-text-muted">
            Configure system permissions and assign this account to an operational municipal department.
          </p>

          <Select
            label="System Role / Permissions *"
            value={selectedRole}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(e.target.value)}
            options={[
              { label: 'Citizen (Public Access & Issue Reporting)', value: 'citizen' },
              { label: 'Maintenance Staff (Field Technician App)', value: 'maintenance_staff' },
              { label: 'Department Manager (Triage & Crew Allocation)', value: 'department_manager' },
              { label: 'City Administrator (Full System Control)', value: 'admin' },
            ]}
          />

          <Select
            label="Assigned Department"
            value={selectedDepartmentId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDepartmentId(e.target.value)}
            options={[
              { label: '— No Department (Citizen or Executive) —', value: '' },
              ...(departments || []).map((d: Department) => ({
                label: `${d.name} (${d.code})`,
                value: d.id,
              })),
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdating} className="font-bold">
              Save Permissions
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Tariqul Islam"
            value={newName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
            required
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. tariqul@civicpulse.gov"
            value={newEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value)}
            required
          />

          <Input
            label="Initial Password *"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role *"
              value={newRole}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRole(e.target.value)}
              options={[
                { label: 'Maintenance Staff', value: 'maintenance_staff' },
                { label: 'Department Manager', value: 'department_manager' },
                { label: 'City Administrator', value: 'admin' },
                { label: 'Citizen', value: 'citizen' },
              ]}
            />

            <Select
              label="Department"
              value={newDepartmentId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewDepartmentId(e.target.value)}
              options={[
                { label: '— None —', value: '' },
                ...(departments || []).map((d: Department) => ({
                  label: d.name,
                  value: d.id,
                })),
              ]}
            />
          </div>

          <Input
            label="Phone Number"
            placeholder="+880 1711-000000"
            value={newPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPhone(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating} className="font-bold">
              Create User
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
