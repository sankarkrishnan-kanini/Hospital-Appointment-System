'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { getDoctorProfileApi } from '@/lib/api/doctor.api';
import { useNotifications } from '@/hooks/useNotifications';
import {
  LayoutDashboard, Users, Stethoscope, UserRound, CalendarDays,
  Building2, GraduationCap, Clock, Search, Lock, Bell, BarChart2, LogOut,
} from 'lucide-react';

interface NavItem { label: string; href: string; icon: string; }
interface Props { items: NavItem[]; }

const iconMap: Record<string, React.ReactNode> = {
  '/admin':                  <LayoutDashboard size={16} />,
  '/admin/users':            <Users size={16} />,
  '/admin/doctors':          <Stethoscope size={16} />,
  '/admin/patients':         <UserRound size={16} />,
  '/admin/appointments':     <CalendarDays size={16} />,
  '/admin/hospitals':        <Building2 size={16} />,
  '/admin/specializations':  <GraduationCap size={16} />,
  '/doctor':                 <LayoutDashboard size={16} />,
  '/doctor/profile':         <UserRound size={16} />,
  '/doctor/offices':         <Building2 size={16} />,
  '/doctor/availability':    <CalendarDays size={16} />,
  '/doctor/timeslots':       <Clock size={16} />,
  '/doctor/appointments':    <CalendarDays size={16} />,
  '/patient':                <LayoutDashboard size={16} />,
  '/patient/doctors':        <Search size={16} />,
  '/patient/appointments':   <CalendarDays size={16} />,
  '/patient/profile':        <UserRound size={16} />,
};

const roleColor: Record<string, string> = {
  admin:   'bg-purple-50 text-purple-600',
  doctor:  'bg-green-50 text-green-600',
  patient: 'bg-pink-50 text-pink-600',
};

const activeColor: Record<string, string> = {
  admin:   'bg-purple-50 text-purple-700',
  doctor:  'bg-green-50 text-green-700',
  patient: 'bg-[#eef3ff] text-[#2d6be4]',
};

const activeIconColor: Record<string, string> = {
  admin:   'text-purple-600',
  doctor:  'text-green-600',
  patient: 'text-[#2d6be4]',
};

const DOCTOR_PROTECTED = ['/doctor/offices', '/doctor/availability', '/doctor/timeslots', '/doctor/appointments'];

export default function Sidebar({ items }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { data: profileRes } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: getDoctorProfileApi,
    enabled: user?.role === 'doctor',
    retry: false,
  });

  const doctor = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;
  const isVerified = doctor?.isVerified ?? false;
  const role = user?.role ?? 'patient';

  const isLocked = (href: string) =>
    role === 'doctor' && DOCTOR_PROTECTED.includes(href) && !isVerified;

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-100 shadow-sm z-50 flex items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${role}`} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2d6be4] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <span className="text-base font-bold text-[#2d6be4]">MediCare</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColor[role] ?? 'bg-gray-100 text-gray-600'}`}>
            {role}
          </span>

          {/* Email */}
          <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Logout */}
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed top-12 left-0 h-[calc(100vh-3rem)] z-40">
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const locked = isLocked(item.href);
            const icon = iconMap[item.href];
            const isActive = pathname === item.href;

            if (locked) {
              return (
                <div key={item.href} title="Available after verification"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 cursor-not-allowed select-none">
                  <Lock size={15} className="text-gray-200" />
                  <span>{item.label}</span>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? activeColor[role] : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <span className={isActive ? activeIconColor[role] : 'text-gray-400'}>{icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
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
      <button onClick={() => setOpen(o => !o)}
        className="relative p-1.5 rounded-lg hover:bg-gray-100 transition">
        <Bell size={16} className="text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
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
                    <p className={`text-sm leading-snug ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
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
