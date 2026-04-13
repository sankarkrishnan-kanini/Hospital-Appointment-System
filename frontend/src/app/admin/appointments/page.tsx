'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getAllAppointmentsApi } from '@/lib/api/admin.api';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Doctors', href: '/admin/doctors', icon: '🩺' },
  { label: 'Patients', href: '/admin/patients', icon: '🧑⚕️' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Hospitals', href: '/admin/hospitals', icon: '🏥' },
  { label: 'Specializations', href: '/admin/specializations', icon: '🎓' },
];

const statusColor: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

export default function AdminAppointmentsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: getAllAppointmentsApi,
    retry: false,
  });

  if (!user) return null;

  const appointments = Array.isArray(res?.data) ? res.data : [];
  const filtered = appointments.filter((a: any) =>
    String(a.id).includes(search) ||
    a.status?.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Appointments</h1>
            <p className="text-xs text-gray-400">All appointments in the system</p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full">
            {appointments.length} Total
          </span>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Scheduled', value: appointments.filter((a: any) => a.status?.status === 'Scheduled').length, color: 'bg-blue-50 text-blue-600' },
              { label: 'Completed', value: appointments.filter((a: any) => a.status?.status === 'Completed').length, color: 'bg-green-50 text-green-600' },
              { label: 'Cancelled', value: appointments.filter((a: any) => a.status?.status === 'Cancelled').length, color: 'bg-red-50 text-red-600' },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by ID or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              </div>
            ) : !filtered.length ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-gray-400 text-sm">No appointments found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Patient</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Start Time</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-700">#{a.id}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {a.client ? `${a.client.firstName} ${a.client.lastName}` : `Patient #${a.userAccountId}`}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(a.appointmentTakenDate).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(a.probableStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{a.durationInMinutes} min</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[a.status?.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {a.status?.status ?? 'Unknown'}
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
