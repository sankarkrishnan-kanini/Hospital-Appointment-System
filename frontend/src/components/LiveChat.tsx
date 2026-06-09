'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, ArrowLeft, MessageCircle, Circle } from 'lucide-react';
import { useLiveChat, ChatRoom, ChatMessageData } from '@/hooks/useLiveChat';

interface Props {
  role: 'patient' | 'doctor';
}

export default function LiveChat({ role }: Props) {
  const {
    connected,
    rooms,
    activeRoom,
    messages,
    loading,
    typing,
    userId,
    joinRoom,
    leaveRoom,
    sendMessage,
    emitTyping,
    startChat,
  } = useLiveChat();

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input when entering a room
  useEffect(() => {
    if (activeRoom) inputRef.current?.focus();
  }, [activeRoom]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    emitTyping();
  };

  const getOtherName = (room: ChatRoom) => {
    if (role === 'patient') return `Dr. ${room.doctor.firstName} ${room.doctor.lastName}`;
    return `${room.patient.firstName} ${room.patient.lastName}`;
  };

  const getLastMessage = (room: ChatRoom) => {
    const last = room.messages?.[0];
    if (!last) return 'No messages yet';
    const prefix = last.senderId === userId ? 'You: ' : '';
    return prefix + (last.content.length > 40 ? last.content.slice(0, 40) + '...' : last.content);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  // ─── Room List View ──────────────────────────────────────────────────────────
  if (!activeRoom) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">
                {role === 'patient' ? 'Chat with your doctors' : 'Chat with your patients'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Circle
                size={8}
                className={connected ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'}
              />
              <span className="text-xs text-gray-400">
                {connected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <MessageCircle size={48} className="text-gray-300 mb-4" />
              <h3 className="text-gray-600 font-medium mb-1">No conversations yet</h3>
              <p className="text-sm text-gray-400">
                {role === 'patient'
                  ? 'Start a conversation from a doctor\'s profile page'
                  : 'Patients will be able to message you here'}
              </p>
            </div>
          )}

          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => joinRoom(room)}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-blue-50 transition-colors border-b border-gray-100 text-left"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {role === 'patient'
                    ? `${room.doctor.firstName[0]}${room.doctor.lastName[0]}`
                    : `${room.patient.firstName[0]}${room.patient.lastName[0]}`}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {getOtherName(room)}
                  </p>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">
                    {room.messages?.[0] ? formatTime(room.messages[0].createdAt) : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {getLastMessage(room)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Chat View ───────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-3">
        <button
          onClick={leaveRoom}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <span className="text-white font-semibold text-xs">
            {role === 'patient'
              ? `${activeRoom.doctor.firstName[0]}${activeRoom.doctor.lastName[0]}`
              : `${activeRoom.patient.firstName[0]}${activeRoom.patient.lastName[0]}`}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{getOtherName(activeRoom)}</p>
          {typing ? (
            <p className="text-xs text-green-600 animate-pulse">typing...</p>
          ) : (
            <p className="text-xs text-gray-400">
              {connected ? 'Online' : 'Offline'}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((m) => {
          const isMine = m.senderId === userId;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                  <span className={`text-[10px] ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                    {formatTime(m.createdAt)}
                  </span>
                  {isMine && (
                    <span className={`text-[10px] ${m.isRead ? 'text-blue-200' : 'text-blue-300/50'}`}>
                      {m.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
