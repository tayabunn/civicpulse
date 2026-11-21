import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { setCredentials, logout } from '../src/store/authSlice';
import { toggleSidebar, setTheme } from '../src/store/uiSlice';
import { setFilters, setSelectedIssues, setViewMode } from '../src/store/explorerSlice';

describe('Redux Toolkit Store', () => {
  it('handles auth state transitions', () => {
    store.dispatch(
      setCredentials({
        user: {
          id: 'u0000000-0000-0000-0000-000000000004',
          email: 'citizen@example.com',
          role: 'citizen',
          name: 'Jane Citizen',
        },
        token: 'mock-jwt-token',
      })
    );
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.email).toBe('citizen@example.com');

    store.dispatch(logout());
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  it('updates UI preferences and explorer filters', () => {
    const initialSidebar = store.getState().ui.sidebarCollapsed;
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarCollapsed).toBe(!initialSidebar);

    store.dispatch(setTheme('dark'));
    expect(store.getState().ui.theme).toBe('dark');

    store.dispatch(setFilters({ category: 'road_damage', status: 'in_progress' }));
    expect(store.getState().explorer.activeFilters.category).toBe('road_damage');
    expect(store.getState().explorer.activeFilters.status).toBe('in_progress');

    store.dispatch(setSelectedIssues(['iss-1', 'iss-2']));
    expect(store.getState().explorer.selectedIssueIds).toHaveLength(2);

    store.dispatch(setViewMode('split'));
    expect(store.getState().explorer.viewMode).toBe('split');
  });

  it('configures RTK Query api reducer in store', () => {
    expect(store.getState().api).toBeDefined();
  });
});
