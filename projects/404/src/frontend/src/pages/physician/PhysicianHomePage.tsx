import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { listAppointments } from '../../lib/api/appointment.service';
import type { Appointment } from '../../types/appointment.types';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import {
  Users, CheckCircle, CalendarDays, Clock, ArrowRight, Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  PENDING:     { dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50',   label: 'Pending'   },
  CONFIRMED:   { dot: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',    label: 'Confirmed' },
  CANCELLED:   { dot: 'bg-gray-400',    text: 'text-gray-500',    bg: 'bg-gray-100',   label: 'Cancelled' },
  COMPLETED:   { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Completed' },
  RESCHEDULED: { dot: 'bg-purple-400',  text: 'text-purple-700',  bg: 'bg-purple-50',  label: 'Rescheduled' },
};

export default function PhysicianHomePage() {
  const { user } = useAuth();
  const { profile } = useCurrentUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.doctorId) return;
    listAppointments({ doctorId: profile.doctorId })
      .then((data) => {
        setAppointments(data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile?.doctorId]);

  const now = new Date();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

  const todayAppts = appointments.filter((a) => {
    const t = new Date(a.startTime);
    return t >= todayStart && t <= todayEnd && a.status !== 'CANCELLED';
  });

  const upcoming = appointments.filter(
    (a) => new Date(a.startTime) > now && a.status !== 'CANCELLED'
  );

  const completedToday = appointments.filter(
    (a) => a.status === 'COMPLETED' && new Date(a.startTime) >= todayStart
  );

  const nextAppt = upcoming[0] ?? null;

  const firstName = user?.fullName?.split(' ')[0] ?? 'Doctor';
  const HOUR = new Date().getHours();
  const greeting = HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 pb-12">

      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-gray-900 tracking-tight">
            {greeting}, Dr. {firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {loading
              ? 'Loading your schedule…'
              : todayAppts.length > 0
              ? `You have ${todayAppts.length} patient${todayAppts.length > 1 ? 's' : ''} scheduled today.`
              : 'No appointments today. Your schedule is clear.'}
          </p>
        </div>
        <Link
          to="/physician/availability"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all"
        >
          <Clock size={14} /> Manage Availability
        </Link>
      </div>

      {/* ─── Stat cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Today's Patients", value: todayAppts.length,    icon: Users,        color: 'text-blue-600',    bg: 'bg-blue-50',    ring: 'ring-blue-100'    },
          { label: 'Upcoming',         value: upcoming.length,      icon: CalendarDays, color: 'text-indigo-600',  bg: 'bg-indigo-50',  ring: 'ring-indigo-100'  },
          { label: 'Completed Today',  value: completedToday.length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ring-4 ${stat.ring} shrink-0`}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 leading-none tabular-nums">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main 2-col grid ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left: upcoming appointments list (2/3) ── */}
        <div className="xl:col-span-2 space-y-5">

          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">Upcoming Appointments</h2>
            {upcoming.length > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {upcoming.length} upcoming
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center bg-white border border-dashed border-gray-200 rounded-2xl py-14">
              <CheckCircle size={32} className="mx-auto text-emerald-300 mb-3" />
              <p className="text-sm font-bold text-gray-500">No upcoming appointments</p>
              <p className="text-xs text-gray-400 mt-1">Your schedule is clear</p>
              <Link
                to="/physician/availability"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-emerald-600 hover:underline"
              >
                Update availability <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} isPhysicianView />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: today's schedule + info (1/3) ── */}
        <div className="space-y-5">

          {/* Today's schedule timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CalendarDays size={15} className="text-emerald-600" />
              </div>
              <h2 className="text-sm font-extrabold text-gray-900">Today's Timeline</h2>
            </div>

            {loading ? (
              <div className="py-10 flex justify-center">
                <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              </div>
            ) : todayAppts.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sm font-semibold text-gray-400">No patients today</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {todayAppts.map((apt) => {
                  const s = STATUS_STYLE[apt.status] ?? STATUS_STYLE.PENDING;
                  const isPast = new Date(apt.endTime) < now;
                  return (
                    <div key={apt.id} className={`flex items-center gap-3 px-6 py-4 ${isPast ? 'opacity-50' : ''}`}>
                      <div className="shrink-0 text-right w-14">
                        <p className="text-xs font-bold text-gray-500">{fmtTime(apt.startTime)}</p>
                      </div>
                      <div className={`shrink-0 w-2 h-2 rounded-full ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {apt.reason || 'General Consultation'}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Next appointment highlight */}
          {!loading && nextAppt && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 shadow-lg shadow-emerald-200/50">
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                Next Up
              </p>
              <h3 className="text-white font-extrabold text-base leading-snug">
                {nextAppt.reason || 'General Consultation'}
              </h3>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold">
                  <CalendarDays size={12} /> {fmtDate(nextAppt.startTime)}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold">
                  <Clock size={12} /> {fmtTime(nextAppt.startTime)}
                </span>
              </div>
              <div className={`mt-3 inline-flex text-xs font-bold px-2.5 py-1 rounded-full ${
                nextAppt.status === 'CONFIRMED' ? 'bg-white/20 text-white' : 'bg-amber-400/30 text-amber-100'
              }`}>
                {STATUS_STYLE[nextAppt.status]?.label ?? nextAppt.status}
              </div>
            </div>
          )}

          {/* Quick nav */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-sm font-extrabold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link
                to="/physician/availability"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-emerald-800 flex-1">Set Availability</span>
                <ArrowRight size={14} className="text-emerald-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
              <Link
                to="/physician/chat"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <Plus size={15} className="text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-indigo-800 flex-1">AI Assistant</span>
                <ArrowRight size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
