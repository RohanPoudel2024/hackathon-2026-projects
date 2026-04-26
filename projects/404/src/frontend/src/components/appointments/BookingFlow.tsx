import { useState } from 'react';
import { ChevronRight, Search, User, Stethoscope, Calendar, Clock, CheckCircle, ChevronLeft } from 'lucide-react';
import { listAvailableSlots } from '../../lib/api/availability.service';
import { createAppointment } from '../../lib/api/appointment.service';
import type { TimeSlot } from '../../types/availability.types';

interface Doctor {
  doctorId: string;
  doctorName: string;
  specialization: string;
  workingHours: { day: string; startTime: string; endTime: string }[];
}

interface BookingFlowProps {
  doctors: Doctor[];
  patientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4;

export default function BookingFlow({ doctors, patientId, onSuccess, onCancel }: BookingFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [booked, setBooked] = useState(false);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setStep(2);
  };

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (!selectedDoctor) return;
    setLoadingSlots(true);
    try {
      const data = await listAvailableSlots({ doctorId: selectedDoctor.doctorId, date, slotMinutes: 30 });
      setSlots(data);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
    setStep(3);
  };

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedDoctor) return;
    setBooking(true);
    setError('');
    try {
      await createAppointment({
        doctorId: selectedDoctor.doctorId,
        patientId,
        status: 'PENDING',
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        reason: reason || 'General Consultation',
      });
      setBooked(true);
      setTimeout(() => { onSuccess(); }, 1800);
    } catch {
      setError('Failed to book. The slot may no longer be available.');
    } finally {
      setBooking(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Success screen
  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-in zoom-in-50">
          <CheckCircle size={36} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">Appointment Booked!</h3>
        <p className="text-gray-500 text-sm">Your visit with <strong>{selectedDoctor?.doctorName}</strong> is confirmed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              s < step ? 'bg-indigo-600 text-white' :
              s === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
              'bg-gray-100 text-gray-400'
            }`}>
              {s < step ? <CheckCircle size={14} /> : s}
            </div>
            {s < 4 && <div className={`flex-1 h-0.5 w-8 transition-all ${s < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <div className="flex-1" />
      </div>

      {/* Step 1: Pick doctor */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Choose a Doctor</h3>
            <p className="text-sm text-gray-500 mt-0.5">Select the provider you'd like to see</p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialization"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredDoctors.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No doctors found</p>
            ) : filteredDoctors.map((doc) => (
              <button
                key={doc.doctorId}
                onClick={() => handleSelectDoctor(doc)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-left transition-all group"
              >
                <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{doc.doctorName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Stethoscope size={11} className="text-gray-400" />
                    <p className="text-xs text-gray-500 font-semibold">{doc.specialization}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Pick date */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Choose a Date</h3>
              <p className="text-sm text-gray-500">With <span className="font-semibold text-indigo-600">{selectedDoctor?.doctorName}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <Calendar size={16} className="text-gray-400" />
            <input
              type="date"
              min={todayStr}
              onChange={(e) => { if (e.target.value) handleSelectDate(e.target.value); }}
              className="flex-1 bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Pick slot */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(2)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Pick a Time Slot</h3>
              <p className="text-sm text-gray-500">{new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          {loadingSlots ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">No slots available on this date</p>
              <button onClick={() => setStep(2)} className="mt-3 text-sm font-semibold text-indigo-600 hover:underline">Choose another date</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const label = new Date(slot.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                const isSelected = selectedSlot?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    onClick={() => { setSelectedSlot(slot); setStep(4); }}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && selectedSlot && selectedDoctor && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(3)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Confirm Your Visit</h3>
              <p className="text-sm text-gray-500">Review and confirm your appointment</p>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <User size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider</p>
                <p className="text-sm font-bold text-gray-900">{selectedDoctor.doctorName}</p>
                <p className="text-xs text-indigo-600 font-semibold">{selectedDoctor.specialization}</p>
              </div>
            </div>
            <div className="h-px bg-indigo-100" />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wide">Date</p>
                <p className="font-bold text-gray-900 mt-0.5">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-400 uppercase tracking-wide">Time</p>
                <p className="font-bold text-gray-900 mt-0.5">
                  {new Date(selectedSlot.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Reason for visit</label>
            <input
              type="text"
              placeholder="e.g. Annual checkup, follow-up..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={booking}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
            >
              {booking ? 'Booking…' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
