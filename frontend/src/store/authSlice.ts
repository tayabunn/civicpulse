import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: '10000000-0000-0000-0000-000000000001',
    email: 'admin@civicpulse.gov',
    name: 'Sarah Rahman (City Administrator)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  manager: {
    id: '10000000-0000-0000-0000-000000000002',
    email: 'manager.roads@civicpulse.gov',
    name: 'Rafiqul Islam (Roads Manager)',
    role: 'manager',
    departmentId: 'd0000000-0000-0000-0000-000000000001',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  staff: {
    id: '10000000-0000-0000-0000-000000000003',
    email: 'staff.electric@civicpulse.gov',
    name: 'Kamal Hossain (Field Electrician)',
    role: 'staff',
    departmentId: 'd0000000-0000-0000-0000-000000000002',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  citizen: {
    id: '10000000-0000-0000-0000-000000000004',
    email: 'citizen.jane@civicpulse.gov',
    name: 'Jane Citizen',
    role: 'citizen',
    phone: '+8801700000001',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setDemoPersona: (state, action: PayloadAction<UserRole>) => {
      const demo = DEMO_USERS[action.payload];
      if (demo) {
        state.user = demo;
        state.token = `demo-token-${action.payload}`;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setDemoPersona, logout } = authSlice.actions;
export default authSlice.reducer;
