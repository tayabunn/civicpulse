'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Notification Center
  notifications: ActivityNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif-1',
    title: 'Work Order Dispatched',
    description: 'Roads & Highways Crew #4 assigned to CP-2024-0042 (Pothole at Dhanmondi 27)',
    time: '5 mins ago',
    read: false,
    type: 'info',
    link: '/citizen/reports',
  },
  {
    id: 'notif-2',
    title: 'Issue Resolved & Closed',
    description: 'Streetlight fault CP-2024-0019 verified repaired by Field Maintenance',
    time: '24 mins ago',
    read: false,
    type: 'success',
    link: '/citizen/reports',
  },
  {
    id: 'notif-3',
    title: 'High Severity Escalation',
    description: 'Severe water main burst reported in Gulshan 2 requires immediate triage',
    time: '1 hour ago',
    read: true,
    type: 'warning',
    link: '/manager/issues',
  },
  {
    id: 'notif-4',
    title: 'SLA Milestone Achieved',
    description: 'Electrical department reached 94.2% on-time resolution this month',
    time: '3 hours ago',
    read: true,
    type: 'info',
    link: '/admin/analytics',
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<ActivityNotification[]>(INITIAL_NOTIFICATIONS);

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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
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
