'use client';

import React, { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/store/apiSlice';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sliders,
  Radar,
  Clock,
  BellRing,
  Building,
  Save,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: settingsData, isLoading, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form States
  const [cityName, setCityName] = useState('Dhaka North City Corporation (DNCC)');
  const [duplicateRadius, setDuplicateRadius] = useState(50);
  const [escalationHours, setEscalationHours] = useState(4);
  const [autoAssign, setAutoAssign] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // SLA Benchmarks (hours)
  const [slaCritical, setSlaCritical] = useState(12);
  const [slaHigh, setSlaHigh] = useState(24);
  const [slaMedium, setSlaMedium] = useState(48);
  const [slaLow, setSlaLow] = useState(96);

  useEffect(() => {
    if (settingsData?.settings) {
      const s = settingsData.settings;
      if (s.cityCorporationName) setCityName(s.cityCorporationName);
      if (s.duplicateRadarRadiusMeters) setDuplicateRadius(s.duplicateRadarRadiusMeters);
      if (s.emergencyEscalationHours) setEscalationHours(s.emergencyEscalationHours);
      if (s.autoAssignPriorityIssues !== undefined) setAutoAssign(s.autoAssignPriorityIssues);
      if (s.emailNotificationsEnabled !== undefined) setEmailAlerts(s.emailNotificationsEnabled);
      if (s.smsAlertsEnabled !== undefined) setSmsAlerts(s.smsAlertsEnabled);
      if (s.slaTargetsHours) {
        if (s.slaTargetsHours.critical) setSlaCritical(s.slaTargetsHours.critical);
        if (s.slaTargetsHours.high) setSlaHigh(s.slaTargetsHours.high);
        if (s.slaTargetsHours.medium) setSlaMedium(s.slaTargetsHours.medium);
        if (s.slaTargetsHours.low) setSlaLow(s.slaTargetsHours.low);
      }
    }
  }, [settingsData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        cityCorporationName: cityName,
        duplicateRadarRadiusMeters: Number(duplicateRadius),
        emergencyEscalationHours: Number(escalationHours),
        autoAssignPriorityIssues: autoAssign,
        emailNotificationsEnabled: emailAlerts,
        smsAlertsEnabled: smsAlerts,
        slaTargetsHours: {
          critical: Number(slaCritical),
          high: Number(slaHigh),
          medium: Number(slaMedium),
          low: Number(slaLow),
        },
      }).unwrap();

      setFeedbackMsg({ type: 'success', text: 'Platform configuration updated and applied globally!' });
      refetch();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to update system settings.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Executive Controls
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            System & Operational Configurations
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Configure citywide SLA benchmarks, duplicate detection radar parameters, and automated dispatch policies.
          </p>
        </div>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Municipal Identity */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Building className="text-brand-cobalt" size={20} />
            <h3 className="text-lg font-bold font-display text-text-primary">
              1. Municipal Identity & Jurisdiction
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City Corporation Authority Name *"
              value={cityName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCityName(e.target.value)}
              required
            />
            <Input
              label="Default Operational Timezone"
              value="Asia/Dhaka (GMT+6)"
              disabled
            />
          </div>
        </Card>

        {/* Section 2: SLA Benchmarks */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Clock className="text-brand-cobalt" size={20} />
            <h3 className="text-lg font-bold font-display text-text-primary">
              2. SLA Resolution Benchmarks (Hours)
            </h3>
          </div>
          <p className="text-xs text-text-muted">
            Target turnaround durations before an issue is flagged as SLA-breached in executive dashboards.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Critical Severity (Hrs) *"
              type="number"
              min="1"
              value={slaCritical}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlaCritical(Number(e.target.value))}
              required
            />
            <Input
              label="High Severity (Hrs) *"
              type="number"
              min="1"
              value={slaHigh}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlaHigh(Number(e.target.value))}
              required
            />
            <Input
              label="Medium Severity (Hrs) *"
              type="number"
              min="1"
              value={slaMedium}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlaMedium(Number(e.target.value))}
              required
            />
            <Input
              label="Low Severity (Hrs) *"
              type="number"
              min="1"
              value={slaLow}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlaLow(Number(e.target.value))}
              required
            />
          </div>
        </Card>

        {/* Section 3: Duplicate Radar & Proximity */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Radar className="text-brand-cobalt" size={20} />
            <h3 className="text-lg font-bold font-display text-text-primary">
              3. Duplicate Proximity Radar Algorithm
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Input
              label="Proximity Radar Radius (Meters) *"
              type="number"
              min="10"
              max="500"
              value={duplicateRadius}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuplicateRadius(Number(e.target.value))}
              required
            />
            <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs text-text-secondary">
              <span className="font-semibold block text-text-primary mb-1">
                Active Threshold: {duplicateRadius} meters
              </span>
              Reports submitted within this geospatial distance from an active incident will trigger the Duplicate Warning Alert on the Citizen report page.
            </div>
          </div>
        </Card>

        {/* Section 4: Dispatch Policies & Automation */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Zap className="text-brand-cobalt" size={20} />
            <h3 className="text-lg font-bold font-display text-text-primary">
              4. Automated Dispatch & Escalation Policies
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-secondary/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={autoAssign}
                onChange={(e) => setAutoAssign(e.target.checked)}
                className="w-4 h-4 text-brand-cobalt rounded focus:ring-brand-cobalt"
              />
              <div>
                <span className="text-sm font-semibold text-text-primary block">
                  Automated Sector Dispatch
                </span>
                <span className="text-xs text-text-muted">
                  Automatically assign incoming reports to their corresponding municipal department (Roads, Electricity, Water/Sewage, Waste) based on category.
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Emergency Escalation Alert Threshold (Hours)"
                type="number"
                min="1"
                max="48"
                value={escalationHours}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEscalationHours(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* Section 5: Notification Delivery */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <BellRing className="text-brand-cobalt" size={20} />
            <h3 className="text-lg font-bold font-display text-text-primary">
              5. Citizen Notification Broadcasts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-secondary/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-cobalt rounded focus:ring-brand-cobalt"
              />
              <span className="text-sm font-medium text-text-primary">
                Email Dispatch Notifications
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-secondary/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-cobalt rounded focus:ring-brand-cobalt"
              />
              <span className="text-sm font-medium text-text-primary">
                SMS Urgent Field Dispatch
              </span>
            </label>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end gap-4 p-4 rounded-xl bg-surface border border-border">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="gap-2 font-bold shadow-md px-8"
          >
            <Save size={18} /> Save All Configurations
          </Button>
        </div>
      </form>
    </div>
  );
}
