'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getAllAppointmentsApi } from '@/lib/api/admin.api';
import { Search, X, ChevronRight, UserRound, Stethoscope, CalendarDays, Clock, Building2 } from 'lucide-react';
import AdminTopBar from '@/components/AdminTopBar';

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

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

function AppointmentCard({ apt }: { apt: any }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">#{apt.id}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[apt.status?.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {apt.status?.status}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays size={11} className="text-gray-400" />
              {new Date(apt.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={11} className="text-gray-400" />
              {apt.durationInMinutes} min
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Building2 size={11} className="text-gray-400" />
              {apt.doctorHospital?.hospital?.name ?? 'Private Practice'}
            </div>
          </div>
          {apt.cancellationReason && (
            <p className="text-xs text-red-500 mt-2 bg-red-50 rounded-lg px-3 py-1.5">
              Reason: {apt.cancellationReason}
            </p>
          )}
          {apt.history?.length > 0 && (
            <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 rounded-lg px-3 py-1.5">
              Rescheduled {apt.history.length} time{apt.history.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SlidePanel({ title, subtitle, onClose, children }: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── BY PATIENTS TAB ──────────────────────────────────────────────────────────

function ByPatientsTab({ appointments }: { appointments: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  // Group appointments by patient
  const patientMap = new Map<number, { patient: any; appointments: any[] }>();
  for (const apt of appointments) {
    if (!apt.client) continue;
    const id = apt.client.id;
    if (!patientMap.has(id)) patientMap.set(id, { patient: apt.client, appointments: [] });
    patientMap.get(id)!.appointments.push(apt);
  }
  const patients = Array.from(patientMap.values());

  const filtered = patients.filter(({ patient }) =>
    `${patient.firstName} ${patient.lastName} ${patient.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedPatientId !== null ? patientMap.get(selectedPatientId) : null;

  return (
    <>
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search patients by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
        {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400 hover:text-gray-600" /></button>}
      </div>

      {/* Patient list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!filtered.length ? (
          <div className="text-center py-16">
            <UserRound size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No patients found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Completed</th>
                <th className="px-6 py-4 font-medium">Cancelled</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(({ patient, appointments: apts }, i) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedPatientId(patient.id)}
                >
                  <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs">
                        {patient.firstName?.[0] ?? '?'}
                      </div>
                      <p className="font-semibold text-gray-800">{patient.firstName} {patient.lastName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{patient.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">{apts.length}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                      {apts.filter((a: any) => a.status?.status === 'Completed').length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full">
                      {apts.filter((a: any) => a.status?.status === 'CANCELLED').length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight size={15} className="text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide panel */}
      {selected && (
        <SlidePanel
          title={`${selected.patient.firstName} ${selected.patient.lastName}`}
          subtitle={`${selected.appointments.length} appointment${selected.appointments.length !== 1 ? 's' : ''} · ${selected.patient.email}`}
          onClose={() => setSelectedPatientId(null)}
        >
          {selected.appointments
            .sort((a: any, b: any) => new Date(b.probableStartTime).getTime() - new Date(a.probableStartTime).getTime())
            .map((apt: any) => (
              <div key={apt.id}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Dr. {apt.doctorHospital?.doctor?.firstName} {apt.doctorHospital?.doctor?.lastName}
                </p>
                <AppointmentCard apt={apt} />
              </div>
            ))}
        </SlidePanel>
      )}
    </>
  );
}

// ─── BY DOCTORS TAB ───────────────────────────────────────────────────────────

function ByDoctorsTab({ appointments }: { appointments: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  // Group appointments by doctor
  const doctorMap = new Map<number, { doctor: any; appointments: any[] }>();
  for (const apt of appointments) {
    const doc = apt.doctorHospital?.doctor;
    if (!doc) continue;
    const id = doc.id;
    if (!doctorMap.has(id)) doctorMap.set(id, { doctor: doc, appointments: [] });
    doctorMap.get(id)!.appointments.push(apt);
  }
  const doctors = Array.from(doctorMap.values());

  const filtered = doctors.filter(({ doctor }) =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedDoctorId !== null ? doctorMap.get(selectedDoctorId) : null;

  // Group selected doctor's appointments by patient for the panel
  const patientGroupsForDoctor: { patient: any; apts: any[] }[] = selected
    ? Array.from(
        selected.appointments.reduce((map: Map<number, { patient: any; apts: any[] }>, apt: any) => {
          const pid = apt.client?.id;
          if (!pid) return map;
          if (!map.has(pid)) map.set(pid, { patient: apt.client, apts: [] });
          map.get(pid)!.apts.push(apt);
          return map;
        }, new Map<number, { patient: any; apts: any[] }>()).values()
      )
    : [];

  return (
    <>
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
        {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400 hover:text-gray-600" /></button>}
      </div>

      {/* Doctor list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!filtered.length ? (
          <div className="text-center py-16">
            <Stethoscope size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No doctors found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Doctor</th>
                <th className="px-6 py-4 font-medium">Patients</th>
                <th className="px-6 py-4 font-medium">Total Apts</th>
                <th className="px-6 py-4 font-medium">Completed</th>
                <th className="px-6 py-4 font-medium">Cancelled</th>
                <th className="px-6 py-4 font-medium">Rescheduled</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(({ doctor, appointments: apts }, i) => {
                const uniquePatients = new Set(apts.map((a: any) => a.client?.id)).size;
                const rescheduled = apts.filter((a: any) => a.history?.length > 0).length;
                return (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedDoctorId(doctor.id)}
                  >
                    <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                          {doctor.firstName?.[0] ?? '?'}
                        </div>
                        <p className="font-semibold text-gray-800">Dr. {doctor.firstName} {doctor.lastName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-purple-50 text-purple-600 font-semibold px-2 py-0.5 rounded-full">{uniquePatients}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">{apts.length}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                        {apts.filter((a: any) => a.status?.status === 'Completed').length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full">
                        {apts.filter((a: any) => a.status?.status === 'CANCELLED').length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">{rescheduled}</span>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight size={15} className="text-gray-300" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide panel */}
      {selected && (
        <SlidePanel
          title={`Dr. ${selected.doctor.firstName} ${selected.doctor.lastName}`}
          subtitle={`${selected.appointments.length} appointment${selected.appointments.length !== 1 ? 's' : ''} across ${patientGroupsForDoctor.length} patient${patientGroupsForDoctor.length !== 1 ? 's' : ''}`}
          onClose={() => setSelectedDoctorId(null)}
        >
          {patientGroupsForDoctor.map(({ patient, apts }) => (
            <div key={patient.id} className="space-y-2">
              {/* Patient header */}
              <div className="flex items-center gap-2 pt-2">
                <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs flex-shrink-0">
                  {patient.firstName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{patient.firstName} {patient.lastName}</p>
                  <p className="text-xs text-gray-400">{patient.email} · {apts.length} appointment{apts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {/* Appointments for this patient under this doctor */}
              <div className="pl-9 space-y-2">
                {apts
                  .sort((a: any, b: any) => new Date(b.probableStartTime).getTime() - new Date(a.probableStartTime).getTime())
                  .map((apt: any) => <AppointmentCard key={apt.id} apt={apt} />)}
              </div>
            </div>
          ))}
        </SlidePanel>
      )}
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminAppointmentsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<'patients' | 'doctors'>('patients');

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: getAllAppointmentsApi,
    retry: false,
  });

  if (!_hasHydrated || !user) return null;

  const appointments = Array.isArray(res?.data) ? res.data : [];
  const total = appointments.length;
  const completed = appointments.filter((a: any) => a.status?.status === 'Completed').length;
  const cancelled = appointments.filter((a: any) => a.status?.status === 'CANCELLED').length;
  const active = appointments.filter((a: any) => a.status?.status === 'ACTIVE').length;
  const rescheduled = appointments.filter((a: any) => a.history?.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 flex pt-14">
      <AdminTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Appointments</h1>
            <p className="text-xs text-gray-400">All appointments in the system</p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full">
            {total} Total
          </span>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Active', value: active, color: 'bg-blue-50 text-blue-600', border: 'border-l-blue-500' },
              { label: 'Completed', value: completed, color: 'bg-green-50 text-green-600', border: 'border-l-green-500' },
              { label: 'Cancelled', value: cancelled, color: 'bg-red-50 text-red-500', border: 'border-l-red-400' },
              { label: 'Rescheduled', value: rescheduled, color: 'bg-amber-50 text-amber-600', border: 'border-l-amber-400' },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-xl p-5 border border-gray-100 border-l-4 ${s.border} shadow-sm`}>
                <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('patients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'patients' ? 'bg-[#2d6be4] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              <UserRound size={15} />
              By Patients
            </button>
            <button
              onClick={() => setTab('doctors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'doctors' ? 'bg-[#2d6be4] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              <Stethoscope size={15} />
              By Doctors
            </button>
          </div>

          {/* Tab content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
            </div>
          ) : tab === 'patients' ? (
            <ByPatientsTab appointments={appointments} />
          ) : (
            <ByDoctorsTab appointments={appointments} />
          )}

        </div>
      </main>
    </div>
  );
}
