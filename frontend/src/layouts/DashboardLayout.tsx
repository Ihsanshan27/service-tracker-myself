import { BarChart3, Car, ClipboardList, FileText, Gauge, Home, LogOut, Settings, ShieldCheck, Users, Wrench } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const userLinks = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/vehicles', label: 'Vehicles', icon: Car },
  { to: '/service-records', label: 'Service Records', icon: Wrench },
  { to: '/service-schedules', label: 'Schedules', icon: ClipboardList },
  { to: '/odometer-logs', label: 'Odometer', icon: Gauge },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/workshops', label: 'Workshops', icon: Settings },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: Home },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/maintenance-items', label: 'Maintenance', icon: Wrench },
  { to: '/admin/service-templates', label: 'Templates', icon: ClipboardList },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const links = user?.role === 'ADMIN' ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-r border-white/70 bg-white/85 shadow-soft backdrop-blur lg:fixed lg:inset-y-0 lg:w-72">
        <div className="flex h-20 items-center gap-3 border-b border-line/80 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-white shadow-soft">
            <Car size={22} />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-ink">Vehicle Service</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Tracker</p>
          </div>
        </div>
        <nav className="grid gap-1.5 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-brand text-white shadow-soft' : 'text-muted hover:bg-slate-100 hover:text-ink'
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mx-4 mt-2 rounded-lg border border-line bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <ShieldCheck size={17} className="text-mint" />
            {user?.role}
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">Kelola kendaraan, service, dokumen, dan laporan dari satu dashboard.</p>
        </div>
      </aside>
      <div className="lg:ml-72 lg:flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/70 bg-white/80 px-4 shadow-sm backdrop-blur sm:px-8">
          <div>
            <p className="text-sm font-semibold text-ink">{user?.name}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-muted shadow-sm transition hover:border-rose/30 hover:text-rose">
            <LogOut size={16} /> Logout
          </button>
        </header>
        <main className="p-4 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
