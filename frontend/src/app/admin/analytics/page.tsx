'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { getAnalyticsApi } from '@/lib/api/admin.api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

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

const BLUE = '#2d6be4';
const BAR_FILL = '#dbeafe';
const BAR_STROKE = '#2d6be4';

export default function AdminAnalyticsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: getAnalyticsApi,
    retry: false,
  });

  if (!_hasHydrated || !user) return null;

  const data = res?.data;
  const summary = data?.summary;

  const summaryCards = summary ? [
    { label: 'Total Appointments', value: summary.totalAppointments },
    { label: 'Completed', value: summary.completedAppointments },
    { label: 'Cancelled', value: summary.cancelledAppointments },
    { label: 'Cancellation Rate', value: `${summary.cancellationRate}%` },
    { label: 'Verified Doctors', value: `${summary.verifiedDoctors}/${summary.totalDoctors}` },
    { label: 'Total Patients', value: summary.totalPatients },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Analytics</h1>
            <p className="text-xs text-gray-400">System-wide insights and statistics</p>
          </div>
          <NotificationBell />
        </header>

        <div className="flex-1 p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2d6be4]" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {summaryCards.map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Appointments per Month</h3>
                  <p className="text-xs text-gray-400 mb-4">Last 6 months trend</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data?.appointmentsPerMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke={BLUE} strokeWidth={2} dot={{ r: 3, fill: '#fff', stroke: BLUE, strokeWidth: 2 }} name="Appointments" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Appointment Status</h3>
                  <p className="text-xs text-gray-400 mb-4">Overall breakdown</p>
                  {data?.statusBreakdown?.length ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={data.statusBreakdown}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          label={false}
                        >
                          {data.statusBreakdown.map((entry: any) => (
                            <Cell key={entry.status} fill={entry.status === 'ACTIVE' ? '#dbeafe' : entry.status === 'Completed' ? '#e2e8f0' : '#f1f5f9'} stroke={entry.status === 'ACTIVE' ? BLUE : '#94a3b8'} strokeWidth={1} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any, name: any) => [value, name]} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          formatter={(value, entry: any) => (
                            <span className="text-xs text-gray-600">{value} ({entry.payload.count})</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Top Doctors</h3>
                  <p className="text-xs text-gray-400 mb-4">By appointment count</p>
                  {data?.topDoctors?.length ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.topDoctors}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill={BAR_FILL} stroke={BAR_STROKE} strokeWidth={1.5} radius={[6, 6, 0, 0]} name="Appointments" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No appointments yet</div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Top Specializations</h3>
                  <p className="text-xs text-gray-400 mb-4">Most booked specializations</p>
                  {data?.topSpecializations?.length ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.topSpecializations}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill={BAR_FILL} stroke={BAR_STROKE} strokeWidth={1.5} radius={[6, 6, 0, 0]} name="Bookings" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No appointments yet</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
