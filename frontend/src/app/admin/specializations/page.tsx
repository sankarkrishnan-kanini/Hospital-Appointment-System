'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getSpecializationRequestsApi, approveSpecializationApi, rejectSpecializationApi, getDoctorByIdApi, viewDoctorDocumentApi } from '@/lib/api/admin.api';
import AdminTopBar from '@/components/AdminTopBar';
import toast from 'react-hot-toast';
import { X, FileText, Stethoscope, GraduationCap, Building2, Eye, CheckCircle, XCircle, Search } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '' },
  { label: 'Users', href: '/admin/users', icon: '' },
  { label: 'Doctors', href: '/admin/doctors', icon: '' },
  { label: 'Patients', href: '/admin/patients', icon: '' },
  { label: 'Appointments', href: '/admin/appointments', icon: '' },
  { label: 'Hospitals', href: '/admin/hospitals', icon: '' },
  { label: 'Specializations', href: '/admin/specializations', icon: '' },
];

function SpecializationRequestModal({ req, onClose, onApprove, onReject, approving, rejecting, readOnly }: {
  req: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
  rejecting: boolean;
  readOnly?: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-doctor', req.doctorId],
    queryFn: () => getDoctorByIdApi(req.doctorId),
  });

  const [pdfUrl, setPdfUrl] = useState<{ url: string; mimeType: string } | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const doctor = data?.data;

  const handleViewDoc = async (doctorId: number, docId: number) => {
    setPdfLoading(true);
    try {
      const res = await viewDoctorDocumentApi(doctorId, docId);
      const blob: Blob = res.data;
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let mimeType = 'application/pdf';
      if (bytes[0] === 0xFF && bytes[1] === 0xD8) mimeType = 'image/jpeg';
      else if (bytes[0] === 0x89 && bytes[1] === 0x50) mimeType = 'image/png';
      const typedBlob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(typedBlob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl.url);
      setPdfUrl({ url, mimeType });
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
          <div>
            <h2 className="text-base font-bold text-gray-900">Specialization Request</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Dr. {req.doctorName} is requesting <span className="text-[#2d6be4] font-semibold">{req.specializationName}</span>
            </p>
          </div>
          <button onClick={() => { if (pdfUrl) URL.revokeObjectURL(pdfUrl.url); onClose(); }}
            className="text-gray-400 hover:text-gray-600 transition">
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
          </div>
        ) : doctor ? (
          <div className="flex flex-1 overflow-hidden">

            {/* Left panel — doctor info */}
            <div className="w-80 flex-shrink-0 border-r border-gray-100 overflow-y-auto p-6 space-y-5">

              {/* Basic info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-lg flex-shrink-0">
                  {doctor.firstName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</p>
                  <p className="text-xs text-gray-400">ID: #{doctor.id}</p>
                  {doctor.practicingFrom && (
                    <p className="text-xs text-gray-400">Since {new Date(doctor.practicingFrom).getFullYear()}</p>
                  )}
                </div>
              </div>

              {/* Requested specialization highlight */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Requesting</p>
                <div className="flex items-center gap-2">
                  <Stethoscope size={14} className="text-[#2d6be4]" />
                  <p className="text-sm font-bold text-[#2d6be4]">{req.specializationName}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(req.uploadedAt).toLocaleDateString('en-GB')}</p>
              </div>

              {/* Current specializations */}
              {doctor.specializations?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope size={13} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Specializations</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.specializations.map((s: string, i: number) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              {doctor.qualifications?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={13} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qualifications</p>
                  </div>
                  <div className="space-y-2">
                    {doctor.qualifications.map((q: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                        <p className="text-sm font-medium text-gray-800">{q.name}</p>
                        <p className="text-xs text-gray-400">{q.institute}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affiliated hospitals */}
              {doctor.doctorHospitals?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={13} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Affiliated Hospitals</p>
                  </div>
                  <div className="space-y-2">
                    {doctor.doctorHospitals.map((dh: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                        <p className="text-sm font-medium text-gray-800">{dh.hospital?.name ?? 'Private Practice'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All documents */}
              {doctor.documents?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={13} className="text-[#2d6be4]" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All Documents ({doctor.documents.length})</p>
                  </div>
                  <div className="space-y-2">
                    {doctor.documents.map((doc: any) => (
                      <div key={doc.id} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-800">{doc.documentType}</p>
                          <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleViewDoc(doctor.id, doc.id)} disabled={pdfLoading}
                          className="flex items-center gap-1 text-xs font-medium text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50">
                          <Eye size={11} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requested specialization document */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Request Document</p>
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-800">{req.specializationName} proof</p>
                    <p className="text-xs text-gray-400">{new Date(req.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleViewDoc(req.doctorId, req.documentId)} disabled={pdfLoading}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50">
                    <Eye size={11} /> View
                  </button>
                </div>
              </div>

              {/* Approve / Reject or Approved badge */}
              {readOnly ? (
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl py-3">
                  <CheckCircle size={15} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Specialization Approved</span>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button onClick={onReject} disabled={rejecting}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 py-2.5 rounded-xl transition disabled:opacity-60">
                    <XCircle size={13} /> {rejecting ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button onClick={onApprove} disabled={approving}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#2d6be4] hover:bg-blue-700 py-2.5 rounded-xl transition disabled:opacity-60">
                    <CheckCircle size={13} /> {approving ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>

            {/* Right panel — document viewer */}
            <div className="flex-1 bg-gray-100 flex items-center justify-center">
              {pdfLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              ) : pdfUrl ? (
                pdfUrl.mimeType === 'application/pdf' ? (
                  <iframe src={pdfUrl.url} className="w-full h-full" title="Document Viewer" />
                ) : (
                  <img src={pdfUrl.url} alt="Document" className="max-w-full max-h-full object-contain p-4" />
                )
              ) : (
                <div className="text-center text-gray-400">
                  <FileText size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Click View on any document to preview it here</p>
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

export default function AdminSpecializationsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const resetFilters = () => { setSearch(''); setSpecFilter(''); setDateFrom(''); setDateTo(''); };

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-specializations'],
    queryFn: getSpecializationRequestsApi,
    retry: false,
  });

  const { mutate: approve, isPending: approving } = useMutation({
    mutationFn: ({ doctorId, specializationId }: any) => approveSpecializationApi(doctorId, specializationId),
    onSuccess: () => {
      toast.success('Specialization approved');
      setSelectedReq(null);
      queryClient.invalidateQueries({ queryKey: ['admin-specializations'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to approve';
      toast.error(typeof msg === 'string' ? msg : msg[0]);
    },
  });

  const { mutate: reject, isPending: rejecting } = useMutation({
    mutationFn: ({ doctorId, specializationId }: any) => rejectSpecializationApi(doctorId, specializationId),
    onSuccess: () => {
      toast.success('Specialization rejected');
      setSelectedReq(null);
      queryClient.invalidateQueries({ queryKey: ['admin-specializations'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to reject';
      toast.error(typeof msg === 'string' ? msg : msg[0]);
    },
  });

  if (!_hasHydrated || !user) return null;

  const allRequests = Array.isArray(res?.data) ? res.data : [];
  const pending = allRequests.filter((r: any) => r.status === 'pending');
  const approved = allRequests.filter((r: any) => r.status === 'approved');

  const uniqueSpecs = [...new Set(allRequests.map((r: any) => r.specializationName).filter(Boolean))] as string[];

  const applyFilters = (list: any[]) => list.filter((r: any) => {
    if (search && !r.doctorName.toLowerCase().includes(search.toLowerCase())) return false;
    if (specFilter && r.specializationName !== specFilter) return false;
    if (dateFrom && new Date(r.uploadedAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(r.uploadedAt) > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  });

  const displayed = applyFilters(tab === 'pending' ? pending : approved);
  const hasFilters = search || specFilter || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-gray-50 flex pt-14">
      <AdminTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Specialization Requests</h1>
            <p className="text-xs text-gray-400">Review and approve doctor specialization requests</p>
          </div>
          {pending.length > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">
              {pending.length} Pending
            </span>
          )}
        </header>

        <div className="flex-1 p-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button onClick={() => setTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              Pending
              {pending.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'pending' ? 'bg-white text-yellow-600' : 'bg-yellow-100 text-yellow-700'}`}>{pending.length}</span>
              )}
            </button>
            <button onClick={() => setTab('approved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              Approved
              {approved.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'approved' ? 'bg-white text-green-600' : 'bg-green-100 text-green-700'}`}>{approved.length}</span>
              )}
            </button>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search by doctor name..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400" />
              {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>
            <select value={specFilter} onChange={e => setSpecFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white cursor-pointer min-w-[160px]">
              <option value="">All Specializations</option>
              {uniqueSpecs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 whitespace-nowrap">From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 whitespace-nowrap">To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d6be4] cursor-pointer" />
            </div>
            {hasFilters && (
              <button onClick={resetFilters} className="text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition">Reset</button>
            )}
            <span className="ml-auto text-xs text-gray-400">{displayed.length} result{displayed.length !== 1 ? 's' : ''}</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
            </div>
          ) : !displayed.length ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <Stethoscope size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">{tab === 'pending' ? 'No pending requests' : 'No approved requests yet'}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Doctor</th>
                    <th className="px-6 py-4 font-medium">Specialization</th>
                    <th className="px-6 py-4 font-medium">Submitted</th>
                    <th className="px-6 py-4 font-medium">{tab === 'pending' ? 'Action' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayed.map((req: any, i: number) => (
                    <tr key={`${req.doctorId}-${req.specializationId}`}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setSelectedReq(req)}>
                      <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                            {req.doctorName?.[0]}
                          </div>
                          <p className="font-semibold text-gray-800">Dr. {req.doctorName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                          {req.specializationName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(req.uploadedAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        {tab === 'pending' ? (
                          <button onClick={() => setSelectedReq(req)}
                            className="text-xs font-semibold text-white bg-[#2d6be4] hover:bg-blue-700 px-3 py-1.5 rounded-lg transition">
                            Review
                          </button>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">✓ Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selectedReq && (
        <SpecializationRequestModal
          req={selectedReq}
          onClose={() => setSelectedReq(null)}
          onApprove={() => approve({ doctorId: selectedReq.doctorId, specializationId: selectedReq.specializationId })}
          onReject={() => reject({ doctorId: selectedReq.doctorId, specializationId: selectedReq.specializationId })}
          approving={approving}
          rejecting={rejecting}
          readOnly={selectedReq.status === 'approved'}
        />
      )}
    </div>
  );
}
