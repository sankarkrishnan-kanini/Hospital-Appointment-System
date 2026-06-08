'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Pencil, Trash2, MapPin, Building2 } from 'lucide-react';
import AdminTopBar from '@/components/AdminTopBar';
import {
  getAllOfficesApi, createOfficeApi, updateOfficeApi,
  getHospitalsByOfficeApi, createHospitalApi, updateHospitalApi,
  deleteOfficeApi, deleteHospitalApi
} from '@/lib/api/admin.api';
import toast from 'react-hot-toast';

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

const EMPTY_HOSPITAL = { name: '', streetAddress: '', city: '', state: '', country: '', zip: '', defaultFirstConsultationFee: '', defaultFollowupFee: '' };
const EMPTY_OFFICE = { name: '', city: '', state: '', country: '' };

export default function AdminHospitalsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedOffice, setSelectedOffice] = useState<any>(null);

 
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);
  const [officeForm, setOfficeForm] = useState(EMPTY_OFFICE);

 
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState<any>(null);
  const [hospitalForm, setHospitalForm] = useState(EMPTY_HOSPITAL);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: officesRes, isLoading } = useQuery({ queryKey: ['admin-offices'], queryFn: getAllOfficesApi, retry: false });
  const { data: hospitalsRes } = useQuery({
    queryKey: ['admin-hospitals', selectedOffice?.id],
    queryFn: () => getHospitalsByOfficeApi(selectedOffice.id),
    enabled: !!selectedOffice, retry: false,
  });

  // Office mutations
  const { mutate: createOffice, isPending: creatingOffice } = useMutation({
    mutationFn: createOfficeApi,
    onSuccess: () => { toast.success('Office created'); closeOfficeModal(); queryClient.invalidateQueries({ queryKey: ['admin-offices'] }); },
    onError: () => toast.error('Failed to create office'),
  });

  const { mutate: updateOffice, isPending: updatingOffice } = useMutation({
    mutationFn: ({ id, dto }: any) => updateOfficeApi(id, dto),
    onSuccess: () => { toast.success('Office updated'); closeOfficeModal(); queryClient.invalidateQueries({ queryKey: ['admin-offices'] }); },
    onError: () => toast.error('Failed to update office'),
  });

  const { mutate: deleteOffice } = useMutation({
    mutationFn: deleteOfficeApi,
    onSuccess: () => { toast.success('Office deleted'); setSelectedOffice(null); queryClient.invalidateQueries({ queryKey: ['admin-offices'] }); },
    onError: () => toast.error('Failed to delete office'),
  });

  // Hospital mutations
  const { mutate: createHospital, isPending: creatingHospital } = useMutation({
    mutationFn: ({ officeId, dto }: any) => createHospitalApi(officeId, dto),
    onSuccess: () => { toast.success('Hospital created'); closeHospitalModal(); queryClient.invalidateQueries({ queryKey: ['admin-hospitals', selectedOffice?.id] }); },
    onError: () => toast.error('Failed to create hospital'),
  });

  const { mutate: updateHospital, isPending: updatingHospital } = useMutation({
    mutationFn: ({ id, dto }: any) => updateHospitalApi(id, dto),
    onSuccess: () => { toast.success('Hospital updated'); closeHospitalModal(); queryClient.invalidateQueries({ queryKey: ['admin-hospitals', selectedOffice?.id] }); },
    onError: () => toast.error('Failed to update hospital'),
  });

  const { mutate: deleteHospital } = useMutation({
    mutationFn: deleteHospitalApi,
    onSuccess: () => { toast.success('Hospital deleted'); queryClient.invalidateQueries({ queryKey: ['admin-hospitals', selectedOffice?.id] }); },
    onError: () => toast.error('Failed to delete hospital'),
  });

  if (!_hasHydrated || !user) return null;

  const offices = Array.isArray(officesRes?.data) ? officesRes.data : [];
  const hospitals = Array.isArray(hospitalsRes?.data) ? hospitalsRes.data : [];

  const openCreateOffice = () => { setEditingOffice(null); setOfficeForm(EMPTY_OFFICE); setShowOfficeForm(true); };
  const openEditOffice = (office: any) => {
    setEditingOffice(office);
    setOfficeForm({ name: office.name, city: office.city, state: office.state, country: office.country });
    setShowOfficeForm(true);
  };
  const closeOfficeModal = () => { setShowOfficeForm(false); setEditingOffice(null); setOfficeForm(EMPTY_OFFICE); };
  const openCreateHospital = () => { setEditingHospital(null); setHospitalForm(EMPTY_HOSPITAL); setShowHospitalForm(true); };
  const openEditHospital = (h: any) => {
    setEditingHospital(h);
    setHospitalForm({
      name: h.name, streetAddress: h.streetAddress, city: h.city,
      state: h.state, country: h.country, zip: h.zip,
      defaultFirstConsultationFee: h.defaultFirstConsultationFee?.toString() || '',
      defaultFollowupFee: h.defaultFollowupFee?.toString() || '',
    });
    setShowHospitalForm(true);
  };
  const closeHospitalModal = () => { setShowHospitalForm(false); setEditingHospital(null); setHospitalForm(EMPTY_HOSPITAL); };

  const handleOfficeSubmit = () => {
    if (editingOffice) updateOffice({ id: editingOffice.id, dto: officeForm });
    else createOffice(officeForm);
  };

  const handleHospitalSubmit = () => {
    const dto = {
      ...hospitalForm,
      defaultFirstConsultationFee: parseFloat(hospitalForm.defaultFirstConsultationFee) || 0,
      defaultFollowupFee: parseFloat(hospitalForm.defaultFollowupFee) || 0,
    };
    if (editingHospital) updateHospital({ id: editingHospital.id, dto });
    else createHospital({ officeId: selectedOffice.id, dto });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-14">
      <AdminTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Hospitals & Offices</h1>
            <p className="text-xs text-gray-400">Manage offices and their hospitals</p>
          </div>
          <button onClick={openCreateOffice}
            className="text-sm font-semibold bg-[#2d6be4] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            + New Office
          </button>
        </header>

        <div className="flex-1 p-6 flex gap-6">
          <div className="w-72 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 px-1">Offices ({offices.length})</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2d6be4]" />
              </div>
            ) : !offices.length ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                <p className="text-gray-400 text-sm">No offices yet</p>
                <button onClick={openCreateOffice} className="mt-2 text-xs text-[#2d6be4] hover:underline">Create first office</button>
              </div>
            ) : (
              offices.map((office: any) => (
                <div key={office.id} onClick={() => setSelectedOffice(office)}
                  className={`bg-white rounded-2xl border-2 p-4 cursor-pointer transition ${selectedOffice?.id === office.id ? 'border-[#2d6be4] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <p className="font-semibold text-gray-800 text-sm">{office.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{office.city}, {office.country}</p>
                  <p className="text-xs text-gray-300 mt-1">{office.hospitals?.length ?? 0} hospital{office.hospitals?.length !== 1 ? 's' : ''}</p>
                </div>
              ))
            )}
          </div>

        
          <div className="flex-1 space-y-4">
            {!selectedOffice ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Building2 size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">Select an office to view details</p>
              </div>
            ) : (
              <>
                {/* Office detail card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-[#2d6be4]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">{selectedOffice.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={11} className="text-gray-400" />
                        <p className="text-xs text-gray-500">{selectedOffice.city}, {selectedOffice.state}, {selectedOffice.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditOffice(selectedOffice)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => { deleteOffice(selectedOffice.id); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

                {/* Hospitals header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Hospitals under <span className="text-[#2d6be4]">{selectedOffice.name}</span>
                  </p>
                  <button onClick={openCreateHospital}
                    className="text-sm font-semibold bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition">
                    + Add Hospital
                  </button>
                </div>
                {!hospitals.length ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-400 text-sm">No hospitals under this office</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-left text-gray-500">
                          <th className="px-5 py-3 font-medium">#</th>
                          <th className="px-5 py-3 font-medium">Hospital Name</th>
                          <th className="px-5 py-3 font-medium">Address</th>
                          <th className="px-5 py-3 font-medium">First Visit</th>
                          <th className="px-5 py-3 font-medium">Follow-up</th>
                          <th className="px-5 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {hospitals.map((h: any, i: number) => (
                          <tr key={h.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                            <td className="px-5 py-3">
                              <p className="font-semibold text-gray-800">{h.name}</p>
                              <p className="text-xs text-gray-400">{h.city}, {h.state}</p>
                            </td>
                            <td className="px-5 py-3 text-gray-500 text-xs">
                              {h.streetAddress}, {h.zip}
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">₹{h.defaultFirstConsultationFee}</span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">₹{h.defaultFollowupFee}</span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditHospital(h)}
                                  className="text-xs font-medium text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                                  <Pencil size={11} /> Edit
                                </button>
                                <button onClick={() => deleteHospital(h.id)}
                                  className="text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

     
        {showOfficeForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                {editingOffice ? 'Edit Office' : 'Create New Office'}
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Office Name', placeholder: 'e.g. Apollo Office' },
                  { key: 'city', label: 'City', placeholder: 'e.g. Hyderabad' },
                  { key: 'state', label: 'State', placeholder: 'e.g. Telangana' },
                  { key: 'country', label: 'Country', placeholder: 'e.g. India' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type="text" placeholder={f.placeholder}
                      value={(officeForm as any)[f.key]}
                      onChange={(e) => setOfficeForm({ ...officeForm, [f.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={closeOfficeModal}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleOfficeSubmit} disabled={creatingOffice || updatingOffice}
                  className="flex-1 bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                  {creatingOffice || updatingOffice ? 'Saving...' : editingOffice ? 'Save Changes' : 'Create Office'}
                </button>
              </div>
            </div>
          </div>
        )}

       
        {showHospitalForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {editingHospital ? `Edit ${editingHospital.name}` : `Add Hospital to ${selectedOffice?.name}`}
              </h2>
              <p className="text-xs text-gray-400 mb-6">{editingHospital ? 'Update hospital details below' : 'Fill in the details for the new hospital'}</p>

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name</label>
                  <input type="text" placeholder="e.g. Apollo Hospital"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                  <input type="text" placeholder="e.g. 123 Main St"
                    value={hospitalForm.streetAddress}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, streetAddress: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input type="text" placeholder="e.g. Hyderabad"
                    value={hospitalForm.city}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                  <input type="text" placeholder="e.g. Telangana"
                    value={hospitalForm.state}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <input type="text" placeholder="e.g. India"
                    value={hospitalForm.country}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
                  <input type="text" placeholder="e.g. 500001"
                    value={hospitalForm.zip}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, zip: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>

                <div className="col-span-2 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Consultation Fees</p>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Default First Visit Fee (₹)</label>
                      <input type="number" placeholder="e.g. 500"
                        value={hospitalForm.defaultFirstConsultationFee}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, defaultFirstConsultationFee: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Follow-up Fee (₹)</label>
                      <input type="number" placeholder="e.g. 300"
                        value={hospitalForm.defaultFollowupFee}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, defaultFollowupFee: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={closeHospitalModal}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleHospitalSubmit} disabled={creatingHospital || updatingHospital}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60">
                  {creatingHospital || updatingHospital ? 'Saving...' : editingHospital ? 'Save Changes' : 'Add Hospital'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
