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
  ChevronRight, Activity, MessageCircle,
} from 'lucide-react';

interface NavItem { label: string; href: string; icon: string; }
interface Props { items: NavItem[]; }

const iconMap: Record<string, React.ReactNode> = {
  '/admin':                  <LayoutDashboard size={18} />,
  '/admin/users':            <Users size={18} />,
  '/admin/doctors':          <Stethoscope size={18} />,
  '/admin/patients':         <UserRound size={18} />,
  '/admin/appointments':     <CalendarDays size={18} />,
  '/admin/hospitals':        <Building2 size={18} />,
  '/admin/specializations':  <GraduationCap size={18} />,
  '/admin/analytics':        <BarChart2 size={18} />,
  '/doctor':                 <LayoutDashboard size={18} />,
  '/doctor/profile':         <UserRound size={18} />,
  '/doctor/offices':         <Building2 size={18} />,
  '/doctor/availability':    <CalendarDays size={18} />,
  '/doctor/timeslots':       <Clock size={18} />,
  '/doctor/appointments':    <CalendarDays size={18} />,
  '/doctor/analytics':       <BarChart2 size={18} />,
  '/doctor/chat':            <MessageCircle size={18} />,
  '/patient':                <LayoutDashboard size={18} />,
  '/patient/doctors':        <Search size={18} />,
  '/patient/appointments':   <CalendarDays size={18} />,
  '/patient/chat':           <MessageCircle size={18} />,
  '/patient/profile':        <UserRound size={18} />,
};

const ROLE_THEME: Record<string, { gradient: string; accent: string; accentLight: string; badge: string; glow: string }> = {
  admin:   { gradient: 'from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]', accent: '#7c3aed', accentLight: 'rgba(124,58,237,0.12)', badge: 'bg-purple-500/20 text-purple-300', glow: 'shadow-purple-500/20' },
  doctor:  { gradient: 'from-[#022c22] via-[#064e3b] to-[#022c22]', accent: '#10b981', accentLight: 'rgba(16,185,129,0.12)', badge: 'bg-emerald-500/20 text-emerald-300', glow: 'shadow-emerald-500/20' },
  patient: { gradient: 'from-[#0c1929] via-[#172554] to-[#0c1929]', accent: '#3b82f6', accentLight: 'rgba(59,130,246,0.12)', badge: 'bg-blue-500/20 text-blue-300', glow: 'shadow-blue-500/20' },
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
  const theme = ROLE_THEME[role] ?? ROLE_THEME.patient;

  const isLocked = (href: string) =>
    role === 'doctor' && DOCTOR_PROTECTED.includes(href) && !isVerified;

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <>
      {/* ── TOP NAVBAR — Dark premium matching sidebar ── */}
      <header className={`fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-5 bg-gradient-to-r ${theme.gradient} border-b border-white/10 shadow-lg`}>
        {/* Decorative subtle glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 left-1/4 w-60 h-20 rounded-full opacity-15" style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }} />
          <div className="absolute -top-10 right-1/4 w-40 h-16 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }} />
        </div>

        {/* Logo */}
        <Link href={`/${role}`} className="relative flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-200 group-hover:scale-105 group-hover:bg-white/20"
            style={{ boxShadow: `0 4px 14px ${theme.accent}30` }}>
            <Activity size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none tracking-tight">MediCare</span>
            <span className="text-[10px] text-white/50 font-medium capitalize">{role} Portal</span>
          </div>
        </Link>

        {/* Right side */}
        <div className="relative flex items-center gap-2">
          {/* Email chip */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: theme.accent }}>
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className="text-xs text-white/80 font-medium max-w-[140px] truncate">{user?.email}</span>
          </div>

          {/* Notification Bell */}
          <NotificationBell accentColor={theme.accent} />

          {/* Logout */}
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-red-300 hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200">
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── SIDEBAR — Dark premium ── */}
      <aside className={`w-60 flex flex-col fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-40 bg-gradient-to-b ${theme.gradient}`}>
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-full h-32 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }} />
        </div>
        <div className="absolute bottom-0 right-0 w-full h-24 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto relative z-10">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-3">Navigation</p>
          {items.map((item) => {
            const locked = isLocked(item.href);
            const icon = iconMap[item.href];
            const isActive = pathname === item.href;

            if (locked) {
              return (
                <div key={item.href} title="Available after verification"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/20 cursor-not-allowed select-none">
                  <Lock size={16} />
                  <span>{item.label}</span>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${isActive
                    ? 'text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                style={isActive ? { backgroundColor: theme.accentLight, boxShadow: `0 4px 16px ${theme.accent}20` } : {}}>
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full" style={{ backgroundColor: theme.accent }} />
                )}
                <span className={`transition-colors duration-200 ${isActive ? '' : 'text-white/40 group-hover:text-white/80'}`}
                  style={isActive ? { color: theme.accent } : {}}>
                  {icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} className="text-white/40" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user card */}
        <div className="relative z-10 px-3 pb-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}aa)` }}>
                {user?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/90 truncate">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${theme.badge}`}>
                {role}
              </span>
              {role === 'doctor' && isVerified && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function NotificationBell({ accentColor }: { accentColor?: string }) {
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
        className="relative p-2 rounded-xl hover:bg-white/10 transition-all duration-200">
        <Bell size={16} className="text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center text-white animate-pulse"
            style={{ backgroundColor: accentColor ?? '#3b82f6' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <span className="font-semibold text-gray-800 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs hover:underline font-medium" style={{ color: accentColor ?? '#3b82f6' }}>
                Mark all read
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
