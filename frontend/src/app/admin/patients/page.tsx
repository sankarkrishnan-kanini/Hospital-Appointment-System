'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getAllPatientsApi, getPatientByIdApi } from '@/lib/api/admin.api';
import { X, CalendarDays, Search } from 'lucide-react';
import AdminTopBar from '@/components/AdminTopBar';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Doctors', href: '/admin/doctors', icon: '🩺' },
  { label: 'Patients', href: '/admin/patients', icon: '🧑‍⚕️' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Hospitals', href: '/admin/hospitals', icon: '🏥' },
  { label: 'Specializations', href: '/admin/specializations', icon: '🎓' },
];

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  Completed: 'bg-blue-100 text-blue-700',
};

function PatientDetailModal({ patientId, onClose }: { patientId: number; onClose: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-patient', patientId],
    queryFn: () => getPatientByIdApi(patientId),
  });
  const patient = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Patient Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
          </div>
        ) : !patient ? (
          <p className="text-center text-gray-400 py-10 text-sm">Failed to load patient details.</p>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">
                {patient.firstName?.[0]}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{patient.firstName} {patient.lastName}</p>
                <p className="text-sm text-gray-400">{patient.email}</p>
                <p className="text-sm text-gray-400">{patient.contactNumber}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={14} className="text-[#2d6be4]" />
                <p className="text-sm font-semibold text-gray-700">Appointments ({patient.appointments?.length ?? 0})</p>
              </div>
              {!patient.appointments?.length ? (
                <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">No appointments yet</p>
              ) : (
                <div className="space-y-3">
                  {patient.appointments.map((apt: any) => (
                    <div key={apt.id} className="bg-gray-50 rounded-xl p-4 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Dr. {apt.doctorHospital?.doctor?.firstName} {apt.doctorHospital?.doctor?.lastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {apt.doctorHospital?.hospital?.name ?? 'Private Practice'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}
                        </p>
                        {apt.cancellationReason && (
                          <p className="text-xs text-red-400 mt-1">Reason: {apt.cancellationReason}</p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[apt.status?.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {apt.status?.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPatientsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [joinFrom, setJoinFrom] = useState('');
  const [joinTo, setJoinTo] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-patients'],
    queryFn: getAllPatientsApi,
    retry: false,
  });

  if (!_hasHydrated || !user) return null;

  const patients = Array.isArray(res?.data) ? res.data : [];
  const filtered = patients.filter((p: any) => {
    if (search && !`${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'active' && !p.isActive) return false;
    if (statusFilter === 'inactive' && p.isActive) return false;
    if (joinFrom && p.createdAt && new Date(p.createdAt) < new Date(joinFrom)) return false;
    if (joinTo && p.createdAt && new Date(p.createdAt) > new Date(joinTo + 'T23:59:59')) return false;
    return true;
  });
  const resetFilters = () => { setSearch(''); setStatusFilter('all'); setJoinFrom(''); setJoinTo(''); };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-12">
      <AdminTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Patients</h1>
            <p className="text-xs text-gray-400">All registered patients</p>
          </div>
          <span className="text-xs bg-pink-100 text-pink-600 font-semibold px-3 py-1 rounded-full">
            {patients.length} Total
          </span>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search by name or email..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400" />
              {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>}
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white cursor-pointer hover:border-gray-300 transition min-w-[130px]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 whitespace-nowrap">Joined from</label>
              <input type="date" value={joinFrom} onChange={e => setJoinFrom(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 whitespace-nowrap">to</label>
              <input type="date" value={joinTo} onChange={e => setJoinTo(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] cursor-pointer" />
            </div>
            {(search || statusFilter !== 'all' || joinFrom || joinTo) && (
              <button onClick={resetFilters} className="text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition">Reset</button>
            )}
            <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              </div>
            ) : !filtered.length ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🧑‍⚕️</p>
                <p className="text-gray-400 text-sm">No patients found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Patient</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Appointments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p: any, i: number) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedPatientId(p.id)}>
                      <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">
                            {p.firstName?.[0] ?? '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{p.firstName} {p.lastName}</p>
                            <p className="text-xs text-gray-400">ID: #{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.email}</td>
                      <td className="px-6 py-4 text-gray-500">{p.contactNumber ?? '—'}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                          {p.appointments?.length ?? 0} appointments
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

      {selectedPatientId !== null && (
        <PatientDetailModal patientId={selectedPatientId} onClose={() => setSelectedPatientId(null)} />
      )}
    </div>
  );
}
