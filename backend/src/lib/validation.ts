import { z } from 'zod';

export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return true;
    }
  } catch {
    // not a standard web URL, check base64 data uri
  }

  // Base64 Data URI check
  const base64DataUriRegex = /^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/;
  if (base64DataUriRegex.test(url)) {
    return url.length <= 8 * 1024 * 1024; // <= 8MB
  }

  return false;
}

export function canUserVerifyReport(role: string): boolean {
  return role === 'department_manager' || role === 'admin';
}

export function canUserCloseReport(role: string): boolean {
  return role === 'department_manager' || role === 'admin';
}

export function canUserChangeIssueStatus(role: string): boolean {
  return role === 'admin' || role === 'department_manager' || role === 'maintenance_staff';
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['citizen', 'maintenance_staff', 'department_manager', 'admin']).default('citizen'),
  departmentId: z.string().uuid().optional(),
});

export const createIssueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum([
    'road_damage',
    'streetlight',
    'drainage',
    'footpath',
    'waste_management',
    'public_infrastructure',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  latitude: z.number().refine((v) => !isNaN(v) && v >= -90 && v <= 90, 'Invalid latitude (-90 to 90)'),
  longitude: z.number().refine((v) => !isNaN(v) && v >= -180 && v <= 180, 'Invalid longitude (-180 to 180)'),
  address: z.string().min(3, 'Address is required'),
  imageUrl: z
    .string()
    .optional()
    .refine((v) => !v || isValidImageUrl(v), 'Invalid image URL or base64 format'),
});

export const issueFilterSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  departmentId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
  myReports: z.coerce.boolean().optional(),
});

const VALID_TRANSITIONS: Record<string, string[]> = {
  submitted: ['under_review', 'closed'],
  under_review: ['assigned', 'closed'],
  assigned: ['in_progress', 'under_review'],
  in_progress: ['resolved', 'assigned'],
  resolved: ['closed', 'in_progress'],
  closed: ['under_review'],
};

export function validateStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  if (currentStatus === newStatus) return true;
  const allowed = VALID_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(newStatus));
}
