export type UserRole = 'admin' | 'manager' | 'staff' | 'citizen';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export type IssueCategory =
  | 'road_damage'
  | 'streetlight'
  | 'drainage'
  | 'footpath'
  | 'waste_management'
  | 'public_infrastructure';

export type IssueStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  color?: string | null;
  staffCount?: number;
  activeIssuesCount?: number;
  staff?: User[];
}

export interface IssueActivity {
  id: string;
  issueId: string;
  userId?: string | null;
  action: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
  notes?: string | null;
  createdAt: string;
  userName?: string;
  userRole?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MaintenanceTask {
  id: string;
  issueId: string;
  staffId: string;
  status: TaskStatus;
  assignedById?: string | null;
  assignedAt?: string | null;
  notes?: string | null;
  completionPhotoUrl?: string | null;
  scheduledDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  issue?: Issue;
  staff?: User;
  staffName?: string;
}

export interface Issue {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  latitude: number;
  longitude: number;
  address: string;
  imageUrl?: string | null;
  reporterId: string;
  departmentId?: string | null;
  departmentName?: string | null;
  duplicateOfId?: string | null;
  resolutionNotes?: string | null;
  resolutionImageUrl?: string | null;
  citizenRating?: number | null;
  citizenFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  reporter?: User;
  activities?: IssueActivity[];
  tasks?: MaintenanceTask[];
}

export interface IssueFilters {
  status?: string;
  category?: string;
  priority?: string;
  departmentId?: string;
  search?: string;
  q?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IssuesResponse {
  items: Issue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DepartmentRanking {
  rank: number;
  departmentId?: string;
  departmentName: string;
  code: string;
  score: number;
  grade: string;
  medal?: string | null;
  slaComplianceRate: number;
  avgResolutionHours: number;
  totalIssues: number;
  resolvedIssues: number;
  trend: string;
}

export interface CitizenSatisfactionData {
  avgRating: number;
  totalRatings: number;
  csatPercentage: number;
  ratingDistribution: { stars: number; count: number; percentage: number }[];
}

export interface AnalyticsSummary {
  totalIssues?: number;
  resolvedCount?: number;
  inProgressCount?: number;
  pendingCount?: number;
  avgResolutionHours?: number;
  slaComplianceRate?: number;
  categoryBreakdown?: { category: string; count: number }[];
  monthlyTrends?: { month: string; submitted?: number; resolved?: number; reported?: number }[];
  departmentWorkloads?: { department: string; openIssues: number; staffCount: number }[];
  departmentRankings?: DepartmentRanking[];
  citizenSatisfaction?: CitizenSatisfactionData;
  overview?: {
    total: number;
    pending: number;
    resolved: number;
    closed: number;
    resolutionRate: number;
  };
}

export interface SavedView {
  id: string;
  userId: string;
  name: string;
  filters: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}
