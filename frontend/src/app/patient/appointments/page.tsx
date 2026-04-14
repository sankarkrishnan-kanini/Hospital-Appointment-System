'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { CalendarDays, X, RefreshCw, CheckCircle2, User, Building2, DollarSign, Hash } from 'lucide-react';
import { getPatientAppointmentsApi, cancelAppointmentApi, rescheduleAppointmentApi, getAvailableTimeSlotsApi } from '@/lib/api/patient.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'My Profile', href: '/patient/profile', icon: '' },
];

export default function PatientAppointmentsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [cancelModal, setCancelModal] = useState<any>(null);
  const [rescheduleModal, setRescheduleModal] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newSlotId, setNewSlotId] = useState<number | null>(null);
  const [summaryModal, setSummaryModal] = useState<any>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'patient') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: getPatientAppointmentsApi,
    retry: false,
  });

  const { data: slotsRes } = useQuery({
    queryKey: ['reschedule-slots', rescheduleModal?.doctorHospital?.id],
    queryFn: () => getAvailableTimeSlotsApi(
      rescheduleModal.doctorHospital.doctorId,
      rescheduleModal.doctorHospital.id
    ),
    enabled: !!rescheduleModal,
    retry: false,
  });

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: ({ id, dto }: any) => cancelAppointmentApi(id, dto),
    onSuccess: () => {
      toast.success('Appointment cancelled');
      setCancelModal(null);
      setCancelReason('');
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Failed to cancel');
    },
  });

  const { mutate: reschedule, isPending: rescheduling } = useMutation({
    mutationFn: ({ id, dto }: any) => rescheduleAppointmentApi(id, dto),
    onSuccess: () => {
      toast.success('Appointment rescheduled');
      setRescheduleModal(null);
      setNewSlotId(null);
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Failed to reschedule');
    },
  });

  if (!_hasHydrated || !user) return null;

  const all = Array.isArray(res?.data) ? res.data : [];
  const filtered = filter === 'upcoming'
    ? all.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED')
    : filter === 'completed' ? all.filter((a: any) => a.status?.status === 'Completed')
    : filter === 'cancelled' ? all.filter((a: any) => a.status?.status === 'CANCELLED')
    : all;

  const slots: { date: string; slots: any[] }[] = Array.isArray(slotsRes?.data) ? slotsRes.data : [];

  const statusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-50 text-green-600';
    if (status === 'CANCELLED') return 'bg-red-50 text-red-600';
    return 'bg-blue-50 text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-gray-900">My Appointments</h1>
          <NotificationBell />
        </header>

        <div className="flex-1 p-6 space-y-5">
         
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total', value: all.length, border: 'border-l-gray-400' },
              { label: 'Upcoming', value: all.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED').length, border: 'border-l-blue-500' },
              { label: 'Completed', value: all.filter((a: any) => a.status?.status === 'Completed').length, border: 'border-l-green-500' },
              { label: 'Cancelled', value: all.filter((a: any) => a.status?.status === 'CANCELLED').length, border: 'border-l-red-400' },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.border} shadow-sm p-4`}>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

         
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize
                  ${filter === f ? 'bg-[#2d6be4] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {f}
              </button>
            ))}
          </div>

         
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              </div>
            ) : !filtered.length ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CalendarDays size={20} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No appointments found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Doctor</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((apt: any) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-500">#{apt.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          Dr. {apt.doctorHospital?.doctor?.firstName} {apt.doctorHospital?.doctor?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {apt.doctorHospital?.isPrivate ? 'Private Practice' : apt.doctorHospital?.hospital?.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(apt.status?.status)}`}>
                          {apt.status?.status ?? 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {apt.status?.status !== 'Completed' && apt.status?.status !== 'CANCELLED' && (
                          <div className="flex gap-2">
                            <button onClick={() => setRescheduleModal(apt)}
                              className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition">
                              <RefreshCw size={11} /> Reschedule
                            </button>
                            <button onClick={() => setCancelModal(apt)}
                              className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition">
                              <X size={11} /> Cancel
                            </button>
                            <button onClick={() => setSummaryModal(apt)}
                              className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition">
                              View
                            </button>
                          </div>
                        )}
                        {(apt.status?.status === 'Completed' || apt.status?.status === 'CANCELLED') && (
                          <button onClick={() => setSummaryModal(apt)}
                            className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition">
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

       
        {cancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cancel Appointment</h2>
              <p className="text-sm text-gray-400 mb-5">Appointment #{cancelModal.id} with Dr. {cancelModal.doctorHospital?.doctor?.firstName}</p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Reason for cancellation *</label>
                <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setCancelModal(null); setCancelReason(''); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button
                  onClick={() => cancel({ id: cancelModal.id, dto: { reason: cancelReason } })}
                  disabled={cancelling || !cancelReason}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition disabled:opacity-60">
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

     
        {rescheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h2>
                  <p className="text-sm text-gray-400">Select a new time slot</p>
                </div>
                <button onClick={() => { setRescheduleModal(null); setNewSlotId(null); }}
                  className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              {!slots.length ? (
                <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
                  No available slots for rescheduling.
                </p>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto mb-5">
                  {slots.map((group) => (
                    <div key={group.date}>
                      <p className="text-xs font-semibold text-gray-500 mb-1.5">
                        {new Date(group.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {group.slots.map((slot: any) => (
                          <button key={slot.id} onClick={() => setNewSlotId(slot.id)}
                            className={`p-2.5 rounded-xl border text-xs font-medium transition text-center
                              ${newSlotId === slot.id
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

              <div className="flex gap-3">
                <button onClick={() => { setRescheduleModal(null); setNewSlotId(null); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button
                  onClick={() => reschedule({ id: rescheduleModal.id, dto: { newTimeSlotId: newSlotId } })}
                  disabled={rescheduling || !newSlotId}
                  className="flex-1 bg-[#2d6be4] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                  {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        )}
       
        {summaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 size={28} className="text-[#2d6be4]" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Appointment Summary</h2>
              </div>
              <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
                {[
                  { icon: <Hash size={14} className="text-gray-400" />, label: 'Appointment ID', value: `#${summaryModal.id}` },
                  { icon: <User size={14} className="text-gray-400" />, label: 'Doctor', value: `Dr. ${summaryModal.doctorHospital?.doctor?.firstName} ${summaryModal.doctorHospital?.doctor?.lastName}` },
                  { icon: <Building2 size={14} className="text-gray-400" />, label: 'Hospital', value: summaryModal.doctorHospital?.isPrivate ? 'Private Practice' : summaryModal.doctorHospital?.hospital?.name },
                  { icon: <CalendarDays size={14} className="text-gray-400" />, label: 'Date & Time', value: new Date(summaryModal.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' }) },
                  { icon: <DollarSign size={14} className="text-gray-400" />, label: 'Consultation Fee', value: `₹${summaryModal.doctorHospital?.firstConsultationFee ?? '—'}` },
                  ...(summaryModal.cancellationReason ? [{ icon: <X size={14} className="text-red-400" />, label: 'Cancellation Reason', value: summaryModal.cancellationReason }] : []),
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2 text-xs text-gray-500">{icon}{label}</span>
                    <span className="text-xs font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSummaryModal(null)}
                className="w-full mt-6 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
