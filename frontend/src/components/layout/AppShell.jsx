import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clients', label: 'Clients' },
  { to: '/leads', label: 'Leads' }
];

export default function AppShell() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <aside
          className={`fixed inset-y-4 left-4 z-40 w-64 rounded-2xl bg-slate-900 p-5 text-slate-200 shadow-xl transition md:static md:block ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">DB + Attractor</h1>
            <p className="text-xs text-slate-400">SaaS CRM Dashboard</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2 text-sm ${
                    isActive ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-xl bg-slate-800 p-3 text-xs">
            <p className="font-medium text-slate-300">{user?.name || 'User'}</p>
            <p className="mb-3 text-slate-400">{user?.email}</p>
            <button className="btn-secondary w-full !border-slate-700 !bg-slate-900 !text-slate-200" onClick={logout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="w-full md:flex-1">
          <header className="mb-6 flex items-center justify-between">
            <button className="btn-secondary md:hidden" onClick={() => setIsOpen((prev) => !prev)}>
              Menu
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Welcome back 👋</h2>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
