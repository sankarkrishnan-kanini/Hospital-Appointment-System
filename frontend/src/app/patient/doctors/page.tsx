'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { Search, X, ChevronRight, Clock, DollarSign } from 'lucide-react';
import { searchDoctorsApi, getDoctorProfileApi, getAvailableTimeSlotsApi, bookAppointmentApi } from '@/lib/api/patient.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'My Profile', href: '/patient/profile', icon: '' },
];

const SPECIALIZATIONS = [
  { id: 1, name: 'Cardiology' }, { id: 2, name: 'Neurology' },
  { id: 3, name: 'Dermatology' }, { id: 4, name: 'Orthopedics' },
  { id: 5, name: 'Pediatrics' }, { id: 6, name: 'Gynecology' },
  { id: 7, name: 'Ophthalmology' }, { id: 8, name: 'Psychiatry' },
  { id: 9, name: 'Radiology' }, { id: 10, name: 'General Surgery' },
];

export default function FindDoctorsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [city, setCity] = useState('');
  const [specializationId, setSpecializationId] = useState<number | ''>('');
  const [maxFee, setMaxFee] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'patient') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: doctorsRes, isLoading, refetch } = useQuery({
    queryKey: ['search-doctors', city, specializationId, maxFee],
    queryFn: () => searchDoctorsApi({
      ...(city && { city }),
      ...(specializationId && { specializationId }),
      ...(maxFee && { maxFee: Number(maxFee) }),
    }),
    enabled: false,
    retry: false,
  });

  const { data: slotsRes } = useQuery({
    queryKey: ['patient-slots', selectedDoctor?.id, selectedPractice?.doctorHospitalId],
    queryFn: () => getAvailableTimeSlotsApi(selectedDoctor.id, selectedPractice.doctorHospitalId),
    enabled: !!selectedDoctor && !!selectedPractice,
    retry: false,
  });

  const { mutate: book, isPending: booking } = useMutation({
    mutationFn: bookAppointmentApi,
    onSuccess: () => {
      toast.success('Appointment booked! View it in My Appointments.');
      setShowBooking(false);
      setSelectedDoctor(null);
      setSelectedPractice(null);
      setSelectedSlot(null);
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Failed to book appointment');
    },
  });

  if (!_hasHydrated || !user) return null;

  const doctors = Array.isArray(doctorsRes?.data) ? doctorsRes.data : [];
  const groupedSlots: { date: string; slots: any[] }[] = Array.isArray(slotsRes?.data) ? slotsRes.data : [];

  const handleSearch = () => {
    setSearched(true);
    refetch();
  };

  const handleBookNow = (doctor: any, practice: any) => {
    setSelectedDoctor(doctor);
    setSelectedPractice(practice);
    setSelectedSlot(null);
    setReason('');
 
    const filterMatch = specializationId ? Number(specializationId) : null;
    if (filterMatch) {
      setSelectedSpecId(filterMatch);
    } else {
      const firstName = doctor.specializations?.[0];
      const match = SPECIALIZATIONS.find(s => s.name === firstName);
      setSelectedSpecId(match?.id ?? null);
    }
    setShowBooking(true);
  };

  const handleConfirmBook = () => {
    if (!selectedSlot) return toast.error('Please select a time slot');
    if (!selectedSpecId) return toast.error('Could not determine specialization. Please use the specialization filter.');
    book({
      doctorId: selectedDoctor.id,
      doctorHospitalId: selectedPractice.doctorHospitalId,
      timeSlotId: selectedSlot,
      specializationId: selectedSpecId,
      reason,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-gray-900">Find Doctors</h1>
          <NotificationBell />
        </header>

        <div className="flex-1 p-6 space-y-5">
        
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Search Doctors</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Specialization</label>
                <select value={specializationId} onChange={e => setSpecializationId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white">
                  <option value="">All Specializations</option>
                  {SPECIALIZATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Hyderabad"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max Fee (₹)</label>
                <input type="number" value={maxFee} onChange={e => setMaxFee(e.target.value)} placeholder="e.g. 500"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
              </div>
              <div className="flex items-end">
                <button onClick={handleSearch}
                  className="w-full bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Search size={15} /> Search
                </button>
              </div>
            </div>
          </div>

        
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
            </div>
          )}

          {searched && !isLoading && !doctors.length && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-sm">No verified doctors found. Try different filters.</p>
            </div>
          )}

          {doctors.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {doctors.map((doc: any) => (
                <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-lg flex-shrink-0">
                      {doc.firstName?.[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Dr. {doc.firstName} {doc.lastName}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.specializations?.map((s: string) => (
                          <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                 
                  <div className="space-y-2">
                    {doc.practices?.map((p: any) => (
                      <div key={p.doctorHospitalId} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            {p.isPrivate ? 'Private Practice' : p.hospital?.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <DollarSign size={11} /> ₹{p.firstConsultationFee}
                            </span>
                            {p.city && (
                              <span className="text-xs text-gray-400">{p.city}</span>
                            )}
                            {p.insurances?.length > 0 && (
                              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                🛡 {p.insurances.slice(0, 2).join(', ')}{p.insurances.length > 2 ? ` +${p.insurances.length - 2}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <button onClick={() => handleBookNow(doc, p)}
                          className="flex items-center gap-1 text-xs font-medium text-[#2d6be4] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
                          Book <ChevronRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
        {showBooking && selectedDoctor && selectedPractice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Book Appointment</h2>
                  <p className="text-sm text-gray-400">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                </div>
                <button onClick={() => setShowBooking(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Practice</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedPractice.isPrivate ? 'Private Practice' : selectedPractice.hospital?.name}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <DollarSign size={11} /> First visit: ₹{selectedPractice.firstConsultationFee}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={11} /> {selectedPractice.timeSlotPerClientInMin ?? '—'} min/slot
                    </span>
                  </div>
                  {selectedPractice.insurances?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs text-gray-400">Insurances:</span>
                      {selectedPractice.insurances.map((ins: string) => (
                        <span key={ins} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{ins}</span>
                      ))}
                    </div>
                  )}
                </div>

             
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Consulting For *</label>
                  <select value={selectedSpecId ?? ''} onChange={e => setSelectedSpecId(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white">
                    <option value="">Select specialization</option>
                    {selectedDoctor?.specializations?.map((name: string) => {
                      const s = SPECIALIZATIONS.find(x => x.name === name);
                      if (s) return <option key={s.id} value={s.id}>{s.name}</option>;
                      // fallback: show the name even if not in local list
                      const idx = selectedDoctor.specializations.indexOf(name) + 1;
                      return <option key={idx} value={idx}>{name}</option>;
                    })}
                  </select>
                </div>

               <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Select Time Slot *</label>
                  {!groupedSlots.length ? (
                    <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
                      No available slots. Ask the doctor to generate slots.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto">
                      {groupedSlots.map((group) => (
                        <div key={group.date}>
                          <p className="text-xs font-semibold text-gray-500 mb-1.5">
                            {new Date(group.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {group.slots.map((slot: any) => (
                              <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                                className={`p-2.5 rounded-xl border text-xs font-medium transition text-center
                                  ${selectedSlot === slot.id
                                    ? 'border-[#2d6be4] bg-blue-50 text-[#2d6be4]'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                {new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

               
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Reason (optional)</label>
                  <input value={reason} onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Chest pain, routine checkup..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowBooking(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleConfirmBook} disabled={booking || !selectedSlot}
                  className="flex-1 bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
