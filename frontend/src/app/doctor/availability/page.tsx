'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DoctorTopBar from '@/components/DoctorTopBar';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { getDoctorOfficesApi, setAvailabilityApi, getAvailabilityApi, deleteAvailabilityApi, markUnavailabilityApi } from '@/lib/api/doctor.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/doctor', icon: '' },
  { label: 'My Profile', href: '/doctor/profile', icon: '' },
  { label: 'Offices', href: '/doctor/offices', icon: '' },
  { label: 'Availability', href: '/doctor/availability', icon: '' },
  { label: 'Time Slots', href: '/doctor/timeslots', icon: '' },
  { label: 'Appointments', href: '/doctor/appointments', icon: '' },
];

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function DoctorAvailabilityPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);
  const [form, setForm] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' });
  const [unavailForm, setUnavailForm] = useState({ date: '', startTime: '', endTime: '', reason: '', isFullDay: true });

  useEffect(() => {
    if (!user || user.role !== 'doctor') router.replace('/auth/login');
  }, [user, router]);

  const { data: officesRes } = useQuery({ queryKey: ['doctor-offices'], queryFn: getDoctorOfficesApi, retry: false });
  const { data: availabilityRes } = useQuery({
    queryKey: ['doctor-availability', selectedOffice],
    queryFn: () => getAvailabilityApi(selectedOffice!),
    enabled: !!selectedOffice,
    retry: false,
  });

  const { mutate: setAvailability, isPending } = useMutation({
    mutationFn: setAvailabilityApi,
    onSuccess: (res) => {
      const data = res?.data;
      // if backend returned an error object as 200
      if (data?.statusCode && data?.statusCode >= 400) {
        toast.error(typeof data.message === 'string' ? data.message : 'Failed to set availability');
        return;
      }
      toast.success('Availability set');
      queryClient.invalidateQueries({ queryKey: ['doctor-availability', selectedOffice] });
    },
    onError: (err: any) => { const m = err?.response?.data?.message; toast.error(typeof m === 'string' ? m : Array.isArray(m) ? m[0] : 'Failed to set availability'); },
  });

  const { mutate: deleteAvailability } = useMutation({
    mutationFn: deleteAvailabilityApi,
    onSuccess: () => {
      toast.success('Availability removed');
      queryClient.invalidateQueries({ queryKey: ['doctor-availability', selectedOffice] });
    },
    onError: (err: any) => { const m = err?.response?.data?.message; toast.error(typeof m === 'string' ? m : Array.isArray(m) ? m[0] : 'Failed to delete'); },
  });

  const { mutate: markUnavailability, isPending: markingUnavail } = useMutation({
    mutationFn: markUnavailabilityApi,
    onSuccess: (res) => {
      toast.success(res?.data?.message || 'Unavailability marked successfully');
      setUnavailForm({ date: '', startTime: '', endTime: '', reason: '', isFullDay: true });
    },
    onError: (err: any) => {
      const m = err?.response?.data?.message;
      const msg = typeof m === 'string' ? m : Array.isArray(m) ? m[0] : 'Failed to mark unavailability';
      toast.error(`⚠️ ${msg}`, { duration: 4000 });
    },
  });

  if (!user) return null;

  const offices = Array.isArray(officesRes?.data) ? officesRes.data : [];
  const availability = Array.isArray(availabilityRes?.data) ? availabilityRes.data : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffice) return toast.error('Select an office first');
    setAvailability({ doctorHospitalId: selectedOffice, ...form });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-12">
      <DoctorTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-12 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Availability</h1>
            <p className="text-xs text-gray-400">Set your weekly schedule</p>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Office Selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Office / Hospital</label>
            <select value={selectedOffice ?? ''} onChange={(e) => setSelectedOffice(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
              <option value="">Choose an office</option>
              {offices.map((o: any) => (
                <option key={o.id} value={o.id}>
                  {o.isPrivate ? `Private Practice — ${o.city}` : o.hospital?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedOffice && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Add Availability Form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={15} className="text-green-700" /> Add Availability
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Day of Week</label>
                    <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                      <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                      <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <button type="submit" disabled={isPending}
                    className="w-full bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 transition disabled:opacity-60">
                    {isPending ? 'Saving...' : 'Set Availability'}
                  </button>
                </form>
              </div>

              {/* Current Availability */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarDays size={15} className="text-green-700" /> Current Schedule
                </h3>
                {!availability.length ? (
                  <p className="text-sm text-gray-400">No availability set yet</p>
                ) : (
                  <div className="space-y-2">
                    {DAYS.map(day => {
                      const slot = availability.find((a: any) => a.dayOfWeek === day);
                      if (!slot) return null;
                      return (
                        <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-800 capitalize">{day.toLowerCase()}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(slot.startTime).toUTCString().slice(17, 22)} — {new Date(slot.endTime).toUTCString().slice(17, 22)}
                            </p>
                          </div>
                          <button onClick={() => deleteAvailability(slot.id)}
                            className="text-gray-300 hover:text-red-500 transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

              {/* Mark Unavailability */}
              <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="text-orange-400">✕</span> Mark Unavailability
                </h3>
                <p className="text-xs text-gray-400 mb-4">Block a date or time range. Existing slots will be deleted and booked appointments will be cancelled.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                    <input type="date" value={unavailForm.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setUnavailForm({ ...unavailForm, date: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="fullday" checked={unavailForm.isFullDay}
                      onChange={e => setUnavailForm({ ...unavailForm, isFullDay: e.target.checked })}
                      className="rounded" />
                    <label htmlFor="fullday" className="text-xs font-medium text-gray-600">Full Day</label>
                  </div>

                  {!unavailForm.isFullDay && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                        <input type="time" value={unavailForm.startTime}
                          onChange={e => setUnavailForm({ ...unavailForm, startTime: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                        <input type="time" value={unavailForm.endTime}
                          onChange={e => setUnavailForm({ ...unavailForm, endTime: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Reason (optional)</label>
                    <input value={unavailForm.reason}
                      onChange={e => setUnavailForm({ ...unavailForm, reason: e.target.value })}
                      placeholder="e.g. Personal leave, emergency..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>

                  <button
                    onClick={() => {
                      if (!unavailForm.date) return toast.error('Please select a date');
                      const dto: any = { date: unavailForm.date };
                      if (unavailForm.reason) dto.reason = unavailForm.reason;
                      if (!unavailForm.isFullDay) {
                        if (!unavailForm.startTime || !unavailForm.endTime)
                          return toast.error('Please select start and end time');
                        dto.startTime = unavailForm.startTime;
                        dto.endTime = unavailForm.endTime;
                      }
                      markUnavailability(dto);
                    }}
                    disabled={markingUnavail}
                    className="w-full bg-orange-400 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-orange-500 transition disabled:opacity-60">
                    {markingUnavail ? 'Marking...' : 'Mark as Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
