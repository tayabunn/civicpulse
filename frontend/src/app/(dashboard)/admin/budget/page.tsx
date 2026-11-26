'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/analytics/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Building2,
  Download,
  Plus,
  Search,
  AlertCircle,
} from 'lucide-react';

interface BudgetRecord {
  id: string;
  department: string;
  ward: string;
  category: string;
  allocatedBdt: number;
  spentBdt: number;
  projectsCount: number;
  status: 'On Track' | 'Near Limit' | 'Audited';
  lastUpdated: string;
}

const INITIAL_BUDGETS: BudgetRecord[] = [
  {
    id: 'BDG-2026-01',
    department: 'Roads & Highways (RHD)',
    ward: 'Ward 19 — Banani & Gulshan',
    category: 'Asphalt Resurfacing & Potholes',
    allocatedBdt: 4800000,
    spentBdt: 3420000,
    projectsCount: 18,
    status: 'On Track',
    lastUpdated: '2026-11-24',
  },
  {
    id: 'BDG-2026-02',
    department: 'Water Supply & Sewerage (WASA)',
    ward: 'Ward 31 — Mohammadpur',
    category: 'Stormwater Drainage Desilting',
    allocatedBdt: 3600000,
    spentBdt: 3290000,
    projectsCount: 14,
    status: 'Near Limit',
    lastUpdated: '2026-11-25',
  },
  {
    id: 'BDG-2026-03',
    department: 'Electrical & Streetlight (ELEC)',
    ward: 'Ward 15 — Dhanmondi',
    category: 'LED High-Mast & Smart Poles',
    allocatedBdt: 2400000,
    spentBdt: 1580000,
    projectsCount: 22,
    status: 'On Track',
    lastUpdated: '2026-11-23',
  },
  {
    id: 'BDG-2026-04',
    department: 'Solid Waste Management (SWM)',
    ward: 'Ward 24 — Mirpur 10',
    category: 'Secondary Transfer & Compactor Fleet',
    allocatedBdt: 2950000,
    spentBdt: 2100000,
    projectsCount: 11,
    status: 'Audited',
    lastUpdated: '2026-11-22',
  },
  {
    id: 'BDG-2026-05',
    department: 'Public Infrastructure & Parks',
    ward: 'Ward 12 — Uttara Sector 7',
    category: 'Pedestrian Footpath & Guardrails',
    allocatedBdt: 1900000,
    spentBdt: 920000,
    projectsCount: 9,
    status: 'On Track',
    lastUpdated: '2026-11-20',
  },
];

const formatBdt = (amount: number) =>
  `৳${(amount / 100000).toFixed(2)} Lakh`;

export default function AdminBudgetPage() {
  const [budgets, setBudgets] = useState<BudgetRecord[]>(INITIAL_BUDGETS);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newDept, setNewDept] = useState('Roads & Highways (RHD)');
  const [newWard, setNewWard] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('1500000');

  const filtered = useMemo(() => {
    return budgets.filter((b) => {
      const matchesDept = deptFilter === 'ALL' || b.department === deptFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.ward.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.department.toLowerCase().includes(q);
      return matchesDept && matchesSearch;
    });
  }, [budgets, deptFilter, search]);

  const totals = useMemo(() => {
    const allocated = budgets.reduce((sum, b) => sum + b.allocatedBdt, 0);
    const spent = budgets.reduce((sum, b) => sum + b.spentBdt, 0);
    const utilization = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
    const totalProjects = budgets.reduce((sum, b) => sum + b.projectsCount, 0);
    return { allocated, spent, remaining: allocated - spent, utilization, totalProjects };
  }, [budgets]);

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Math.max(100000, Number(newAmount) || 0);
    const created: BudgetRecord = {
      id: `BDG-2026-0${budgets.length + 1}`,
      department: newDept,
      ward: newWard.trim() || 'Ward 08 — Motijheel',
      category: newCategory.trim() || 'Emergency Infrastructure Repair',
      allocatedBdt: amount,
      spentBdt: 0,
      projectsCount: 1,
      status: 'On Track',
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    setBudgets([created, ...budgets]);
    setIsAddOpen(false);
    setNewWard('');
    setNewCategory('');
    setFeedback(`Allocated ${formatBdt(amount)} to ${created.ward}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleExportCsv = () => {
    const header = 'ID,Department,Ward,Category,Allocated_BDT,Spent_BDT,Projects,Status,Updated\n';
    const rows = filtered
      .map(
        (b) =>
          `"${b.id}","${b.department}","${b.ward}","${b.category}",${b.allocatedBdt},${b.spentBdt},${b.projectsCount},"${b.status}","${b.lastUpdated}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'civicpulse-budget-ledger.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Budget & Repair Spending Ledger
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Transparent municipal fund allocation, ward-level repair expenditure, and utilization tracking.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 rounded-lg">
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 rounded-lg">
            <Plus size={14} /> Allocate Budget
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Fiscal Allocation"
          value={formatBdt(totals.allocated)}
          change="FY 2026–27 Municipal Pool"
          isPositive={true}
          icon={<Wallet size={20} />}
        />
        <StatCard
          label="Verified Disbursed"
          value={formatBdt(totals.spent)}
          change={`${totals.utilization}% utilized`}
          isPositive={true}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          label="Available Reserve"
          value={formatBdt(totals.remaining)}
          change="Ready for emergency triage"
          isPositive={true}
          icon={<Building2 size={20} />}
        />
        <StatCard
          label="Funded Work Orders"
          value={totals.totalProjects}
          change="Across 5 active departments"
          isPositive={true}
          icon={<CheckCircle2 size={20} />}
        />
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ward, department, or work category..."
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Municipal Departments' },
                { value: 'Roads & Highways (RHD)', label: 'Roads & Highways (RHD)' },
                { value: 'Water Supply & Sewerage (WASA)', label: 'Water Supply & Sewerage (WASA)' },
                { value: 'Electrical & Streetlight (ELEC)', label: 'Electrical & Streetlight (ELEC)' },
                { value: 'Solid Waste Management (SWM)', label: 'Solid Waste Management (SWM)' },
                { value: 'Public Infrastructure & Parks', label: 'Public Infrastructure & Parks' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Budget Ledger Table */}
      <Card className="overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/60 text-xs font-mono uppercase text-text-muted">
                <th className="py-3.5 px-4">Ledger ID</th>
                <th className="py-3.5 px-4">Department & Ward</th>
                <th className="py-3.5 px-4">Allocated</th>
                <th className="py-3.5 px-4">Spent</th>
                <th className="py-3.5 px-4">Utilization</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtered.map((item) => {
                const pct = Math.min(100, Math.round((item.spentBdt / item.allocatedBdt) * 100));
                return (
                  <tr key={item.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted">{item.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-text-primary">{item.department}</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {item.ward} • {item.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      {formatBdt(item.allocatedBdt)}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{formatBdt(item.spentBdt)}</td>
                    <td className="py-3.5 px-4 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 88
                                ? 'bg-amber-500'
                                : 'bg-[#315CFF]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-text-secondary w-9">
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="pill"
                        className={
                          item.status === 'Near Limit'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : item.status === 'Audited'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        }
                      >
                        {item.status === 'Near Limit' && <AlertCircle size={12} className="mr-1" />}
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Budget Dialog */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Allocate Municipal Repair Fund"
      >
        <form onSubmit={handleAddAllocation} className="space-y-4">
          <Select
            label="Department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            options={[
              { value: 'Roads & Highways (RHD)', label: 'Roads & Highways (RHD)' },
              { value: 'Water Supply & Sewerage (WASA)', label: 'Water Supply & Sewerage (WASA)' },
              { value: 'Electrical & Streetlight (ELEC)', label: 'Electrical & Streetlight (ELEC)' },
              { value: 'Solid Waste Management (SWM)', label: 'Solid Waste Management (SWM)' },
              { value: 'Public Infrastructure & Parks', label: 'Public Infrastructure & Parks' },
            ]}
          />
          <Input
            label="Target Ward / Zone"
            placeholder="e.g. Ward 18 — Baridhara"
            value={newWard}
            onChange={(e) => setNewWard(e.target.value)}
            required
          />
          <Input
            label="Repair Scope / Category"
            placeholder="e.g. Culvert & Drainage Upgrade"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <Input
            label="Allocation Amount (BDT)"
            type="number"
            min={100000}
            step={50000}
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Allocation
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
