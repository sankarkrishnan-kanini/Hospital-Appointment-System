'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-[#2d6be4] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-[#2d6be4]">MediCare</span>
        </div>
        <nav className="flex-1 p-4">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 px-2">Menu</p>
          <Link href={`/${user?.role}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#eef3ff] hover:text-[#2d6be4] transition mb-1">
            <span>🏠</span> Dashboard
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-[#eef3ff] rounded-full flex items-center justify-center">
              <span className="text-[#2d6be4] text-sm font-bold">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-sm font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition text-left">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center px-6">
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
