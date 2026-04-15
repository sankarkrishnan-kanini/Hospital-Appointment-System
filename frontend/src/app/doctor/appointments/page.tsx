'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DoctorTopBar from '@/components/DoctorTopBar';
import { CheckCircle, CalendarDays } from 'lucide-react';
import { getDoctorAppointmentsApi, completeAppointmentApi } from '@/lib/api/doctor.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/doctor', icon: '' },
  { label: 'My Profile', href: '/doctor/profile', icon: '' },
  { label: 'Offices', href: '/doctor/offices', icon: '' },
  { label: 'Availability', href: '/doctor/availability', icon: '' },
  { label: 'Time Slots', href: '/doctor/timeslots', icon: '' },
  { label: 'Appointments', href: '/doctor/appointments', icon: '' },
];

export default function DoctorAppointmentsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: getDoctorAppointmentsApi,
    retry: false,
  });

  const { mutate: complete } = useMutation({
    mutationFn: completeAppointmentApi,
    onSuccess: () => {
      toast.success('Appointment marked as completed');
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to complete'),
  });

  if (!_hasHydrated || !user) return null;

  const all = Array.isArray(res?.data) ? res.data : [];
  const filtered = filter === 'upcoming'
    ? all.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED')
    : filter === 'completed'
    ? all.filter((a: any) => a.status?.status === 'Completed')
    : all;

  return (
    <div className="min-h-screen bg-gray-50 flex pt-12">
      <DoctorTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-12 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Appointments</h1>
            <p className="text-xs text-gray-400">Manage your patient appointments</p>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total', value: all.length, border: 'border-l-gray-400' },
              { label: 'Upcoming', value: all.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED').length, border: 'border-l-blue-500' },
              { label: 'Completed', value: all.filter((a: any) => a.status?.status === 'Completed').length, border: 'border-l-green-500' },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.border} shadow-sm p-5`}>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize
                  ${filter === f ? 'bg-[#2d6be4] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              </div>
            ) : !filtered.length ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CalendarDays size={20} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No appointments found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Patient</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((apt: any) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-500">#{apt.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          {apt.client ? `${apt.client.firstName} ${apt.client.lastName}` : `Patient #${apt.userAccountId}`}
                        </p>
                        <p className="text-xs text-gray-400">{apt.client?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{apt.durationInMinutes} min</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${apt.status?.status === 'Completed' ? 'bg-green-50 text-green-600'
                          : apt.status?.status === 'CANCELLED' ? 'bg-red-50 text-red-600'
                          : 'bg-blue-50 text-blue-600'}`}>
                          {apt.status?.status ?? 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {apt.status?.status !== 'Completed' && apt.status?.status !== 'CANCELLED' && (
                          <button onClick={() => complete(apt.id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition">
                            <CheckCircle size={13} /> Complete
                          </button>
                        )}
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
