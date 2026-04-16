'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Stethoscope, Bell, LogOut } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useQuery } from '@tanstack/react-query';
import { getDoctorProfileApi } from '@/lib/api/doctor.api';

export default function DoctorTopBar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: profileRes } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: getDoctorProfileApi,
    retry: false,
  });
  const doctor = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12 bg-gradient-to-r from-[#1a6b4c] to-[#22a06b] flex items-center justify-between px-6 shadow-md">
      {/* Left — logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>
        <span className="text-white font-bold text-sm">MediCare</span>
        <span className="text-green-200 text-xs ml-1 hidden sm:block">· Doctor Portal</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <p className="text-green-200 text-xs hidden md:block">{dateStr}</p>

        <div className="w-px h-4 bg-white/20" />

        <div className="flex items-center gap-1.5">
          <Stethoscope size={13} className="text-green-200" />
          <span className="text-white text-xs font-medium">
            {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : user?.email}
          </span>
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium ml-1">Doctor</span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        {/* Notification Bell */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(o => !o)} className="relative p-1.5 rounded-lg hover:bg-white/10 transition">
            <Bell size={15} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-[#2d6be4] hover:underline font-medium">
                    Mark all as read
                  </button>
                )}
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-gray-400">No notifications</li>
                ) : (
                  notifications.map((n) => (
                    <li key={n.id} onClick={() => !n.isRead && markAsRead(n.id)}
                      className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 transition ${!n.isRead ? 'bg-[#f5f8ff]' : ''}`}>
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-[#2d6be4]' : 'bg-gray-200'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{n.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); router.replace('/auth/login'); }}
          className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition">
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </div>
  );
}
