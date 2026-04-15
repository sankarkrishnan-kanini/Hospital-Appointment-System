'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getAllUsersApi, activateUserApi, deactivateUserApi, getUserDetailApi, viewDoctorDocumentApi, verifyDoctorApi } from '@/lib/api/admin.api';
import toast from 'react-hot-toast';
import { X, Stethoscope, GraduationCap, FileText, Eye, CalendarDays, CheckCircle, Search } from 'lucide-react';
import AdminTopBar from '@/components/AdminTopBar';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
  { label: 'Analytics', href: '/admin/analytics', icon: '' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Doctors', href: '/admin/doctors', icon: '🩺' },
  { label: 'Patients', href: '/admin/patients', icon: '🧑⚕️' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Hospitals', href: '/admin/hospitals', icon: '🏥' },
  { label: 'Specializations', href: '/admin/specializations', icon: '🎓' },
];

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  Completed: 'bg-blue-100 text-blue-700',
};

function UserDetailModal({ userId, onClose, onVerify, verifying }: { userId: number; onClose: () => void; onVerify: (id: number) => void; verifying: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-user-detail', userId],
    queryFn: () => getUserDetailApi(userId),
  });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const detail = data?.data;

  const handleViewDoc = async (docId: number) => {
    if (!detail) return;
    setPdfLoading(true);
    try {
      const res = await viewDoctorDocumentApi(detail.id, docId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
    } catch { toast.error('Failed to load document'); }
    finally { setPdfLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl mx-4 h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {detail?.role === 'doctor' ? 'Doctor Details' : 'Patient Details'}
          </h2>
          <button onClick={() => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); onClose(); }} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
          </div>
        ) : !detail ? (
          <p className="text-center text-gray-400 py-10 text-sm">Profile not set up yet.</p>
        ) : detail.role === 'doctor' ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Left — doctor info */}
            <div className="w-80 flex-shrink-0 border-r border-gray-100 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-xl">
                  {detail.firstName?.[0]}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Dr. {detail.firstName} {detail.lastName}</p>
                  {detail.professionalStatement && <p className="text-xs text-gray-500 mt-0.5">{detail.professionalStatement}</p>}
                  {detail.practicingFrom && <p className="text-xs text-gray-400">Since {new Date(detail.practicingFrom).getFullYear()}</p>}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-1 inline-block ${detail.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {detail.isVerified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>

              {detail.specializations?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><Stethoscope size={13} className="text-[#2d6be4]" /><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Specializations</p></div>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.specializations.map((s: string, i: number) => <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{s}</span>)}
                  </div>
                </div>
              )}

              {detail.qualifications?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><GraduationCap size={13} className="text-[#2d6be4]" /><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qualifications</p></div>
                  <div className="space-y-2">
                    {detail.qualifications.map((q: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-4 py-2.5">
                        <p className="text-sm font-medium text-gray-800">{q.name}</p>
                        <p className="text-xs text-gray-400">{q.institute}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.documents?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><FileText size={13} className="text-[#2d6be4]" /><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Documents ({detail.documents.length})</p></div>
                  <div className="space-y-2">
                    {detail.documents.map((doc: any) => (
                      <div key={doc.id} className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.documentType}</p>
                          <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleViewDoc(doc.id)} disabled={pdfLoading}
                          className="flex items-center gap-1 text-xs font-medium text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                          <Eye size={12} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Verify button */}
              {!detail.isVerified && detail.verificationRequested && (
                <button onClick={() => onVerify(detail.id)} disabled={verifying}
                  className="w-full flex items-center justify-center gap-2 bg-[#2d6be4] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60 text-sm">
                  <CheckCircle size={15} />
                  {verifying ? 'Verifying...' : 'Approve & Verify Doctor'}
                </button>
              )}
            </div>
            <div className="flex-1 bg-gray-100 flex items-center justify-center">
              {pdfLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
                : pdfUrl ? <iframe src={pdfUrl} className="w-full h-full" title="Document" />
                : <div className="text-center text-gray-400"><FileText size={40} className="mx-auto mb-2 opacity-30" /><p className="text-sm">Click View to preview a document</p></div>}
            </div>
          </div>
        ) : (
          // Patient view
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">
                {detail.firstName?.[0]}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{detail.firstName} {detail.lastName}</p>
                <p className="text-sm text-gray-400">{detail.email}</p>
                <p className="text-sm text-gray-400">{detail.contactNumber}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3"><CalendarDays size={14} className="text-[#2d6be4]" /><p className="text-sm font-semibold text-gray-700">Appointments ({detail.appointments?.length ?? 0})</p></div>
              {!detail.appointments?.length ? (
                <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">No appointments yet</p>
              ) : (
                <div className="space-y-3">
                  {detail.appointments.map((apt: any) => (
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

export default function AdminUsersPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'patient' | 'doctor'>('patient');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [joinFrom, setJoinFrom] = useState('');
  const [joinTo, setJoinTo] = useState('');

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsersApi,
    retry: false,
  });

  const { mutate: activate } = useMutation({
    mutationFn: activateUserApi,
    onSuccess: () => {
      toast.success('User activated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to activate user'),
  });

  const { mutate: deactivate } = useMutation({
    mutationFn: deactivateUserApi,
    onSuccess: () => {
      toast.success('User deactivated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to deactivate user'),
  });

  const { mutate: verify, isPending: verifying } = useMutation({
    mutationFn: verifyDoctorApi,
    onSuccess: () => {
      toast.success('Doctor verified successfully!');
      setSelectedUserId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
    },
    onError: () => toast.error('Failed to verify doctor'),
  });

  if (!_hasHydrated || !user) return null;

  const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
  const nonAdmins = users.filter((u: any) => u.role !== 'admin');
  const tabFiltered = nonAdmins.filter((u: any) => {
    if (u.role === 'doctor' && !u.isVerified) return false;
    return u.role === tab;
  });
  const filtered = tabFiltered.filter((u: any) => {
    if (search && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'active' && !u.isActive) return false;
    if (statusFilter === 'inactive' && u.isActive) return false;
    if (joinFrom && new Date(u.createdAt) < new Date(joinFrom)) return false;
    if (joinTo && new Date(u.createdAt) > new Date(joinTo + 'T23:59:59')) return false;
    return true;
  });

  const resetFilters = () => { setSearch(''); setStatusFilter('all'); setJoinFrom(''); setJoinTo(''); };

  const roleColor: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-700',
    doctor: 'bg-green-100 text-green-700',
    patient: 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-12">
      <AdminTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Users</h1>
            <p className="text-xs text-gray-400">Manage all registered users</p>
          </div>
          <span className="text-xs bg-blue-100 text-[#2d6be4] font-semibold px-3 py-1 rounded-full">
            {nonAdmins.length} Total
          </span>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Tabs + Filters */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => { setTab('patient'); resetFilters(); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'patient' ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Patients
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === 'patient' ? 'bg-white text-pink-500' : 'bg-pink-100 text-pink-600'}`}>
                  {users.filter((u: any) => u.role === 'patient').length}
                </span>
              </button>
              <button
                onClick={() => { setTab('doctor'); resetFilters(); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'doctor' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Doctors
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === 'doctor' ? 'bg-white text-green-600' : 'bg-green-100 text-green-600'}`}>
                  {users.filter((u: any) => u.role === 'doctor' && u.isVerified).length}
                </span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            {/* Search email */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search by email..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400" />
              {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>}
            </div>

            {/* Status filter */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white cursor-pointer hover:border-gray-300 transition min-w-[130px]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Join date from */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 whitespace-nowrap">Joined from</label>
              <input type="date" value={joinFrom} onChange={e => setJoinFrom(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] cursor-pointer" />
            </div>

            {/* Join date to */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 whitespace-nowrap">to</label>
              <input type="date" value={joinTo} onChange={e => setJoinTo(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] cursor-pointer" />
            </div>

            {/* Reset */}
            {(search || statusFilter !== 'all' || joinFrom || joinTo) && (
              <button onClick={resetFilters}
                className="text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition">
                Reset Filters
              </button>
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
                <p className="text-gray-400 text-sm">No users found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u: any, i: number) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedUserId(u.id)}>
                      <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-sm">
                            {u.email[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColor[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {u.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {u.isActive ? (
                            <button onClick={() => deactivate(u.id)}
                              className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                              Deactivate
                            </button>
                          ) : (
                            <button onClick={() => activate(u.id)}
                              className="text-xs font-semibold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition">
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {selectedUserId !== null && (
        <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} onVerify={verify} verifying={verifying} />
      )}
    </div>
  );
}
