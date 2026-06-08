'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Search, CalendarDays, UserRound, CalendarPlus, Bell, RotateCcw, Clock } from 'lucide-react';
import { getPatientAppointmentsApi, getClientAccountApi } from '@/lib/api/patient.api';
import ChatBot from '@/components/ChatBot';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'Messages', href: '/patient/chat', icon: '' },
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
  const upcoming = allApts.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED');
  const completed = allApts.filter((a: any) => a.status?.status === 'Completed');

  // ── Feature #7: Reminder Banner ──────────────────────────────────────────────
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const reminderApt = upcoming
    .filter((a: any) => {
      const t = new Date(a.probableStartTime);
      return t >= now && t <= in24h;
    })
    .sort((a: any, b: any) => new Date(a.probableStartTime).getTime() - new Date(b.probableStartTime).getTime())[0];

  // ── Feature #9: Re-book Last Doctor ──────────────────────────────────────────
  const lastCompleted = completed
    .sort((a: any, b: any) => new Date(b.probableStartTime).getTime() - new Date(a.probableStartTime).getTime())[0];
  const rebookDoctor = lastCompleted?.doctorHospital?.doctor;

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString('en-GB', {
      timeZone: 'UTC', weekday: 'short', day: 'numeric',
      month: 'short', hour: '2-digit', minute: '2-digit',
    });

  const hoursUntil = reminderApt
    ? Math.round((new Date(reminderApt.probableStartTime).getTime() - now.getTime()) / 3600000)
    : 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex pt-14">
        <Sidebar items={navItems} />
        <main className="flex-1 flex flex-col ml-60">

          <div className="flex-1 p-6 space-y-4">

            {/* ── Profile incomplete warning ── */}
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

            {/* ── Feature #7: Reminder Banner ── */}
            {reminderApt && (
              <div className="relative overflow-hidden bg-gradient-to-r from-[#2d6be4] to-[#1a4fc4] rounded-2xl p-5 flex items-center justify-between shadow-lg">
                {/* decorative ring */}
                <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
                <div className="flex items-center gap-4 relative">
                  <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bell size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {hoursUntil === 0 ? '⏰ Your appointment is very soon!' : `⏰ Appointment in ~${hoursUntil}h`}
                    </p>
                    <p className="text-blue-100 text-xs mt-0.5">
                      Dr. {reminderApt.doctorHospital?.doctor?.firstName} {reminderApt.doctorHospital?.doctor?.lastName}
                      {' · '}{formatTime(reminderApt.probableStartTime)}
                    </p>
                  </div>
                </div>
                <Link href="/patient/appointments"
                  className="relative text-xs font-semibold bg-white text-[#2d6be4] px-4 py-2 rounded-xl hover:bg-blue-50 transition whitespace-nowrap flex-shrink-0">
                  View Details
                </Link>
              </div>
            )}

            {/* ── Quick action cards ── */}
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

            {/* ── Stats + Re-book row ── */}
            <div className="grid grid-cols-4 gap-4">
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

              {/* ── Feature #9: Re-book Last Doctor ── */}
              {rebookDoctor ? (
                <Link
                  href={`/patient/doctors?rebookDoctorId=${lastCompleted.doctorHospital?.doctor?.id ?? ''}`}
                  className="bg-white border border-[#2d6be4]/20 rounded-xl shadow-sm p-5 flex items-center gap-3 hover:bg-[#eef3ff] transition group"
                >
                  <div className="w-10 h-10 bg-[#eef3ff] group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 transition">
                    <RotateCcw size={16} className="text-[#2d6be4]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2d6be4] truncate">Book Again</p>
                    <p className="text-xs text-gray-500 truncate">Dr. {rebookDoctor.firstName} {rebookDoctor.lastName}</p>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <p className="text-2xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-400 mt-1">Re-book</p>
                </div>
              )}
            </div>

            {/* ── Recent Appointments ── */}
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
                  {allApts.slice(0, 5).map((apt: any) => {
                    const doc = apt.doctorHospital?.doctor;
                    const status = apt.status?.status ?? 'Scheduled';
                    const statusCls =
                      status === 'Completed' ? 'bg-green-50 text-green-600' :
                      status === 'CANCELLED' ? 'bg-red-50 text-red-500' :
                      'bg-[#eef3ff] text-[#2d6be4]';
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                            <Clock size={13} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {doc ? `Dr. ${doc.firstName} ${doc.lastName}` : `Appointment #${apt.id}`}
                            </p>
                            <p className="text-xs text-gray-400">{new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusCls}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <ChatBot role="patient" userName={profile ? `${profile.firstName}` : user.email} />
    </>
  );
}
