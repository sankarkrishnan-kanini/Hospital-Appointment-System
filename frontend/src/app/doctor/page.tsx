'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { CalendarDays, Building2, GraduationCap, FileText, UserRound, Clock, ChevronRight } from 'lucide-react';
import { getDoctorProfileApi, getDoctorAppointmentsApi, getDoctorOfficesApi } from '@/lib/api/doctor.api';

const navItems = [
  { label: 'Dashboard', href: '/doctor', icon: '' },
  { label: 'Analytics', href: '/doctor/analytics', icon: '' },
  { label: 'My Profile', href: '/doctor/profile', icon: '' },
  { label: 'Offices', href: '/doctor/offices', icon: '' },
  { label: 'Availability', href: '/doctor/availability', icon: '' },
  { label: 'Time Slots', href: '/doctor/timeslots', icon: '' },
  { label: 'Appointments', href: '/doctor/appointments', icon: '' },
];

export default function DoctorDashboard() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: profileRes, isLoading } = useQuery({ queryKey: ['doctor-profile'], queryFn: getDoctorProfileApi, retry: false });
  const { data: appointmentsRes } = useQuery({ queryKey: ['doctor-appointments'], queryFn: getDoctorAppointmentsApi, retry: false });
  const { data: officesRes } = useQuery({ queryKey: ['doctor-offices'], queryFn: getDoctorOfficesApi, retry: false });

  if (!_hasHydrated || !user) return null;

  const doctor = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;
  const appointments = Array.isArray(appointmentsRes?.data) ? appointmentsRes.data : [];
  const offices = Array.isArray(officesRes?.data) ? officesRes.data : [];
  const isProfileSetup = !!doctor?.firstName;
  const isVerified = doctor?.isVerified;
  const verificationRequested = doctor?.verificationRequested;

  if (!isLoading && (!isProfileSetup || (!isVerified && verificationRequested))) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar items={navItems} />
        <main className="flex-1 flex flex-col ml-60">
          <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
            <NotificationBell />
          </header>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md w-full">
              {!isProfileSetup ? (
                <>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserRound size={24} className="text-[#2d6be4]" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Complete Your Profile</h2>
                  <p className="text-gray-400 text-sm mt-2 mb-6">Set up your profile to access the dashboard.</p>
                  <Link href="/doctor/profile"
                    className="bg-[#2d6be4] text-white font-medium px-8 py-2.5 rounded-xl hover:bg-blue-700 transition inline-block text-sm">
                    Setup Profile
                  </Link>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} className="text-amber-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Verification Pending</h2>
                  <p className="text-gray-400 text-sm mt-2">Your profile has been submitted for admin verification.</p>
                  <p className="text-gray-400 text-xs mt-1">Once approved, you will get full access.</p>
                  <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Dr. {doctor?.firstName} {doctor?.lastName}</p>
                    <p className="text-xs text-gray-400 mt-1">Documents uploaded: {doctor?.documentCount}</p>
                    <p className="text-xs text-amber-600 mt-1">Status: Awaiting admin approval</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: <CalendarDays size={18} /> },
    { label: 'Offices / Hospitals', value: offices.length, icon: <Building2 size={18} /> },
    { label: 'Specializations', value: Array.isArray(doctor?.specializations) ? doctor.specializations.length : 0, icon: <GraduationCap size={18} /> },
    { label: 'Qualifications', value: Array.isArray(doctor?.qualifications) ? doctor.qualifications.length : 0, icon: <FileText size={18} /> },
  ];

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
            <h2 className="text-lg font-semibold">Welcome, Dr. {doctor?.firstName} {doctor?.lastName}</h2>
            <p className="text-blue-100 text-sm mt-1">Manage your practice and appointments.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-9 h-9 bg-[#eef3ff] text-[#2d6be4] rounded-lg flex items-center justify-center mb-3">{s.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-1">
                {[
                  { label: 'Edit Profile', href: '/doctor/profile', icon: <UserRound size={15} /> },
                  { label: 'Manage Offices', href: '/doctor/offices', icon: <Building2 size={15} /> },
                  { label: 'Set Availability', href: '/doctor/availability', icon: <CalendarDays size={15} /> },
                  { label: 'Generate Time Slots', href: '/doctor/timeslots', icon: <Clock size={15} /> },
                ].map((a) => (
                  <Link key={a.label} href={a.href}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition group">
                    <div className="w-7 h-7 bg-[#eef3ff] text-[#2d6be4] rounded-lg flex items-center justify-center">{a.icon}</div>
                    <span className="text-sm text-gray-700 group-hover:text-[#2d6be4] transition">{a.label}</span>
                    <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-[#2d6be4]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Upcoming Appointments</h3>
                <Link href="/doctor/appointments" className="text-xs text-[#2d6be4] hover:underline">View all</Link>
              </div>
              {!appointments.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED').length ? (
                <p className="text-sm text-gray-400">No upcoming appointments</p>
              ) : (
                <div className="space-y-2">
                  {appointments
                    .filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED')
                    .slice(0, 4)
                    .map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {apt.client ? `${apt.client.firstName} ${apt.client.lastName}` : `Appointment #${apt.id}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {apt.status?.status ?? 'Scheduled'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
