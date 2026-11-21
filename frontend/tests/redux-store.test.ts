import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { setCredentials, logout, setDemoPersona } from '../src/store/authSlice';
import { toggleSidebar, setTheme } from '../src/store/uiSlice';
import { setFilters, setSelectedIssueId } from '../src/store/explorerSlice';

describe('Redux Toolkit Store', () => {
  it('handles auth state transitions and credentials', () => {
    store.dispatch(
      setCredentials({
        user: { id: 'test-1', email: 'citizen@civicpulse.gov', name: 'Citizen Jane', role: 'citizen' },
        token: 'mock-jwt-token',
      })
    );
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.name).toBe('Citizen Jane');

    store.dispatch(logout());
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  it('supports demo persona switching', () => {
    store.dispatch(setDemoPersona('admin'));
    expect(store.getState().auth.user?.role).toBe('admin');
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it('updates UI preferences and explorer state', () => {
    const initialSidebar = store.getState().ui.sidebarCollapsed;
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarCollapsed).toBe(!initialSidebar);

    store.dispatch(setTheme('dark'));
    expect(store.getState().ui.theme).toBe('dark');

    store.dispatch(setFilters({ category: 'road_damage', status: 'in_progress' }));
    expect(store.getState().explorer.activeFilters.category).toBe('road_damage');
    expect(store.getState().explorer.activeFilters.status).toBe('in_progress');

    store.dispatch(setSelectedIssueId('issue-123'));
    expect(store.getState().explorer.selectedIssueId).toBe('issue-123');
  });
});
