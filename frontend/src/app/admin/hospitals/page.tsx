'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Pencil } from 'lucide-react';
import {
  getAllOfficesApi, createOfficeApi, updateOfficeApi,
  getHospitalsByOfficeApi, createHospitalApi, updateHospitalApi,
  deleteOfficeApi, deleteHospitalApi
} from '@/lib/api/admin.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
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

  // Office modal
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);
  const [officeForm, setOfficeForm] = useState(EMPTY_OFFICE);

  // Hospital modal
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

  // Office modal helpers
  const openCreateOffice = () => { setEditingOffice(null); setOfficeForm(EMPTY_OFFICE); setShowOfficeForm(true); };
  const openEditOffice = (office: any, e: any) => {
    e.stopPropagation();
    setEditingOffice(office);
    setOfficeForm({ name: office.name, city: office.city, state: office.state, country: office.country });
    setShowOfficeForm(true);
  };
  const closeOfficeModal = () => { setShowOfficeForm(false); setEditingOffice(null); setOfficeForm(EMPTY_OFFICE); };

  // Hospital modal helpers
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
    <div className="min-h-screen bg-gray-50 flex">
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
          {/* Offices List */}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{office.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{office.city}, {office.country}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => openEditOffice(office, e)}
                        className="text-blue-400 hover:text-blue-600 text-xs">
                        <Pencil size={13} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteOffice(office.id); }}
                        className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Hospitals */}
          <div className="flex-1 space-y-4">
            {!selectedOffice ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-4xl mb-3">🏥</p>
                <p className="text-gray-400 text-sm">Select an office to view its hospitals</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">
                    Hospitals under <span className="text-[#2d6be4]">{selectedOffice.name}</span>
                  </h2>
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
                  <div className="grid grid-cols-2 gap-4">
                    {hospitals.map((h: any) => (
                      <div key={h.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{h.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{h.streetAddress}</p>
                            <p className="text-xs text-gray-400">{h.city}, {h.state}, {h.country} - {h.zip}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">First: ₹{h.defaultFirstConsultationFee}</span>
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Follow-up: ₹{h.defaultFollowupFee}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditHospital(h)}
                              className="text-blue-400 hover:text-blue-600">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => deleteHospital(h.id)}
                              className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Office Modal (Create / Edit) */}
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

        {/* Hospital Modal (Create / Edit) */}
        {showHospitalForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                {editingHospital ? `Edit ${editingHospital.name}` : `Add Hospital to ${selectedOffice?.name}`}
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Hospital Name', placeholder: 'e.g. Apollo Hospital' },
                  { key: 'streetAddress', label: 'Street Address', placeholder: 'e.g. 123 Main St' },
                  { key: 'city', label: 'City', placeholder: 'e.g. Hyderabad' },
                  { key: 'state', label: 'State', placeholder: 'e.g. Telangana' },
                  { key: 'country', label: 'Country', placeholder: 'e.g. India' },
                  { key: 'zip', label: 'ZIP Code', placeholder: 'e.g. 500001' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type="text" placeholder={f.placeholder}
                      value={(hospitalForm as any)[f.key]}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, [f.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default First Visit Fee (₹)</label>
                    <input type="number" placeholder="e.g. 500"
                      value={hospitalForm.defaultFirstConsultationFee}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, defaultFirstConsultationFee: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Follow-up Fee (₹)</label>
                    <input type="number" placeholder="e.g. 300"
                      value={hospitalForm.defaultFollowupFee}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, defaultFollowupFee: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={closeHospitalModal}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleHospitalSubmit} disabled={creatingHospital || updatingHospital}
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60">
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
