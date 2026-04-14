'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

import api from '@/lib/axios';

const getNotifications = () => api.get<Notification[]>('/notifications').then((r) => r.data);
const markAsReadApi = (id: number) => api.patch(`/notifications/${id}/read`).then((r) => r.data);
const markAllAsReadApi = () => api.patch('/notifications/read-all').then((r) => r.data);

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
    await markAsReadApi(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadApi();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, markAsRead: handleMarkAsRead, markAllAsRead: handleMarkAllAsRead };
}
