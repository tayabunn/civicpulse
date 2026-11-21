import { db } from '@/db';
import { issues, issueActivities, departments, users, maintenanceTasks } from '@/db/schema';
import { eq, and, or, ilike, desc, asc, sql, count } from 'drizzle-orm';
import { calculateDistanceMeters, getBoundingBox } from './geo';
import { validateStatusTransition } from './validation';

export const CATEGORY_DEPT_CODE_MAP: Record<string, string> = {
  road_damage: 'DEPT-ROAD',
  streetlight: 'DEPT-ELEC',
  drainage: 'DEPT-WATER',
  waste_management: 'DEPT-WASTE',
  footpath: 'DEPT-INFRA',
  public_infrastructure: 'DEPT-INFRA',
};

export function findNearbyDuplicate<
  T extends { id: string; category: string; latitude: number; longitude: number; status: string }
>(
  lat: number,
  lon: number,
  category: string,
  candidateIssues: T[],
  radiusMeters: number = 50
): T | null {
  for (const issue of candidateIssues) {
    if (issue.category !== category) continue;
    if (issue.status === 'closed') continue;

    const dist = calculateDistanceMeters(lat, lon, issue.latitude, issue.longitude);
    if (dist <= radiusMeters) {
      return issue;
    }
  }
  return null;
}

export async function resolveDepartmentForCategory(category: string): Promise<string | null> {
  const code = CATEGORY_DEPT_CODE_MAP[category];
  if (!code) return null;
  const [dept] = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.code, code))
    .limit(1);
  return dept?.id || null;
}

export async function logIssueActivity({
  issueId,
  userId,
  action,
  previousStatus,
  newStatus,
  notes,
  attachmentUrl,
}: {
  issueId: string;
  userId: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
  attachmentUrl?: string;
}) {
  return db.insert(issueActivities).values({
    issueId,
    userId,
    action,
    previousStatus,
    newStatus,
    notes: notes || `Action: ${action}`,
    attachmentUrl,
  });
}
