'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Clock, Plus } from 'lucide-react';
import { getDoctorOfficesApi, generateTimeSlotsApi, getTimeSlotsApi } from '@/lib/api/doctor.api';
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

export default function DoctorTimeSlotsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router]);

  const { data: officesRes } = useQuery({ queryKey: ['doctor-offices'], queryFn: getDoctorOfficesApi, retry: false });
  const { data: slotsRes } = useQuery({
    queryKey: ['doctor-timeslots', selectedOffice],
    queryFn: () => getTimeSlotsApi(selectedOffice!),
    enabled: !!selectedOffice,
    retry: false,
  });

  const { mutate: generate, isPending } = useMutation({
    mutationFn: generateTimeSlotsApi,
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Time slots generated');
      queryClient.invalidateQueries({ queryKey: ['doctor-timeslots', selectedOffice] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to generate slots'),
  });

  if (!user) return null;

  const offices = Array.isArray(officesRes?.data) ? officesRes.data : [];
  const slots = Array.isArray(slotsRes?.data) ? slotsRes.data : [];
  const bookedSlots = slots.filter((s: any) => s.isBooked);
  const availableSlots = slots.filter((s: any) => !s.isBooked);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Time Slots</h1>
            <p className="text-xs text-gray-400">Generate and manage appointment slots</p>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Generate Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={15} className="text-[#2d6be4]" /> Generate Time Slots
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Office / Hospital</label>
                <select value={selectedOffice ?? ''} onChange={(e) => setSelectedOffice(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4] bg-white">
                  <option value="">Select office</option>
                  {offices.map((o: any) => (
                    <option key={o.id} value={o.id}>
                      {o.isPrivate ? `Private — ${o.city}` : o.hospital?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    if (!selectedOffice) return toast.error('Select an office');
                    if (!date) return toast.error('Select a date');
                    generate({ doctorHospitalId: selectedOffice, date });
                  }}
                  disabled={isPending}
                  className="w-full bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  <Clock size={15} />
                  {isPending ? 'Generating...' : 'Generate Slots'}
                </button>
              </div>
            </div>
          </div>

          {selectedOffice && (
            <>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Slots', value: slots.length, border: 'border-l-gray-400' },
                  { label: 'Available', value: availableSlots.length, border: 'border-l-green-500' },
                  { label: 'Booked', value: bookedSlots.length, border: 'border-l-blue-500' },
                ].map((s) => (
                  <div key={s.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.border} shadow-sm p-5`}>
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">All Time Slots</h3>
                {!slots.length ? (
                  <p className="text-sm text-gray-400">No slots generated yet. Select a date and generate.</p>
                ) : (
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                    {slots.map((slot: any) => (
                      <div key={slot.id}
                        className={`p-3 rounded-xl border text-center text-xs font-medium
                          ${slot.isBooked
                            ? 'bg-blue-50 border-blue-100 text-blue-600'
                            : 'bg-green-50 border-green-100 text-green-600'
                          }`}>
                        <p>{new Date(slot.startTime).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</p>
                        <p className="mt-0.5">
                          {new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                        </p>
                        <p className="mt-1 text-xs opacity-70">{slot.isBooked ? 'Booked' : 'Available'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
