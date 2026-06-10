'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import {
  getChatRoomsApi,
  getChatMessagesApi,
  startChatApi,
  markChatReadApi,
  getChatUnreadCountApi,
} from '@/lib/api/chat.api';

export interface ChatRoom {
  id: number;
  doctorId: number;
  patientId: number;
  doctor: { id: number; firstName: string; lastName: string; userId: number };
  patient: { id: number; firstName: string; lastName: string; userId: number };
  messages: ChatMessageData[];
  updatedAt: string;
}

export interface ChatMessageData {
  id: number;
  chatRoomId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: number; email: string; role: string };
}

export function useLiveChat() {
  const { token, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect socket
  useEffect(() => {
    if (!token) return;

    const socket = io(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat`,
      {
        auth: { token },
        transports: ['websocket', 'polling'],
      },
    );

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('newMessage', (message: ChatMessageData) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      // Update room's last message
      setRooms((prev) =>
        prev.map((r) =>
          r.id === message.chatRoomId ? { ...r, messages: [message] } : r,
        ),
      );
    });

    socket.on('newMessageNotification', () => {
      setUnreadCount((c) => c + 1);
      fetchRooms(); // Refresh rooms to update last message
    });

    socket.on('userTyping', () => setTyping(true));
    socket.on('userStopTyping', () => setTyping(false));

    socket.on('messagesRead', () => {
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const res = await getChatRoomsApi();
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch { /* ignore */ }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await getChatUnreadCountApi();
      setUnreadCount(res.data?.unreadCount ?? 0);
    } catch { /* ignore */ }
  }, []);

  // Load rooms on mount
  useEffect(() => {
    if (token) {
      fetchRooms();
      fetchUnreadCount();
    }
  }, [token, fetchRooms, fetchUnreadCount]);

  // Join a room
  const joinRoom = useCallback(
    async (room: ChatRoom) => {
      if (activeRoom?.id === room.id) return;

      // Leave previous room
      if (activeRoom) {
        socketRef.current?.emit('leaveRoom', { roomId: activeRoom.id });
      }

      setActiveRoom(room);
      setLoading(true);

      try {
        const res = await getChatMessagesApi(room.id);
        setMessages(Array.isArray(res.data) ? res.data : []);
        await markChatReadApi(room.id);
        socketRef.current?.emit('joinRoom', { roomId: room.id });
        fetchUnreadCount();
      } finally {
        setLoading(false);
      }
    },
    [activeRoom, fetchUnreadCount],
  );

  // Send message
  const sendMessage = useCallback(
    (content: string) => {
      if (!activeRoom || !content.trim()) return;
      socketRef.current?.emit('sendMessage', {
        roomId: activeRoom.id,
        content: content.trim(),
      });
      // Stop typing indicator
      socketRef.current?.emit('stopTyping', { roomId: activeRoom.id });
    },
    [activeRoom],
  );

  // Typing indicator
  const emitTyping = useCallback(() => {
    if (!activeRoom) return;
    socketRef.current?.emit('typing', { roomId: activeRoom.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stopTyping', { roomId: activeRoom.id });
    }, 2000);
  }, [activeRoom]);

  // Start a new chat (patient → doctor)
  const startChat = useCallback(
    async (doctorId: number) => {
      setLoading(true);
      try {
        const res = await startChatApi(doctorId);
        const room = res.data;
        await fetchRooms();
        await joinRoom(room);
        return room;
      } finally {
        setLoading(false);
      }
    },
    [fetchRooms, joinRoom],
  );

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (activeRoom) {
      socketRef.current?.emit('leaveRoom', { roomId: activeRoom.id });
      setActiveRoom(null);
      setMessages([]);
    }
  }, [activeRoom]);

  return {
    connected,
    rooms,
    activeRoom,
    messages,
    loading,
    typing,
    unreadCount,
    userId: user?.id,
    joinRoom,
    leaveRoom,
    sendMessage,
    emitTyping,
    startChat,
    fetchRooms,
  };
}
