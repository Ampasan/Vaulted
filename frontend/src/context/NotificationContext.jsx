import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import notificationService from '../services/notificationService';
import notificationSound from '../assets/notification.mp3';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const socket = useSocket();

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated]);

  const handleNewNotification = useCallback((newNotif) => {
    setNotifications((prev) => [newNotif, ...prev]);
    try {
      const audio = new Audio(notificationSound);
      audio.play().catch(() => { });
    } catch (e) { }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket, handleNewNotification]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success && res.data) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
  };

  const value = {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    handleNewNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
