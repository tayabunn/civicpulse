import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';
import type {
  Issue,
  IssuesResponse,
  IssueFilters,
  Department,
  MaintenanceTask,
  AnalyticsSummary,
  SavedView,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Issues', 'Departments', 'Tasks', 'Analytics', 'SavedViews', 'Users', 'Settings'],
  endpoints: (builder) => ({
    // Issues
    getIssues: builder.query<IssuesResponse, IssueFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
              if (key === 'search') {
                params.append('q', String(val));
              } else if (key === 'sortBy') {
                params.append('sort', String(val));
              } else if (key === 'sortOrder') {
                params.append('order', String(val));
              } else {
                params.append(key, String(val));
              }
            }
          });
        }
        return `/issues?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Issues' as const, id })),
              { type: 'Issues', id: 'LIST' },
            ]
          : [{ type: 'Issues', id: 'LIST' }],
    }),

    getIssueById: builder.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Issues', id }],
    }),

    createIssue: builder.mutation<Issue, Partial<Issue>>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Issues', id: 'LIST' }, 'Analytics'],
    }),

    updateIssueStatus: builder.mutation<
      Issue,
      {
        id: string;
        status?: string;
        priority?: string;
        departmentId?: string;
        assignedStaffId?: string;
        duplicateOfId?: string;
        notes?: string;
        userId?: string;
        userName?: string;
        userRole?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Issues', id },
        { type: 'Issues', id: 'LIST' },
        'Analytics',
      ],
    }),

    submitFeedback: builder.mutation<Issue, { id: string; rating: number; feedback: string }>({
      query: ({ id, rating, feedback }) => ({
        url: `/issues/${id}/feedback`,
        method: 'POST',
        body: { rating, feedback },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Issues', id }],
    }),

    // Departments
    getDepartments: builder.query<Department[], void>({
      query: () => '/departments',
      providesTags: ['Departments'],
    }),

    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/departments/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Departments', id }],
    }),

    // Tasks
    getTasks: builder.query<MaintenanceTask[], { staffId?: string; status?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.staffId) queryParams.append('staffId', params.staffId);
        if (params?.status) queryParams.append('status', params.status);
        return `/tasks?${queryParams.toString()}`;
      },
      providesTags: ['Tasks'],
    }),

    assignTask: builder.mutation<
      MaintenanceTask,
      { issueId: string; staffId: string; notes?: string; scheduledDate?: string }
    >({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks', { type: 'Issues', id: 'LIST' }],
    }),

    updateTaskStatus: builder.mutation<
      MaintenanceTask,
      { id: string; status: string; notes?: string; completionPhotoUrl?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Tasks', { type: 'Issues', id: 'LIST' }, 'Analytics'],
    }),

    // Analytics
    getAnalytics: builder.query<AnalyticsSummary, void>({
      query: () => '/analytics',
      providesTags: ['Analytics'],
    }),

    // Saved Views
    getSavedViews: builder.query<SavedView[], void>({
      query: () => '/saved-views',
      providesTags: ['SavedViews'],
    }),

    createSavedView: builder.mutation<SavedView, { name: string; filters: Record<string, any> }>({
      query: (body) => ({
        url: '/saved-views',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SavedViews'],
    }),

    // Users Management
    getUsers: builder.query<{ users: any[]; total: number }, { role?: string; search?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.role) queryParams.append('role', params.role);
        if (params?.search) queryParams.append('search', params.search);
        return `/users?${queryParams.toString()}`;
      },
      providesTags: ['Users'],
    }),

    createUser: builder.mutation<any, any>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<any, { id: string; role?: string; departmentId?: string; name?: string; phone?: string }>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    createDepartment: builder.mutation<any, { name: string; code: string; description?: string; managerId?: string }>({
      query: (body) => ({
        url: '/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Departments'],
    }),

    updateDepartment: builder.mutation<any, { id: string; name?: string; description?: string; managerId?: string; isActive?: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/departments/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Departments'],
    }),

    // System Settings
    getSettings: builder.query<{ success: boolean; settings: any }, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: '/settings',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Profile & Password Management
    updateProfile: builder.mutation<any, { id: string; name?: string; phone?: string; avatarUrl?: string }>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    updatePassword: builder.mutation<any, { id: string; currentPassword: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/password',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueStatusMutation,
  useSubmitFeedbackMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useGetTasksQuery,
  useAssignTaskMutation,
  useUpdateTaskStatusMutation,
  useGetAnalyticsQuery,
  useGetSavedViewsQuery,
  useCreateSavedViewMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = apiSlice;
