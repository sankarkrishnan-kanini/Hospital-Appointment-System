'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { getDoctorProfileApi } from '@/lib/api/doctor.api';
import {
  LayoutDashboard, Users, Stethoscope, UserRound, CalendarDays,
  Building2, GraduationCap, Clock, MapPin, Search, LogOut, Lock
} from 'lucide-react';

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
  '/admin/users': <Users size={16} />,
  '/admin/doctors': <Stethoscope size={16} />,
  '/admin/patients': <UserRound size={16} />,
  '/admin/appointments': <CalendarDays size={16} />,
  '/admin/hospitals': <Building2 size={16} />,
  '/admin/specializations': <GraduationCap size={16} />,
  '/doctor': <LayoutDashboard size={16} />,
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
