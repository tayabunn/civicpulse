import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
