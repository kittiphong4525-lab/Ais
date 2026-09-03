import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types';
import { ApiService } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  broadcastNewLead: (customerName: string, phone: string, pkgName?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Real-time listener to Cloud Firestore notifications
  useEffect(() => {
    const unsubscribe = ApiService.subscribeNotifications((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const list = await ApiService.getNotifications();
      setNotifications(list);
    } catch (e) {
      console.error('Failed to load notifications from cloud:', e);
    }
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error('Failed to mark notification read in cloud:', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark all notifications read in cloud:', e);
    }
  };

  const broadcastNewLead = (customerName: string, phone: string, pkgName?: string) => {
    addToast({
      type: 'success',
      title: '🎉 ได้รับข้อมูลเรียบร้อยแล้ว!',
      message: `เจ้าหน้าที่จะติดต่อกลับคุณ ${customerName} (${phone}) เร็วที่สุด`,
      duration: 6000,
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        addToast,
        removeToast,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        broadcastNewLead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const defaultNotificationContext: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  refreshNotifications: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  broadcastNewLead: () => {},
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return defaultNotificationContext;
  }
  return context;
};
