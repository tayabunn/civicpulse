import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { setCredentials, logout, setDemoPersona } from '../src/store/authSlice';
import { toggleSidebar, setTheme } from '../src/store/uiSlice';

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

  it('updates UI preferences', () => {
    const initialSidebar = store.getState().ui.sidebarCollapsed;
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarCollapsed).toBe(!initialSidebar);

    store.dispatch(setTheme('dark'));
    expect(store.getState().ui.theme).toBe('dark');
  });
});
