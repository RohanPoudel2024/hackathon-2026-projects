import { useEffect, useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
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

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await listAppointments({ patientId: user.id });
      setAppointments(data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
    } catch { /* fail silently */ }
    finally { setLoading(false); }
  };

  // Fetch available doctors for booking
  const fetchDoctors = async () => {
    try {
      const res = await apiClient.get<{ id: string; fullName: string; doctor?: { id: string }; }[]>(
        '/users', { params: { role: 'DOCTOR', pageSize: 50 } }
      );
      // The list comes paginated: res.data.data
      const raw = (res.data as unknown as { data?: { id: string; fullName: string; doctor?: { id: string } | null }[] }).data ?? [];

      // We already have doctor suggestions with their specializations from chat service;
      // for booking we fetch suggestions from our fetchAvailableDoctors-style endpoint
      const doctorDetails = await apiClient.get<DoctorOption[]>('/availability/doctors').catch(() => ({ data: [] as DoctorOption[] }));
      if (doctorDetails.data.length > 0) {
        setDoctors(doctorDetails.data);
        return;
      }

      // Fallback: map from users list
      setDoctors(
        raw
          .filter((u) => u.doctor?.id)
          .map((u) => ({
            doctorId: u.doctor!.id,
            doctorName: u.fullName,
            specialization: 'General Medicine',
            workingHours: [],
          }))
      );
    } catch { /* no doctors loaded */ }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Appointments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your upcoming and past visits</p>
        </div>
        {!isBooking && (
          <button
            onClick={() => setIsBooking(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={16} /> Book Visit
          </button>
        )}
      </div>

      {/* Booking inline flow */}
      {isBooking && (
        <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6">
          <BookingFlow
            doctors={doctors}
            patientId={profile?.patientId ?? user?.id ?? ''}
            onSuccess={() => { setIsBooking(false); fetchAppointments(); }}
            onCancel={() => setIsBooking(false)}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Upcoming */}
      {!loading && upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Upcoming</h2>
          {upcoming.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={() => handleCancel(apt.id)}
            />
          ))}
        </div>
      )}

      {/* Past */}
      {!loading && past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Past Visits</h2>
          {past.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && appointments.length === 0 && !isBooking && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar size={48} className="text-indigo-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No appointments yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">Schedule your first visit with a provider</p>
          <button
            onClick={() => setIsBooking(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}
