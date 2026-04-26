import { useMemo } from 'react';
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import type { TimeSlot } from '../../types/availability.types';

interface SlotSelectorProps {
  slots: TimeSlot[];
  loading?: boolean;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot: TimeSlot | null;
}

export default function SlotSelector({
  slots,
  loading = false,
  selectedDate,
  onDateChange,
  onSlotSelect,
  selectedSlot,
}: SlotSelectorProps) {
  // Generate next 14 days
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const changeDate = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today) {
      onDateChange(newDate);
    }
  };

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const isSelected = (slot: TimeSlot) =>
    selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

  return (
    <div className="space-y-5">
      {/* ── Date Navigation header ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-gray-700">Select Date</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <span className="text-xs font-bold text-gray-600 w-28 text-center">
            {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Date strip ── */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
        {availableDates.map((date, i) => {
          const active = isSameDate(date, selectedDate);
          return (
            <button
              key={i}
              onClick={() => onDateChange(date)}
              style={{ scrollSnapAlign: 'start' }}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[58px] h-[70px] rounded-xl border transition-all ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <span className={`text-[11px] font-semibold mb-1 ${active ? 'text-indigo-100' : 'text-gray-400'}`}>
                {date.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
              <span className={`text-lg font-extrabold ${active ? 'text-white' : 'text-gray-900'}`}>
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Time slots ── */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-700 flex items-center gap-2 mb-3">
          <Clock size={15} className="text-indigo-500" />
          Available Times
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-10 gap-3 text-gray-400">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm font-semibold">Loading slots…</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Clock size={28} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-500">No slots available on this date</p>
            <button
              onClick={() => changeDate(1)}
              className="mt-3 text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Try the next day <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot, i) => {
              const active = isSelected(slot);
              return (
                <button
                  key={i}
                  onClick={() => onSlotSelect(slot)}
                  className={`py-2.5 px-1 rounded-xl text-sm font-bold border transition-all ${
                    active
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {formatTime(slot.start)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
