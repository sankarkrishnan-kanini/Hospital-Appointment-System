'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { getAllUsersApi, activateUserApi, deactivateUserApi } from '@/lib/api/admin.api';
import toast from 'react-hot-toast';
import { Search, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '' },
  { label: 'Analytics', href: '/admin/analytics', icon: '' },
  { label: 'Users', href: '/admin/users', icon: '' },
  { label: 'Doctors', href: '/admin/doctors', icon: '' },
  { label: 'Patients', href: '/admin/patients', icon: '' },
  { label: 'Appointments', href: '/admin/appointments', icon: '' },
  { label: 'Hospitals', href: '/admin/hospitals', icon: '' },
  { label: 'Specializations', href: '/admin/specializations', icon: '' },
];

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'doctor' | 'patient'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<'email' | 'role' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== 'admin') router.replace('/auth/login');
  }, [user, router, _hasHydrated]);

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsersApi,
    retry: false,
  });

  const { mutate: activate } = useMutation({
    mutationFn: activateUserApi,
    onSuccess: () => { toast.success('User activated'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: () => toast.error('Failed to activate user'),
  });

  const { mutate: deactivate } = useMutation({
    mutationFn: deactivateUserApi,
    onSuccess: () => { toast.success('User deactivated'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: () => toast.error('Failed to deactivate user'),
  });

  if (!_hasHydrated || !user) return null;

  const users = Array.isArray(usersRes?.data) ? usersRes.data : [];

  const filtered = useMemo(() => {
    let result = [...users];

    // search
    if (search) {
      result = result.filter((u: any) =>
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // role filter
    if (roleFilter !== 'all') result = result.filter((u: any) => u.role === roleFilter);

    // status filter
    if (statusFilter === 'active') result = result.filter((u: any) => u.isActive);
    if (statusFilter === 'inactive') result = result.filter((u: any) => !u.isActive);

    // sort
    result.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = aVal?.toLowerCase?.() ?? '';
        bVal = bVal?.toLowerCase?.() ?? '';
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, roleFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className={sortField === field && sortDir === 'asc' ? 'text-[#2d6be4]' : 'text-gray-300'} />
      <ChevronDown size={10} className={sortField === field && sortDir === 'desc' ? 'text-[#2d6be4]' : 'text-gray-300'} />
    </span>
  );

  const roleColor: Record<string, string> = {
    admin: 'bg-blue-50 text-blue-700',
    doctor: 'bg-green-50 text-green-700',
    patient: 'bg-purple-50 text-purple-700',
  };

  const hasFilters = search || roleFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar items={navItems} />
      <main className="flex-1 flex flex-col ml-60">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Users</h1>
            <p className="text-xs text-gray-500">Manage all registered users</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#eef3ff] text-[#2d6be4] font-semibold px-3 py-1 rounded-full">{users.length} Total</span>
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 p-6 space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Admins', value: users.filter((u: any) => u.role === 'admin').length },
              { label: 'Doctors', value: users.filter((u: any) => u.role === 'doctor').length },
              { label: 'Patients', value: users.filter((u: any) => u.role === 'patient').length },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-48 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 font-medium mr-1">Role:</span>
              {(['all', 'admin', 'doctor', 'patient'] as const).map((r) => (
                <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition capitalize
                    ${roleFilter === r ? 'bg-[#2d6be4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {r === 'all' ? 'All' : r}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 font-medium mr-1">Status:</span>
              {(['all', 'active', 'inactive'] as const).map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition capitalize
                    ${statusFilter === s ? 'bg-[#2d6be4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>

            {/* Clear All */}
            {hasFilters && (
              <button onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); setPage(1); }}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 ml-auto">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{paginated.length}</span> of <span className="font-semibold text-gray-600">{filtered.length}</span> users
            </p>
            {hasFilters && (
              <p className="text-xs text-[#2d6be4] font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</p>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6be4]" />
              </div>
            ) : !paginated.length ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No users found</p>
                {hasFilters && <button onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }} className="mt-2 text-xs text-[#2d6be4] hover:underline">Clear filters</button>}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium cursor-pointer select-none" onClick={() => handleSort('email')}>
                      <span className="flex items-center">Email <SortIcon field="email" /></span>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer select-none" onClick={() => handleSort('role')}>
                      <span className="flex items-center">Role <SortIcon field="role" /></span>
                    </th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                      <span className="flex items-center">Joined <SortIcon field="createdAt" /></span>
                    </th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((u: any, i: number) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#eef3ff] rounded-full flex items-center justify-center text-[#2d6be4] font-bold text-sm flex-shrink-0">
                            {u.email[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColor[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {u.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4">
                        {u.role !== 'admin' && (
                          u.isActive ? (
                            <button onClick={() => deactivate(u.id)}
                              className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                              Deactivate
                            </button>
                          ) : (
                            <button onClick={() => activate(u.id)}
                              className="text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition">
                              Activate
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition
                      ${page === p ? 'bg-[#2d6be4] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
