import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IssueFilters } from '../types';

interface ExplorerState {
  activeFilters: IssueFilters;
  selectedIssueId: string | null;
  splitRatio: number; // Percentage for table (e.g. 55%)
  viewMode: 'split' | 'table' | 'map';
}

const initialState: ExplorerState = {
  activeFilters: {
    page: 1,
    limit: 15,
  },
  selectedIssueId: null,
  splitRatio: 55,
  viewMode: 'split',
};

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<IssueFilters>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.activeFilters = { page: 1, limit: 15 };
    },
    setSelectedIssueId: (state, action: PayloadAction<string | null>) => {
      state.selectedIssueId = action.payload;
    },
    setSplitRatio: (state, action: PayloadAction<number>) => {
      state.splitRatio = Math.max(20, Math.min(80, action.payload));
    },
    setViewMode: (state, action: PayloadAction<'split' | 'table' | 'map'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setFilters, clearFilters, setSelectedIssueId, setSplitRatio, setViewMode } =
  explorerSlice.actions;
export default explorerSlice.reducer;
