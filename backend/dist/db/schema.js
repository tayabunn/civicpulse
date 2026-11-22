"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceTasksRelations = exports.issueActivitiesRelations = exports.issuesRelations = exports.departmentsRelations = exports.usersRelations = exports.notifications = exports.searchHistory = exports.savedViews = exports.maintenanceTasks = exports.issueActivities = exports.issues = exports.departments = exports.users = exports.taskStatusEnum = exports.issuePriorityEnum = exports.issueStatusEnum = exports.issueCategoryEnum = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Enums
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', [
    'admin',
    'department_manager',
    'maintenance_staff',
    'citizen',
]);
exports.issueCategoryEnum = (0, pg_core_1.pgEnum)('issue_category', [
    'road_damage',
    'streetlight',
    'drainage',
    'footpath',
    'waste_management',
    'public_infrastructure',
]);
exports.issueStatusEnum = (0, pg_core_1.pgEnum)('issue_status', [
    'submitted',
    'under_review',
    'assigned',
    'in_progress',
    'resolved',
    'closed',
]);
exports.issuePriorityEnum = (0, pg_core_1.pgEnum)('issue_priority', [
    'low',
    'medium',
    'high',
    'critical',
]);
exports.taskStatusEnum = (0, pg_core_1.pgEnum)('task_status', [
    'pending',
    'in_progress',
    'completed',
]);
// 1. Users Table
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    role: (0, exports.userRoleEnum)('role').default('citizen').notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id'),
    phone: (0, pg_core_1.text)('phone'),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
// 2. Departments Table
exports.departments = (0, pg_core_1.pgTable)('departments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').unique().notNull(),
    code: (0, pg_core_1.text)('code').unique().notNull(),
    description: (0, pg_core_1.text)('description'),
    managerId: (0, pg_core_1.uuid)('manager_id'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
// 3. Issues Table
exports.issues = (0, pg_core_1.pgTable)('issues', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    category: (0, exports.issueCategoryEnum)('category').notNull(),
    status: (0, exports.issueStatusEnum)('status').default('submitted').notNull(),
    priority: (0, exports.issuePriorityEnum)('priority').default('medium').notNull(),
    latitude: (0, pg_core_1.doublePrecision)('latitude').notNull(),
    longitude: (0, pg_core_1.doublePrecision)('longitude').notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    reporterId: (0, pg_core_1.uuid)('reporter_id').references(() => exports.users.id).notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id),
    assignedStaffId: (0, pg_core_1.uuid)('assigned_staff_id').references(() => exports.users.id),
    duplicateOfId: (0, pg_core_1.uuid)('duplicate_of_id'),
    feedbackRating: (0, pg_core_1.integer)('feedback_rating'),
    feedbackComment: (0, pg_core_1.text)('feedback_comment'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at', { withTimezone: true }),
}, (table) => [
    (0, pg_core_1.index)('idx_issues_dept_status').on(table.departmentId, table.status),
    (0, pg_core_1.index)('idx_issues_reporter').on(table.reporterId, table.createdAt),
    (0, pg_core_1.index)('idx_issues_category_priority').on(table.category, table.priority),
    (0, pg_core_1.index)('idx_issues_coords').on(table.latitude, table.longitude),
]);
// 4. Issue Activities Table (Immutable Audit Trail)
exports.issueActivities = (0, pg_core_1.pgTable)('issue_activities', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    issueId: (0, pg_core_1.uuid)('issue_id')
        .references(() => exports.issues.id, { onDelete: 'cascade' })
        .notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    action: (0, pg_core_1.text)('action').notNull(),
    previousStatus: (0, pg_core_1.text)('previous_status'),
    newStatus: (0, pg_core_1.text)('new_status'),
    notes: (0, pg_core_1.text)('notes'),
    attachmentUrl: (0, pg_core_1.text)('attachment_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)('idx_issue_activities_issue').on(table.issueId, table.createdAt),
]);
// 5. Maintenance Tasks Table
exports.maintenanceTasks = (0, pg_core_1.pgTable)('maintenance_tasks', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    issueId: (0, pg_core_1.uuid)('issue_id')
        .references(() => exports.issues.id, { onDelete: 'cascade' })
        .notNull(),
    staffId: (0, pg_core_1.uuid)('staff_id').references(() => exports.users.id).notNull(),
    status: (0, exports.taskStatusEnum)('status').default('pending').notNull(),
    fieldNotes: (0, pg_core_1.text)('field_notes'),
    proofImageUrl: (0, pg_core_1.text)('proof_image_url'),
    assignedAt: (0, pg_core_1.timestamp)('assigned_at', { withTimezone: true }).defaultNow().notNull(),
    startedAt: (0, pg_core_1.timestamp)('started_at', { withTimezone: true }),
    completedAt: (0, pg_core_1.timestamp)('completed_at', { withTimezone: true }),
}, (table) => [
    (0, pg_core_1.index)('idx_maintenance_tasks_staff').on(table.staffId, table.status),
]);
// 6. Saved Views Table
exports.savedViews = (0, pg_core_1.pgTable)('saved_views', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    filtersJson: (0, pg_core_1.text)('filters_json').notNull(),
    sortJson: (0, pg_core_1.text)('sort_json'),
    columnsJson: (0, pg_core_1.text)('columns_json'),
    isShared: (0, pg_core_1.boolean)('is_shared').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
// 7. Search History Table
exports.searchHistory = (0, pg_core_1.pgTable)('search_history', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    queryText: (0, pg_core_1.text)('query_text').notNull(),
    filtersJson: (0, pg_core_1.text)('filters_json'),
    executedAt: (0, pg_core_1.timestamp)('executed_at', { withTimezone: true }).defaultNow().notNull(),
});
// 8. Notifications Table
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    type: (0, pg_core_1.text)('type').notNull(),
    link: (0, pg_core_1.text)('link'),
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    department: one(exports.departments, {
        fields: [exports.users.departmentId],
        references: [exports.departments.id],
    }),
    reportedIssues: many(exports.issues, { relationName: 'reportedIssues' }),
    assignedIssues: many(exports.issues, { relationName: 'assignedIssues' }),
    maintenanceTasks: many(exports.maintenanceTasks),
    activities: many(exports.issueActivities),
    notifications: many(exports.notifications),
}));
exports.departmentsRelations = (0, drizzle_orm_1.relations)(exports.departments, ({ one, many }) => ({
    manager: one(exports.users, {
        fields: [exports.departments.managerId],
        references: [exports.users.id],
    }),
    members: many(exports.users),
    issues: many(exports.issues),
}));
exports.issuesRelations = (0, drizzle_orm_1.relations)(exports.issues, ({ one, many }) => ({
    reporter: one(exports.users, {
        fields: [exports.issues.reporterId],
        references: [exports.users.id],
        relationName: 'reportedIssues',
    }),
    department: one(exports.departments, {
        fields: [exports.issues.departmentId],
        references: [exports.departments.id],
    }),
    assignedStaff: one(exports.users, {
        fields: [exports.issues.assignedStaffId],
        references: [exports.users.id],
        relationName: 'assignedIssues',
    }),
    duplicateOf: one(exports.issues, {
        fields: [exports.issues.duplicateOfId],
        references: [exports.issues.id],
        relationName: 'duplicateIssues',
    }),
    activities: many(exports.issueActivities),
    tasks: many(exports.maintenanceTasks),
}));
exports.issueActivitiesRelations = (0, drizzle_orm_1.relations)(exports.issueActivities, ({ one }) => ({
    issue: one(exports.issues, {
        fields: [exports.issueActivities.issueId],
        references: [exports.issues.id],
    }),
    user: one(exports.users, {
        fields: [exports.issueActivities.userId],
        references: [exports.users.id],
    }),
}));
exports.maintenanceTasksRelations = (0, drizzle_orm_1.relations)(exports.maintenanceTasks, ({ one }) => ({
    issue: one(exports.issues, {
        fields: [exports.maintenanceTasks.issueId],
        references: [exports.issues.id],
    }),
    staff: one(exports.users, {
        fields: [exports.maintenanceTasks.staffId],
        references: [exports.users.id],
    }),
}));
