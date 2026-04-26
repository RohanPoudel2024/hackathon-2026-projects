import { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Plus, Clock, CheckCircle2, XCircle, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listAppointments } from '../../lib/api/appointment.service';
import type { Appointment } from '../../types/appointment.types';
import { Link, useNavigate } from 'react-router-dom';

const HOUR = new Date().getHours();
const GREETING =
  HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  PENDING:     { dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50',   label: 'Pending'   },
  CONFIRMED:   { dot: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',    label: 'Confirmed' },
  CANCELLED:   { dot: 'bg-gray-400',    text: 'text-gray-500',    bg: 'bg-gray-100',   label: 'Cancelled' },
  COMPLETED:   { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Completed' },
  RESCHEDULED: { dot: 'bg-purple-400',  text: 'text-purple-700',  bg: 'bg-purple-50',  label: 'Rescheduled' },
};

export default function PatientHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    listAppointments({ patientId: user.id })
      .then((data) => {
        setAppointments(
          data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const now = new Date();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

  const upcoming = appointments.filter(
    (a) => new Date(a.startTime) > now && a.status !== 'CANCELLED'
  );
  const nextAppt = upcoming[0] ?? null;

  const todayAppts = appointments.filter((a) => {
    const t = new Date(a.startTime);
    return t >= todayStart && t <= todayEnd && a.status !== 'CANCELLED';
  });

  const recentPast = appointments
    .filter((a) => new Date(a.startTime) < now || a.status === 'CANCELLED')
    .slice(-3)
    .reverse();

  return (
    <div className="space-y-8 pb-10">

      {/* ── Greeting row ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {GREETING}, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {loading
              ? 'Loading your schedule…'
              : upcoming.length > 0
              ? `You have ${upcoming.length} upcoming appointment${upcoming.length > 1 ? 's' : ''}.`
              : 'No upcoming appointments. Ready to book a visit?'}
          </p>
        </div>
        <button
          onClick={() => navigate('/patient/appointments')}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={15} /> Book Visit
        </button>
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left column (2/3 width): appointments ── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Next appointment hero */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : nextAppt ? (
            <Link to="/patient/appointments" className="block group">
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-7 shadow-lg shadow-indigo-200/60 hover:shadow-xl hover:shadow-indigo-300/50 transition-all">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 right-12 w-32 h-32 rounded-full bg-white/5" />
                <div className="relative">
                  <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest mb-3">
                    Next Appointment
                  </p>
                  <h2 className="text-white text-xl font-extrabold leading-snug">
                    {nextAppt.reason || 'General Consultation'}
                  </h2>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-indigo-200 text-sm font-semibold">
                      <Calendar size={13} />
                      {fmtDate(nextAppt.startTime)}
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-200 text-sm font-semibold">
                      <Clock size={13} />
                      {fmtTime(nextAppt.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      nextAppt.status === 'CONFIRMED' ? 'bg-white/20 text-white' : 'bg-amber-400/30 text-amber-100'
                    }`}>
                      {STATUS_STYLE[nextAppt.status]?.label ?? nextAppt.status}
                    </span>
                    <span className="ml-auto flex items-center gap-1.5 text-indigo-200 text-xs font-bold group-hover:text-white transition-colors">
                      View all <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/patient/appointments" className="block group">
              <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Calendar size={26} className="text-indigo-400" />
                </div>
                <p className="font-bold text-gray-700 text-base">No upcoming appointments</p>
                <p className="text-sm text-gray-500 mt-1.5">Schedule your next visit with a provider</p>
                <span className="inline-flex items-center gap-1.5 text-indigo-600 text-sm font-bold mt-4 group-hover:underline">
                  Book now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          )}

          {/* Today's schedule */}
          {!loading && todayAppts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Calendar size={15} className="text-indigo-500" />
                  </div>
                  <h2 className="text-base font-extrabold text-gray-900">Today's Schedule</h2>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {todayAppts.length} today
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {todayAppts.map((apt) => {
                  const s = STATUS_STYLE[apt.status] ?? STATUS_STYLE.PENDING;
                  return (
                    <div key={apt.id} className="flex items-center gap-4 px-6 py-4">
                      <div className={`shrink-0 w-2 h-2 rounded-full ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {apt.reason || 'General Consultation'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {fmtTime(apt.startTime)} – {fmtTime(apt.endTime)}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming list */}
          {!loading && upcoming.length > 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                <h2 className="text-base font-extrabold text-gray-900">Upcoming</h2>
                <Link
                  to="/patient/appointments"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {upcoming.slice(1, 5).map((apt) => {
                  const s = STATUS_STYLE[apt.status] ?? STATUS_STYLE.PENDING;
                  return (
                    <div key={apt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                        <Calendar size={16} className={s.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {apt.reason || 'General Consultation'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {fmtDate(apt.startTime)} · {fmtTime(apt.startTime)}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column (1/3): sidebar cards ── */}
        <div className="space-y-5">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-sm font-extrabold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link
                to="/patient/appointments"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <Calendar size={15} className="text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-indigo-800 flex-1">Book an Appointment</span>
                <ArrowRight size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
              <Link
                to="/patient/chat"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-sky-600" />
                </div>
                <span className="text-sm font-semibold text-sky-800 flex-1">Chat with AI</span>
                <ArrowRight size={14} className="text-sky-400 group-hover:text-sky-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-sm font-extrabold text-gray-900">Your Summary</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Upcoming', value: upcoming.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Cancelled', value: appointments.filter(a => a.status === 'CANCELLED').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 px-6 py-4">
                    <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <p className="flex-1 text-sm font-semibold text-gray-600">{stat.label}</p>
                    <p className="text-lg font-extrabold text-gray-900 tabular-nums">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent history */}
          {!loading && recentPast.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-sm font-extrabold text-gray-900">Recent History</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentPast.map((apt) => {
                  const s = STATUS_STYLE[apt.status] ?? STATUS_STYLE.COMPLETED;
                  return (
                    <div key={apt.id} className="flex items-start gap-3 px-6 py-4">
                      <div className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">
                          {apt.reason || 'General Consultation'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{fmtDate(apt.startTime)}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50">
                <Link
                  to="/patient/appointments"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  View full history <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
