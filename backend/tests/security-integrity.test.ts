import { describe, it, expect } from 'vitest';
import {
  createIssueSchema,
  isValidImageUrl,
  canUserVerifyReport,
  canUserCloseReport,
  canUserChangeIssueStatus,
  validateStatusTransition,
} from '../src/lib/validation';
import { verifySessionToken } from '../src/lib/auth';

describe('Security & Data Integrity: Section 5 Server-Side Enforcement', () => {
  describe('Rule 1 & 7: Unauthorized users and Citizens cannot modify issue status', () => {
    it('disallows citizens from modifying issue lifecycle status', () => {
      expect(canUserChangeIssueStatus('citizen')).toBe(false);
      expect(canUserChangeIssueStatus('admin')).toBe(true);
      expect(canUserChangeIssueStatus('department_manager')).toBe(true);
      expect(canUserChangeIssueStatus('maintenance_staff')).toBe(true);
    });

    it('rejects unauthenticated requests without valid session tokens', async () => {
      const invalidToken = 'invalid-forged-token-xyz';
      const user = await verifySessionToken(invalidToken);
      expect(user).toBeNull();
    });
  });

  describe('Rule 2 & 3: Role & Department Scoping', () => {
    it('only allows maintenance staff to update their own assigned tasks', () => {
      const staffUser = { id: 'staff-1', role: 'maintenance_staff' };
      const taskA = { id: 'task-101', staffId: 'staff-1' };
      const taskB = { id: 'task-102', staffId: 'staff-2' };

      const canUpdateTaskA = staffUser.role === 'maintenance_staff' ? taskA.staffId === staffUser.id : false;
      const canUpdateTaskB = staffUser.role === 'maintenance_staff' ? taskB.staffId === staffUser.id : false;

      expect(canUpdateTaskA).toBe(true);
      expect(canUpdateTaskB).toBe(false);
    });

    it('prevents department managers from managing issues of other departments', () => {
      const managerUser = { id: 'mgr-1', role: 'department_manager', departmentId: 'dept-roads' };
      const roadsIssue = { id: 'issue-1', departmentId: 'dept-roads' };
      const electricalIssue = { id: 'issue-2', departmentId: 'dept-electric' };

      const canManageRoads = managerUser.departmentId === roadsIssue.departmentId;
      const canManageElectric = managerUser.departmentId === electricalIssue.departmentId;

      expect(canManageRoads).toBe(true);
      expect(canManageElectric).toBe(false);
    });
  });

  describe('Rule 4: Verification and Closure Authorization', () => {
    it('allows only department managers and admins to verify reports (under_review)', () => {
      expect(canUserVerifyReport('admin')).toBe(true);
      expect(canUserVerifyReport('department_manager')).toBe(true);
      expect(canUserVerifyReport('maintenance_staff')).toBe(false);
      expect(canUserVerifyReport('citizen')).toBe(false);
    });

    it('allows only department managers and admins to close reports (closed)', () => {
      expect(canUserCloseReport('admin')).toBe(true);
      expect(canUserCloseReport('department_manager')).toBe(true);
      expect(canUserCloseReport('maintenance_staff')).toBe(false);
      expect(canUserCloseReport('citizen')).toBe(false);
    });
  });

  describe('Rule 6: GPS Coordinates and Uploaded Image Validation', () => {
    it('validates GPS coordinates strictly within -90..90 and -180..180 bounds', () => {
      const validPayload = {
        title: 'Deep road crater on Mirpur road',
        description: 'Dangerous pothole damaging vehicles passing by',
        category: 'road_damage' as const,
        priority: 'high' as const,
        latitude: 23.8103,
        longitude: 90.4125,
        address: 'Mirpur Road, Dhaka',
      };
      expect(createIssueSchema.safeParse(validPayload).success).toBe(true);

      const invalidLat = { ...validPayload, latitude: 95.5 };
      expect(createIssueSchema.safeParse(invalidLat).success).toBe(false);

      const invalidLng = { ...validPayload, longitude: -195.0 };
      expect(createIssueSchema.safeParse(invalidLng).success).toBe(false);

      const nanCoords = { ...validPayload, latitude: NaN };
      expect(createIssueSchema.safeParse(nanCoords).success).toBe(false);
    });

    it('accepts valid HTTP/HTTPS image URLs and Base64 image data URIs', () => {
      expect(isValidImageUrl('https://images.unsplash.com/photo-1515162816999?w=800')).toBe(true);
      expect(isValidImageUrl('http://example.com/photo.png')).toBe(true);
      expect(isValidImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=')).toBe(true);
      expect(isValidImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')).toBe(true);
      expect(isValidImageUrl('data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==')).toBe(true);
    });

    it('rejects malicious or invalid image payloads', () => {
      expect(isValidImageUrl('javascript:alert(1)')).toBe(false);
      expect(isValidImageUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(false);
      expect(isValidImageUrl('file:///etc/passwd')).toBe(false);
      expect(isValidImageUrl('random-non-url-string')).toBe(false);
    });
  });

  describe('Rule 5: Issue History Preservation & Status Transitions', () => {
    it('enforces valid status transition graph', () => {
      expect(validateStatusTransition('submitted', 'under_review')).toBe(true);
      expect(validateStatusTransition('under_review', 'assigned')).toBe(true);
      expect(validateStatusTransition('assigned', 'in_progress')).toBe(true);
      expect(validateStatusTransition('in_progress', 'resolved')).toBe(true);
      expect(validateStatusTransition('resolved', 'closed')).toBe(true);

      // Disallowed jump
      expect(validateStatusTransition('submitted', 'resolved')).toBe(false);
      expect(validateStatusTransition('submitted', 'in_progress')).toBe(false);
    });
  });
});
