'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '../store/apiSlice';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ActivityNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  link?: string;
}

interface NotificationContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  notifySuccess: (message: string, title?: string) => string;
  notifyError: (message: string, title?: string) => string;
  notifyInfo: (message: string, title?: string) => string;
  notifyWarning: (message: string, title?: string) => string;
  notifications: ActivityNotification[];
  unreadCount: number;
  isLoadingNotifications: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const formatRelativeTime = (isoDate: string) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [localReadIds, setLocalReadIds] = useState<Record<string, boolean>>({});
  const [clearedIds, setClearedIds] = useState<Record<string, boolean>>({});

  const { data, isLoading: isLoadingNotifications } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated || !user,
    pollingInterval: 30000,
  });

  const [markReadMutation] = useMarkNotificationReadMutation();
  const [markAllReadMutation] = useMarkAllNotificationsReadMutation();

  const notifications: ActivityNotification[] = useMemo(() => {
    const items = data?.items || [];
    return items
      .filter((item: any) => !clearedIds[item.id])
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        time: item.createdAt ? formatRelativeTime(item.createdAt) : 'Recent',
        read: Boolean(item.read) || Boolean(localReadIds[item.id]),
        type: (item.type as NotificationType) || 'info',
        link: item.link,
      }));
  }, [data, localReadIds, clearedIds]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = ({
    type,
    title,
    message,
    duration = 4000,
  }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const notifySuccess = (message: string, title = 'Success') =>
    addToast({ type: 'success', title, message });

  const notifyError = (message: string, title = 'Error') =>
    addToast({ type: 'error', title, message });

  const notifyInfo = (message: string, title = 'Notification') =>
    addToast({ type: 'info', title, message });

  const notifyWarning = (message: string, title = 'Warning') =>
    addToast({ type: 'warning', title, message });

  const markAsRead = (id: string) => {
    setLocalReadIds((prev) => ({ ...prev, [id]: true }));
    if (isAuthenticated && !id.startsWith('act-')) {
      markReadMutation(id);
    }
  };

  const markAllAsRead = () => {
    const next: Record<string, boolean> = {};
    notifications.forEach((n) => {
      next[n.id] = true;
    });
    setLocalReadIds((prev) => ({ ...prev, ...next }));
    if (isAuthenticated) {
      markAllReadMutation();
    }
  };

  const clearNotifications = () => {
    const next: Record<string, boolean> = {};
    notifications.forEach((n) => {
      next[n.id] = true;
    });
    setClearedIds((prev) => ({ ...prev, ...next }));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning,
        notifications,
        unreadCount,
        isLoadingNotifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
