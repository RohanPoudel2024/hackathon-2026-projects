import { useState, useEffect } from 'react';
import { ChevronRight, Search, User, Stethoscope, CheckCircle, ChevronLeft, Calendar, Clock } from 'lucide-react';
import { listAvailableSlots } from '../../lib/api/availability.service';
import { createAppointment } from '../../lib/api/appointment.service';
import type { TimeSlot } from '../../types/availability.types';
import SlotSelector from '../availability/SlotSelector';

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

// Merged to 3 steps: Pick Doctor → Pick Date & Time → Confirm
type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, { label: string; icon: React.ElementType }> = {
  1: { label: 'Provider', icon: User },
  2: { label: 'Date & Time', icon: Calendar },
  3: { label: 'Confirm', icon: CheckCircle },
};

export default function BookingFlow({ doctors, patientId, onSuccess, onCancel }: BookingFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  });
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

  // Auto-load slots whenever doctor or date changes (on step 2)
  useEffect(() => {
    if (!selectedDoctor || step !== 2) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    setLoadingSlots(true);
    setSelectedSlot(null);
    listAvailableSlots({ doctorId: selectedDoctor.doctorId, date: dateStr, slotMinutes: 30 })
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDoctor, selectedDate, step]);

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setStep(2);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
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

  // ── Success screen ──
  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={36} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">Appointment Booked!</h3>
        <p className="text-gray-500 text-sm">
          Your visit with <strong>{selectedDoctor?.doctorName}</strong> is confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Step indicator (3-step) ── */}
      <div className="flex items-center gap-1">
        {([1, 2, 3] as Step[]).map((s) => {
          const { label, icon: StepIcon } = STEP_LABELS[s];
          const isComplete = s < step;
          const isActive = s === step;
          return (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isComplete ? 'bg-indigo-600 text-white' :
                isActive ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-300' :
                'bg-gray-100 text-gray-400'
              }`}>
                {isComplete
                  ? <CheckCircle size={13} />
                  : <StepIcon size={13} />
                }
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{s}</span>
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 rounded-full mx-1 transition-all ${s < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Pick Doctor ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Choose a Provider</h3>
            <p className="text-sm text-gray-500 mt-0.5">Select the physician you'd like to see</p>
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-10">
                <User size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 font-semibold">No providers found</p>
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <button
                  key={doc.doctorId}
                  onClick={() => handleSelectDoctor(doc)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-left transition-all group"
                >
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{doc.doctorName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Stethoscope size={11} className="text-gray-400" />
                      <p className="text-xs text-gray-500 font-semibold">{doc.specialization}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Date + Time (combined) ── */}
      {step === 2 && selectedDoctor && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(1)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Pick a Date & Time</h3>
              <p className="text-sm text-gray-500">
                With{' '}
                <span className="font-semibold text-indigo-600">{selectedDoctor.doctorName}</span>
              </p>
            </div>
          </div>

          <SlotSelector
            slots={slots}
            loading={loadingSlots}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onSlotSelect={(slot) => {
              handleSlotSelect(slot);
              setStep(3);
            }}
            selectedSlot={selectedSlot}
          />

          {slots.length > 0 && !selectedSlot && !loadingSlots && (
            <p className="text-xs font-semibold text-gray-400 text-center">Select a time slot to continue</p>
          )}
        </div>
      )}

      {/* ── Step 3: Confirm ── */}
      {step === 3 && selectedSlot && selectedDoctor && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedSlot(null); setStep(2); }}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Confirm Your Visit</h3>
              <p className="text-sm text-gray-500">Review your appointment details</p>
            </div>
          </div>

          {/* Booking summary card */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-4">
            {/* Provider */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <User size={17} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Provider</p>
                <p className="text-sm font-bold text-gray-900">{selectedDoctor.doctorName}</p>
                <p className="text-xs text-indigo-600 font-semibold">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div className="h-px bg-indigo-100" />

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Calendar size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Date</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Time</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {new Date(selectedSlot.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason input */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
              Reason for visit <span className="text-gray-400 font-semibold normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Annual checkup, follow-up, symptoms..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
          )}

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
