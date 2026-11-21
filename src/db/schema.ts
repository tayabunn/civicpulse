import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  doublePrecision,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'department_manager',
  'maintenance_staff',
  'citizen',
]);

export const issueCategoryEnum = pgEnum('issue_category', [
  'road_damage',
  'streetlight',
  'drainage',
  'footpath',
  'waste_management',
  'public_infrastructure',
]);

export const issueStatusEnum = pgEnum('issue_status', [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
]);

export const issuePriorityEnum = pgEnum('issue_priority', [
  'low',
  'medium',
  'high',
  'critical',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'pending',
  'in_progress',
  'completed',
]);

// 1. Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('citizen').notNull(),
  departmentId: uuid('department_id'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Departments Table
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').unique().notNull(),
  code: text('code').unique().notNull(),
  description: text('description'),
  managerId: uuid('manager_id'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Issues Table
export const issues = pgTable(
  'issues',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    category: issueCategoryEnum('category').notNull(),
    status: issueStatusEnum('status').default('submitted').notNull(),
    priority: issuePriorityEnum('priority').default('medium').notNull(),
    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
    address: text('address').notNull(),
    imageUrl: text('image_url'),
    reporterId: uuid('reporter_id').references(() => users.id).notNull(),
    departmentId: uuid('department_id').references(() => departments.id),
    assignedStaffId: uuid('assigned_staff_id').references(() => users.id),
    duplicateOfId: uuid('duplicate_of_id'),
    feedbackRating: integer('feedback_rating'),
    feedbackComment: text('feedback_comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_issues_dept_status').on(table.departmentId, table.status),
    index('idx_issues_reporter').on(table.reporterId, table.createdAt),
    index('idx_issues_category_priority').on(table.category, table.priority),
    index('idx_issues_coords').on(table.latitude, table.longitude),
  ]
);

// 4. Issue Activities Table (Immutable Audit Trail)
export const issueActivities = pgTable(
  'issue_activities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    issueId: uuid('issue_id')
      .references(() => issues.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    action: text('action').notNull(),
    previousStatus: text('previous_status'),
    newStatus: text('new_status'),
    notes: text('notes'),
    attachmentUrl: text('attachment_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_issue_activities_issue').on(table.issueId, table.createdAt),
  ]
);

// 5. Maintenance Tasks Table
export const maintenanceTasks = pgTable(
  'maintenance_tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    issueId: uuid('issue_id')
      .references(() => issues.id, { onDelete: 'cascade' })
      .notNull(),
    staffId: uuid('staff_id').references(() => users.id).notNull(),
    status: taskStatusEnum('status').default('pending').notNull(),
    fieldNotes: text('field_notes'),
    proofImageUrl: text('proof_image_url'),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_maintenance_tasks_staff').on(table.staffId, table.status),
  ]
);

// 6. Saved Views Table
export const savedViews = pgTable('saved_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  filtersJson: text('filters_json').notNull(),
  sortJson: text('sort_json'),
  columnsJson: text('columns_json'),
  isShared: boolean('is_shared').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. Search History Table
export const searchHistory = pgTable('search_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  queryText: text('query_text').notNull(),
  filtersJson: text('filters_json'),
  executedAt: timestamp('executed_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Notifications Table
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  reportedIssues: many(issues, { relationName: 'reportedIssues' }),
  assignedIssues: many(issues, { relationName: 'assignedIssues' }),
  maintenanceTasks: many(maintenanceTasks),
  activities: many(issueActivities),
  notifications: many(notifications),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
  }),
  members: many(users),
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
  reporter: one(users, {
    fields: [issues.reporterId],
    references: [users.id],
    relationName: 'reportedIssues',
  }),
  department: one(departments, {
    fields: [issues.departmentId],
    references: [departments.id],
  }),
  assignedStaff: one(users, {
    fields: [issues.assignedStaffId],
    references: [users.id],
    relationName: 'assignedIssues',
  }),
  duplicateOf: one(issues, {
    fields: [issues.duplicateOfId],
    references: [issues.id],
    relationName: 'duplicateIssues',
  }),
  activities: many(issueActivities),
  tasks: many(maintenanceTasks),
}));

export const issueActivitiesRelations = relations(issueActivities, ({ one }) => ({
  issue: one(issues, {
    fields: [issueActivities.issueId],
    references: [issues.id],
  }),
  user: one(users, {
    fields: [issueActivities.userId],
    references: [users.id],
  }),
}));

export const maintenanceTasksRelations = relations(maintenanceTasks, ({ one }) => ({
  issue: one(issues, {
    fields: [maintenanceTasks.issueId],
    references: [issues.id],
  }),
  staff: one(users, {
    fields: [maintenanceTasks.staffId],
    references: [users.id],
  }),
}));

// Export inferred types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type IssueActivity = typeof issueActivities.$inferSelect;
export type NewIssueActivity = typeof issueActivities.$inferInsert;
export type MaintenanceTask = typeof maintenanceTasks.$inferSelect;
export type NewMaintenanceTask = typeof maintenanceTasks.$inferInsert;
export type SavedView = typeof savedViews.$inferSelect;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
