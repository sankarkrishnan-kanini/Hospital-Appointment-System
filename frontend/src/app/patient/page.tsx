'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { Search, CalendarDays, UserRound, CalendarPlus } from 'lucide-react';
import { getPatientAppointmentsApi, getClientAccountApi } from '@/lib/api/patient.api';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'My Profile', href: '/patient/profile', icon: '' },
];

export default function PatientDashboard() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'patient') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: profileRes } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: getClientAccountApi,
    retry: false,
  });

  const { data: appointmentsRes } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: getPatientAppointmentsApi,
    retry: false,
  });

  if (!_hasHydrated || !user) return null;

  const profile = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;
  const allApts = Array.isArray(appointmentsRes?.data) ? appointmentsRes.data : [];
  const upcoming = allApts.filter((a: any) => a.status?.status !== 'Completed');
  const completed = allApts.filter((a: any) => a.status?.status === 'Completed');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <NotificationBell />
        </header>

        <div className="flex-1 p-6 space-y-5">
          <div className="bg-[#2d6be4] rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-blue-100 text-sm mt-1">{user.email}</p>
          </div>

      
          {profileRes && !profile && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800">Complete your profile to book appointments</p>
                <p className="text-xs text-amber-600 mt-0.5">You need a patient profile before you can book.</p>
              </div>
              <Link href="/patient/profile"
                className="text-xs font-semibold bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition whitespace-nowrap">
                Setup Now →
              </Link>
            </div>
          )}

        
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link href="/patient/doctors"
              className="bg-[#2d6be4] hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center gap-4 transition">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CalendarPlus size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm">Book Appointment</p>
                <p className="text-blue-100 text-xs mt-0.5">Find &amp; book a doctor</p>
              </div>
            </Link>

            <Link href="/patient/doctors"
              className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition shadow-sm">
              <div className="w-10 h-10 bg-[#eef3ff] rounded-xl flex items-center justify-center">
                <Search size={18} className="text-[#2d6be4]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Find a Doctor</p>
                <p className="text-gray-400 text-xs mt-0.5">Search by specialization</p>
              </div>
            </Link>

            <Link href="/patient/appointments"
              className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition shadow-sm">
              <div className="w-10 h-10 bg-[#eef3ff] rounded-xl flex items-center justify-center">
                <CalendarDays size={18} className="text-[#2d6be4]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">My Appointments</p>
                <p className="text-gray-400 text-xs mt-0.5">{allApts.length} total</p>
              </div>
            </Link>

            <Link href="/patient/profile"
              className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition shadow-sm">
              <div className="w-10 h-10 bg-[#eef3ff] rounded-xl flex items-center justify-center">
                <UserRound size={18} className="text-[#2d6be4]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">My Profile</p>
                <p className="text-gray-400 text-xs mt-0.5">View and edit</p>
              </div>
            </Link>
          </div>

          
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Upcoming', value: upcoming.length },
              { label: 'Completed', value: completed.length },
              { label: 'Total', value: allApts.length },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Recent Appointments</h3>
              <Link href="/patient/appointments" className="text-xs text-[#2d6be4] hover:underline">View all</Link>
            </div>
            {!allApts.length ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No appointments yet</p>
                <Link href="/patient/doctors"
                  className="mt-3 inline-block text-sm text-[#2d6be4] font-medium hover:underline">
                  Book your first appointment →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {allApts.slice(0, 5).map((apt: any) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Appointment #{apt.id}</p>
                      <p className="text-xs text-gray-400">{new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#eef3ff] text-[#2d6be4]">
                      {apt.status?.status ?? 'Scheduled'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
