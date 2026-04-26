import { NavLink, Outlet, Link } from "react-router-dom";
import { Calendar, Home, LogOut, ShieldCheck, Bot } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function PatientLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const firstName = user?.fullName?.split(" ")[0] || "Patient";
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "P";

  const navItems = [
    { to: "/patient/home",         icon: Home,     label: "Home"         },
    { to: "/patient/appointments", icon: Calendar, label: "Appointments" },
    { to: "/patient/chat",         icon: Bot,      label: "AI Chat"      },
  ];

  // Chat page needs full height — no padding wrapper
  const isChatPage = location.pathname.includes("/chat");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* ─────────────── Desktop Sidebar ─────────────── */}
      <aside className="hidden md:flex w-64 xl:w-72 shrink-0 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen">

        {/* Brand */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link to="/patient/home" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shrink-0">
              <ShieldCheck size={18} />
            </span>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900">
              CareFlow <span className="text-indigo-600">AI</span>
            </span>
          </Link>
        </div>

        {/* User card */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900 leading-snug">
                {user?.fullName || "Patient"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-xs font-semibold text-emerald-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
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
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-gray-500 hover:bg-slate-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="shrink-0"
                  />
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
            className="flex items-center gap-3.5 px-4 py-3.5 w-full text-left rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} className="shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─────────────── Content Area ─────────────── */}
      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">

        {/* Mobile header */}
        <header className="sticky top-0 z-30 px-5 py-4 bg-white border-b border-gray-100 shadow-sm md:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <ShieldCheck size={15} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 leading-none mb-0.5">
                CareFlow AI
              </p>
              <p className="text-sm font-extrabold text-gray-900 leading-tight">
                Hi, {firstName}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
          </button>
        </header>

        {/* Page content */}
        {isChatPage ? (
          /* Chat gets full height with no padding — manages its own layout */
          <main className="flex-1 overflow-hidden pb-16 md:pb-0">
            <Outlet />
          </main>
        ) : (
          /* All other pages: constrained max-width with comfortable padding */
          <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
            <div className="max-w-screen-xl mx-auto px-6 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
              <Outlet />
            </div>
          </main>
        )}
      </div>

      {/* ─────────────── Mobile Bottom Nav ─────────────── */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40 md:hidden shadow-[0_-2px_20px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex items-stretch justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1.5 flex-1 py-3 min-h-[62px] transition-all relative ${
                  isActive ? "text-indigo-600" : "text-gray-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-b-full" />
                  )}
                  <item.icon size={21} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className={`text-[10px] font-bold leading-none ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
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
