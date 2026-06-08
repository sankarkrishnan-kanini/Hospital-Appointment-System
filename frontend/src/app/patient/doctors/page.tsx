'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, X, ChevronRight, Clock, DollarSign, MessageCircle } from 'lucide-react';
import { searchDoctorsApi, getAvailableTimeSlotsApi, bookAppointmentApi, getSpecializationsApi } from '@/lib/api/patient.api';
import { startChatApi } from '@/lib/api/chat.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'Messages', href: '/patient/chat', icon: '' },
  { label: 'My Profile', href: '/patient/profile', icon: '' },
];

export default function FindDoctorsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [city, setCity] = useState('');
  const [specializationId, setSpecializationId] = useState<number | ''>('');
  const [maxFee, setMaxFee] = useState('');
  const [insurance, setInsurance] = useState('');
  const [searched, setSearched] = useState(false);

  const { data: specsRes } = useQuery({
    queryKey: ['patient-specializations'],
    queryFn: getSpecializationsApi,
    retry: false,
  });

  const SPECIALIZATIONS = Array.isArray(specsRes?.data)
    ? specsRes.data.map((s: any) => ({ id: s.id, name: s.specializationName }))
    : [];


  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [isFollowup, setIsFollowup] = useState(false);

  // ── Feature #5: Reason Templates ─────────────────────────────────────────────
  const REASON_TEMPLATES = ['Routine Checkup', 'Follow-up Visit', 'New Symptoms', 'Test Results Review', 'Second Opinion', 'Prescription Renewal'];

  // ── Feature #2: Slot grouping helper ─────────────────────────────────────────
  const groupSlotsByPeriod = (slots: any[]) => {
    const morning: any[] = [], afternoon: any[] = [], evening: any[] = [];
    slots.forEach(s => {
      const h = new Date(s.startTime).getUTCHours();
      if (h < 12) morning.push(s);
      else if (h < 17) afternoon.push(s);
      else evening.push(s);
    });
    return { morning, afternoon, evening };
  };

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
      ...(insurance && { insurance }),
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
    // ── Feature #3: detect follow-up ──
    // We don't have appointments here, but we pass it via query — check via queryClient cache
    const cachedApts = queryClient.getQueryData<any>(['patient-appointments']);
    const allApts = Array.isArray(cachedApts?.data) ? cachedApts.data : [];
    const hasCompleted = allApts.some((a: any) =>
      a.doctorHospital?.doctor?.id === doctor.id && a.status?.status === 'Completed'
    );
    setIsFollowup(hasCompleted);

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
    <div className="min-h-screen bg-gray-50 flex pt-14">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <div className="flex-1 p-6 space-y-5">
        
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Search Doctors</h3>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Insurance</label>
                <input value={insurance} onChange={e => setInsurance(e.target.value)} placeholder="e.g. Star Health"
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
                        {[...new Set(doc.specializations as string[])]?.map((s: string, i: number) => (
                          <span key={`${s}-${i}`} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await startChatApi(doc.id);
                          router.push('/patient/chat');
                        } catch {
                          toast.error('Could not start chat. Please set up your profile first.');
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                      title="Message this doctor"
                    >
                      <MessageCircle size={12} /> Chat
                    </button>
                  </div>

                 
                  <div className="space-y-2">
                    {doc.practices?.map((p: any) => (
                      <div key={p.doctorHospitalId} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            {p.isPrivate
                              ? p.city ? `Private · ${p.city}` : 'Private Practice'
                              : p.hospital?.name}
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
                    {selectedPractice.isPrivate
                      ? selectedPractice.city ? `Private · ${selectedPractice.city}` : 'Private Practice'
                      : selectedPractice.hospital?.name}
                  </p>
                  {/* ── Feature #3: Fee Estimator ── */}
                  <div className="flex gap-3 mt-3">
                    <div className={`flex-1 rounded-xl p-2.5 border-2 text-center transition ${
                      !isFollowup ? 'border-[#2d6be4] bg-blue-50' : 'border-gray-100 bg-white'
                    }`}>
                      <p className="text-[10px] text-gray-400 font-medium">First Visit</p>
                      <p className={`text-base font-bold mt-0.5 ${ !isFollowup ? 'text-[#2d6be4]' : 'text-gray-400'}`}>
                        ₹{selectedPractice.firstConsultationFee ?? '—'}
                      </p>
                    </div>
                    <div className={`flex-1 rounded-xl p-2.5 border-2 text-center transition ${
                      isFollowup ? 'border-[#2d6be4] bg-blue-50' : 'border-gray-100 bg-white'
                    }`}>
                      <p className="text-[10px] text-gray-400 font-medium">Follow-up</p>
                      <p className={`text-base font-bold mt-0.5 ${ isFollowup ? 'text-[#2d6be4]' : 'text-gray-400'}`}>
                        ₹{selectedPractice.followupConsultationFee ?? '—'}
                      </p>
                    </div>
                  </div>
                  {isFollowup && (
                    <p className="text-[11px] text-emerald-600 bg-emerald-50 rounded-lg px-3 py-1.5 mt-2 font-medium">
                      ✅ Follow-up rate applied — you've visited this doctor before
                    </p>
                  )}
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
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
                    // ── Feature #2: Time Slot Grouping ──
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {groupedSlots.map((group) => {
                        const { morning, afternoon, evening } = groupSlotsByPeriod(group.slots);
                        const periods = [
                          { label: '🌅 Morning', slots: morning },
                          { label: '☀️ Afternoon', slots: afternoon },
                          { label: '🌆 Evening', slots: evening },
                        ].filter(p => p.slots.length > 0);
                        return (
                          <div key={group.date}>
                            <p className="text-xs font-semibold text-gray-500 mb-2">
                              {new Date(group.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                            </p>
                            {periods.map(period => (
                              <div key={period.label} className="mb-2">
                                <p className="text-[11px] text-gray-400 font-medium mb-1.5">{period.label}</p>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {period.slots.map((slot: any) => (
                                    <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                                      className={`py-2 rounded-xl border text-[11px] font-semibold transition text-center ${
                                        selectedSlot === slot.id
                                          ? 'border-[#2d6be4] bg-[#2d6be4] text-white shadow-sm'
                                          : 'border-gray-200 text-gray-600 hover:border-[#2d6be4] hover:text-[#2d6be4] bg-white'
                                      }`}>
                                      {new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Feature #5: Reason Templates ── */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Reason for Visit</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {REASON_TEMPLATES.map(t => (
                      <button key={t} onClick={() => setReason(t)}
                        className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition ${
                          reason === t
                            ? 'bg-[#2d6be4] text-white border-[#2d6be4]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6be4] hover:text-[#2d6be4]'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <input value={reason} onChange={e => setReason(e.target.value)}
                    placeholder="Or type your own reason..."
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
