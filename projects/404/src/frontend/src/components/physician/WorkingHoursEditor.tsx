import { useState } from 'react';
import { Loader2, Clock } from 'lucide-react';
import type { WeekDay, WorkingHours, UpsertWorkingHoursRequest } from '../../types/availability.types';

const WEEK_DAYS: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const DAY_ABBR: Record<WeekDay, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
};

const DAY_FULL: Record<WeekDay, string> = {
  MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
};

interface WorkingHoursEditorProps {
  workingHours: WorkingHours[];
  onSave: (data: UpsertWorkingHoursRequest) => Promise<void>;
  onDelete: (day: WeekDay) => Promise<void>;
  loading?: boolean;
}

export default function WorkingHoursEditor({ workingHours, onSave, onDelete, loading }: WorkingHoursEditorProps) {
  const [savingDay, setSavingDay] = useState<WeekDay | null>(null);

  const getDayConfig = (day: WeekDay) =>
    workingHours.find((wh) => wh.day === day) || { startTime: '09:00', endTime: '17:00', isActive: false };

  const handleToggleActive = async (day: WeekDay, currentActive: boolean) => {
    setSavingDay(day);
    if (currentActive) {
      await onDelete(day);
    } else {
      await onSave({ day, startTime: '09:00', endTime: '17:00' });
    }
    setSavingDay(null);
  };

  const handleTimeChange = async (day: WeekDay, field: 'startTime' | 'endTime', value: string) => {
    const current = getDayConfig(day);
    setSavingDay(day);
    await onSave({
      day,
      startTime: field === 'startTime' ? value : current.startTime,
      endTime: field === 'endTime' ? value : current.endTime,
    });
    setSavingDay(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <Clock size={17} className="text-emerald-600" />
        <h2 className="text-sm font-extrabold text-gray-900">Weekly Schedule</h2>
        <span className="ml-auto text-xs font-semibold text-gray-400">Toggle days on/off</span>
      </div>

      <div className="divide-y divide-gray-50">
        {WEEK_DAYS.map((day) => {
          const config = workingHours.find((wh) => wh.day === day);
          const isActive = !!config;
          const isSaving = savingDay === day || loading;

          return (
            <div
              key={day}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 transition-colors ${
                isActive ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              {/* Day toggle + label */}
              <div className="flex items-center gap-3 sm:w-44">
                {/* Toggle switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={() => handleToggleActive(day, isActive)}
                    disabled={isSaving}
                  />
                  <div className="w-10 h-[22px] bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-300/50 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:after:translate-x-[18px]" />
                </label>

                {/* Day name */}
                <div>
                  <p className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    <span className="hidden sm:inline">{DAY_FULL[day]}</span>
                    <span className="sm:hidden">{DAY_ABBR[day]}</span>
                  </p>
                </div>
              </div>

              {/* Time inputs or unavailable label */}
              {isActive ? (
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="time"
                    value={config!.startTime}
                    onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                    disabled={isSaving}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                  <span className="text-xs font-semibold text-gray-400">to</span>
                  <input
                    type="time"
                    value={config!.endTime}
                    onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                    disabled={isSaving}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                  {isSaving && <Loader2 size={15} className="text-emerald-500 animate-spin" />}
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-semibold italic">Not available</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
