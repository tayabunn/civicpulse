import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Issues', 'Departments', 'Tasks', 'Analytics', 'SavedViews'],
  endpoints: (builder) => ({
    getIssues: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: '/issues',
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }: { id: string }) => ({
                type: 'Issues' as const,
                id,
              })),
              { type: 'Issues', id: 'LIST' },
            ]
          : [{ type: 'Issues', id: 'LIST' }],
    }),
    getIssueDetails: builder.query<any, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Issues', id }],
    }),
    createIssue: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Issues', id: 'LIST' }, 'Analytics'],
    }),
    updateIssueStatus: builder.mutation<any, { id: string; status: string; notes?: string }>({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Issues', id },
        { type: 'Issues', id: 'LIST' },
        'Analytics',
      ],
    }),
    submitFeedback: builder.mutation<any, { id: string; rating: number; comment?: string }>({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/feedback`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Issues', id },
        { type: 'Issues', id: 'LIST' },
        'Analytics',
      ],
    }),
    getDepartments: builder.query<any, void>({
      query: () => '/departments',
      providesTags: ['Departments'],
    }),
    getTasks: builder.query<any, void>({
      query: () => '/tasks',
      providesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<any, { id: string; status: string; fieldNotes?: string; proofImageUrl?: string }>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Tasks', { type: 'Issues', id: 'LIST' }, 'Analytics'],
    }),
    getAnalytics: builder.query<any, void>({
      query: () => '/analytics',
      providesTags: ['Analytics'],
    }),
    getSavedViews: builder.query<any, void>({
      query: () => '/saved-views',
      providesTags: ['SavedViews'],
    }),
    createSavedView: builder.mutation<any, any>({
      query: (body) => ({
        url: '/saved-views',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SavedViews'],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueDetailsQuery,
  useCreateIssueMutation,
  useUpdateIssueStatusMutation,
  useSubmitFeedbackMutation,
  useGetDepartmentsQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useGetAnalyticsQuery,
  useGetSavedViewsQuery,
  useCreateSavedViewMutation,
} = apiSlice;
