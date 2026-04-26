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
  { id: '1', name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', period: 'morning', status: 'taken', instructions: 'Take with water' },
  { id: '2', name: 'Aspirin', dosage: '81mg', time: '8:00 AM', period: 'morning', status: 'taken' },
  { id: '3', name: 'Metformin', dosage: '500mg', time: '1:00 PM', period: 'afternoon', status: 'due', instructions: 'Take with food', refillDue: true },
  { id: '4', name: 'Vitamin D3', dosage: '2000 IU', time: '1:00 PM', period: 'afternoon', status: 'due' },
  { id: '5', name: 'Atorvastatin', dosage: '20mg', time: '9:00 PM', period: 'evening', status: 'due', instructions: 'Can be taken any time of day' },
];

const STATUS_CONFIG: Record<MedStatus, { bg: string; icon: React.ElementType; iconColor: string; label: string }> = {
  taken:  { bg: 'bg-emerald-50', icon: CheckCircle, iconColor: 'text-emerald-500', label: 'Taken' },
  due:    { bg: 'bg-white',      icon: Clock,        iconColor: 'text-amber-500',   label: 'Due' },
  missed: { bg: 'bg-red-50',     icon: AlertCircle,  iconColor: 'text-red-500',     label: 'Missed' },
};

const PERIOD_ICON: Record<string, React.ElementType> = { morning: Sun, afternoon: Sunset, evening: Moon };
const PERIOD_LABEL: Record<string, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

export default function PatientMedicationsPage() {
  const [meds, setMeds] = useState(MOCK_MEDS);

  const markTaken = (id: string) =>
    setMeds((p) => p.map((m) => (m.id === id ? { ...m, status: 'taken' as MedStatus } : m)));

  const periods = ['morning', 'afternoon', 'evening'] as const;

  const takenCount = meds.filter((m) => m.status === 'taken').length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Medications</h1>
        <p className="text-gray-500 text-sm mt-0.5">{takenCount} of {meds.length} taken today</p>
      </div>

      {/* Daily progress */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-5 shadow-lg shadow-purple-200">
        <div className="flex justify-between items-end mb-3">
          <p className="text-purple-100 text-sm font-bold">Daily Progress</p>
          <p className="text-white text-2xl font-extrabold">{takenCount}/{meds.length}</p>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${(takenCount / meds.length) * 100}%` }}
          />
        </div>
        <p className="text-purple-200 text-xs font-semibold mt-2">
          {takenCount === meds.length ? '🎉 All done for today!' : `${meds.length - takenCount} remaining`}
        </p>
      </div>

      {/* Grouped by period */}
      {periods.map((period) => {
        const periodMeds = meds.filter((m) => m.period === period);
        if (periodMeds.length === 0) return null;
        const PIcon = PERIOD_ICON[period];
        return (
          <div key={period} className="space-y-2">
            <div className="flex items-center gap-2">
              <PIcon size={15} className="text-gray-400" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{PERIOD_LABEL[period]}</h2>
            </div>
            {periodMeds.map((med) => {
              const cfg = STATUS_CONFIG[med.status];
              const Icon = cfg.icon;
              return (
                <div key={med.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  med.status === 'taken' ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50/20'
                } ${med.refillDue ? 'ring-1 ring-amber-200' : ''}`}>
                  <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${cfg.bg}`}>
                    <Pill size={18} className={cfg.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${med.status === 'taken' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {med.name}
                      </p>
                      <span className="text-xs font-bold text-gray-400">{med.dosage}</span>
                      {med.refillDue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Refill Due</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 font-semibold">{med.time}</span>
                      {med.instructions && <span className="text-xs text-gray-400 truncate">{med.instructions}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {med.status === 'taken' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <Icon size={14} /> Taken
                      </span>
                    ) : (
                      <button
                        onClick={() => markTaken(med.id)}
                        className="px-3 py-1.5 text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all"
                      >
                        Mark taken
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <p className="text-center text-xs text-gray-400 pt-4">
        Medication reminders are for tracking only. Always follow your provider's instructions.
      </p>
    </div>
  );
}
