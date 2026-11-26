'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/analytics/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  Megaphone,
  Plus,
  MapPin,
  CheckCircle2,
  Radio,
  Archive,
} from 'lucide-react';

interface Advisory {
  id: string;
  title: string;
  message: string;
  ward: string;
  severity: 'Urgent' | 'Scheduled' | 'Info';
  active: boolean;
  publishedAt: string;
}

const INITIAL_ADVISORIES: Advisory[] = [
  {
    id: 'ADV-104',
    title: 'Mirpur 10 Water Main Valve Replacement',
    message:
      'Scheduled WASA pipeline maintenance from 10:00 PM to 4:00 AM. Low water pressure expected in Ward 24 & adjacent blocks.',
    ward: 'Ward 24 — Mirpur 10',
    severity: 'Scheduled',
    active: true,
    publishedAt: '2026-11-26 14:30',
  },
  {
    id: 'ADV-103',
    title: 'Asad Avenue Single-Lane Resurfacing',
    message:
      'Nighttime asphalt paving underway near Town Hall. Commuters are advised to use Ring Road bypass.',
    ward: 'Ward 31 — Mohammadpur',
    severity: 'Urgent',
    active: true,
    publishedAt: '2026-11-25 18:10',
  },
  {
    id: 'ADV-102',
    title: 'Dhanmondi Lake Stormwater Drain Clearing',
    message:
      'Pre-monsoon silt extraction completed along Road 8A. Normal pedestrian access restored.',
    ward: 'Ward 15 — Dhanmondi',
    severity: 'Info',
    active: false,
    publishedAt: '2026-11-20 09:00',
  },
];

export default function AdminAdvisoriesPage() {
  const [advisories, setAdvisories] = useState<Advisory[]>(INITIAL_ADVISORIES);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [ward, setWard] = useState('All Dhaka Wards');
  const [severity, setSeverity] = useState<'Urgent' | 'Scheduled' | 'Info'>('Urgent');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const activeCount = advisories.filter((a) => a.active).length;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Advisory = {
      id: `ADV-${105 + advisories.length}`,
      title: title.trim(),
      message: message.trim(),
      ward,
      severity,
      active: true,
      publishedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setAdvisories([created, ...advisories]);
    setIsComposeOpen(false);
    setTitle('');
    setMessage('');
    setToast(`Public advisory "${created.title}" broadcast to ${created.ward}.`);
    setTimeout(() => setToast(null), 4000);
  };

  const toggleStatus = (id: string) => {
    setAdvisories((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Citywide Public Advisories
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Broadcast official road closures, utility maintenance notices, and emergency alerts to Dhaka wards.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsComposeOpen(true)} className="gap-1.5 rounded-lg">
          <Plus size={14} /> Broadcast Advisory
        </Button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Live Broadcasts"
          value={activeCount}
          change="Visible on Citizen Portal"
          isPositive={true}
          icon={<Radio size={20} />}
        />
        <StatCard
          label="Total Advisories"
          value={advisories.length}
          change="Published this cycle"
          isPositive={true}
          icon={<Megaphone size={20} />}
        />
        <StatCard
          label="Archived Notices"
          value={advisories.length - activeCount}
          change="Resolved or expired"
          isPositive={true}
          icon={<Archive size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {advisories.map((adv) => (
          <Card key={adv.id} className="p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="pill"
                  className={
                    adv.severity === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      : adv.severity === 'Scheduled'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }
                >
                  {adv.severity}
                </Badge>
                <Badge
                  variant={adv.active ? 'pill' : 'outline'}
                  className={
                    adv.active
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : ''
                  }
                >
                  {adv.active ? 'Live' : 'Archived'}
                </Badge>
                <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                  <MapPin size={12} /> {adv.ward}
                </span>
                <span className="text-xs font-mono text-text-muted">• {adv.publishedAt}</span>
              </div>
              <h3 className="text-base font-bold text-text-primary">{adv.title}</h3>
              <p className="text-sm text-text-secondary max-w-3xl">{adv.message}</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleStatus(adv.id)}
              className="rounded-lg shrink-0"
            >
              {adv.active ? 'Archive Notice' : 'Republish'}
            </Button>
          </Card>
        ))}
      </div>

      <Dialog
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Broadcast Citywide Public Advisory"
      >
        <form onSubmit={handlePublish} className="space-y-4">
          <Input
            label="Advisory Headline"
            placeholder="e.g. Gulshan Avenue Transformer Maintenance"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Target Ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              options={[
                { value: 'All Dhaka Wards', label: 'All Dhaka Wards' },
                { value: 'Ward 15 — Dhanmondi', label: 'Ward 15 — Dhanmondi' },
                { value: 'Ward 19 — Banani & Gulshan', label: 'Ward 19 — Banani & Gulshan' },
                { value: 'Ward 24 — Mirpur 10', label: 'Ward 24 — Mirpur 10' },
                { value: 'Ward 31 — Mohammadpur', label: 'Ward 31 — Mohammadpur' },
              ]}
            />
            <Select
              label="Severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as 'Urgent' | 'Scheduled' | 'Info')}
              options={[
                { value: 'Urgent', label: 'Urgent' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Info', label: 'Info' },
              ]}
            />
          </div>
          <Textarea
            label="Citizen Advisory Details"
            placeholder="Provide clear timing, affected roads, and alternative routes..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Advisory
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
