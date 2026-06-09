'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DoctorTopBar from '@/components/DoctorTopBar';
import { Building2, Plus, Trash2, MapPin, IndianRupee, Clock } from 'lucide-react';
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
  { label: 'Messages', href: '/doctor/chat', icon: '' },
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
    <div className="min-h-screen bg-gray-50 flex pt-14">
      <DoctorTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <div className="flex-1 p-6">
          <div className="flex justify-end gap-2 mb-4">
            <button onClick={() => setShowAffiliateForm(true)}
              className="flex items-center gap-2 text-sm font-medium border border-green-600 text-green-700 px-4 py-2 rounded-xl hover:bg-green-50 transition">
              <Plus size={15} /> Affiliate Hospital
            </button>
            <button onClick={() => setShowPrivateForm(true)}
              className="flex items-center gap-2 text-sm font-medium bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 transition">
              <Plus size={15} /> Private Practice
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
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
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-50">
                        <Building2 size={18} className="text-green-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {office.isPrivate
                            ? office.streetAddress.length > 28 ? office.streetAddress.slice(0, 28) + '...' : office.streetAddress
                            : office.hospital?.name}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${office.isPrivate ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
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
                      <IndianRupee size={14} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-800">₹{office.firstConsultationFee}</p>
                      <p className="text-xs text-gray-400">First visit</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <IndianRupee size={14} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-800">₹{office.followupConsultationFee}</p>
                      <p className="text-xs text-gray-400">Follow-up</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Clock size={14} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-800">{office.timeSlotPerClientInMin} min</p>
                      <p className="text-xs text-gray-400">Per slot</p>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In-Network Insurance</p>
                      <button
                        onClick={() => setInsuranceOfficeId(insuranceOfficeId === office.id ? null : office.id)}
                        className="text-xs text-green-700 hover:underline font-medium"
                      >
                        {insuranceOfficeId === office.id ? 'Hide' : 'Manage'}
                      </button>
                    </div>

                  
                    {office.insurances?.length > 0 && insuranceOfficeId !== office.id && (
                      <div className="flex flex-wrap gap-1">
                        {office.insurances.map((ins: any) => (
                          <span key={ins.id} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{ins.insuranceName}</span>
                        ))}
                      </div>
                    )}

                    {insuranceOfficeId === office.id && (
                      <div className="space-y-2">
                      
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
                       
                        <div className="flex gap-2 mt-2">
                          <input
                            value={newInsurance}
                            onChange={(e) => setNewInsurance(e.target.value)}
                            placeholder="e.g. BlueCross"
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newInsurance.trim()) {
                                addInsurance({ doctorHospitalId: office.id, insuranceName: newInsurance.trim() });
                              }
                            }}
                          />
                          <button
                            onClick={() => newInsurance.trim() && addInsurance({ doctorHospitalId: office.id, insuranceName: newInsurance.trim() })}
                            disabled={addingInsurance || !newInsurance.trim()}
                            className="text-xs font-medium bg-green-700 text-white px-3 py-2 rounded-xl hover:bg-green-800 transition disabled:opacity-50"
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

      
        {showPrivateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Create Private Practice</h2>
              <p className="text-xs text-gray-400 mb-6">Fill in your practice details below</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Address <span className="text-red-400">*</span></label>
                  <input placeholder="e.g. Apollo Hospital, Road No. 72, Jubilee Hills" value={form.streetAddress}
                    onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">City</label>
                  <input placeholder="Hyderabad" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">State</label>
                  <input placeholder="Telangana" value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Country</label>
                  <input placeholder="India" value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">ZIP Code</label>
                  <input placeholder="500001" value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                <div className="col-span-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Consultation Fees & Slot</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">First Visit Fee (₹)</label>
                      <input type="number" placeholder="500" value={form.firstConsultationFee}
                        onChange={(e) => setForm({ ...form, firstConsultationFee: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Follow-up Fee (₹)</label>
                      <input type="number" placeholder="300" value={form.followupConsultationFee}
                        onChange={(e) => setForm({ ...form, followupConsultationFee: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Slot Duration (min)</label>
                      <input type="number" placeholder="30" value={form.timeSlotPerClientInMin}
                        onChange={(e) => setForm({ ...form, timeSlotPerClientInMin: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowPrivateForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
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
                  className="flex-1 bg-green-700 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition disabled:opacity-60">
                  {creating ? 'Creating...' : 'Create Practice'}
                </button>
              </div>
            </div>
          </div>
        )}

      
        {showAffiliateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Affiliate with Hospital</h2>
              <p className="text-xs text-gray-400 mb-6">Select a hospital to affiliate with and set your fees</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Office</label>
                  <select value={selectedOfficeId ?? ''} onChange={(e) => setSelectedOfficeId(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option value="">Choose an office</option>
                    {adminOffices.map((o: any) => (
                      <option key={o.id} value={o.id}>{o.name} — {o.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Hospital</label>
                  <select value={affiliateForm.hospitalId} onChange={(e) => handleHospitalSelect(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:opacity-50"
                    disabled={!selectedOfficeId}>
                    <option value="">Choose a hospital</option>
                    {hospitals.map((h: any) => (
                      <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
                    ))}
                  </select>
                  {affiliateForm.hospitalId && hospitals.find((h: any) => h.id === parseInt(affiliateForm.hospitalId)) && (
                    <p className="text-xs text-green-600 mt-1">✓ Default fees loaded. Edit below if needed.</p>
                  )}
                </div>

                <div className="col-span-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Consultation Fees & Slot</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">First Visit Fee (₹)</label>
                      <input type="number" placeholder="500" value={affiliateForm.firstConsultationFee}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, firstConsultationFee: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Follow-up Fee (₹)</label>
                      <input type="number" placeholder="300" value={affiliateForm.followupConsultationFee}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, followupConsultationFee: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Slot Duration (min)</label>
                      <input type="number" placeholder="30" value={affiliateForm.timeSlotPerClientInMin}
                        onChange={(e) => setAffiliateForm({ ...affiliateForm, timeSlotPerClientInMin: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAffiliateForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
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
                  className="flex-1 bg-green-700 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition disabled:opacity-60">
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
