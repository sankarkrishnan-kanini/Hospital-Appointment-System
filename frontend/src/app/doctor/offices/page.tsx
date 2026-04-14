'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Building2, Plus, Trash2, MapPin, DollarSign, Clock } from 'lucide-react';
import { getDoctorOfficesApi, createOfficeApi, deletePracticeApi, affiliateHospitalApi, getInsurancesApi, addInsuranceApi, deleteInsuranceApi } from '@/lib/api/doctor.api';
import { getAllOfficesApi, getHospitalsByOfficeApi } from '@/lib/api/admin.api';
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

export default function DoctorOfficesPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPrivateForm, setShowPrivateForm] = useState(false);
  const [showAffiliateForm, setShowAffiliateForm] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null);
  const [insuranceOfficeId, setInsuranceOfficeId] = useState<number | null>(null);
  const [newInsurance, setNewInsurance] = useState('');
  const [form, setForm] = useState({
    streetAddress: '', city: '', state: '', country: '', zip: '',
    firstConsultationFee: '', followupConsultationFee: '', timeSlotPerClientInMin: ''
  });
  const [affiliateForm, setAffiliateForm] = useState({
    hospitalId: '', firstConsultationFee: '', followupConsultationFee: '', timeSlotPerClientInMin: ''
  });

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: officesRes, isLoading } = useQuery({
    queryKey: ['doctor-offices'],
    queryFn: getDoctorOfficesApi,
    retry: false,
  });

  const { data: adminOfficesRes } = useQuery({
    queryKey: ['admin-offices'],
    queryFn: getAllOfficesApi,
    retry: false,
    enabled: showAffiliateForm,
  });

  const { data: hospitalsRes } = useQuery({
    queryKey: ['admin-hospitals', selectedOfficeId],
    queryFn: () => getHospitalsByOfficeApi(selectedOfficeId!),
    enabled: !!selectedOfficeId,
    retry: false,
  });

  const { data: insurancesRes } = useQuery({
    queryKey: ['insurances', insuranceOfficeId],
    queryFn: () => getInsurancesApi(insuranceOfficeId!),
    enabled: !!insuranceOfficeId,
    retry: false,
  });

  const { mutate: addInsurance, isPending: addingInsurance } = useMutation({
    mutationFn: addInsuranceApi,
    onSuccess: () => {
      toast.success('Insurance added');
      setNewInsurance('');
      queryClient.invalidateQueries({ queryKey: ['insurances', insuranceOfficeId] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to add insurance'),
  });

  const { mutate: removeInsurance } = useMutation({
    mutationFn: deleteInsuranceApi,
    onSuccess: () => {
      toast.success('Insurance removed');
      queryClient.invalidateQueries({ queryKey: ['insurances', insuranceOfficeId] });
    },
    onError: () => toast.error('Failed to remove insurance'),
  });

  // auto-fill fees when hospital is selected
  const handleHospitalSelect = (hospitalId: string) => {
    setAffiliateForm({ ...affiliateForm, hospitalId });
    const hospital = hospitals.find((h: any) => h.id === parseInt(hospitalId));
    if (hospital) {
      setAffiliateForm(prev => ({
        ...prev,
        hospitalId,
        firstConsultationFee: hospital.defaultFirstConsultationFee?.toString() || '',
        followupConsultationFee: hospital.defaultFollowupFee?.toString() || '',
      }));
    }
  };

  const { mutate: createPrivate, isPending: creating } = useMutation({
    mutationFn: createOfficeApi,
    onSuccess: () => {
      toast.success('Private practice created');
      setShowPrivateForm(false);
      setForm({ streetAddress: '', city: '', state: '', country: '', zip: '', firstConsultationFee: '', followupConsultationFee: '', timeSlotPerClientInMin: '' });
      queryClient.invalidateQueries({ queryKey: ['doctor-offices'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create practice'),
  });

  const { mutate: affiliate, isPending: affiliating } = useMutation({
    mutationFn: affiliateHospitalApi,
    onSuccess: () => {
      toast.success('Affiliated with hospital successfully');
      setShowAffiliateForm(false);
      queryClient.invalidateQueries({ queryKey: ['doctor-offices'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to affiliate'),
  });

  const { mutate: deletePractice } = useMutation({
    mutationFn: deletePracticeApi,
    onSuccess: () => {
      toast.success('Practice removed');
      queryClient.invalidateQueries({ queryKey: ['doctor-offices'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete'),
  });

  if (!_hasHydrated || !user) return null;

  const offices = Array.isArray(officesRes?.data) ? officesRes.data : [];
  const adminOffices = Array.isArray(adminOfficesRes?.data) ? adminOfficesRes.data : [];
  const hospitals = Array.isArray(hospitalsRes?.data) ? hospitalsRes.data : [];
  const insurances = Array.isArray(insurancesRes?.data) ? insurancesRes.data : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Offices & Hospitals</h1>
            <p className="text-xs text-gray-400">Manage your practices</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAffiliateForm(true)}
              className="flex items-center gap-2 text-sm font-medium border border-[#2d6be4] text-[#2d6be4] px-4 py-2 rounded-xl hover:bg-blue-50 transition">
              <Plus size={15} /> Affiliate Hospital
            </button>
            <button onClick={() => setShowPrivateForm(true)}
              className="flex items-center gap-2 text-sm font-medium bg-[#2d6be4] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              <Plus size={15} /> Private Practice
            </button>
          </div>
        </header>

        <div className="flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
            </div>
          ) : !offices.length ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No offices yet</p>
              <p className="text-gray-400 text-sm mt-1">Create a private practice or affiliate with a hospital</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {offices.map((office: any) => (
                <div key={office.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${office.isPrivate ? 'bg-purple-50' : 'bg-blue-50'}`}>
                        <Building2 size={18} className={office.isPrivate ? 'text-purple-600' : 'text-blue-600'} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {office.isPrivate ? 'Private Practice' : office.hospital?.name}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${office.isPrivate ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {office.isPrivate ? 'Private' : 'Hospital'}
                        </span>
                      </div>
                    </div>
                    {office.isPrivate && (
                      <button onClick={() => deletePractice(office.id)}
                        className="text-gray-300 hover:text-red-500 transition">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {office.isPrivate && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                      <MapPin size={12} />
                      <span>{office.streetAddress}, {office.city}, {office.state}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 mt-3 flex-1">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <DollarSign size={14} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-800">₹{office.firstConsultationFee}</p>
                      <p className="text-xs text-gray-400">First visit</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <DollarSign size={14} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-800">₹{office.followupConsultationFee}</p>
                      <p className="text-xs text-gray-400">Follow-up</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Clock size={14} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-800">{office.timeSlotPerClientInMin} min</p>
                      <p className="text-xs text-gray-400">Per slot</p>
                    </div>
                  </div>

                  {/* In-Network Insurance */}
                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In-Network Insurance</p>
                      <button
                        onClick={() => setInsuranceOfficeId(insuranceOfficeId === office.id ? null : office.id)}
                        className="text-xs text-[#2d6be4] hover:underline font-medium"
                      >
                        {insuranceOfficeId === office.id ? 'Hide' : 'Manage'}
                      </button>
                    </div>

                    {/* existing insurances from offices data */}
                    {office.insurances?.length > 0 && insuranceOfficeId !== office.id && (
                      <div className="flex flex-wrap gap-1">
                        {office.insurances.map((ins: any) => (
                          <span key={ins.id} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{ins.insuranceName}</span>
                        ))}
                      </div>
                    )}

                    {insuranceOfficeId === office.id && (
                      <div className="space-y-2">
                        {/* loaded insurances */}
                        {insurances.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {insurances.map((ins: any) => (
                              <span key={ins.id} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                {ins.insuranceName}
                                <button onClick={() => removeInsurance(ins.id)} className="text-green-400 hover:text-red-500 ml-0.5">×</button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">No insurances added yet</p>
                        )}
                        {/* add new */}
                        <div className="flex gap-2 mt-2">
                          <input
                            value={newInsurance}
                            onChange={(e) => setNewInsurance(e.target.value)}
                            placeholder="e.g. BlueCross"
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6be4]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newInsurance.trim()) {
                                addInsurance({ doctorHospitalId: office.id, insuranceName: newInsurance.trim() });
                              }
                            }}
                          />
                          <button
                            onClick={() => newInsurance.trim() && addInsurance({ doctorHospitalId: office.id, insuranceName: newInsurance.trim() })}
                            disabled={addingInsurance || !newInsurance.trim()}
                            className="text-xs font-medium bg-[#2d6be4] text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Private Practice Modal */}
        {showPrivateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Create Private Practice</h2>
              <div className="space-y-3">
                {[
                  { key: 'streetAddress', label: 'Street Address', placeholder: '123 Main St' },
                  { key: 'city', label: 'City', placeholder: 'Hyderabad' },
                  { key: 'state', label: 'State', placeholder: 'Telangana' },
                  { key: 'country', label: 'Country', placeholder: 'India' },
                  { key: 'zip', label: 'ZIP Code', placeholder: '500001' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input placeholder={f.placeholder} value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'firstConsultationFee', label: 'First Visit Fee (₹)' },
                    { key: 'followupConsultationFee', label: 'Follow-up Fee (₹)' },
                    { key: 'timeSlotPerClientInMin', label: 'Slot Duration (min)' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <input type="number" value={(form as any)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowPrivateForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button
                  onClick={() => createPrivate({
                    ...form,
                    firstConsultationFee: parseFloat(form.firstConsultationFee),
                    followupConsultationFee: parseFloat(form.followupConsultationFee),
                    timeSlotPerClientInMin: parseInt(form.timeSlotPerClientInMin),
                  })}
                  disabled={creating}
                  className="flex-1 bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                  {creating ? 'Creating...' : 'Create Practice'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Affiliate Hospital Modal */}
        {showAffiliateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Affiliate with Hospital</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Office</label>
                  <select value={selectedOfficeId ?? ''} onChange={(e) => setSelectedOfficeId(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white">
                    <option value="">Select an office</option>
                    {adminOffices.map((o: any) => (
                      <option key={o.id} value={o.id}>{o.name} — {o.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Hospital</label>
                  <select value={affiliateForm.hospitalId} onChange={(e) => handleHospitalSelect(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white"
                    disabled={!selectedOfficeId}>
                    <option value="">Select a hospital</option>
                    {hospitals.map((h: any) => (
                      <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
                    ))}
                  </select>
                  {affiliateForm.hospitalId && hospitals.find((h: any) => h.id === parseInt(affiliateForm.hospitalId)) && (
                    <p className="text-xs text-blue-600 mt-1">
                      Default fees loaded from hospital. You can edit below if needed.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'firstConsultationFee', label: 'First Visit Fee (₹)' },
                    { key: 'followupConsultationFee', label: 'Follow-up Fee (₹)' },
                    { key: 'timeSlotPerClientInMin', label: 'Slot Duration (min)' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <input type="number" value={(affiliateForm as any)[f.key]}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAffiliateForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button
                  onClick={() => affiliate({
                    hospitalId: parseInt(affiliateForm.hospitalId),
                    firstConsultationFee: parseFloat(affiliateForm.firstConsultationFee),
                    followupConsultationFee: parseFloat(affiliateForm.followupConsultationFee),
                    timeSlotPerClientInMin: parseInt(affiliateForm.timeSlotPerClientInMin),
                  })}
                  disabled={affiliating}
                  className="flex-1 bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                  {affiliating ? 'Affiliating...' : 'Affiliate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
