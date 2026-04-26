import { Calendar, CheckCircle2, Clock, XCircle, Stethoscope, User } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../../types/appointment.types';

interface AppointmentCardProps {
  appointment: Appointment;
  isPhysicianView?: boolean;
  onCancel?: () => void;
  compact?: boolean;
}

const STATUS_STYLE: Record<AppointmentStatus, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:     { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Pending'     },
  CONFIRMED:   { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    label: 'Confirmed'   },
  CANCELLED:   { bg: 'bg-gray-100',   text: 'text-gray-500',    dot: 'bg-gray-400',    label: 'Cancelled'   },
  COMPLETED:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed'   },
  RESCHEDULED: { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400',  label: 'Rescheduled' },
};

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleString(undefined, opts);
}

export default function AppointmentCard({
  appointment,
  isPhysicianView = false,
  onCancel,
  compact = false,
}: AppointmentCardProps) {
  const s = STATUS_STYLE[appointment.status];
  const isPast = new Date(appointment.endTime) < new Date();
  const canCancel =
    !isPast &&
    (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') &&
    onCancel;

  const dateStr = fmt(appointment.startTime, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = `${fmt(appointment.startTime, { hour: 'numeric', minute: '2-digit' })} – ${fmt(appointment.endTime, { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <div
      className={`group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${compact ? 'p-4' : 'p-4 sm:p-5'}`}
    >
      {/* Left accent bar — slightly thicker for visibility */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl ${s.dot}`} />

      <div className="flex items-start gap-3 sm:gap-4 pl-3">
        {/* Icon */}
        <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
          {isPhysicianView
            ? <User size={18} className={s.text} />
            : <Stethoscope size={18} className={s.text} />
          }
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            {isPast && appointment.status !== 'CANCELLED' && (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Past</span>
            )}
          </div>

          <h3 className="text-[15px] font-bold text-gray-900 truncate">
            {appointment.reason || 'General Consultation'}
          </h3>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Calendar size={11} className="text-gray-400" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Clock size={11} className="text-gray-400" />
              {timeStr}
            </span>
          </div>
        </div>

        {/* Actions — stacks cleanly */}
        <div className="shrink-0 flex flex-col items-end gap-2 self-start">
          {canCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-600 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition-colors whitespace-nowrap"
            >
              <XCircle size={13} /> Cancel
            </button>
          )}
          {appointment.status === 'COMPLETED' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 whitespace-nowrap">
              <CheckCircle2 size={14} /> Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
