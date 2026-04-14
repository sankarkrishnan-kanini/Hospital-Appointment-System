import api from '@/lib/axios';

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = () =>
  api.get<Notification[]>('/notifications').then((r) => r.data);

export const markAsRead = (id: number) =>
  api.patch(`/notifications/${id}/read`).then((r) => r.data);

export const markAllAsRead = () =>
  api.patch('/notifications/read-all').then((r) => r.data);
