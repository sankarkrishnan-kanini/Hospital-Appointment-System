import api from '../axios';

export const getChatRoomsApi = () => api.get('/chat/rooms');

export const getChatMessagesApi = (roomId: number, take?: number, cursor?: number) =>
  api.get(`/chat/rooms/${roomId}/messages`, { params: { take, cursor } });

export const startChatApi = (doctorId: number) => api.post(`/chat/start/${doctorId}`);

export const markChatReadApi = (roomId: number) => api.post(`/chat/rooms/${roomId}/read`);

export const getChatUnreadCountApi = () => api.get('/chat/unread');
