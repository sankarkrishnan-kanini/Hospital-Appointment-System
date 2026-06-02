'use client';
import { useAuthStore } from '@/store/auth.store';
import { ShieldCheck } from 'lucide-react';

export default function AdminBanner() {
  const { user } = useAuthStore();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gradient-to-r from-[#1a4fc4] to-[#2d6be4] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{user?.email}</p>
          <p className="text-blue-200 text-xs">Administrator · MediCare System</p>
        </div>
      </div>
      <p className="text-blue-200 text-xs hidden sm:block">{dateStr}</p>
    </div>
  );
}
