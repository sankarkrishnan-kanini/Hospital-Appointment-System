'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import PatientTopBar from '@/components/PatientTopBar';
import { UserRound } from 'lucide-react';
import { getClientAccountApi, createClientAccountApi } from '@/lib/api/patient.api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', href: '/patient', icon: '' },
  { label: 'Find Doctors', href: '/patient/doctors', icon: '' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '' },
  { label: 'My Profile', href: '/patient/profile', icon: '' },
];

export default function PatientProfilePage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ firstName: '', lastName: '', contactNumber: '', email: '' });

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'patient') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: getClientAccountApi,
    retry: false,
  });

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: createClientAccountApi,
    onSuccess: () => {
      toast.success('Profile created successfully');
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Failed to create profile');
    },
  });

  if (!_hasHydrated || !user) return null;

  const profile = profileRes?.data && !profileRes.data.statusCode ? profileRes.data : null;

  return (
    <div className="min-h-screen bg-gray-50 flex pt-12">
      <PatientTopBar />
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <div className="flex-1 p-6 max-w-2xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
            </div>
          ) : profile ? (
         
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700 font-bold text-2xl">{profile.firstName?.[0]}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                  <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-full">Patient Account</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'First Name', value: profile.firstName },
                  { label: 'Last Name', value: profile.lastName },
                  { label: 'Email', value: profile.email },
                  { label: 'Contact Number', value: profile.contactNumber },
                ].map((f) => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1.5">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
          
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Complete Your Profile</h2>
                <p className="text-sm text-gray-400 mt-1">Fill in your details to book appointments</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
                    <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                      placeholder="e.g. Rahul"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
                    <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                      placeholder="e.g. Sharma"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Contact Number *</label>
                  <input value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6be4]" />
                </div>
                <button onClick={() => createAccount(form)} disabled={isPending}
                  className="w-full bg-[#2d6be4] text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                  {isPending ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
