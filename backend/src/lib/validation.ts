import { z } from 'zod';

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
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(3, 'Address is required'),
  imageUrl: z.string().optional(),
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
