'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { getDoctorAnalyticsApi } from '@/lib/api/doctor.api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const navItems = [
  { label: 'Dashboard', href: '/doctor', icon: '' },
  { label: 'Analytics', href: '/doctor/analytics', icon: '' },
  { label: 'My Profile', href: '/doctor/profile', icon: '' },
  { label: 'Offices', href: '/doctor/offices', icon: '' },
  { label: 'Availability', href: '/doctor/availability', icon: '' },
  { label: 'Time Slots', href: '/doctor/timeslots', icon: '' },
  { label: 'Appointments', href: '/doctor/appointments', icon: '' },
];

const BLUE = '#2d6be4';
const BAR_FILL = '#dbeafe';
const BAR_STROKE = '#2d6be4';
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#dbeafe',
  Completed: '#e2e8f0',
  CANCELLED: '#f1f5f9',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="font-medium">{payload[0].name}</p>
      <p>{payload[0].value}</p>
    </div>
  );
};

export default function DoctorAnalyticsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['doctor-analytics'],
    queryFn: getDoctorAnalyticsApi,
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
    { label: 'Total Patients', value: summary.totalPatients },
    { label: 'Total Earnings', value: `₹${summary.totalEarnings}` },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">My Analytics</h1>
            <p className="text-xs text-gray-400">Your practice performance overview</p>
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
                      <Tooltip content={<CustomTooltip />} />
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
                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#f1f5f9'} stroke={entry.status === 'ACTIVE' ? BLUE : '#94a3b8'} strokeWidth={1} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} formatter={(value: any, name: any) => [value, name]} />
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
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Earnings per Month</h3>
                  <p className="text-xs text-gray-400 mb-4">Based on completed appointments (₹)</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data?.earningsPerMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} formatter={(v: any) => `₹${v}`} />
                      <Bar dataKey="amount" fill={BAR_FILL} stroke={BAR_STROKE} strokeWidth={1.5} radius={[6, 6, 0, 0]} name="Earnings (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Top Patients</h3>
                  <p className="text-xs text-gray-400 mb-4">By visit count</p>
                  {data?.topPatients?.length ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.topPatients} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={110} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill={BAR_FILL} stroke={BAR_STROKE} strokeWidth={1.5} radius={[0, 6, 6, 0]} name="Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No patients yet</div>
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
