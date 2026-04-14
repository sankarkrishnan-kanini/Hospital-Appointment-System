'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/api/notification.api';
import { useAuthStore } from '@/store/auth.store';

export function useNotifications() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {}
  }, [token]);

  useEffect(() => {
    fetch();
    intervalRef.current = setInterval(fetch, 30_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetch]);

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, markAsRead: handleMarkAsRead, markAllAsRead: handleMarkAllAsRead };
}
