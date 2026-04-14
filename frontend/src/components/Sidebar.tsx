'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { getDoctorProfileApi } from '@/lib/api/doctor.api';
import {
  LayoutDashboard, Users, Stethoscope, UserRound, CalendarDays,

  Building2, GraduationCap, Clock, MapPin, Search, LogOut, Lock, BarChart2,
  Bell
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useState,useEffect,useRef } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface Props {
  items: NavItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  '/admin': <LayoutDashboard size={16} />,
  '/admin/analytics': <BarChart2 size={16} />,
  '/admin/users': <Users size={16} />,
  '/admin/doctors': <Stethoscope size={16} />,
  '/admin/patients': <UserRound size={16} />,
  '/admin/appointments': <CalendarDays size={16} />,
  '/admin/hospitals': <Building2 size={16} />,
  '/admin/specializations': <GraduationCap size={16} />,
  '/doctor': <LayoutDashboard size={16} />,
  '/doctor/analytics': <BarChart2 size={16} />,
  '/doctor/profile': <UserRound size={16} />,
  '/doctor/offices': <Building2 size={16} />,
  '/doctor/availability': <CalendarDays size={16} />,
  '/doctor/timeslots': <Clock size={16} />,
  '/doctor/appointments': <CalendarDays size={16} />,
  '/patient': <LayoutDashboard size={16} />,
  '/patient/doctors': <Search size={16} />,
  '/patient/appointments': <CalendarDays size={16} />,
  '/patient/profile': <UserRound size={16} />,
};

const DOCTOR_PROTECTED = ['/doctor/offices', '/doctor/availability', '/doctor/timeslots', '/doctor/appointments'];

export default function Sidebar({ items }: Props) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const { data: profileRes } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: getDoctorProfileApi,
    enabled: user?.role === 'doctor',
    retry: false,
  });

  const doctor = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;
  const isVerified = doctor?.isVerified ?? false;

  const isLocked = (href: string) =>
    user?.role === 'doctor' && DOCTOR_PROTECTED.includes(href) && !isVerified;

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0 h-screen z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100">
        <div className="w-7 h-7 bg-[#2d6be4] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>
        <span className="text-base font-bold text-gray-900">MediCare</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 px-2">Menu</p>
        {items.map((item) => {
          const locked = isLocked(item.href);
          const icon = iconMap[item.href];
          const isActive = pathname === item.href;

          if (locked) {
            return (
              <div key={item.href} title="Available after verification"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 cursor-not-allowed select-none">
                <span className="text-gray-200"><Lock size={15} /></span>
                <span>{item.label}</span>
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-[#eef3ff] text-[#2d6be4]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
              <span className={isActive ? 'text-[#2d6be4]' : 'text-gray-400'}>{icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 bg-[#eef3ff] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#2d6be4] text-xs font-bold">{user?.email?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{user?.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.replace('/auth/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <span className="relative">
          <Bell size={16} className="text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
        <span>Notifications</span>
        {unreadCount > 0 && (
          <span className="ml-auto text-xs bg-red-100 text-red-500 font-semibold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
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
                <li
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 transition ${!n.isRead ? 'bg-[#f5f8ff]' : ''}`}
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-[#2d6be4]' : 'bg-gray-200'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
