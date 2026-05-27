'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getAllDoctorsApi, getPendingDoctorsApi, verifyDoctorApi, getDoctorByIdApi, viewDoctorDocumentApi } from '@/lib/api/admin.api';
import toast from 'react-hot-toast';
import { X, CheckCircle, FileText, Stethoscope, GraduationCap, Building2, Eye, Search } from 'lucide-react';
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

function DoctorDetailModal({ doctorId, onClose, onVerify, verifying }: {
  doctorId: number;
  onClose: () => void;
  onVerify: (id: number) => void;
  verifying: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-doctor', doctorId],
    queryFn: () => getDoctorByIdApi(doctorId),
  });

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const doctor = data?.data;

  const handleViewDocument = async (docId: number) => {
    setPdfLoading(true);
    try {
      const res = await viewDoctorDocumentApi(doctor.id, docId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
    } catch {
      toast.error('Failed to load document');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl mx-4 h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Doctor Details</h2>
          <button onClick={() => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); onClose(); }} className="text-gray-400 hover:text-gray-600 transition">
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
          </div>
        ) : doctor ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Left panel - doctor info */}
            <div className="p-6 space-y-5 w-80 flex-shrink-0 border-r border-gray-100 overflow-y-auto">
              {/* Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-xl">
                  {doctor.firstName?.[0]}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</p>
                  <p className="text-xs text-gray-400">ID: #{doctor.id}</p>
                  {doctor.professionalStatement && (
                    <p className="text-sm text-gray-500 mt-0.5">{doctor.professionalStatement}</p>
                  )}
                  {doctor.practicingFrom && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Practicing since {new Date(doctor.practicingFrom).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
              {doctor.specializations?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope size={14} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Specializations</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((s: string) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {doctor.qualifications?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={14} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qualifications</p>
                  </div>
                  <div className="space-y-2">
                    {doctor.qualifications.map((q: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-4 py-2.5">
                        <p className="text-sm font-medium text-gray-800">{q.name}</p>
                        <p className="text-xs text-gray-400">{q.institute} {q.year ? `· ${q.year}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.doctorHospitals?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Affiliated Hospitals</p>
                  </div>
                  <div className="space-y-2">
                    {doctor.doctorHospitals.map((dh: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-4 py-2.5">
                        <p className="text-sm font-medium text-gray-800">{dh.hospital?.name ?? `Hospital #${dh.hospitalId}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.documents?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Documents ({doctor.documents.length})</p>
                  </div>
                  <div className="space-y-2">
                    {doctor.documents.map((doc: any) => (
                      <div key={doc.id} className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.documentType}</p>
                          <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleViewDocument(doc.id)}
                          disabled={pdfLoading}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                          <Eye size={12} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {doctor.isVerified ? (
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">✅ Verified</span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">⏳ Pending Verification</span>
                )}
              </div>

              
              {!doctor.isVerified && doctor.verificationRequested && (
                <button
                  onClick={() => onVerify(doctor.id)}
                  disabled={verifying}
                  className="w-full flex items-center justify-center gap-2 bg-[#2d6be4] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60 text-sm"
                >
                  <CheckCircle size={15} />
                  {verifying ? 'Verifying...' : 'Approve & Verify Doctor'}
                </button>
              )}
            </div>

            {/* Right panel - PDF viewer */}
            <div className="flex-1 bg-gray-100 flex items-center justify-center">

              {pdfLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              ) : pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full" title="Document Viewer" />
              ) : (
                <div className="text-center text-gray-400">
                  <FileText size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Click View on a document to preview it here</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10 text-sm">Failed to load doctor details.</p>
        )}
      </div>
    </div>
  );
}

export default function AdminDoctorsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'pending' | 'not_requested'>('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: allRes, isLoading } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: getAllDoctorsApi,
    retry: false,
  });

  const { data: pendingRes } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: getPendingDoctorsApi,
    retry: false,
  });

  const { mutate: verify, isPending: verifying } = useMutation({
    mutationFn: verifyDoctorApi,
    onSuccess: () => {
      toast.success('Doctor verified successfully');
      setSelectedDoctorId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending'] });
    },
    onError: () => toast.error('Failed to verify doctor'),
  });

  if (!_hasHydrated || !user) return null;

  const allDoctors = Array.isArray(allRes?.data) ? allRes.data : [];
  const pendingDoctors = Array.isArray(pendingRes?.data) ? pendingRes.data : [];
  const displayList = tab === 'all' ? allDoctors : pendingDoctors;

  const filtered = displayList.filter((d: any) => {
    if (search && !`${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (verificationFilter === 'verified' && !d.isVerified) return false;
    if (verificationFilter === 'pending' && (!d.verificationRequested || d.isVerified)) return false;
    if (verificationFilter === 'not_requested' && (d.verificationRequested || d.isVerified)) return false;
    return true;
  });
  const resetFilters = () => { setSearch(''); setVerificationFilter('all'); };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-12">
      <AdminTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Doctors</h1>
            <p className="text-xs text-gray-400">Manage and verify doctor profiles</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingDoctors.length > 0 && (
              <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">
                {pendingDoctors.length} Pending
              </span>
            )}
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
              {allDoctors.length} Total
            </span>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-5">

          {/* Tabs + Filters */}
          <div className="flex items-center justify-between gap-4 flex-wrap">


            <div className="flex gap-2">
              <button onClick={() => { setTab('all'); resetFilters(); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'all' ? 'bg-[#2d6be4] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                All Doctors
              </button>
              <button onClick={() => { setTab('pending'); resetFilters(); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${tab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                Pending Verification
                {pendingDoctors.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'pending' ? 'bg-white text-yellow-600' : 'bg-yellow-100 text-yellow-700'}`}>
                    {pendingDoctors.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search by name..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400" />
              {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>}
            </div>
            <select value={verificationFilter} onChange={e => setVerificationFilter(e.target.value as any)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white cursor-pointer hover:border-gray-300 transition min-w-[160px]">
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="not_requested">Not Requested</option>
            </select>
            {(search || verificationFilter !== 'all') && (
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
                <p className="text-4xl mb-3">🩺</p>
                <p className="text-gray-400 text-sm">
                  {tab === 'pending' ? 'No pending verifications' : 'No doctors found'}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Doctor</th>
                    <th className="px-6 py-4 font-medium">Practicing From</th>
                    <th className="px-6 py-4 font-medium">Verification</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((doc: any, i: number) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setSelectedDoctorId(doc.id)}
                    >
                      <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                            {doc.firstName?.[0] ?? '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Dr. {doc.firstName} {doc.lastName}
                            </p>
                            <p className="text-xs text-gray-400">ID: #{doc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {doc.practicingFrom
                          ? new Date(doc.practicingFrom).getFullYear()
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {doc.isVerified ? (
                          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                            ✅ Verified
                          </span>
                        ) : doc.verificationRequested ? (
                          <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2.5 py-1 rounded-full">
                            ⏳ Pending
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2.5 py-1 rounded-full">
                            Not Requested
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${doc.user?.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {doc.user?.isActive !== false ? '● Active' : '● Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        {!doc.isVerified && doc.verificationRequested && (
                          <button
                            onClick={() => setSelectedDoctorId(doc.id)}
                            className="text-xs font-semibold text-white bg-[#2d6be4] hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
                          >
                            View & Verify
                          </button>
                        )}
                        {doc.isVerified && (
                          <span className="text-xs text-gray-400">No action needed</span>
                        )}
                        {!doc.isVerified && !doc.verificationRequested && (
                          <span className="text-xs text-gray-400">Awaiting request</span>
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

      {selectedDoctorId !== null && (
        <DoctorDetailModal
          doctorId={selectedDoctorId}
          onClose={() => setSelectedDoctorId(null)}
          onVerify={verify}
          verifying={verifying}
        />
      )}
    </div>
  );
}
