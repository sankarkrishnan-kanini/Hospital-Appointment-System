'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Users, Stethoscope, UserRound, CalendarDays, Building2, GraduationCap, ChevronRight } from 'lucide-react';
import { getAllUsersApi, getAllDoctorsApi, getAllAppointmentsApi, getAllPatientsApi, getPendingDoctorsApi } from '@/lib/api/admin.api';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '' },
  { label: 'Analytics', href: '/admin/analytics', icon: '' },
  { label: 'Users', href: '/admin/users', icon: '' },
  { label: 'Doctors', href: '/admin/doctors', icon: '' },
  { label: 'Patients', href: '/admin/patients', icon: '' },
  { label: 'Appointments', href: '/admin/appointments', icon: '' },
  { label: 'Hospitals', href: '/admin/hospitals', icon: '' },
  { label: 'Specializations', href: '/admin/specializations', icon: '' },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router]);

  const { data: usersRes } = useQuery({ queryKey: ['admin-users'], queryFn: getAllUsersApi, retry: false });
  const { data: doctorsRes } = useQuery({ queryKey: ['admin-doctors'], queryFn: getAllDoctorsApi, retry: false });
  const { data: patientsRes } = useQuery({ queryKey: ['admin-patients'], queryFn: getAllPatientsApi, retry: false });
  const { data: appointmentsRes } = useQuery({ queryKey: ['admin-appointments'], queryFn: getAllAppointmentsApi, retry: false });
  const { data: pendingRes } = useQuery({ queryKey: ['admin-pending'], queryFn: getPendingDoctorsApi, retry: false });

  if (!user) return null;

  const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
  const doctors = Array.isArray(doctorsRes?.data) ? doctorsRes.data : [];
  const patients = Array.isArray(patientsRes?.data) ? patientsRes.data : [];
  const appointments = Array.isArray(appointmentsRes?.data) ? appointmentsRes.data : [];
  const pending = Array.isArray(pendingRes?.data) ? pendingRes.data : [];

  const stats = [
    { label: 'Total Users', value: users.length, icon: <Users size={18} /> },
    { label: 'Total Doctors', value: doctors.length, icon: <Stethoscope size={18} /> },
    { label: 'Total Patients', value: patients.length, icon: <UserRound size={18} /> },
    { label: 'Appointments', value: appointments.length, icon: <CalendarDays size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full">Admin</span>
        </header>

        <div className="flex-1 p-6 space-y-5">
          <div className="bg-[#2d6be4] rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold">Welcome back, Admin</h2>
            <p className="text-blue-100 text-sm mt-1">Here is an overview of your hospital system.</p>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Pending Verifications</h3>
                <Link href="/admin/doctors" className="text-xs text-[#2d6be4] hover:underline">View all</Link>
              </div>
              {!pending.length ? (
                <p className="text-sm text-gray-400">No pending verifications</p>
              ) : (
                <div className="space-y-2">
                  {pending.slice(0, 4).map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <Stethoscope size={14} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Dr. {doc.firstName} {doc.lastName}</p>
                          <p className="text-xs text-gray-400">ID #{doc.id}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-1">
                {[
                  { label: 'Manage Doctors', href: '/admin/doctors', icon: <Stethoscope size={15} /> },
                  { label: 'Manage Patients', href: '/admin/patients', icon: <UserRound size={15} /> },
                  { label: 'View Appointments', href: '/admin/appointments', icon: <CalendarDays size={15} /> },
                  { label: 'Manage Hospitals', href: '/admin/hospitals', icon: <Building2 size={15} /> },
                  { label: 'Specializations', href: '/admin/specializations', icon: <GraduationCap size={15} /> },
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
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Recent Appointments</h3>
              <Link href="/admin/appointments" className="text-xs text-[#2d6be4] hover:underline">View all</Link>
            </div>
            {!appointments.length ? (
              <p className="text-sm text-gray-400">No appointments yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.slice(0, 5).map((apt: any) => (
                    <tr key={apt.id}>
                      <td className="py-3 text-gray-500">#{apt.id}</td>
                      <td className="py-3 text-gray-500">{new Date(apt.appointmentTakenDate).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {apt.status?.status ?? 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
