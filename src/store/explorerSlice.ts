import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IssueFilterState {
  q?: string;
  category?: string;
  status?: string;
  priority?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface ExplorerState {
  activeFilters: IssueFilterState;
  selectedIssueIds: string[];
  visibleColumns: string[];
  viewMode: 'table' | 'map' | 'split';
}

const initialState: ExplorerState = {
  activeFilters: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
  },
  selectedIssueIds: [],
  visibleColumns: ['title', 'category', 'priority', 'status', 'address', 'createdAt'],
  viewMode: 'table',
};

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IssueFilterState>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
    },
    setSelectedIssues: (state, action: PayloadAction<string[]>) => {
      state.selectedIssueIds = action.payload;
    },
    toggleSelectIssue: (state, action: PayloadAction<string>) => {
      if (state.selectedIssueIds.includes(action.payload)) {
        state.selectedIssueIds = state.selectedIssueIds.filter((id) => id !== action.payload);
      } else {
        state.selectedIssueIds.push(action.payload);
      }
    },
    clearSelection: (state) => {
      state.selectedIssueIds = [];
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'table' | 'map' | 'split'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setSelectedIssues,
  toggleSelectIssue,
  clearSelection,
  setVisibleColumns,
  setViewMode,
} = explorerSlice.actions;

export default explorerSlice.reducer;
