import { db } from '../db';
import { issues, departments } from '../db/schema';

export const SLA_TARGET_HOURS: Record<string, number> = {
  critical: 24,
  high: 48,
  medium: 96,
  low: 168,
};

export function calculateSlaCompliance(
  issues: Array<{ priority: string; hoursTaken: number }>
): number {
  if (issues.length === 0) return 100;

  let metCount = 0;
  for (const item of issues) {
    const target = SLA_TARGET_HOURS[item.priority] || 96;
    if (item.hoursTaken <= target) {
      metCount++;
    }
  }

  return Math.round((metCount / issues.length) * 100);
}

export async function getSystemAnalytics() {
  const allIssues = await db
    .select({
      id: issues.id,
      category: issues.category,
      status: issues.status,
      priority: issues.priority,
      departmentId: issues.departmentId,
      createdAt: issues.createdAt,
      resolvedAt: issues.resolvedAt,
    })
    .from(issues);

  const total = allIssues.length;
  const pending = allIssues.filter((i) =>
    ['submitted', 'under_review', 'assigned', 'in_progress'].includes(i.status)
  ).length;
  const resolved = allIssues.filter((i) =>
    ['resolved', 'closed'].includes(i.status)
  ).length;
  const closed = allIssues.filter((i) => i.status === 'closed').length;

  const categoryCounts: Record<string, number> = {};
  for (const issue of allIssues) {
    categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
  }
  const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  const statusCounts: Record<string, number> = {};
  for (const issue of allIssues) {
    statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
  }

  const priorityCounts: Record<string, number> = {};
  for (const issue of allIssues) {
    priorityCounts[issue.priority] = (priorityCounts[issue.priority] || 0) + 1;
  }

  const allDepts = await db.select().from(departments);
  const departmentMetrics = allDepts.map((dept) => {
    const deptIssues = allIssues.filter((i) => i.departmentId === dept.id);
    const resolvedDeptIssues = deptIssues.filter(
      (i) => i.resolvedAt && (i.status === 'resolved' || i.status === 'closed')
    );

    let totalHours = 0;
    const resolvedWithHours = resolvedDeptIssues.map((i) => {
      const hoursTaken =
        (new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime()) /
        (1000 * 60 * 60);
      totalHours += hoursTaken;
      return { priority: i.priority, hoursTaken };
    });

    const avgResolutionHours =
      resolvedWithHours.length > 0 ? Math.round(totalHours / resolvedWithHours.length) : 0;
    const slaComplianceRate = calculateSlaCompliance(resolvedWithHours);

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      code: dept.code,
      totalIssues: deptIssues.length,
      pendingIssues: deptIssues.filter((i) =>
        ['submitted', 'under_review', 'assigned', 'in_progress'].includes(i.status)
      ).length,
      resolvedIssues: resolvedDeptIssues.length,
      avgResolutionHours,
      slaComplianceRate,
    };
  });

  departmentMetrics.sort((a, b) => b.slaComplianceRate - a.slaComplianceRate);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrendsMap: Record<string, { month: string; reported: number; resolved: number }> = {};

  const now = new Date();
  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyTrendsMap[key] = { month: label, reported: 0, resolved: 0 };
  }

  for (const issue of allIssues) {
    const cDate = new Date(issue.createdAt);
    const cKey = `${cDate.getFullYear()}-${String(cDate.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyTrendsMap[cKey]) {
      monthlyTrendsMap[cKey].reported++;
    }

    if (issue.resolvedAt) {
      const rDate = new Date(issue.resolvedAt);
      const rKey = `${rDate.getFullYear()}-${String(rDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyTrendsMap[rKey]) {
        monthlyTrendsMap[rKey].resolved++;
      }
    }
  }

  const monthlyTrends = Object.values(monthlyTrendsMap);

  return {
    overview: {
      total,
      pending,
      resolved,
      closed,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    },
    categoryDistribution,
    statusCounts,
    priorityCounts,
    departmentMetrics,
    monthlyTrends,
  };
}
