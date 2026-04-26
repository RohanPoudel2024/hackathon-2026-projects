import { useState } from 'react';
import { CheckCircle2, Heart, Activity, BookOpen, Star, ChevronDown, ChevronUp } from 'lucide-react';

type TaskCategory = 'lifestyle' | 'follow-up' | 'monitoring' | 'education';

interface CareTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  completed: boolean;
  priority?: 'high';
}

const CATEGORY_CONFIG: Record<TaskCategory, {
  label: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  progressBar: string;
}> = {
  lifestyle:   { label: 'Lifestyle',  icon: Heart,    iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', progressBar: 'bg-emerald-400' },
  'follow-up': { label: 'Follow-up',  icon: Star,     iconColor: 'text-blue-600',    iconBg: 'bg-blue-50',    progressBar: 'bg-blue-400'    },
  monitoring:  { label: 'Monitoring', icon: Activity, iconColor: 'text-amber-600',   iconBg: 'bg-amber-50',   progressBar: 'bg-amber-400'   },
  education:   { label: 'Education',  icon: BookOpen, iconColor: 'text-purple-600',  iconBg: 'bg-purple-50',  progressBar: 'bg-purple-400'  },
};

const INITIAL_TASKS: CareTask[] = [
  { id: '1', title: 'Check blood pressure',      description: 'Record your morning reading before medication',       category: 'monitoring', completed: false, priority: 'high' },
  { id: '2', title: 'Walk 30 minutes',            description: 'Low-impact walking as recommended by your care plan', category: 'lifestyle',  completed: true  },
  { id: '3', title: 'Schedule follow-up',         description: 'Book your 3-month check-in with Dr. Johnson',        category: 'follow-up',  completed: false },
  { id: '4', title: 'Read blood pressure guide',  description: 'Educational material sent by your care team',        category: 'education',  completed: true  },
  { id: '5', title: 'Log daily water intake',     description: 'Aim for 2 liters per day',                           category: 'monitoring', completed: false },
  { id: '6', title: 'Reduce sodium in your diet', description: 'Try to stay under 1500mg per day',                   category: 'lifestyle',  completed: false },
];

export default function PatientTasksPage() {
  const [tasks, setTasks] = useState<CareTask[]>(INITIAL_TASKS);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORY_CONFIG))
  );

  const toggle = (id: string) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const toggleCategory = (cat: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const allDone = tasks.every((t) => t.completed);
  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-7 pb-10">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Care Tasks</h1>
        <p className="text-gray-500 text-sm mt-2">Your personalized care plan for this week</p>
      </div>

      {/* ── Progress banner ── */}
      <div className={`rounded-2xl px-7 py-6 transition-all ${
        allDone
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200/50'
          : 'bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg shadow-indigo-200/50'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white font-bold text-base">Weekly Progress</p>
            <p className="text-white/70 text-sm mt-1">
              {allDone ? '🎉 All tasks complete! Great work.' : `${tasks.length - doneCount} tasks remaining`}
            </p>
          </div>
          <p className="text-white text-4xl font-extrabold shrink-0 leading-none tabular-nums">
            {doneCount}<span className="text-white/40 text-2xl">/{tasks.length}</span>
          </p>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mt-5">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${(doneCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Task categories ── */}
      <div className="space-y-4">
        {(Object.entries(CATEGORY_CONFIG) as [TaskCategory, typeof CATEGORY_CONFIG[TaskCategory]][]).map(([cat, cfg]) => {
          const catTasks = tasks.filter((t) => t.category === cat);
          if (catTasks.length === 0) return null;
          const catDone = catTasks.filter((t) => t.completed).length;
          const isExpanded = expandedCategories.has(cat);
          const CatIcon = cfg.icon;

          return (
            <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50/70 transition-colors text-left"
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.iconBg}`}>
                  <CatIcon size={18} className={cfg.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h2 className="text-sm font-extrabold text-gray-900">{cfg.label}</h2>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {catDone}/{catTasks.length}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cfg.progressBar}`}
                      style={{ width: `${(catDone / catTasks.length) * 100}%` }}
                    />
                  </div>
                </div>
                {isExpanded
                  ? <ChevronUp size={16} className="text-gray-300 shrink-0 ml-2" />
                  : <ChevronDown size={16} className="text-gray-300 shrink-0 ml-2" />
                }
              </button>

              {/* Task rows */}
              {isExpanded && (
                <div className="border-t border-gray-50">
                  {catTasks.map((task, idx) => (
                    <button
                      key={task.id}
                      onClick={() => toggle(task.id)}
                      className={`w-full flex items-start gap-4 px-6 py-5 text-left transition-all hover:bg-gray-50/60 ${
                        task.completed ? 'opacity-60' : ''
                      } ${idx < catTasks.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                      }`}>
                        {task.completed && <CheckCircle2 size={11} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <p className={`text-sm font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          {task.priority === 'high' && !task.completed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">
                              Priority
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
