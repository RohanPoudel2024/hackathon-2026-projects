import { useEffect, useState } from 'react';
import { Plus, Calendar, ChevronDown, Clock, CheckCircle2, XCircle, X } from 'lucide-react';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import BookingFlow from '../../components/appointments/BookingFlow';
import { listAppointments, deleteAppointment } from '../../lib/api/appointment.service';
import type { Appointment } from '../../types/appointment.types';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import apiClient from '../../lib/api/axios';

interface DoctorOption {
  doctorId: string;
  doctorName: string;
  specialization: string;
  workingHours: { day: string; startTime: string; endTime: string }[];
}

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const { profile } = useCurrentUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [showPast, setShowPast] = useState(false);

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await listAppointments({ patientId: user.id });
      setAppointments(data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
    } catch { /* fail silently */ }
    finally { setLoading(false); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await apiClient.get<{ id: string; fullName: string; doctor?: { id: string } }[]>(
        '/users', { params: { role: 'DOCTOR', pageSize: 50 } }
      );
      const raw = (res.data as unknown as { data?: { id: string; fullName: string; doctor?: { id: string } | null }[] }).data ?? [];
      const doctorDetails = await apiClient.get<DoctorOption[]>('/availability/doctors').catch(() => ({ data: [] as DoctorOption[] }));
      if (doctorDetails.data.length > 0) { setDoctors(doctorDetails.data); return; }
      setDoctors(
        raw.filter((u) => u.doctor?.id).map((u) => ({
          doctorId: u.doctor!.id,
          doctorName: u.fullName,
          specialization: 'General Medicine',
          workingHours: [],
        }))
      );
    } catch { /* no doctors */ }
  };

  useEffect(() => { fetchAppointments(); }, [user?.id]);
  useEffect(() => { if (isBooking) fetchDoctors(); }, [isBooking]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await deleteAppointment(id); fetchAppointments(); }
    catch { alert('Failed to cancel.'); }
  };

  const upcoming = appointments.filter((a) => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED');
  const past = appointments.filter((a) => new Date(a.startTime) <= new Date() || a.status === 'CANCELLED');

  const totalCompleted = appointments.filter(a => a.status === 'COMPLETED').length;
  const totalCancelled = appointments.filter(a => a.status === 'CANCELLED').length;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-gray-900 tracking-tight">Appointments</h1>
          <p className="text-gray-500 text-sm mt-2">Manage your visits and book new appointments</p>
        </div>
        {!isBooking && (
          <button
            onClick={() => setIsBooking(true)}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={15} /> Book Visit
          </button>
        )}
      </div>

      {/* ── Stats bar ── */}
      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: appointments.length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
            { label: 'Upcoming', value: upcoming.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
            { label: 'Completed', value: totalCompleted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
            { label: 'Cancelled', value: totalCancelled, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', ring: 'ring-red-100' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ring-4 ${stat.ring} shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-none tabular-nums">{stat.value}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Booking Modal Panel ── */}
      {isBooking && (
        <div className="rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-600">
            <div>
              <h2 className="text-lg font-extrabold text-white">Book a New Appointment</h2>
              <p className="text-indigo-200 text-sm mt-0.5">Choose a provider, date and time to get started</p>
            </div>
            <button
              onClick={() => setIsBooking(false)}
              aria-label="Close booking"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step indicator line */}
          <div className="h-1 bg-indigo-50">
            <div className="h-full w-1/3 bg-indigo-600 rounded-r-full transition-all duration-500" />
          </div>

          {/* Flow content */}
          <div className="px-8 py-8">
            <BookingFlow
              doctors={doctors}
              patientId={profile?.patientId ?? user?.id ?? ''}
              onSuccess={() => { setIsBooking(false); fetchAppointments(); }}
              onCancel={() => setIsBooking(false)}
            />
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {/* ── Main content: 2-col on large screens ── */}
      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* Upcoming — wider column */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">Upcoming</h2>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
                {upcoming.length}
              </span>
            </div>
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} onCancel={() => handleCancel(apt.id)} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={22} className="text-indigo-400" />
                </div>
                <p className="text-sm font-bold text-gray-500">No upcoming appointments</p>
                <button
                  onClick={() => setIsBooking(true)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                >
                  <Plus size={12} /> Book one now
                </button>
              </div>
            )}
          </div>

          {/* Past / Cancelled — sidebar column */}
          <div className="xl:col-span-2 space-y-4">
            <button
              onClick={() => setShowPast((v) => !v)}
              className="w-full flex items-center gap-3 text-left"
            >
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">Past & Cancelled</h2>
              <div className="flex-1 h-px bg-gray-100" />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{past.length}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showPast ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {showPast && (
              <div className="space-y-3">
                {past.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
            {!showPast && past.length > 0 && (
              <div className="bg-white border border-dashed border-gray-100 rounded-2xl px-6 py-5 text-center">
                <p className="text-xs font-semibold text-gray-400">
                  {past.length} past visit{past.length > 1 ? 's' : ''} — click to expand
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && appointments.length === 0 && !isBooking && (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
            <Calendar size={36} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">No appointments yet</h3>
          <p className="text-gray-400 text-sm mt-2 mb-7 max-w-xs">
            Schedule your first visit with a provider to get started
          </p>
          <button
            onClick={() => setIsBooking(true)}
            className="flex items-center gap-2 px-7 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={15} /> Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}
