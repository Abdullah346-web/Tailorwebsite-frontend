import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out expired notifications
        const active = parsed.filter((n) => new Date(n.expiresAt) > new Date());
        setNotifications(active);
        if (active.length > 0) {
          localStorage.setItem('notifications', JSON.stringify(active));
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    }
  }, []);

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } else {
      localStorage.removeItem('notifications');
    }
  }, [notifications]);

  const addNotification = useCallback((message, type = 'success', durationMs = 180000) => {
    // 180000ms = 3 minutes
    const id = Date.now();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMs);

    const notification = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after duration
    const timer = setTimeout(() => {
      removeNotification(id);
    }, durationMs);

    return { id, timer };
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
