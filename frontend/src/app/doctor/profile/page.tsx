'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Pencil, Check, X, Clock } from 'lucide-react';
import { getDoctorProfileApi, setupProfileApi, requestVerificationApi, updateDoctorProfileApi } from '@/lib/api/doctor.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/doctor', icon: '' },
  { label: 'Analytics', href: '/doctor/analytics', icon: '' },
  { label: 'My Profile', href: '/doctor/profile', icon: '' },
  { label: 'Offices', href: '/doctor/offices', icon: '' },
  { label: 'Availability', href: '/doctor/availability', icon: '' },
  { label: 'Time Slots', href: '/doctor/timeslots', icon: '' },
  { label: 'Appointments', href: '/doctor/appointments', icon: '' },
];

const SPECIALIZATIONS = [
  { id: 1, name: 'Cardiology' }, { id: 2, name: 'Neurology' },
  { id: 3, name: 'Dermatology' }, { id: 4, name: 'Orthopedics' },
  { id: 5, name: 'Pediatrics' }, { id: 6, name: 'Gynecology' },
  { id: 7, name: 'Ophthalmology' }, { id: 8, name: 'Psychiatry' },
  { id: 9, name: 'Radiology' }, { id: 10, name: 'General Surgery' },
];

export default function DoctorProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Setup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [professionalStatement, setProfessionalStatement] = useState('');
  const [practicingFrom, setPracticingFrom] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>([]);
  const [qualifications, setQualifications] = useState([{ qualificationName: '', instituteName: '', procurementYear: '' }]);
  const [documentTypes, setDocumentTypes] = useState(['']);
  const [files, setFiles] = useState<File[]>([]);

  // Edit mode state (for verified doctors)
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', professionalStatement: '', practicingFrom: '' });

  useEffect(() => {
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router]);

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: getDoctorProfileApi,
    retry: false,
  });

  const { mutate: setupProfile, isPending: submitting } = useMutation({
    mutationFn: setupProfileApi,
    onSuccess: () => {
      toast.success('Profile setup complete! Now request verification.');
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to setup profile';
      toast.error(typeof msg === 'string' ? msg : msg[0]);
    },
  });

  const { mutate: requestVerification, isPending: requesting } = useMutation({
    mutationFn: requestVerificationApi,
    onSuccess: () => {
      toast.success('Verification request sent!');
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to request verification';
      toast.error(typeof msg === 'string' ? msg : msg[0]);
    },
  });

  const { mutate: updateProfile, isPending: updating } = useMutation({
    mutationFn: updateDoctorProfileApi,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to update profile';
      toast.error(typeof msg === 'string' ? msg : msg[0]);
    },
  });

  if (!user) return null;

  const doctor = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;
  const isProfileSetup = !!doctor?.firstName;
  const isVerified = doctor?.isVerified;
  const verificationRequested = doctor?.verificationRequested;

  // Pre-fill edit form when doctor data loads
  const startEditing = () => {
    setEditForm({
      firstName: doctor?.firstName || '',
      lastName: doctor?.lastName || '',
      professionalStatement: doctor?.professionalStatement || '',
      practicingFrom: doctor?.practicingFrom ? new Date(doctor.practicingFrom).toISOString().split('T')[0] : '',
    });
    setEditing(true);
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return toast.error('Please upload at least one document');
    if (files.length !== documentTypes.filter(d => d).length)
      return toast.error('Each file must have a document type');
    if (!selectedSpecs.length) return toast.error('Select at least one specialization');

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('professionalStatement', professionalStatement);
    formData.append('practicingFrom', practicingFrom);
    formData.append('specializations', JSON.stringify(selectedSpecs));
    formData.append('qualifications', JSON.stringify(qualifications.filter(q => q.qualificationName && q.instituteName)));
    formData.append('hospitalAffiliations', JSON.stringify([]));
    formData.append('documentTypes', JSON.stringify(documentTypes.filter(d => d)));
    files.forEach(file => formData.append('files', file));
    setupProfile(formData);
  };

  const toggleSpec = (id: number) =>
    setSelectedSpecs(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar items={navItems} />
        <main className="flex-1 ml-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-gray-900">My Profile</h1>
          {isVerified && (
            <span className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1 rounded-full">Verified</span>
          )}
        </header>

        <div className="flex-1 p-6 space-y-5 max-w-3xl">

          {/* ── VERIFIED DOCTOR VIEW ── */}
          {isVerified && doctor && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-xl">
                      {doctor.firstName?.[0]}
                    </div>
                    <div>
                      {editing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                              <input value={editForm.firstName}
                                onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] w-full" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                              <input value={editForm.lastName}
                                onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] w-full" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Professional Statement</label>
                            <textarea value={editForm.professionalStatement}
                              onChange={e => setEditForm({ ...editForm, professionalStatement: e.target.value })}
                              rows={2}
                              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] w-full resize-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Practicing From</label>
                            <input type="date" value={editForm.practicingFrom}
                              onChange={e => setEditForm({ ...editForm, practicingFrom: e.target.value })}
                              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] w-full" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-lg font-bold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</h2>
                          <p className="text-sm text-gray-500 mt-0.5">{doctor.professionalStatement || 'No statement added'}</p>
                          {doctor.practicingFrom && (
                            <p className="text-xs text-gray-400 mt-1">
                              Practicing since {new Date(doctor.practicingFrom).getFullYear()}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Edit / Save / Cancel buttons */}
                  <div className="flex gap-2 ml-4">
                    {editing ? (
                      <>
                        <button onClick={() => setEditing(false)}
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition">
                          <X size={13} /> Cancel
                        </button>
                        <button
                          onClick={() => updateProfile({
                            firstName: editForm.firstName,
                            lastName: editForm.lastName,
                            professionalStatement: editForm.professionalStatement,
                            ...(editForm.practicingFrom && {
                              practicingFrom: new Date(editForm.practicingFrom).toISOString()
                            }),
                          })}
                          disabled={updating}
                          className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#2d6be4] hover:bg-blue-700 px-3 py-2 rounded-xl transition disabled:opacity-60">
                          <Check size={13} /> {updating ? 'Saving...' : 'Save'}
                        </button>
                      </>
                    ) : (
                      <button onClick={startEditing}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition">
                        <Pencil size={13} /> Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Specializations & Qualifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-medium text-gray-400 mb-3">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations?.map((s: string) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-medium text-gray-400 mb-3">Qualifications</p>
                  <div className="space-y-1.5">
                    {doctor.qualifications?.map((q: any, i: number) => (
                      <div key={i}>
                        <p className="text-sm font-medium text-gray-700">{q.name}</p>
                        <p className="text-xs text-gray-400">{q.institute}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-medium text-gray-400 mb-2">Documents Uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{doctor.documentCount}</p>
                <p className="text-xs text-gray-400 mt-1">documents on file</p>
              </div>
            </>
          )}

          {/* ── PENDING VERIFICATION ── */}
          {isProfileSetup && verificationRequested && !isVerified && (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Verification Pending</h2>
              <p className="text-gray-400 text-sm mt-2">Your profile has been submitted. Admin will review and approve.</p>
              <div className="mt-5 bg-gray-50 rounded-xl p-4 text-left inline-block">
                <p className="text-sm font-medium text-gray-700">Dr. {doctor?.firstName} {doctor?.lastName}</p>
                <p className="text-xs text-gray-400 mt-1">Specializations: {doctor?.specializations?.join(', ')}</p>
                <p className="text-xs text-gray-400">Documents: {doctor?.documentCount} uploaded</p>
              </div>
            </div>
          )}

          {/* ── REQUEST VERIFICATION (profile done, not yet requested) ── */}
          {isProfileSetup && !verificationRequested && !isVerified && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <h2 className="text-lg font-semibold text-gray-900">Profile Setup Complete</h2>
              <p className="text-gray-400 text-sm mt-2 mb-5">Click below to send your profile for admin verification.</p>
              <button onClick={() => requestVerification()} disabled={requesting}
                className="bg-[#2d6be4] text-white font-medium px-8 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 text-sm">
                {requesting ? 'Sending...' : 'Request Verification'}
              </button>
            </div>
          )}

          {/* ── SETUP FORM (new doctor) ── */}
          {!isProfileSetup && !verificationRequested && !isVerified && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm font-medium text-blue-800">Complete your profile to get started</p>
                <p className="text-xs text-blue-600 mt-0.5">Fill in your details, upload documents, then request verification.</p>
              </div>

              <form onSubmit={handleSetupSubmit} className="space-y-5">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="e.g. Rahul"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="e.g. Sharma"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Professional Statement</label>
                    <textarea value={professionalStatement} onChange={e => setProfessionalStatement(e.target.value)}
                      placeholder="e.g. Experienced cardiologist with 10+ years..." rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Practicing From</label>
                    <input type="date" value={practicingFrom} onChange={e => setPracticingFrom(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                </div>

                {/* Specializations */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Specializations *</h3>
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                    {SPECIALIZATIONS.map(spec => (
                      <button key={spec.id} type="button" onClick={() => toggleSpec(spec.id)}
                        className={`p-2.5 rounded-xl border-2 text-xs font-medium transition text-center
                          ${selectedSpecs.includes(spec.id)
                            ? 'border-[#2d6be4] bg-blue-50 text-[#2d6be4]'
                            : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                        {spec.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Qualifications *</h3>
                    <button type="button" onClick={() => setQualifications([...qualifications, { qualificationName: '', instituteName: '', procurementYear: '' }])}
                      className="text-xs text-[#2d6be4] hover:underline">+ Add</button>
                  </div>
                  {qualifications.map((q, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3">
                      <input placeholder="Qualification (e.g. MBBS)" value={q.qualificationName}
                        onChange={e => { const u = [...qualifications]; u[i].qualificationName = e.target.value; setQualifications(u); }}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                      <input placeholder="Institute (e.g. AIIMS)" value={q.instituteName}
                        onChange={e => { const u = [...qualifications]; u[i].instituteName = e.target.value; setQualifications(u); }}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                      <input type="date" value={q.procurementYear}
                        onChange={e => { const u = [...qualifications]; u[i].procurementYear = e.target.value; setQualifications(u); }}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                  ))}
                </div>

                {/* Documents */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Documents *</h3>
                    <button type="button" onClick={() => setDocumentTypes([...documentTypes, ''])}
                      className="text-xs text-[#2d6be4] hover:underline">+ Add Type</button>
                  </div>
                  <p className="text-xs text-gray-400">Upload medical license, degree certificates (jpg, jpeg, png, pdf — max 2MB)</p>
                  {documentTypes.map((dt, i) => (
                    <input key={i} placeholder={`Document type (e.g. Medical License)`} value={dt}
                      onChange={e => { const u = [...documentTypes]; u[i] = e.target.value; setDocumentTypes(u); }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  ))}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={e => { if (e.target.files) setFiles(Array.from(e.target.files)); }}
                      className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <p className="text-sm font-medium text-gray-600">Click to upload files</p>
                      <p className="text-xs text-gray-400 mt-1">jpg, jpeg, png, pdf — max 2MB each</p>
                    </label>
                    {files.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {files.map((f, i) => <p key={i} className="text-xs text-green-600">✓ {f.name}</p>)}
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full bg-[#2d6be4] text-white py-3 rounded-2xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Profile & Request Verification'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
