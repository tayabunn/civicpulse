'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/analytics/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  HardHat,
  Star,
  CheckCircle2,
  Plus,
  Briefcase,
  Search,
} from 'lucide-react';

interface Contractor {
  id: string;
  companyName: string;
  specialty: string;
  licenseNo: string;
  onTimeSla: number;
  rating: number;
  activeOrders: number;
  status: 'Verified' | 'Probation';
}

const INITIAL_CONTRACTORS: Contractor[] = [
  {
    id: 'VND-01',
    companyName: 'Bengal Civil & Asphalt Ltd.',
    specialty: 'Road Paving & Culverts',
    licenseNo: 'DNCC-RHD-8841',
    onTimeSla: 96,
    rating: 4.8,
    activeOrders: 7,
    status: 'Verified',
  },
  {
    id: 'VND-02',
    companyName: 'Padma Smart Grid Electricals',
    specialty: 'Streetlights & High-Mast Poles',
    licenseNo: 'DESCO-EL-4412',
    onTimeSla: 93,
    rating: 4.7,
    activeOrders: 5,
    status: 'Verified',
  },
  {
    id: 'VND-03',
    companyName: 'Dhaka Hydro & Drainage Works',
    specialty: 'Stormwater & Sewerage Desilting',
    licenseNo: 'WASA-DR-2109',
    onTimeSla: 84,
    rating: 4.1,
    activeOrders: 4,
    status: 'Probation',
  },
  {
    id: 'VND-04',
    companyName: 'GreenCity Sanitation Fleet',
    specialty: 'Solid Waste & Compactor Logistics',
    licenseNo: 'DSCC-SWM-6720',
    onTimeSla: 91,
    rating: 4.5,
    activeOrders: 6,
    status: 'Verified',
  },
];

export default function AdminContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>(INITIAL_CONTRACTORS);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [specialty, setSpecialty] = useState('Road Paving & Culverts');
  const [licenseNo, setLicenseNo] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = contractors.filter(
    (c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.specialty.toLowerCase().includes(search.toLowerCase()) ||
      c.licenseNo.toLowerCase().includes(search.toLowerCase())
  );

  const avgSla = Math.round(
    contractors.reduce((sum, c) => sum + c.onTimeSla, 0) / Math.max(1, contractors.length)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Contractor = {
      id: `VND-0${contractors.length + 1}`,
      companyName: companyName.trim(),
      specialty,
      licenseNo: licenseNo.trim().toUpperCase(),
      onTimeSla: 100,
      rating: 5.0,
      activeOrders: 0,
      status: 'Verified',
    };
    setContractors([created, ...contractors]);
    setIsAddOpen(false);
    setCompanyName('');
    setLicenseNo('');
    setToast(`Registered verified vendor "${created.companyName}".`);
    setTimeout(() => setToast(null), 4000);
  };

  const toggleStatus = (id: string) => {
    setContractors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Verified' ? 'Probation' : 'Verified' } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Contractors & Vendors Registry
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Track licensed municipal repair vendors, SLA delivery scores, and quality compliance.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 rounded-lg">
          <Plus size={14} /> Register Vendor
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
          label="Registered Vendors"
          value={contractors.length}
          change="Active municipal roster"
          isPositive={true}
          icon={<HardHat size={20} />}
        />
        <StatCard
          label="Avg Vendor SLA"
          value={`${avgSla}%`}
          change="On-time repair completion"
          isPositive={true}
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          label="Active Work Orders"
          value={contractors.reduce((s, c) => s + c.activeOrders, 0)}
          change="Assigned across wards"
          isPositive={true}
          icon={<Briefcase size={20} />}
        />
      </div>

      <Card className="p-4 rounded-lg">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contractor name, specialty, or license number..."
            className="pl-9"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((vendor) => (
          <Card key={vendor.id} className="p-5 rounded-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text-primary">{vendor.companyName}</h3>
                  <Badge
                    variant="pill"
                    className={
                      vendor.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }
                  >
                    {vendor.status}
                  </Badge>
                </div>
                <p className="text-sm text-text-muted mt-0.5">{vendor.specialty}</p>
              </div>
              <span className="text-xs font-mono text-text-muted">{vendor.licenseNo}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border text-sm">
              <div>
                <p className="text-xs text-text-muted">SLA On-Time</p>
                <p className="font-bold text-text-primary">{vendor.onTimeSla}%</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Quality Score</p>
                <p className="font-bold text-text-primary flex items-center gap-1">
                  <Star size={13} className="text-amber-500 fill-amber-500" /> {vendor.rating.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Active Jobs</p>
                <p className="font-bold text-text-primary">{vendor.activeOrders}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleStatus(vendor.id)}
                className="rounded-lg"
              >
                {vendor.status === 'Verified' ? 'Move to Probation' : 'Restore Verified'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Municipal Contractor">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Apex Urban Engineering Ltd."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <Select
            label="Primary Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            options={[
              { value: 'Road Paving & Culverts', label: 'Road Paving & Culverts' },
              { value: 'Streetlights & High-Mast Poles', label: 'Streetlights & High-Mast Poles' },
              { value: 'Stormwater & Sewerage Desilting', label: 'Stormwater & Sewerage Desilting' },
              { value: 'Solid Waste & Compactor Logistics', label: 'Solid Waste & Compactor Logistics' },
            ]}
          />
          <Input
            label="Municipal License Number"
            placeholder="e.g. DNCC-ENG-9012"
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Vendor
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
