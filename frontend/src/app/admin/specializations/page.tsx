'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getSpecializationRequestsApi, approveSpecializationApi, rejectSpecializationApi } from '@/lib/api/admin.api';
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

export default function AdminSpecializationsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['admin-specializations'],
    queryFn: getSpecializationRequestsApi,
    retry: false,
  });

  const { mutate: approve } = useMutation({
    mutationFn: ({ doctorId, specializationId }: any) => approveSpecializationApi(doctorId, specializationId),
    onSuccess: () => {
      toast.success('Specialization approved');
      queryClient.invalidateQueries({ queryKey: ['admin-specializations'] });
    },
    onError: () => toast.error('Failed to approve'),
  });

  const { mutate: reject } = useMutation({
    mutationFn: ({ doctorId, specializationId }: any) => rejectSpecializationApi(doctorId, specializationId),
    onSuccess: () => {
      toast.success('Specialization rejected');
      queryClient.invalidateQueries({ queryKey: ['admin-specializations'] });
    },
    onError: () => toast.error('Failed to reject'),
  });

  if (!user) return null;

  const requests = Array.isArray(res?.data) ? res.data : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Specialization Requests</h1>
            <p className="text-xs text-gray-400">Approve or reject doctor specialization requests</p>
          </div>
          {requests.length > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">
              {requests.length} Pending
            </span>
          )}
        </header>

        <div className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
            </div>
          ) : !requests.length ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <p className="text-4xl mb-3">🎓</p>
              <p className="text-gray-400 text-sm">No pending specialization requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req: any) => (
                <div key={`${req.doctorId}-${req.specializationId}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🎓</div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Dr. {req.doctor?.firstName} {req.doctor?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Requesting: <span className="font-medium text-[#2d6be4]">{req.specialization?.specializationName}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Doctor ID: #{req.doctorId}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => reject({ doctorId: req.doctorId, specializationId: req.specializationId })}
                      className="text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approve({ doctorId: req.doctorId, specializationId: req.specializationId })}
                      className="text-sm font-semibold text-white bg-[#2d6be4] hover:bg-blue-700 px-4 py-2 rounded-xl transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
