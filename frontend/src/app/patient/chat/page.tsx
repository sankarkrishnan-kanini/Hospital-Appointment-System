'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import LiveChat from '@/components/LiveChat';
import ChatBot from '@/components/ChatBot';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'Messages', href: '/patient/chat', icon: '' },
  { label: 'My Profile', href: '/patient/profile', icon: '' },
];

export default function PatientChatPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'patient') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  if (!_hasHydrated || !user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <LiveChat role="patient" />
        </div>
      </main>
      <ChatBot role="patient" userName={user.email?.split('@')[0] ?? 'Patient'} />
    </div>
  );
}
