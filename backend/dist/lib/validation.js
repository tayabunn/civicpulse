"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueFilterSchema = exports.createIssueSchema = exports.registerSchema = exports.loginSchema = void 0;
exports.validateStatusTransition = validateStatusTransition;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['citizen', 'maintenance_staff', 'department_manager', 'admin']).default('citizen'),
    departmentId: zod_1.z.string().uuid().optional(),
});
exports.createIssueSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters').max(200),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    category: zod_1.z.enum([
        'road_damage',
        'streetlight',
        'drainage',
        'footpath',
        'waste_management',
        'public_infrastructure',
    ]),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    address: zod_1.z.string().min(3, 'Address is required'),
    imageUrl: zod_1.z.string().optional(),
});
exports.issueFilterSchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    priority: zod_1.z.string().optional(),
    departmentId: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(10),
    sort: zod_1.z.string().default('createdAt'),
    order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    lat: zod_1.z.coerce.number().optional(),
    lng: zod_1.z.coerce.number().optional(),
    radius: zod_1.z.coerce.number().optional(),
});
const VALID_TRANSITIONS = {
    submitted: ['under_review', 'closed'],
    under_review: ['assigned', 'closed'],
    assigned: ['in_progress', 'under_review'],
    in_progress: ['resolved', 'assigned'],
    resolved: ['closed', 'in_progress'],
    closed: ['under_review'],
};
function validateStatusTransition(currentStatus, newStatus) {
    if (currentStatus === newStatus)
        return true;
    const allowed = VALID_TRANSITIONS[currentStatus];
    return Boolean(allowed && allowed.includes(newStatus));
}
