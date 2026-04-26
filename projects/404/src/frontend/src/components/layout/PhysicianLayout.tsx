import { NavLink, Outlet, Link } from 'react-router-dom';
import { Home, Clock, LogOut, Stethoscope, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function PhysicianLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Physician';
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DR';

  const navItems = [
    { to: '/physician/home',         icon: Home,        label: 'Dashboard'    },
    { to: '/physician/availability', icon: Clock,       label: 'Availability' },
    { to: '/physician/chat',         icon: Bot,         label: 'AI Assistant' },
  ];

  const isChatPage = location.pathname.includes('/chat');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen overflow-hidden">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link to="/physician/home" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm shrink-0">
              <Stethoscope size={17} />
            </span>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900">
              CareFlow <span className="text-emerald-600">MD</span>
            </span>
          </Link>
        </div>

        {/* Physician profile */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900 leading-snug">
                {user?.fullName ?? 'Physician'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-xs font-semibold text-emerald-600">On duty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-4">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'text-gray-500 hover:bg-slate-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-4 py-5 border-t border-gray-100">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex min-w-0 flex-1 flex-col min-h-screen lg:h-screen lg:overflow-hidden">

        {/* Mobile / Tablet Header */}
        <header className="sticky top-0 z-30 px-5 py-4 bg-white border-b border-gray-100 lg:hidden flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
              <Stethoscope size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Clinical Portal</p>
              <p className="text-sm font-extrabold text-gray-900 leading-tight">Dr. {firstName}</p>
            </div>
          </div>
          <button onClick={signOut} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <LogOut size={18} />
          </button>
        </header>

        {/* Page Content */}
        {isChatPage ? (
          <main className="flex-1 overflow-hidden pb-16 lg:pb-0">
            <Outlet />
          </main>
        ) : (
          <main className="flex-1 lg:overflow-y-auto pb-24 lg:pb-8">
            <div className="max-w-screen-xl mx-auto px-6 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
              <Outlet />
            </div>
          </main>
        )}
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40 lg:hidden shadow-[0_-2px_16px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1.5 flex-1 py-3 min-h-[62px] transition-all relative ${
                  isActive ? 'text-emerald-600' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-b-full" />
                  )}
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className={`text-[10px] font-bold leading-none ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
