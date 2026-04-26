import { useEffect, useState } from 'react';
import { Calendar, ChevronRight, CheckCircle, Pill, ClipboardList, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listAppointments } from '../../lib/api/appointment.service';
import type { Appointment } from '../../types/appointment.types';
import { Link } from 'react-router-dom';

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening';

const MOCK_TASKS = [
  { id: '1', title: 'Check blood pressure', done: false },
  { id: '2', title: 'Drink 2L of water', done: true },
  { id: '3', title: 'Take evening medication', done: false },
];

const MOCK_MEDS = [
  { name: 'Lisinopril 10mg', time: '8:00 AM', taken: true },
  { name: 'Metformin 500mg', time: '1:00 PM', taken: false },
  { name: 'Atorvastatin 20mg', time: '9:00 PM', taken: false },
];

export default function PatientHomePage() {
  const { user } = useAuth();
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const doneCount = tasks.filter((t) => t.done).length;

  useEffect(() => {
    if (!user?.id) return;
    listAppointments({ patientId: user.id })
      .then((data) => {
        const upcoming = data
          .filter((a) => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED')
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        setNextAppt(upcoming[0] ?? null);
      })
      .catch(() => {});
  }, [user?.id]);

  const toggle = (id: string) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-sm font-semibold text-indigo-500 mb-1">Today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {GREETING}, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
        </h1>
      </div>

      {/* What to do next — primary CTA */}
      {nextAppt ? (
        <Link to="../appointments" className="block group">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-6 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="relative">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">Next Appointment</p>
              <h2 className="text-white text-xl font-extrabold">{nextAppt.reason || 'General Consultation'}</h2>
              <p className="text-indigo-200 text-sm mt-1.5 font-semibold">
                {new Date(nextAppt.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                {' · '}
                {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${nextAppt.status === 'CONFIRMED' ? 'bg-white/20 text-white' : 'bg-amber-400/30 text-amber-100'}`}>
                  {nextAppt.status}
                </span>
                <span className="ml-auto flex items-center gap-1 text-indigo-200 text-xs font-bold group-hover:text-white transition-colors">
                  View details <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <Link to="../appointments" className="block group">
          <div className="bg-white border-2 border-dashed border-indigo-200 rounded-3xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
            <Calendar size={32} className="mx-auto text-indigo-300 mb-2" />
            <p className="font-bold text-gray-700">No upcoming appointments</p>
            <p className="text-sm text-gray-500 mt-1">Schedule your next visit</p>
            <span className="inline-flex items-center gap-1 text-indigo-600 text-sm font-bold mt-3 group-hover:underline">
              Book now <ChevronRight size={14} />
            </span>
          </div>
        </Link>
      )}

      {/* Tasks progress */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-indigo-500" />
            <h2 className="text-base font-extrabold text-gray-900">Today's Tasks</h2>
          </div>
          <span className="text-xs font-bold text-gray-400">{doneCount}/{tasks.length} done</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / tasks.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggle(task.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                task.done
                  ? 'bg-gray-50 border-gray-100'
                  : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
              }`}
            >
              <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
              }`}>
                {task.done && <CheckCircle size={12} className="text-white" />}
              </div>
              <span className={`text-sm font-semibold ${task.done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {task.title}
              </span>
            </button>
          ))}
        </div>

        <Link to="../tasks" className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors">
          View all tasks <ChevronRight size={13} />
        </Link>
      </div>

      {/* Medications strip */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill size={18} className="text-purple-500" />
            <h2 className="text-base font-extrabold text-gray-900">Today's Medications</h2>
          </div>
        </div>

        <div className="space-y-2">
          {MOCK_MEDS.map((med) => (
            <div key={med.name} className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
              med.taken ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'
            }`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                med.taken ? 'bg-emerald-100' : 'bg-purple-100'
              }`}>
                <Pill size={14} className={med.taken ? 'text-emerald-600' : 'text-purple-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${med.taken ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{med.name}</p>
                <p className="text-xs text-gray-400 font-semibold">{med.time}</p>
              </div>
              {med.taken && <span className="text-xs font-bold text-emerald-600">Taken ✓</span>}
              {!med.taken && <span className="text-xs font-bold text-purple-500">Due</span>}
            </div>
          ))}
        </div>

        <Link to="../medications" className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors">
          Manage medications <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
