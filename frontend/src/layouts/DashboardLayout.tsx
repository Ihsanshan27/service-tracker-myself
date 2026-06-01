import { BarChart3, Car, ClipboardList, FileText, Gauge, Home, LogOut, Moon, Settings, ShieldCheck, SunMedium, Users, Wrench } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();
  const links = user?.role === 'ADMIN' ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-r border-line/60 bg-panel/70 shadow-soft backdrop-blur-xl lg:fixed lg:inset-y-0 lg:w-80">
        <div className="flex h-24 items-center gap-4 border-b border-line/70 px-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-soft">
            <Car size={22} />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-ink">Vehicle Service</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">Tracker</p>
          </div>
        </div>
        <nav className="grid gap-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand text-white shadow-soft' : 'text-muted hover:bg-panel-alt hover:text-ink'
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mx-4 mt-2 rounded-3xl border border-line/60 bg-panel-alt/80 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <ShieldCheck size={17} className="text-mint" />
            {user?.role}
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">Kelola kendaraan, service, dokumen, dan laporan dari satu dashboard.</p>
        </div>
      </aside>
      <div className="lg:ml-80 lg:flex-1">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-line/60 bg-panel/60 px-4 shadow-sm backdrop-blur-xl sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="secondary-button" aria-label={theme === 'light' ? 'Aktifkan night mode' : 'Aktifkan light mode'}>
              {theme === 'light' ? <Moon size={16} /> : <SunMedium size={16} />}
              {theme === 'light' ? 'Night' : 'Light'}
            </button>
            <button onClick={logout} className="secondary-button hover:border-rose/30 hover:text-rose">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
