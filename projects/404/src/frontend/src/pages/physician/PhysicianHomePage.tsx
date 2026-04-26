import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { listAppointments } from '../../lib/api/appointment.service';
import type { Appointment } from '../../types/appointment.types';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { Users, Clock, CheckCircle, ChevronRight, AlertTriangle, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_QUEUE = [
  { id: 'q1', type: 'Review', urgency: 'high', title: 'AI Care Plan Ready', body: 'Generated plan for Jane Doe — chronic hypertension management.' },
  { id: 'q2', type: 'Follow-up', urgency: 'normal', title: 'Lab Results', body: "Sarah Johnson's lipid panel is ready for your review." },
  { id: 'q3', type: 'Referral', urgency: 'normal', title: 'Pending Referral', body: 'Michael Chen referred for cardiology consult.' },
];

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

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
  const todayAppts = appointments.filter((a) => {
    const t = new Date(a.startTime);
    return t >= todayStart && t <= todayEnd && a.status !== 'CANCELLED';
  });
  const upcoming = appointments.filter((a) => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED').slice(0, 5);
  const completedToday = appointments.filter((a) => a.status === 'COMPLETED' && new Date(a.startTime) >= todayStart);

  const firstName = user?.fullName?.split(' ')[0] ?? 'Doctor';

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600 mb-0.5">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome, Dr. {firstName}</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your practice overview for today</p>
        </div>
        <Link to="../availability" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Settings size={13} /> Availability
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today's Patients", value: todayAppts.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Review', value: MOCK_QUEUE.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: completedToday.length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Upcoming Appointments — real API, 3/5 width */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">Upcoming Appointments</h2>
            {upcoming.length > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{upcoming.length} upcoming</span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center bg-white border border-dashed border-gray-200 rounded-2xl py-12">
              <CheckCircle size={32} className="mx-auto text-emerald-300 mb-2" />
              <p className="text-sm font-bold text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} isPhysicianView />
              ))}
            </div>
          )}
        </div>

        {/* Action queue — mock, 2/5 width */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-base font-extrabold text-gray-900">Action Required</h2>
          <div className="space-y-3">
            {MOCK_QUEUE.map((item) => (
              <div key={item.id} className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow ${
                item.urgency === 'high' ? 'border-orange-200' : 'border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                    item.urgency === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.type}
                  </span>
                  {item.urgency === 'high' && <AlertTriangle size={13} className="text-orange-500" />}
                </div>
                <div className="flex items-start gap-2">
                  <FileText size={15} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.body}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-3 transition-colors">
                  Review <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
