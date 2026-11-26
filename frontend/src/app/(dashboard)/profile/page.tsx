'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials } from '@/store/authSlice';
import { useUpdateProfileMutation, useUpdatePasswordMutation, useGetDepartmentsQuery } from '@/store/apiSlice';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Shield,
  Key,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { data: departments } = useGetDepartmentsQuery();

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const deptList = Array.isArray(departments)
    ? departments
    : (departments as any)?.departments || [];
  const dept = deptList.find((d: any) => d.id === user?.departmentId);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      const res = await updateProfile({
        id: user.id,
        name,
        phone,
      }).unwrap();

      if (res.user) {
        dispatch(setCredentials({ user: res.user, token: token || '' }));
      }
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully.' });
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.data?.error || 'Failed to update profile.' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      await updatePassword({
        id: user.id,
        currentPassword,
        newPassword,
      }).unwrap();

      setPasswordMsg({ type: 'success', text: 'Password updated securely.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.data?.error || 'Failed to change password. Verify your current password.' });
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'City Administrator (Full Control)';
      case 'department_manager':
      case 'manager':
        return 'Department Operations Manager';
      case 'maintenance_staff':
      case 'staff':
        return 'Field Maintenance Technician';
      default:
        return 'Registered Citizen';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Account & Security Settings
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            User Profile Management
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Manage your personal profile details, contact preferences, and password security.
          </p>
        </div>
      </div>

      {/* Account Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-midnight text-brand-yellow font-bold text-2xl flex items-center justify-center shadow">
              {(user?.name || 'CP').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-text-primary">
                {user?.name || 'CivicPulse User'}
              </h3>
              <p className="text-xs text-text-muted font-mono">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-brand-cobalt/10 text-brand-cobalt border border-brand-cobalt/20">
                  <Shield size={12} className="mr-1" /> {getRoleLabel(user?.role)}
                </Badge>
                {dept && (
                  <Badge className="bg-surface-secondary text-text-secondary border border-border">
                    <Building2 size={12} className="mr-1" /> {dept.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <User size={18} className="text-brand-cobalt" /> Personal Information
            </CardTitle>
            <CardDescription>Update your display name and contact phone number</CardDescription>
          </CardHeader>

          {profileMsg && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {profileMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name *"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address (Login Identity)"
              value={user?.email || ''}
              disabled
            />

            <Input
              label="Phone Number"
              placeholder="+880 1700-000000"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isUpdatingProfile} className="w-full font-bold">
                Save Profile Details
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Security Form */}
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock size={18} className="text-brand-cobalt" /> Password Security
            </CardTitle>
            <CardDescription>Update your password to keep your account safe</CardDescription>
          </CardHeader>

          {passwordMsg && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {passwordMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="Current Password *"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password *"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password *"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="accent" isLoading={isUpdatingPassword} className="w-full font-bold shadow-sm">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
