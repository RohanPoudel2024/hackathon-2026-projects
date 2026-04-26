import { useState } from 'react';
import { Pill, CheckCircle, Clock, AlertCircle, Moon, Sun, Sunset } from 'lucide-react';

type MedStatus = 'taken' | 'due' | 'missed';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  status: MedStatus;
  instructions?: string;
  refillDue?: boolean;
}

const MOCK_MEDS: Medication[] = [
  { id: '1', name: 'Lisinopril',   dosage: '10mg',    time: '8:00 AM', period: 'morning',   status: 'taken', instructions: 'Take with water'             },
  { id: '2', name: 'Aspirin',      dosage: '81mg',    time: '8:00 AM', period: 'morning',   status: 'taken'                                               },
  { id: '3', name: 'Metformin',    dosage: '500mg',   time: '1:00 PM', period: 'afternoon', status: 'due',   instructions: 'Take with food', refillDue: true },
  { id: '4', name: 'Vitamin D3',   dosage: '2000 IU', time: '1:00 PM', period: 'afternoon', status: 'due'                                                 },
  { id: '5', name: 'Atorvastatin', dosage: '20mg',    time: '9:00 PM', period: 'evening',   status: 'due',   instructions: 'Can be taken any time of day' },
];

const STATUS_CONFIG: Record<MedStatus, { icon: React.ElementType; iconColor: string; pillBg: string; label: string }> = {
  taken:  { icon: CheckCircle, iconColor: 'text-emerald-500', pillBg: 'bg-emerald-50', label: 'Taken'  },
  due:    { icon: Clock,       iconColor: 'text-amber-500',   pillBg: 'bg-purple-50',  label: 'Due'    },
  missed: { icon: AlertCircle, iconColor: 'text-red-500',     pillBg: 'bg-red-50',     label: 'Missed' },
};

const PERIOD_CONFIG: Record<string, { icon: React.ElementType; label: string; accent: string }> = {
  morning:   { icon: Sun,    label: 'Morning',   accent: 'text-amber-500'  },
  afternoon: { icon: Sunset, label: 'Afternoon', accent: 'text-orange-500' },
  evening:   { icon: Moon,   label: 'Evening',   accent: 'text-indigo-500' },
};

export default function PatientMedicationsPage() {
  const [meds, setMeds] = useState(MOCK_MEDS);

  const markTaken = (id: string) =>
    setMeds((p) => p.map((m) => (m.id === id ? { ...m, status: 'taken' as MedStatus } : m)));

  const periods = ['morning', 'afternoon', 'evening'] as const;
  const takenCount = meds.filter((m) => m.status === 'taken').length;

  return (
    <div className="space-y-7 pb-10">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Medications</h1>
        <p className="text-gray-500 text-sm mt-2">{takenCount} of {meds.length} taken today</p>
      </div>

      {/* ── Progress banner ── */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl px-7 py-6 shadow-lg shadow-purple-200/50">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white font-bold text-base">Daily Progress</p>
            <p className="text-white/70 text-sm mt-1">
              {takenCount === meds.length ? '🎉 All done for today!' : `${meds.length - takenCount} remaining`}
            </p>
          </div>
          <p className="text-white text-4xl font-extrabold shrink-0 leading-none tabular-nums">
            {takenCount}<span className="text-white/40 text-2xl">/{meds.length}</span>
          </p>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mt-5">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${(takenCount / meds.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Period groups ── */}
      {periods.map((period) => {
        const periodMeds = meds.filter((m) => m.period === period);
        if (periodMeds.length === 0) return null;
        const { icon: PIcon, label, accent } = PERIOD_CONFIG[period];

        return (
          <div key={period} className="space-y-3">

            {/* Period label */}
            <div className="flex items-center gap-2.5 px-1">
              <PIcon size={15} className={accent} />
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</h2>
            </div>

            {/* Med cards */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {periodMeds.map((med) => {
                const cfg = STATUS_CONFIG[med.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={med.id}
                    className={`flex items-center gap-4 px-6 py-5 transition-all ${
                      med.status !== 'taken' ? 'hover:bg-purple-50/30' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${cfg.pillBg}`}>
                      <Pill size={20} className={cfg.iconColor} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold ${med.status === 'taken' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {med.name}
                        </p>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {med.dosage}
                        </span>
                        {med.refillDue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            Refill Due
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <span className="text-xs text-gray-400 font-medium">{med.time}</span>
                        {med.instructions && (
                          <span className="text-xs text-gray-400 truncate">· {med.instructions}</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {med.status === 'taken' ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <Icon size={14} /> Taken
                        </span>
                      ) : (
                        <button
                          onClick={() => markTaken(med.id)}
                          aria-label={`Mark ${med.name} as taken`}
                          className="px-4 py-2 text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all whitespace-nowrap"
                        >
                          Mark taken
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Disclaimer ── */}
      <p className="text-center text-xs text-gray-400 leading-relaxed pb-2">
        Medication reminders are for tracking only.<br />Always follow your provider's instructions.
      </p>
    </div>
  );
}
