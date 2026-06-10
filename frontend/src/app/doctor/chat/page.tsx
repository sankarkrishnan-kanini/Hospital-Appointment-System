'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import LiveChat from '@/components/LiveChat';
import ChatBot from '@/components/ChatBot';

const navItems = [
  { label: 'Dashboard', href: '/doctor', icon: '' },
  { label: 'Analytics', href: '/doctor/analytics', icon: '' },
  { label: 'My Profile', href: '/doctor/profile', icon: '' },
  { label: 'Offices', href: '/doctor/offices', icon: '' },
  { label: 'Availability', href: '/doctor/availability', icon: '' },
  { label: 'Time Slots', href: '/doctor/timeslots', icon: '' },
  { label: 'Appointments', href: '/doctor/appointments', icon: '' },
  { label: 'Messages', href: '/doctor/chat', icon: '' },
];

export default function DoctorChatPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  if (!_hasHydrated || !user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <LiveChat role="doctor" />
        </div>
      </main>
      <ChatBot role="doctor" userName={`Dr. ${user.email?.split('@')[0] ?? 'Doctor'}`} />
    </div>
  );
}
